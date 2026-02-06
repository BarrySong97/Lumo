mod logger;

use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::{Manager, async_runtime};
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_devtools(webview: tauri::Webview) {
    #[cfg(debug_assertions)]
    webview.open_devtools();
}

/// Get the log file path for debugging
#[tauri::command]
fn get_log_path() -> Option<String> {
    logger::get_log_path().map(|p| p.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logger FIRST with fallback location
    // This ensures we can log even if app_data_dir fails
    let log_path = logger::init_early();
    logger::info(&format!("Early log initialized at: {}", log_path.display()));

    let sidecar_child: Arc<Mutex<Option<CommandChild>>> = Arc::new(Mutex::new(None));
    let sidecar_child_for_setup = Arc::clone(&sidecar_child);
    let sidecar_child_for_events = Arc::clone(&sidecar_child);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(move |app| {
            logger::info("Tauri setup starting...");

            // Get app data directory
            let app_data_dir = match app.path().app_data_dir() {
                Ok(dir) => {
                    logger::info(&format!("App data directory: {}", dir.display()));
                    dir
                }
                Err(e) => {
                    logger::error(&format!("Failed to get app data directory: {}", e));
                    // Use fallback
                    let fallback = if let Ok(home) = std::env::var("USERPROFILE") {
                        PathBuf::from(home).join(".lumo")
                    } else {
                        PathBuf::from(".").join(".lumo")
                    };
                    logger::info(&format!("Using fallback directory: {}", fallback.display()));
                    fallback
                }
            };

            // Re-initialize logger in proper location
            logger::init(Some(&app_data_dir));
            logger::info("Logger re-initialized in app data directory");

            let use_sidecar_in_dev = std::env::var("LUMO_USE_SIDECAR_IN_DEV")
                .map(|v| v == "1")
                .unwrap_or(false);
            let should_spawn_sidecar = !cfg!(debug_assertions) || use_sidecar_in_dev;

            if should_spawn_sidecar {
                let db_path = app_data_dir.join("lumo.db");
                logger::info(&format!("Database path: {}", db_path.display()));

                let app_handle = app.handle().clone();
                let sidecar_child_for_spawn = Arc::clone(&sidecar_child_for_setup);
                async_runtime::spawn(async move {
                    match app_handle.shell().sidecar("lumo-server") {
                        Ok(sidecar) => {
                            logger::info("Starting server sidecar...");
                            match sidecar
                                .env("LUMO_DB_PATH", db_path.to_string_lossy().to_string())
                                .spawn()
                            {
                                Ok((_rx, child)) => {
                                    if let Ok(mut guard) = sidecar_child_for_spawn.lock() {
                                        *guard = Some(child);
                                    }
                                    logger::info("Server sidecar started successfully");
                                }
                                Err(e) => {
                                    logger::error(&format!("Failed to spawn server sidecar: {}", e));
                                }
                            }
                        }
                        Err(e) => {
                            logger::error(&format!("Failed to get server sidecar: {}", e));
                        }
                    }
                });
            } else {
                logger::info("Skipping sidecar in dev mode; using external server");
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, open_devtools, get_log_path])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(move |_app_handle, event| {
        match event {
            tauri::RunEvent::ExitRequested { .. } | tauri::RunEvent::Exit => {
                if let Ok(mut guard) = sidecar_child_for_events.lock() {
                    if let Some(child) = guard.take() {
                        if let Err(e) = child.kill() {
                            logger::error(&format!("Failed to stop server sidecar: {}", e));
                        } else {
                            logger::info("Server sidecar stopped");
                        }
                    }
                }
            }
            _ => {}
        }
    });
}
