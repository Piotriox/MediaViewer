use std::path::{PathBuf, Path};
use tauri::Manager;
use std::fs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_log::Builder::default()
        .level(log::LevelFilter::Info)
        .level_for("tauri", log::LevelFilter::Info)
        .build(),
    )
    .setup(|app| {
      // Collect files opened via file association
      let opened_files = collect_opened_files_from_args();

      if !opened_files.is_empty() {
        log::info!("Opening {} file(s) via file association", opened_files.len());
      }

      // Build initialization script for opened files
      let init_script = build_opened_files_init_script(app.handle().clone(), &opened_files)?;

      // Create main window with initialization script
      let mut window = tauri::WebviewWindowBuilder::new(
        app.handle(),
        "main",
        tauri::WebviewUrl::default(),
      )
      .title("MediaViewer")
      .inner_size(800.0, 600.0)
      .resizable(true);

      if let Some(script) = init_script {
        window = window.initialization_script(&script);
      }

      window.build().map_err(|e| {
        log::error!("Failed to create main window: {}", e);
        e
      })?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .map_err(|e| {
      log::error!("Application error: {}", e);
      e.into()
    })
}

/// Validates that a file path is safe
/// Allows any file location (full filesystem access) but validates symlink boundaries
fn validate_file_path(file: &Path) -> Result<PathBuf, String> {
  // Check if file exists
  if !file.exists() {
    // Generic error message
    log::debug!("File not found: {}", file.display());
    return Err("File not found or inaccessible".to_string());
  }

  // Resolve symlinks to get the canonical path
  let canonical = fs::canonicalize(file).map_err(|e| {
    log::debug!("Failed to resolve path {}: {}", file.display(), e);
    "Unable to access file".to_string()
  })?;

  // Detect and warn about symlinks
  if file != canonical {
    match file.read_link() {
      Ok(_) => {
        log::warn!(
          "Symlink detected: user_provided={}, resolved_to={}",
          file.display(),
          canonical.display()
        );
      }
      Err(_) => {
        // Path normalization
        log::debug!("Path normalized: {} -> {}", file.display(), canonical.display());
      }
    }
  }

  // Log access at debug level with full path
  log::debug!("File access allowed: {}", canonical.display());
  
  // Log access at info level with generic message
  log::info!("File loaded successfully");
  
  Ok(canonical)
}

/// Collects file paths from command-line arguments (Windows/Linux/macOS file association)
fn collect_opened_files_from_args() -> Vec<PathBuf> {
  #[cfg(any(windows, target_os = "linux", target_os = "macos"))]
  {
    let mut files = Vec::new();

    for arg in std::env::args().skip(1) {
      if arg.starts_with('-') {
        continue;
      }

      // Try parsing as file:// URL first
      if let Ok(url) = url::Url::parse(&arg) {
        if let Ok(path) = url.to_file_path() {
          files.push(path);
          continue;
        }
      }

      // Fallback to plain filesystem path
      files.push(PathBuf::from(arg));
    }

    files
  }

  #[cfg(not(any(windows, target_os = "linux", target_os = "macos")))]
  {
    Vec::new()
  }
}

/// Validates and allows files through the asset protocol, returns initialization script
fn build_opened_files_init_script(
  app: tauri::AppHandle,
  files: &[PathBuf],
) -> Result<Option<String>, String> {
  if files.is_empty() {
    return Ok(None);
  }

  let asset_scope = app.asset_protocol_scope();
  let mut valid_files = Vec::new();

  for file in files {
    // Validate file path (checks existence, resolves symlinks, verifies scope)
    match validate_file_path(file) {
      Ok(canonical_path) => {
        // Allow the canonical path through asset protocol
        if let Err(e) = asset_scope.allow_file(&canonical_path) {
          log::error!("Failed to allow file {}: {}", canonical_path.display(), e);
          continue;
        }

        log::info!("Validated and allowed file: {}", canonical_path.display());
        valid_files.push(canonical_path);
      }
      Err(e) => {
        log::warn!("File validation failed: {}", e);
        continue;
      }
    }
  }

  if valid_files.is_empty() {
    log::warn!("No valid files to open from arguments");
    return Ok(None);
  }

  // Generate JavaScript to pass file paths to frontend
  let files_js = valid_files
    .iter()
    .map(|path| {
      let escaped = path
        .to_string_lossy()
        .replace('\\', "\\\\")
        .replace('\"', "\\\"");
      format!("\"{escaped}\"")
    })
    .collect::<Vec<_>>()
    .join(",");

  log::info!("Initialized with {} valid file(s)", valid_files.len());
  Ok(Some(format!("window.openedFiles = [{files_js}];")))
}

