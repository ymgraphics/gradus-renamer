import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { AppSettings } from '@/types';
import { DEFAULT_CLIENTS, DEFAULT_FORMATS } from '@/lib/constants';

interface SettingsState {
  clients: string[];
  formats: string[];
  theme: string;
  isLoaded: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;

  // Client CRUD
  addClient: (client: string) => void;
  editClient: (oldName: string, newName: string) => void;
  deleteClient: (client: string) => void;

  // Format CRUD
  addFormat: (format: string) => void;
  editFormat: (oldName: string, newName: string) => void;
  deleteFormat: (format: string) => void;

  // Theme
  setTheme: (theme: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  clients: DEFAULT_CLIENTS,
  formats: DEFAULT_FORMATS,
  theme: 'dark',
  isLoaded: false,

  loadSettings: async () => {
    try {
      const settings = await invoke<AppSettings>('load_settings');
      set({
        clients: settings.clients,
        formats: settings.formats,
        theme: settings.theme,
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoaded: true });
    }
  },

  saveSettings: async () => {
    const { clients, formats, theme } = get();
    try {
      await invoke('save_settings', {
        settings: { clients, formats, theme },
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  },

  addClient: (client) => {
    const { clients } = get();
    if (!clients.includes(client)) {
      set({ clients: [...clients, client] });
      get().saveSettings();
    }
  },

  editClient: (oldName, newName) => {
    const { clients } = get();
    set({
      clients: clients.map((c) => (c === oldName ? newName : c)),
    });
    get().saveSettings();
  },

  deleteClient: (client) => {
    const { clients } = get();
    set({ clients: clients.filter((c) => c !== client) });
    get().saveSettings();
  },

  addFormat: (format) => {
    const { formats } = get();
    if (!formats.includes(format)) {
      set({ formats: [...formats, format] });
      get().saveSettings();
    }
  },

  editFormat: (oldName, newName) => {
    const { formats } = get();
    set({
      formats: formats.map((f) => (f === oldName ? newName : f)),
    });
    get().saveSettings();
  },

  deleteFormat: (format) => {
    const { formats } = get();
    set({ formats: formats.filter((f) => f !== format) });
    get().saveSettings();
  },

  setTheme: (theme) => {
    set({ theme });
    get().saveSettings();
  },
}));
