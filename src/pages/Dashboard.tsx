import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeAuthToken, isAuthenticated } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoList } from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { useTodos } from "@/hooks/useTodos";
import { useNotifications } from "@/hooks/useNotifications";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { todos, loading, addTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos(userId);
  const { requestPermission } = useNotifications(todos);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(userId);
    } else {
      navigate("/");
    }

    requestPermission();
  }, [navigate, requestPermission]);

  const handleLogout = async () => {
    removeAuthToken();
    localStorage.removeItem("user_id");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
            ? !todo.completed
            : todo.completed;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div
            className="text-4xl font-bold animate-pulse"
            style={{
              background: "var(--gradient-twilight)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TaskFlow
          </div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-twilight)" }}
            >
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{
                background: "var(--gradient-twilight)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TaskFlow
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="hover:border-destructive/50 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {todos.length}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total Tasks
                  </div>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-accent">
                    {todos.filter((t) => !t.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active
                  </div>
                </div>
                <div className="p-3 rounded-full bg-accent/10">
                  <Circle className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {todos.filter((t) => t.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Completed
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
          <AddTodoForm
            onAdd={addTodo}
            existingTitles={todos.map((t) => t.title)}
          />

          <TodoFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          {filteredTodos.length > 0 ? (
            <TodoList
              todos={filteredTodos}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onReorder={reorderTodos}
            />
          ) : (
            /* Empty State */
            <div
              className="text-center py-20 rounded-2xl border border-border/50 relative overflow-hidden"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative">
                <div className="inline-flex p-4 rounded-full bg-muted/30 mb-4">
                  {searchQuery || filterStatus !== "all" ? (
                    <Circle className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <ListTodo className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <p className="text-muted-foreground text-xl">
                  {searchQuery || filterStatus !== "all"
                    ? "No tasks match your filters"
                    : "No tasks yet. Start by adding your first task!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
