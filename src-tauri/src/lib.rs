use std::path::PathBuf;
use tauri::Manager;

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
    // Validate file exists and is accessible
    if !file.exists() {
      log::warn!("File not found: {}", file.display());
      continue;
    }

    // Allow file through asset protocol
    if let Err(e) = asset_scope.allow_file(file) {
      log::error!("Failed to allow file {}: {}", file.display(), e);
      continue;
    }

    valid_files.push(file);
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

