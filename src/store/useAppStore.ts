import { create } from 'zustand';
import type { FileEntry, Page } from '@/types';

interface AppState {
  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Naming form
  selectedClient: string;
  selectedFormat: string;
  subject: string;
  setSelectedClient: (client: string) => void;
  setSelectedFormat: (format: string) => void;
  setSubject: (subject: string) => void;

  // Files
  files: FileEntry[];
  addFiles: (files: FileEntry[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileNewName: (id: string, newName: string) => void;
  updateAllFileNames: (files: FileEntry[]) => void;

  // Rename state
  isRenaming: boolean;
  setIsRenaming: (value: boolean) => void;

  // Reset form
  resetForm: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'main',
  setCurrentPage: (page) => set({ currentPage: page }),

  selectedClient: '',
  selectedFormat: '',
  subject: '',
  setSelectedClient: (client) => set({ selectedClient: client }),
  setSelectedFormat: (format) => set({ selectedFormat: format }),
  setSubject: (subject) => set({ subject }),

  files: [],
  addFiles: (newFiles) =>
    set((state) => {
      const existingPaths = new Set(state.files.map((f) => f.filePath));
      const uniqueFiles = newFiles.filter((f) => !existingPaths.has(f.filePath));
      return { files: [...state.files, ...uniqueFiles] };
    }),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
  updateFileNewName: (id, newName) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, newName } : f)),
    })),
  updateAllFileNames: (files) => set({ files }),

  isRenaming: false,
  setIsRenaming: (value) => set({ isRenaming: value }),

  resetForm: () =>
    set({
      selectedClient: '',
      selectedFormat: '',
      subject: '',
      files: [],
    }),
}));
