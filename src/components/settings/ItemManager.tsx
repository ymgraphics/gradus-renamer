import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ItemManagerProps {
  title: string;
  description: string;
  items: string[];
  onAdd: (item: string) => void;
  onEdit: (oldName: string, newName: string) => void;
  onDelete: (item: string) => void;
}

export function ItemManager({
  title,
  description,
  items,
  onAdd,
  onEdit,
  onDelete,
}: ItemManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (!trimmed) {
      toast.error('Name cannot be empty');
      return;
    }
    if (items.includes(trimmed)) {
      toast.error(`"${trimmed}" already exists`);
      return;
    }
    onAdd(trimmed);
    setNewItem('');
    setIsAddOpen(false);
    toast.success(`Added "${trimmed}"`);
  };

  const handleEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      toast.error('Name cannot be empty');
      return;
    }
    if (trimmed !== editingItem && items.includes(trimmed)) {
      toast.error(`"${trimmed}" already exists`);
      return;
    }
    onEdit(editingItem, trimmed);
    setIsEditOpen(false);
    toast.success(`Updated to "${trimmed}"`);
  };

  const handleDelete = (item: string) => {
    onDelete(item);
    toast.success(`Deleted "${item}"`);
  };

  const openEdit = (item: string) => {
    setEditingItem(item);
    setEditValue(item);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNewItem('');
            setIsAddOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus size={14} />
          Add
        </Button>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 group transition-colors"
          >
            <span className="text-sm">{item}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => openEdit(item)}
              >
                <Pencil size={13} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => handleDelete(item)}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No items yet. Click "Add" to create one.
          </p>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Add {title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="new-item">Name</Label>
            <Input
              id="new-item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Enter ${title.toLowerCase().slice(0, -1)} name...`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="edit-item">Name</Label>
            <Input
              id="edit-item"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
