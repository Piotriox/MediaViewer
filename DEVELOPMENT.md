# Development Guide

Complete reference for developing MediaViewer. This guide covers setting up the development environment, understanding the codebase structure, and common development tasks.

## Quick Start

Install dependencies and start development:

```bash
# Install all dependencies (root + frontend)
npm install

# Start dev server with hot-reload
npm run dev

# Create production build
npm run release

# Run unit tests
npm --prefix frontend run test
```

## Directory Structure

```
MediaViewer/
├── frontend/                    # Vite + JavaScript frontend
│   ├── src/
│   │   ├── main.js             # App entry point & state management
│   │   ├── validation.js       # File type & path validation
│   │   ├── utils.js            # URL & memory management
│   │   ├── logger.js           # Logging utilities
│   │   ├── style.css           # UI styling
│   │   ├── validation.test.js  # Unit tests
│   │   ├── assets/             # Static assets
│   │   └── index.html          # HTML structure
│   ├── package.json            # Frontend dependencies
│   ├── vitest.config.js        # Test configuration
│   └── vite.config.js          # Vite build configuration
│
├── src-tauri/                  # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs            # Application entry point
│   │   └── lib.rs             # Window initialization & file association logic
│   ├── Cargo.toml             # Rust dependencies
│   ├── build.rs               # Build script
│   ├── tauri.conf.json        # Security & window configuration
│   └── capabilities/          # Security permissions
│
├── package.json               # Root workspace configuration
├── BUILD.md                   # Multi-platform build guide
├── WINDOWS.md                 # Windows-specific instructions
├── LINUX.md                   # Linux-specific instructions
├── MACOS.md                   # macOS-specific instructions
├── ARCHITECTURE.md            # System design documentation
└── README.md                  # Project overview
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

This launches:
- Vite dev server on http://localhost:5173
- Tauri application with hot-reload enabled
- Press F12 in the app to open DevTools

### Frontend Development

Frontend code is located in `frontend/src/`:
- Changes hot-reload automatically
- Console output appears in DevTools (F12)
- Check for errors before committing

### Backend Development

Backend code is located in `src-tauri/src/`:
- Changes require full app restart
- Stop dev app, edit code, run `npm run dev` again
- Use `log::info!()`, `log::warn!()`, `log::error!()` in Rust

### Testing

Run the test suite:

```bash
# Run all tests once
npm --prefix frontend run test

# Run tests with UI dashboard
npm --prefix frontend run test:ui

# Generate coverage report
npm --prefix frontend run test:coverage

# Watch mode (re-run on changes)
npm --prefix frontend run test -- --watch
```

Test files are located in `frontend/src/*.test.js`

### Building

Build the application for distribution:

```bash
# Debug/development build (larger, faster)
npm run build

# Optimized release build (smaller, slower)
npm run release
```

## Debugging

### Browser DevTools

Access debugging tools while the app is running:
1. Press F12 in the application window
2. Full Chrome DevTools opens
3. Inspect elements, check console, profile performance

### Console Output

Use the logger in JavaScript:

```javascript
import { logger } from './logger.js';

logger.error('Error message', { details });
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug details'); // Only in development
```

In Rust:

```rust
log::error!("Error: {}", msg);
log::warn!("Warning: {}", msg);
log::info!("Info: {}", msg);
log::debug!("Debug: {}", msg);
```

Output appears in console and application logs.

## Code Organization

### State Management (main.js)

Central state object manages:
- Playlist (array of media items)
- Current playback index
- Image zoom and pan values
- URL cleanup tracking

### Validation (validation.js)

Provides type checking:
- `validateFile()` - Check if file is supported
- `isImageFile()` - Image type detection
- `isVideoFile()` - Video type detection
- `isPathSafe()` - Security check for path traversal

### URL Management (utils.js)

Handles blob URL lifecycle:
- `createObjectUrl()` - Create URL from file
- `revokeObjectUrl()` - Release memory
- `setupCleanupOnUnload()` - Cleanup on page exit

### Logging (logger.js)

Consistent logging interface:
- `logger.error()` - Error level
- `logger.warn()` - Warning level
- `logger.info()` - Info level
- `logger.debug()` - Debug level (dev only)

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
