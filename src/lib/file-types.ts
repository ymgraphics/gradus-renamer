import type { FileType } from '@/types';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'psd', 'ai'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mxf'];
const DOCUMENT_EXTENSIONS = ['pdf', 'pptx', 'docx', 'xlsx'];

export function getFileType(extension: string): FileType {
  const ext = extension.toLowerCase().replace('.', '');
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (DOCUMENT_EXTENSIONS.includes(ext)) return 'document';
  return 'other';
}

export function getFileTypeLabel(type: FileType): string {
  switch (type) {
    case 'image': return 'Image';
    case 'video': return 'Video';
    case 'document': return 'Document';
    case 'other': return 'Other';
  }
}

export function getFileTypeColor(type: FileType): string {
  switch (type) {
    case 'image': return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
    case 'video': return 'bg-violet-500/15 text-violet-600 dark:text-violet-400';
    case 'document': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
    case 'other': return 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400';
  }
}
