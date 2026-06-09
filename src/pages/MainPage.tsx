import { NamingForm } from '@/components/rename/NamingForm';
import { LivePreview } from '@/components/rename/LivePreview';
import { DropZone } from '@/components/rename/DropZone';
import { FileTable } from '@/components/rename/FileTable';
import { ActionBar } from '@/components/rename/ActionBar';

export function MainPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Rename Files</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure the naming convention, add files, and rename them in batch.
        </p>
      </div>

      <NamingForm />
      <LivePreview />
      <DropZone />
      <FileTable />
      <ActionBar />
    </div>
  );
}
