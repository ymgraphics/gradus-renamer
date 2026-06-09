import { Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { generateFilename, sanitizeFilename } from '@/lib/validation';

export function LivePreview() {
  const selectedClient = useAppStore((s) => s.selectedClient);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const subject = useAppStore((s) => s.subject);

  const sanitizedSubject = sanitizeFilename(subject);
  const preview = generateFilename(selectedClient, selectedFormat, sanitizedSubject);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-muted/30">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
        <Eye size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
          Preview
        </p>
        {preview ? (
          <p className="text-sm font-medium truncate">{preview}</p>
        ) : (
          <p className="text-sm text-muted-foreground/60 italic">
            Fill in the fields above to preview...
          </p>
        )}
      </div>
    </div>
  );
}
