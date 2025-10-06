import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  Edit2,
  GripVertical,
  Bell,
  BellOff,
  Save,
  X,
} from "lucide-react";
import { Todo } from "@/types/todo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for delete dialog
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || "",
  );
  const [editNotifyEnabled, setEditNotifyEnabled] = useState(
    todo.notify_enabled,
  );
  const [editNotifyFrequency, setEditNotifyFrequency] = useState(
    todo.notify_frequency,
  );
  const [editDiscordEnabled, setEditDiscordEnabled] = useState(
    todo.discord_enabled,
  );
  const [editTelegramEnabled, setEditTelegramEnabled] = useState(
    todo.telegram_enabled,
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/50";
      case "medium":
        return "bg-accent/20 text-accent border-accent/50";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const handleToggleComplete = async () => {
    await onUpdate(todo.id, { completed: !todo.completed });
    toast.success(
      todo.completed ? "Task marked as incomplete" : "Task completed!",
    );
  };

  const handleToggleNotify = async () => {
    await onUpdate(todo.id, { notify_enabled: !todo.notify_enabled });
    toast.success(
      `Notifications ${!todo.notify_enabled ? "enabled" : "disabled"}`,
    );
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      notify_enabled: editNotifyEnabled,
      notify_frequency: editNotifyFrequency,
      discord_enabled: editDiscordEnabled,
      telegram_enabled: editTelegramEnabled,
    });
    setIsEditing(false);
    toast.success("Task updated!");
  };

  // Updated: Open dialog instead of native confirm
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // New: Handle actual deletion
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(todo.id);
    toast.success("Task deleted!");
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden relative group ${
          todo.completed ? "opacity-60" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <CardContent className="p-4 relative">
          <div className="flex items-start gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />

            <div className="flex-1 space-y-3 min-w-0">
              {isEditing ? (
                <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description..."
                      rows={2}
                      className="bg-background/50 resize-none"
                    />
                  </div>
                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label>Enable Notifications</Label>
                      <Switch
                        checked={editNotifyEnabled}
                        onCheckedChange={setEditNotifyEnabled}
                      />
                    </div>

                    {editNotifyEnabled && (
                      <div className="space-y-3 animate-in slide-in-from-top duration-200">
                        <div className="space-y-2">
                          <Label htmlFor="edit-frequency" className="text-sm">
                            Notify (minutes before due)
                          </Label>
                          <Input
                            id="edit-frequency"
                            type="number"
                            value={editNotifyFrequency}
                            onChange={(e) =>
                              setEditNotifyFrequency(Number(e.target.value))
                            }
                            min={1}
                            max={10080}
                            className="bg-background/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">
                            Notification Channels
                          </Label>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-background/30 border border-border/30">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                              </div>
                              <span className="text-sm">Discord</span>
                            </div>
                            <Switch
                              checked={editDiscordEnabled}
                              onCheckedChange={setEditDiscordEnabled}
                            />
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-background/30 border border-border/30">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#26A5E4] flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                                </svg>
                              </div>
                              <span className="text-sm">Telegram</span>
                            </div>
                            <Switch
                              checked={editTelegramEnabled}
                              onCheckedChange={setEditTelegramEnabled}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3
                      className={`font-medium text-lg ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge
                      className={getPriorityColor(todo.priority)}
                      variant="outline"
                    >
                      {getPriorityIcon(todo.priority)} {todo.priority}
                    </Badge>

                    {todo.due_date && (
                      <Badge
                        variant="outline"
                        className="text-xs border-border/50"
                      >
                        📅{" "}
                        {format(new Date(todo.due_date), "MMM dd, yyyy HH:mm")}
                      </Badge>
                    )}

                    {todo.notify_enabled && (
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/50 text-primary"
                      >
                        ⏰ {todo.notify_frequency}m before
                      </Badge>
                    )}

                    {todo.discord_enabled && (
                      <Badge
                        variant="outline"
                        className="text-xs border-[#5865F2]/50 text-[#5865F2]"
                      >
                        Discord ✓
                      </Badge>
                    )}

                    {todo.telegram_enabled && (
                      <Badge
                        variant="outline"
                        className="text-xs border-[#26A5E4]/50 text-[#26A5E4]"
                      >
                        Telegram ✓
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSaveEdit}
                    className="hover:bg-primary/20 hover:text-primary"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(todo.title);
                      setEditDescription(todo.description || "");
                    }}
                    className="hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-accent/20 hover:text-accent"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleToggleNotify}
                    className="hover:bg-primary/20"
                  >
                    {todo.notify_enabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDelete} // Updated to open dialog
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete
              &quot;{todo.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
