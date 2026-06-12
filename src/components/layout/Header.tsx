import { APP_NAME, APP_VERSION } from '@/lib/constants';

export function Header() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm overflow-hidden border border-border/50">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
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
