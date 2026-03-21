# Development Guide

Quick reference for MediaViewer development on Windows.

## Quick Start

```cmd
# First time setup
npm install

# Start development
npm run dev

# Build release
npm run release

# Run tests
npm --prefix frontend run test
```

## Directory Structure

```
MediaViewer/
├── frontend/              # Vite + JavaScript
│   ├── src/
│   │   ├── main.js       # App entry point (200 lines)
│   │   ├── validation.js # File validation (100 lines)
│   │   ├── utils.js      # URL management (50 lines)
│   │   ├── logger.js     # Logging utilities (30 lines)
│   │   ├── style.css     # UI styling
│   │   └── *.test.js     # Unit tests
│   └── index.html
│
├── src-tauri/            # Rust backend
│   ├── src/
│   │   ├── main.rs      # Entry point
│   │   └── lib.rs       # Core logic
│   ├── Cargo.toml       # Dependencies
│   ├── tauri.conf.json  # Config (IMPORTANT)
│   └── .cargo/config.toml # Build settings
│
└── Docs/
    ├── README.md        # Project overview
    ├── ARCHITECTURE.md  # Design details
    ├── BUILD.md         # Build instructions
    └── WINDOWS.md       # Windows-specific info
```

## Common Tasks

### Starting Development

```cmd
npm run dev
```

This starts:
- Dev server on http://localhost:5173
- Tauri app with hot-reload
- Open F12 for debugging

### Making Code Changes

**Frontend** (`frontend/src/*.js`):
- Changes hot-reload automatically
- Check console (F12) for errors

**Backend** (`src-tauri/src/*.rs`):
- Changes require app restart
- Stop dev app, make changes, restart with `npm run dev`

### Testing

```cmd
# Run all tests
npm --prefix frontend run test

# Run with UI
npm --prefix frontend run test:ui

# Generate coverage report
npm --prefix frontend run test:coverage

# Watch mode (auto-rerun on changes)
npm --prefix frontend run test -- --watch
```

Test files in `frontend/src/*.test.js`

### Building

```cmd
# Development build (fast, large)
npm run build

# Release build (slow, small, optimized)
npm run release
```

### Debugging

**JavaScript Console**:
- Press F12 in running app
- See all console.log output
- Use `logger.error()`, `logger.warn()`, `logger.info()`

**Tauri Debug**:
- Right-click window title → "Inspect Element"
- JavaScript DevTools window opens
- Full Chrome DevTools available

**Console Logs**:
```javascript
// In frontend code
import { logger } from './logger.js';

logger.error('File not found', { path, error });
logger.warn('Autoplay blocked');
logger.info('Playing video', { name });
logger.debug('State updated', { state }); // Dev only
```

## Architecture Overview

### Data Flow

```
User selects files
    ↓
validation.js checks types
    ↓
main.js manages state and UI
    ↓
utils.js creates object URLs
    ↓
Display media (image or video)
```

### Component Responsibilities

- **main.js**: State, lifecycle, user interaction
- **validation.js**: File type checking, error messages
- **utils.js**: Memory management (blob URLs)
- **logger.js**: Consistent error logging
- **Rust backend**: File association, window setup

## Modifying Features

### Add New File Type

1. Update `frontend/src/validation.js`:
```javascript
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'm4v', 'flv'];
```

2. Test in `frontend/src/validation.test.js`

3. Update documentation in `README.md`

### Change UI Layout

1. Edit `frontend/src/style.css` for styling
2. Edit `frontend/index.html` for structure
3. Update button handlers in `frontend/src/main.js`

### Add New Tauri Command

1. Create command in `src-tauri/src/lib.rs`:
```rust
#[tauri::command]
async fn my_command(name: String) -> Result<String> {
    Ok(format!("Hello {}", name))
}
```

2. Call from frontend:
```javascript
import { invoke } from '@tauri-apps/api/tauri';

const result = await invoke('my_command', { name: 'World' });
```

### Change Window Configuration

Edit `src-tauri/tauri.conf.json`:
- Window size: `"app"."windows"[0]."width"` and `"height"`
- Title bar: `"app"."windows"[0]."title"`
- Icon: `"bundle"."icon"`
- Security: `"app"."security"`

## Dependency Management

### Frontend Dependencies

```cmd
# Add package
npm install package-name --prefix frontend

# Remove package  
npm uninstall package-name --prefix frontend

# Update packages
npm update --prefix frontend
```

### Rust Dependencies

Edit `src-tauri/Cargo.toml`:
```toml
[dependencies]
serde_json = "1.0"  # Add here
```

Then:
```cmd
cd src-tauri
cargo build  # Downloads and compiles dependencies
```

## Performance Optimization

### Build Times

- First build: ~2-5 minutes (always slow)
- Incremental frontend changes: ~5-10 seconds
- Incremental Rust changes: ~10-30 seconds
- Release build: ~5-10 minutes

Speed up with:
- SSD (not HDD)
- 8+ GB RAM
- Modern CPU (4+ cores)

### Runtime Performance

Profile with:
1. Open DevTools (F12)
2. Performance tab
3. Record application usage
4. Analyze in timeline

## Common Issues

### "Module not found" Errors

```cmd
# Clear node_modules and reinstall
rmdir /s frontend/node_modules
npm install --prefix frontend
```

### App Won't Start

Check console for errors:
```cmd
npm run dev
# Read output carefully for error messages
```

### Build Fails

Clean and rebuild:
```cmd
cd src-tauri
cargo clean
cargo build --release
```

### Port Already in Use

Dev server uses port 5173. If taken:
```cmd
# Kill process using port
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Or wait 30 seconds for cleanup, then retry.

## Code Style

### JavaScript

```javascript
// Use imports
import { logger } from './logger.js';

// Comments for complex logic
// JSDoc for functions
/**
 * Play media at index
 * @param {number} index - Playlist index
 */
function playMedia(index) {
  // Implementation
}

// Use const by default
const state = { /* ... */ };

// Use template strings
const msg = `Error: ${error.message}`;
```

### Rust

```rust
// Follow Rust idioms
#[tauri::command]
async fn my_function() -> Result<String> {
    Ok("Result".to_string())
}

// Use structured logging
log::error!("Message");
log::warn!("Message");
log::info!("Message");
```

## Release Checklist

Before publishing:

- [ ] Update version in `package.json` and `Cargo.toml`
- [ ] Test all features manually
- [ ] Run full test suite: `npm test`
- [ ] Check for console errors (F12)
- [ ] Build release: `npm run release`
- [ ] Test installer setup and uninstall
- [ ] Verify file associations work
- [ ] Update changelog (if applicable)

## Resources

- [Tauri Documentation](https://tauri.app/)
- [Vite Documentation](https://vitejs.dev/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Getting Help

1. Check relevant markdown file (README.md, ARCHITECTURE.md, etc.)
2. Check terminal output for error messages
3. Check browser console (F12) for JavaScript errors
4. Check related documentation links
5. Check GitHub issues if available
