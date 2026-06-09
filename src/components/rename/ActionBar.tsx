import { Wand2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useRename } from '@/hooks/useRename';

export function ActionBar() {
  const files = useAppStore((s) => s.files);
  const isRenaming = useAppStore((s) => s.isRenaming);
  const clearFiles = useAppStore((s) => s.clearFiles);
  const { rename } = useRename();

  const hasFiles = files.length > 0;

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-muted-foreground">
        {hasFiles
          ? `${files.length} file${files.length > 1 ? 's' : ''} ready`
          : 'No files selected'}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFiles}
          disabled={!hasFiles || isRenaming}
          className="gap-2"
        >
          <Trash2 size={14} />
          Clear
        </Button>
        <Button
          size="sm"
          onClick={rename}
          disabled={!hasFiles || isRenaming}
          className="gap-2 min-w-[120px]"
        >
          {isRenaming ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Renaming...
            </>
          ) : (
            <>
              <Wand2 size={14} />
              Rename Files
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
