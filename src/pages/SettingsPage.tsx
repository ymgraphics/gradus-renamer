import { useSettingsStore } from '@/store/useSettingsStore';
import { ItemManager } from '@/components/settings/ItemManager';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { UpdaterSettings } from '@/components/settings/UpdaterSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SettingsPage() {
  const clients = useSettingsStore((s) => s.clients);
  const formats = useSettingsStore((s) => s.formats);
  const addClient = useSettingsStore((s) => s.addClient);
  const editClient = useSettingsStore((s) => s.editClient);
  const deleteClient = useSettingsStore((s) => s.deleteClient);
  const addFormat = useSettingsStore((s) => s.addFormat);
  const editFormat = useSettingsStore((s) => s.editFormat);
  const deleteFormat = useSettingsStore((s) => s.deleteFormat);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage clients, formats, and appearance preferences.
        </p>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger value="clients" className="text-xs">Clients</TabsTrigger>
          <TabsTrigger value="formats" className="text-xs">Formats</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs">Appearance</TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="clients" className="mt-0">
            <ItemManager
              title="Clients"
              description="Manage the list of clients available in the rename form."
              items={clients}
              onAdd={addClient}
              onEdit={editClient}
              onDelete={deleteClient}
            />
          </TabsContent>

          <TabsContent value="formats" className="mt-0">
            <ItemManager
              title="Formats"
              description="Manage the list of content formats available in the rename form."
              items={formats}
              onAdd={addFormat}
              onEdit={editFormat}
              onDelete={deleteFormat}
            />
          </TabsContent>

          <TabsContent value="appearance" className="mt-0 space-y-5">
            <UpdaterSettings />
            <AppearanceSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
