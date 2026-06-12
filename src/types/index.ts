export type FileType = 'image' | 'video' | 'document' | 'other';

export type Page = 'main' | 'history' | 'settings';

export type Theme = 'light' | 'dark' | 'system';

export type NamingMode = 'standard' | 'world_cup';

export interface FileEntry {
  id: string;
  originalName: string;
  extension: string;
  fileType: FileType;
  filePath: string;
  newName: string;
  size: number;
  team1?: string;
  team2?: string;
}

export interface RenameOperation {
  id: string;
  date: string;
  originalName: string;
  newName: string;
  client: string;
  format: string;
  subject: string;
  filePath: string;
  success: boolean;
  error?: string;
}

export interface RenameResult {
  file_path: string;
  original_name: string;
  new_name: string;
  success: boolean;
  error?: string;
}

export interface FileMetadata {
  original_name: string;
  extension: string;
  file_path: string;
  size: number;
}

export interface FileRenameRequest {
  source_path: string;
  new_name: string;
}

export interface AppSettings {
  clients: string[];
  formats: string[];
  theme: string;
}

export interface RenameRecord {
  id: string;
  date: string;
  original_name: string;
  new_name: string;
  client: string;
  format: string;
  subject: string;
  file_path: string;
  success: boolean;
  error?: string;
}
