import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { validateNamingForm, generateBatchFilename } from '@/lib/validation';
import type { FileRenameRequest, RenameResult, RenameRecord } from '@/types';

export function useRename() {
  const {
    files,
    selectedClient,
    selectedFormat,
    subject,
    setIsRenaming,
    clearFiles,
  } = useAppStore();

  const addRecords = useHistoryStore((s) => s.addRecords);

  const rename = useCallback(async () => {
    const validation = validateNamingForm(selectedClient, selectedFormat, subject);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    if (files.length === 0) {
      toast.error('No files to rename');
      return;
    }

    setIsRenaming(true);

    try {
      const requests: FileRenameRequest[] = files.map((file, index) => {
        const baseName = generateBatchFilename(
          selectedClient,
          selectedFormat,
          subject,
          index,
          files.length
        );
        const newName = `${baseName}.${file.extension}`;
        return {
          source_path: file.filePath,
          new_name: newName,
        };
      });

      const results = await invoke<RenameResult[]>('rename_files', { files: requests });

      const now = new Date().toISOString();
      const historyRecords: RenameRecord[] = results.map((result) => ({
        id: crypto.randomUUID(),
        date: now,
        original_name: result.original_name,
        new_name: result.new_name,
        client: selectedClient,
        format: selectedFormat,
        subject: subject.trim(),
        file_path: result.file_path,
        success: result.success,
        error: result.error,
      }));

      await addRecords(historyRecords);

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      if (failCount === 0) {
        toast.success(`Successfully renamed ${successCount} file${successCount > 1 ? 's' : ''}`);
        clearFiles();
      } else if (successCount === 0) {
        toast.error(`Failed to rename all ${failCount} file${failCount > 1 ? 's' : ''}`);
      } else {
        toast.warning(
          `Renamed ${successCount} file${successCount > 1 ? 's' : ''}, ${failCount} failed`
        );
      }
    } catch (error) {
      toast.error(`Rename failed: ${error}`);
    } finally {
      setIsRenaming(false);
    }
  }, [files, selectedClient, selectedFormat, subject, setIsRenaming, clearFiles, addRecords]);

  return { rename };
}
