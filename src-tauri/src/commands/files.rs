use crate::models::types::FileMetadata;
use std::path::Path;

#[tauri::command]
pub async fn get_file_metadata(paths: Vec<String>) -> Result<Vec<FileMetadata>, String> {
    let mut results = Vec::new();

    for path_str in &paths {
        let path = Path::new(path_str);

        let original_name = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();

        let extension = path
            .extension()
            .map(|e| e.to_string_lossy().to_string())
            .unwrap_or_default();

        let size = match std::fs::metadata(path) {
            Ok(meta) => meta.len(),
            Err(e) => {
                return Err(format!("Failed to read metadata for '{}': {}", path_str, e));
            }
        };

        results.push(FileMetadata {
            original_name,
            extension,
            file_path: path_str.clone(),
            size,
        });
    }

    Ok(results)
}
