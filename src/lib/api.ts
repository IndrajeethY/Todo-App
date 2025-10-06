// API client for backend REST API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface ApiError {
  message: string;
}

interface LoginResponse {
  token: string;
  user_id: string;
}

interface TodoInput {
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority?: "low" | "medium" | "high";
  notify_enabled?: boolean;
  notify_frequency?: number;
  order_index?: number;
}

interface TodoResponse {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  notify_enabled: boolean;
  notify_frequency: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message);
    }
    return response.json();
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async getTodos(): Promise<TodoResponse[]> {
    const response = await fetch(`${this.baseUrl}/api/todos`, {
      method: "GET",
      headers: {
        ...this.getAuthHeader(),
      },
    });
    return this.handleResponse(response);
  }

  async createTodo(todo: TodoInput): Promise<TodoResponse> {
    const response = await fetch(`${this.baseUrl}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(todo),
    });
    return this.handleResponse(response);
  }

  async updateTodo(
    id: string,
    updates: Partial<TodoInput>,
  ): Promise<TodoResponse> {
    const response = await fetch(`${this.baseUrl}/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return this.handleResponse(response);
  }

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        ...this.getAuthHeader(),
      },
    });
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message);
    }
  }

  async completeTodo(id: string): Promise<TodoResponse> {
    const response = await fetch(`${this.baseUrl}/api/todos/${id}/complete`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
      },
    });
    return this.handleResponse(response);
  }

  async reorderTodos(todoIds: string[]): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/todos/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ todo_ids: todoIds }),
    });
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message);
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth helpers
export const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
