import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { Todo } from "@/types/todo";

export const useTodos = (userId: string | null) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await apiClient.getTodos();
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchTodos();
  }, [userId, fetchTodos]);

  const addTodo = async (
    todo: Omit<
      Todo,
      | "id"
      | "user_id"
      | "completed"
      | "order_index"
      | "created_at"
      | "updated_at"
    >,
  ) => {
    if (!userId) return;

    try {
      await apiClient.createTodo({
        ...todo,
        order_index: todos.length,
      });
      // Refetch to get the updated list
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      // If marking as complete, use the complete endpoint
      if (updates.completed !== undefined && updates.completed) {
        await apiClient.completeTodo(id);
      } else {
        await apiClient.updateTodo(id, updates);
      }
      // Refetch to get the updated list
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await apiClient.deleteTodo(id);
      // Refetch to get the updated list
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  };

  const reorderTodos = async (reorderedTodos: Todo[]) => {
    try {
      const todoIds = reorderedTodos.map((todo) => todo.id);
      await apiClient.reorderTodos(todoIds);
      setTodos(reorderedTodos);
    } catch (error) {
      console.error("Error reordering todos:", error);
      throw error;
    }
  };

  return { todos, loading, addTodo, updateTodo, deleteTodo, reorderTodos };
};
