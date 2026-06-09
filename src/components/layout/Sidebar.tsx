import { Layers, Clock, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Page } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems: { page: Page; icon: typeof Layers; label: string }[] = [
  { page: 'main', icon: Layers, label: 'Rename' },
  { page: 'history', icon: Clock, label: 'History' },
  { page: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  return (
    <div className="flex flex-col items-center gap-1 w-[52px] py-3 border-r border-border/50">
      {navItems.map(({ page, icon: Icon, label }) => (
        <Tooltip key={page} delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCurrentPage(page)}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150',
                currentPage === page
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
