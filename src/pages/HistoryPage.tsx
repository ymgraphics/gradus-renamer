import { Download, Trash2, Clock } from 'lucide-react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { generateCSV, downloadCSV } from '@/lib/csv-export';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';

export function HistoryPage() {
  const records = useHistoryStore((s) => s.records);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const handleExportCSV = () => {
    if (records.length === 0) {
      toast.error('No history to export');
      return;
    }
    const csv = generateCSV(records);
    const filename = `gradus-rename-history-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csv, filename);
    toast.success('History exported to CSV');
  };

  const handleClearHistory = async () => {
    await clearHistory();
    toast.success('History cleared');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Rename History</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {records.length > 0
              ? `${records.length} operation${records.length > 1 ? 's' : ''} recorded`
              : 'No rename operations yet'}
          </p>
        </div>
        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="gap-2"
            >
              <Trash2 size={14} />
              Clear
            </Button>
            <Button size="sm" onClick={handleExportCSV} className="gap-2">
              <Download size={14} />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <EmptyState
          icon={<Clock size={22} className="text-muted-foreground" />}
          title="No history yet"
          description="Renamed files will appear here. The last 100 operations are stored."
        />
      ) : (
        <ScrollArea className="max-h-[500px] rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9">Date</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9">Original</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9">New Name</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[80px]">Client</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[80px]">Format</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-medium h-9 w-[70px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm truncate max-w-[160px] block">
                          {record.original_name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{record.original_name}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium text-primary truncate max-w-[200px] block">
                          {record.new_name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{record.new_name}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-2.5 text-xs">{record.client}</TableCell>
                  <TableCell className="py-2.5 text-xs">{record.format}</TableCell>
                  <TableCell className="py-2.5">
                    <Badge
                      variant="secondary"
                      className={
                        record.success
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] border-0'
                          : 'bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] border-0'
                      }
                    >
                      {record.success ? 'OK' : 'Fail'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
