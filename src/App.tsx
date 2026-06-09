import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MainPage } from '@/pages/MainPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useTheme } from '@/hooks/useTheme';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

function PageRouter() {
  const currentPage = useAppStore((s) => s.currentPage);

  switch (currentPage) {
    case 'main':
      return <MainPage />;
    case 'history':
      return <HistoryPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <MainPage />;
  }
}

function App() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadHistory = useHistoryStore((s) => s.loadHistory);

  // Initialize theme
  useTheme();

  // Load persisted data on mount
  useEffect(() => {
    loadSettings();
    loadHistory();
  }, [loadSettings, loadHistory]);

  return (
    <TooltipProvider delayDuration={200}>
      <Layout>
        <PageRouter />
      </Layout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'text-sm',
        }}
      />
    </TooltipProvider>
  );
}

export default App;
