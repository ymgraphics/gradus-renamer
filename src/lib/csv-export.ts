import type { RenameRecord } from '@/types';

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSV(records: RenameRecord[]): string {
  const headers = ['Date', 'Original Name', 'New Name', 'Client', 'Format', 'Subject', 'Status'];
  const rows = records.map((record) => [
    escapeCSV(new Date(record.date).toLocaleString()),
    escapeCSV(record.original_name),
    escapeCSV(record.new_name),
    escapeCSV(record.client),
    escapeCSV(record.format),
    escapeCSV(record.subject),
    escapeCSV(record.success ? 'Success' : `Failed: ${record.error || 'Unknown'}`),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
