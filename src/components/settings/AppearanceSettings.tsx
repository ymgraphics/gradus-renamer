import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Appearance</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose your preferred color scheme
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className={cn(
            'flex-1 h-20 flex-col gap-2 rounded-xl transition-all',
            theme === 'light' && 'border-primary bg-primary/5 ring-1 ring-primary'
          )}
          onClick={() => setTheme('light')}
        >
          <Sun size={20} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
          <span className="text-xs font-medium">Light</span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            'flex-1 h-20 flex-col gap-2 rounded-xl transition-all',
            theme === 'dark' && 'border-primary bg-primary/5 ring-1 ring-primary'
          )}
          onClick={() => setTheme('dark')}
        >
          <Moon size={20} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
          <span className="text-xs font-medium">Dark</span>
        </Button>
      </div>
    </div>
  );
}
