import { useCallback, useEffect, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from '@/store/useAppStore';
import { getFileType } from '@/lib/file-types';
import type { FileEntry, FileMetadata } from '@/types';

interface TauriDragDropEvent {
  paths: string[];
  position: { x: number; y: number };
  type: string;
}

export function useDragDrop() {
  const addFiles = useAppStore((s) => s.addFiles);
  const isDragging = useRef(false);
  const dragCallbacks = useRef<{
    onDragEnter?: () => void;
    onDragLeave?: () => void;
  }>({});

  const processFilePaths = useCallback(
    async (paths: string[]) => {
      if (paths.length === 0) return;

      try {
        const metadata = await invoke<FileMetadata[]>('get_file_metadata', { paths });

        const entries: FileEntry[] = metadata.map((meta) => ({
          id: crypto.randomUUID(),
          originalName: meta.original_name,
          extension: meta.extension,
          fileType: getFileType(meta.extension),
          filePath: meta.file_path,
          newName: '',
          size: meta.size,
        }));

        addFiles(entries);
      } catch (error) {
        console.error('Failed to get file metadata:', error);
      }
    },
    [addFiles]
  );

  const browseFiles = useCallback(async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: 'All Files',
            extensions: [
              'jpg', 'jpeg', 'png', 'webp', 'svg', 'psd', 'ai',
              'mp4', 'mov', 'avi', 'mxf',
              'pdf', 'pptx', 'docx', 'xlsx',
            ],
          },
        ],
      });

      if (selected) {
        const paths = Array.isArray(selected) ? selected : [selected];
        await processFilePaths(paths);
      }
    } catch (error) {
      console.error('Failed to open file dialog:', error);
    }
  }, [processFilePaths]);

  useEffect(() => {
    const unlistenDrop = listen<TauriDragDropEvent>('tauri://drag-drop', (event) => {
      isDragging.current = false;
      dragCallbacks.current.onDragLeave?.();
      if (event.payload.paths && event.payload.paths.length > 0) {
        processFilePaths(event.payload.paths);
      }
    });

    const unlistenDragEnter = listen('tauri://drag-enter', () => {
      isDragging.current = true;
      dragCallbacks.current.onDragEnter?.();
    });

    const unlistenDragLeave = listen('tauri://drag-leave', () => {
      isDragging.current = false;
      dragCallbacks.current.onDragLeave?.();
    });

    return () => {
      unlistenDrop.then((fn) => fn());
      unlistenDragEnter.then((fn) => fn());
      unlistenDragLeave.then((fn) => fn());
    };
  }, [processFilePaths]);

  const setDragCallbacks = useCallback(
    (callbacks: { onDragEnter?: () => void; onDragLeave?: () => void }) => {
      dragCallbacks.current = callbacks;
    },
    []
  );

  return { browseFiles, processFilePaths, setDragCallbacks };
}
