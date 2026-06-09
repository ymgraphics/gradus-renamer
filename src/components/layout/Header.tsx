import { APP_NAME, APP_VERSION } from '@/lib/constants';

export function Header() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-950 dark:from-white dark:to-neutral-300 shadow-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white dark:text-neutral-900"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex items-center gap-2.5">
        <h1 className="text-[15px] font-semibold tracking-tight">{APP_NAME}</h1>
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-muted text-muted-foreground">
          v{APP_VERSION}
        </span>
      </div>
    </div>
  );
}
