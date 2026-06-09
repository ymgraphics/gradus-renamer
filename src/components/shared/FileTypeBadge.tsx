import type { FileType } from '@/types';
import { getFileTypeLabel, getFileTypeColor } from '@/lib/file-types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FileTypeBadgeProps {
  type: FileType;
}

export function FileTypeBadge({ type }: FileTypeBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'text-[10px] font-medium px-2 py-0.5 rounded-md border-0',
        getFileTypeColor(type)
      )}
    >
      {getFileTypeLabel(type)}
    </Badge>
  );
}
