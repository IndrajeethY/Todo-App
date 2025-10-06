// src/types/todo.ts
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority: Priority;
  completed: boolean;
  notify_enabled: boolean;
  notify_frequency: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  discord_enabled?: boolean;
  telegram_enabled?: boolean;
}

export type NewTodo = Omit<
  Todo,
  "id" | "user_id" | "completed" | "order_index" | "created_at" | "updated_at"
>;
