use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FileRenameRequest {
    pub source_path: String,
    pub new_name: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RenameResult {
    pub file_path: String,
    pub original_name: String,
    pub new_name: String,
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FileMetadata {
    pub original_name: String,
    pub extension: String,
    pub file_path: String,
    pub size: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RenameRecord {
    pub id: String,
    pub date: String,
    pub original_name: String,
    pub new_name: String,
    pub client: String,
    pub format: String,
    pub subject: String,
    pub file_path: String,
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppSettings {
    pub clients: Vec<String>,
    pub formats: Vec<String>,
    pub theme: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            clients: vec![
                "7CIEL".to_string(),
                "Movenpick".to_string(),
                "Amormor".to_string(),
                "Louna".to_string(),
            ],
            formats: vec![
                "Post".to_string(),
                "Story".to_string(),
                "Reel".to_string(),
                "Video".to_string(),
                "Banner".to_string(),
                "Flyer".to_string(),
                "Menu".to_string(),
                "Presentation".to_string(),
                "Document".to_string(),
                "Other".to_string(),
            ],
            theme: "dark".to_string(),
        }
    }
}
