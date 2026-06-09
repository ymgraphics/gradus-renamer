import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { RenameRecord } from '@/types';
import { MAX_HISTORY_ENTRIES } from '@/lib/constants';

interface HistoryState {
  records: RenameRecord[];
  isLoaded: boolean;

  loadHistory: () => Promise<void>;
  addRecords: (records: RenameRecord[]) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],
  isLoaded: false,

  loadHistory: async () => {
    try {
      const history = await invoke<RenameRecord[]>('load_history');
      set({ records: history, isLoaded: true });
    } catch (error) {
      console.error('Failed to load history:', error);
      set({ isLoaded: true });
    }
  },

  addRecords: async (newRecords) => {
    const { records } = get();
    const combined = [...newRecords, ...records].slice(0, MAX_HISTORY_ENTRIES);
    set({ records: combined });
    try {
      await invoke('save_history', { history: combined });
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  },

  clearHistory: async () => {
    set({ records: [] });
    try {
      await invoke('save_history', { history: [] });
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  },
}));
