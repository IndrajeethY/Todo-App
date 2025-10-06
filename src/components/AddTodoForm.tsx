import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";

interface AddTodoFormProps {
  onAdd: (todo: {
    title: string;
    description?: string;
    due_date?: string;
    priority: "low" | "medium" | "high";
    notify_enabled: boolean;
    notify_frequency: number;
    discord_enabled: boolean;
    telegram_enabled: boolean;
  }) => Promise<void>;
  existingTitles: string[];
}

export const AddTodoForm = ({ onAdd, existingTitles }: AddTodoFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [notifyFrequency, setNotifyFrequency] = useState(60);
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [telegramEnabled, setTelegramEnabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingTitles.includes(title.trim())) {
      toast.error("A task with this title already exists!");
      return;
    }

    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        priority,
        notify_enabled: notifyEnabled,
        notify_frequency: notifyFrequency,
        discord_enabled: discordEnabled,
        telegram_enabled: telegramEnabled,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setNotifyEnabled(true);
      setNotifyFrequency(60);
      setDiscordEnabled(false);
      setTelegramEnabled(false);
      setIsOpen(false);

      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  if (!isOpen) {
    return (
      <Card
        className="border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group overflow-hidden relative"
        onClick={() => setIsOpen(true)}
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-lg font-medium">Add a new task...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-primary/30 overflow-hidden relative animate-in slide-in-from-top duration-300"
      style={{
        background: "var(--gradient-card)",
        boxShadow: "0 0 40px rgba(147, 51, 234, 0.2)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create New Task
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground/90">
              Task Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground/90">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-foreground/90">
                Due Date & Time
              </Label>
              <DateTimePicker value={dueDate} onChange={setDueDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground/90">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v: any) => setPriority(v)}
              >
                <SelectTrigger
                  id="priority"
                  className="bg-background/50 border-border/50"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="notify"
                className="flex items-center gap-2 text-foreground/90 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-primary" />
                Enable Notifications
              </Label>
              <Switch
                id="notify"
                checked={notifyEnabled}
                onCheckedChange={setNotifyEnabled}
              />
            </div>

            {notifyEnabled && (
              <div className="space-y-4 animate-in slide-in-from-top duration-200">
                <div className="space-y-2">
                  <Label
                    htmlFor="frequency"
                    className="text-sm text-foreground/80"
                  >
                    Notify (minutes before due)
                  </Label>
                  <Input
                    id="frequency"
                    type="number"
                    value={notifyFrequency}
                    onChange={(e) => setNotifyFrequency(Number(e.target.value))}
                    min={1}
                    max={10080}
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-foreground/80">
                    Notification Channels
                  </Label>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30 hover:border-[#5865F2]/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg group-hover:shadow-[#5865F2]/50 transition-shadow">
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      </div>
                      <div>
                        <Label
                          htmlFor="discord"
                          className="cursor-pointer font-medium"
                        >
                          Discord
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified on Discord
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="discord"
                      checked={discordEnabled}
                      onCheckedChange={setDiscordEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30 hover:border-[#26A5E4]/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#26A5E4] flex items-center justify-center shadow-lg group-hover:shadow-[#26A5E4]/50 transition-shadow">
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                        </svg>
                      </div>
                      <div>
                        <Label
                          htmlFor="telegram"
                          className="cursor-pointer font-medium"
                        >
                          Telegram
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified on Telegram
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="telegram"
                      checked={telegramEnabled}
                      onCheckedChange={setTelegramEnabled}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 font-medium shadow-lg hover:shadow-xl transition-all"
              style={{ background: "var(--gradient-twilight)" }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border/50 hover:bg-muted/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
