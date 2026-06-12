import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { generateBatchFilename, sanitizeFilename } from '@/lib/validation';
import { WORLD_CUP_TEAMS } from '@/lib/constants';
import { FileTypeBadge } from '@/components/shared/FileTypeBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FileTable() {
  const files = useAppStore((s) => s.files);
  const selectedClient = useAppStore((s) => s.selectedClient);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const subject = useAppStore((s) => s.subject);
  const namingMode = useAppStore((s) => s.namingMode);
  const removeFile = useAppStore((s) => s.removeFile);
  const updateFileTeams = useAppStore((s) => s.updateFileTeams);

  const sanitizedSubject = sanitizeFilename(subject);

  const filesWithPreview = useMemo(
    () =>
      files.map((file, index) => {
        let currentSubject = sanitizedSubject;
        if (namingMode === 'world_cup') {
          const t1 = file.team1 || 'Team 1';
          const t2 = file.team2 || 'Team 2';
          currentSubject = sanitizeFilename(`${t1} vs ${t2}`);
        }

        const baseName = generateBatchFilename(
          selectedClient,
          selectedFormat,
          currentSubject,
          index,
          files.length
        );
        const newName = baseName ? `${baseName}.${file.extension}` : '';
        return { ...file, newName };
      }),
    [files, selectedClient, selectedFormat, sanitizedSubject, namingMode]
  );

  if (files.length === 0) {
    return (
      <EmptyState
        title="No files added"
        description="Drag and drop files above or browse to add files for renaming"
      />
    );
  }

  return (
    <ScrollArea className="max-h-[280px] rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9">Original Name</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[70px]">Ext</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[80px]">Type</TableHead>
            {namingMode === 'world_cup' && (
              <>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[130px]">Team 1</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[130px]">Team 2</TableHead>
              </>
            )}
            <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9">New Filename</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filesWithPreview.map((file) => (
            <TableRow key={file.id} className="group">
              <TableCell className="py-2.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm truncate max-w-[200px] block">
                      {file.originalName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{file.originalName}</TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="py-2.5">
                <span className="text-xs text-muted-foreground font-mono">
                  .{file.extension}
                </span>
              </TableCell>
              <TableCell className="py-2.5">
                <FileTypeBadge type={file.fileType} />
              </TableCell>
              {namingMode === 'world_cup' && (
                <>
                  <TableCell className="py-2.5">
                    <Select
                      value={file.team1}
                      onValueChange={(val) => updateFileTeams(file.id, val, file.team2)}
                    >
                      <SelectTrigger className="h-8 text-xs px-2">
                        <SelectValue placeholder="Team 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORLD_CUP_TEAMS.map((team) => (
                          <SelectItem key={team} value={team} className="text-xs">
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Select
                      value={file.team2}
                      onValueChange={(val) => updateFileTeams(file.id, file.team1, val)}
                    >
                      <SelectTrigger className="h-8 text-xs px-2">
                        <SelectValue placeholder="Team 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORLD_CUP_TEAMS.map((team) => (
                          <SelectItem key={team} value={team} className="text-xs">
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </>
              )}
              <TableCell className="py-2.5">
                {file.newName ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-primary font-medium truncate max-w-[250px] block">
                        {file.newName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{file.newName}</TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">
                    Fill form to preview
                  </span>
                )}
              </TableCell>
              <TableCell className="py-2.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
