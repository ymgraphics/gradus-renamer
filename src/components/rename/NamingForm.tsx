import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function NamingForm() {
  const selectedClient = useAppStore((s) => s.selectedClient);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const subject = useAppStore((s) => s.subject);
  const setSelectedClient = useAppStore((s) => s.setSelectedClient);
  const setSelectedFormat = useAppStore((s) => s.setSelectedFormat);
  const setSubject = useAppStore((s) => s.setSubject);

  const clients = useSettingsStore((s) => s.clients);
  const formats = useSettingsStore((s) => s.formats);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="client" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Client
        </Label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger id="client" className="h-10">
            <SelectValue placeholder="Select client..." />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Format
        </Label>
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger id="format" className="h-10">
            <SelectValue placeholder="Select format..." />
          </SelectTrigger>
          <SelectContent>
            {formats.map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Subject
        </Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject..."
          className="h-10"
        />
      </div>
    </div>
  );
}
