use crate::models::types::{AppSettings, RenameRecord};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

/// Resolve the app data directory and ensure it exists.
fn get_data_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data directory: {}", e))?;

    if !data_dir.exists() {
        fs::create_dir_all(&data_dir)
            .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    }

    Ok(data_dir)
}

#[tauri::command]
pub async fn load_settings(app_handle: tauri::AppHandle) -> Result<AppSettings, String> {
    let data_dir = get_data_dir(&app_handle)?;
    let settings_path = data_dir.join("settings.json");

    if !settings_path.exists() {
        return Ok(AppSettings::default());
    }

    let contents = fs::read_to_string(&settings_path)
        .map_err(|e| format!("Failed to read settings file: {}", e))?;

    let settings: AppSettings = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse settings file: {}", e))?;

    Ok(settings)
}

#[tauri::command]
pub async fn save_settings(
    app_handle: tauri::AppHandle,
    settings: AppSettings,
) -> Result<(), String> {
    let data_dir = get_data_dir(&app_handle)?;
    let settings_path = data_dir.join("settings.json");

    let json = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    fs::write(&settings_path, json)
        .map_err(|e| format!("Failed to write settings file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn load_history(app_handle: tauri::AppHandle) -> Result<Vec<RenameRecord>, String> {
    let data_dir = get_data_dir(&app_handle)?;
    let history_path = data_dir.join("history.json");

    if !history_path.exists() {
        return Ok(Vec::new());
    }

    let contents = fs::read_to_string(&history_path)
        .map_err(|e| format!("Failed to read history file: {}", e))?;

    let history: Vec<RenameRecord> = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse history file: {}", e))?;

    Ok(history)
}

#[tauri::command]
pub async fn save_history(
    app_handle: tauri::AppHandle,
    history: Vec<RenameRecord>,
) -> Result<(), String> {
    let data_dir = get_data_dir(&app_handle)?;
    let history_path = data_dir.join("history.json");

    let json = serde_json::to_string_pretty(&history)
        .map_err(|e| format!("Failed to serialize history: {}", e))?;

    fs::write(&history_path, json)
        .map_err(|e| format!("Failed to write history file: {}", e))?;

    Ok(())
}

/// Escape a single CSV field: wrap in quotes if it contains comma, quote, or newline.
fn escape_csv_field(field: &str) -> String {
    if field.contains(',') || field.contains('"') || field.contains('\n') || field.contains('\r') {
        format!("\"{}\"", field.replace('"', "\"\""))
    } else {
        field.to_string()
    }
}

#[tauri::command]
pub async fn export_csv(
    _app_handle: tauri::AppHandle,
    history: Vec<RenameRecord>,
    export_path: String,
) -> Result<(), String> {
    let mut csv_content = String::from("Date,Original Name,New Name,Client,Format,Subject\n");

    for record in &history {
        let line = format!(
            "{},{},{},{},{},{}\n",
            escape_csv_field(&record.date),
            escape_csv_field(&record.original_name),
            escape_csv_field(&record.new_name),
            escape_csv_field(&record.client),
            escape_csv_field(&record.format),
            escape_csv_field(&record.subject),
        );
        csv_content.push_str(&line);
    }

    fs::write(&export_path, csv_content)
        .map_err(|e| format!("Failed to write CSV file: {}", e))?;

    Ok(())
}
