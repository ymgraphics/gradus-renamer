import { useState } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';

export function UpdaterSettings() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const update = await check();

      if (update) {
        toast.info(`Update ${update.version} available!`, {
          description: 'Downloading...',
          duration: 3000,
        });

        setIsDownloading(true);
        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              if (contentLength > 0) {
                setProgress(Math.round((downloaded / contentLength) * 100));
              }
              break;
            case 'Finished':
              setProgress(100);
              break;
          }
        });

        toast.success('Update installed!', {
          description: 'The application will now restart.',
        });
        
        // Slight delay so the user reads the toast
        setTimeout(async () => {
          await relaunch();
        }, 2000);
      } else {
        toast.success('You are up to date!', {
          description: `You are running the latest version (${APP_VERSION}).`,
        });
      }
    } catch (error) {
      console.error('Update check failed:', error);
      toast.error('Failed to check for updates', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsChecking(false);
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium">Application Updates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Current Version: <span className="font-mono text-xs">{APP_VERSION}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDownloading && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Download size={14} className="animate-bounce" />
              {progress}%
            </div>
          )}
          <Button
            variant="secondary"
            onClick={checkForUpdates}
            disabled={isChecking || isDownloading}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isChecking && !isDownloading ? 'animate-spin' : ''}`}
            />
            {isDownloading ? 'Downloading...' : 'Check for Updates'}
          </Button>
        </div>
      </div>
    </div>
  );
}
