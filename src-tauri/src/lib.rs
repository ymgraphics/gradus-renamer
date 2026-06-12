mod commands;
mod models;

use commands::files::get_file_metadata;
use commands::rename::rename_files;
use commands::storage::{export_csv, load_history, load_settings, save_history, save_settings};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_file_metadata,
            rename_files,
            load_settings,
            save_settings,
            load_history,
            save_history,
            export_csv,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
