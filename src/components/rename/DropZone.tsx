import { useState, useCallback, useEffect } from 'react';
import { Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDragDrop } from '@/hooks/useDragDrop';
import { cn } from '@/lib/utils';

export function DropZone() {
  const { browseFiles, setDragCallbacks } = useDragDrop();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback(() => {
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  useEffect(() => {
    setDragCallbacks({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
    });
  }, [setDragCallbacks, handleDragEnter, handleDragLeave]);

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-xl border-2 border-dashed transition-all duration-200',
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border/60 bg-muted/20 hover:border-border hover:bg-muted/30'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200',
          isDragOver ? 'bg-primary/15' : 'bg-muted'
        )}
      >
        <Upload
          size={22}
          className={cn(
            'transition-colors duration-200',
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          or browse from your computer
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={browseFiles}
        className="gap-2"
      >
        <FolderOpen size={14} />
        Browse Files
      </Button>
    </div>
  );
}
