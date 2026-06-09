use crate::models::types::{FileRenameRequest, RenameResult};
use std::path::Path;

#[tauri::command]
pub async fn rename_files(files: Vec<FileRenameRequest>) -> Result<Vec<RenameResult>, String> {
    let mut results = Vec::new();

    for file in &files {
        let source = Path::new(&file.source_path);

        // Check if source exists
        if !source.exists() {
            results.push(RenameResult {
                file_path: file.source_path.clone(),
                original_name: source
                    .file_name()
                    .map(|n| n.to_string_lossy().to_string())
                    .unwrap_or_default(),
                new_name: file.new_name.clone(),
                success: false,
                error: Some("Source file does not exist".to_string()),
            });
            continue;
        }

        let original_name = source
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();

        // Build destination path in the same directory as the source
        let parent = source.parent().unwrap_or_else(|| Path::new("."));
        let mut dest = parent.join(&file.new_name);

        // If destination already exists, append (1), (2), etc.
        if dest.exists() {
            let dest_stem = Path::new(&file.new_name)
                .file_stem()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_default();
            let dest_ext = Path::new(&file.new_name)
                .extension()
                .map(|e| e.to_string_lossy().to_string());

            let mut counter = 1u32;
            loop {
                let candidate_name = match &dest_ext {
                    Some(ext) => format!("{} ({}).{}", dest_stem, counter, ext),
                    None => format!("{} ({})", dest_stem, counter),
                };
                dest = parent.join(&candidate_name);
                if !dest.exists() {
                    break;
                }
                counter += 1;
            }
        }

        let actual_new_name = dest
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| file.new_name.clone());

        // Try to rename
        match std::fs::rename(source, &dest) {
            Ok(()) => {
                results.push(RenameResult {
                    file_path: dest.to_string_lossy().to_string(),
                    original_name,
                    new_name: actual_new_name,
                    success: true,
                    error: None,
                });
            }
            Err(e) => {
                let error_msg = if e.kind() == std::io::ErrorKind::PermissionDenied {
                    "Permission denied: file may be locked or read-only".to_string()
                } else {
                    format!("Rename failed: {}", e)
                };

                results.push(RenameResult {
                    file_path: file.source_path.clone(),
                    original_name,
                    new_name: actual_new_name,
                    success: false,
                    error: Some(error_msg),
                });
            }
        }
    }

    Ok(results)
}
