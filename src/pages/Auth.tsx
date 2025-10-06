import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, setAuthToken, isAuthenticated } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await apiClient.login(username, password);
      setAuthToken(response.token);
      localStorage.setItem("user_id", response.user_id);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-2xl bg-card/40 border-primary/30 shadow-elevated">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-block">
                <h1
                  className="text-5xl font-bold mb-2"
                  style={{
                    background: "var(--gradient-hero)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  TaskFlow
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Your personal task sanctuary
              </p>
              <div
                className="h-1 w-20 mx-auto rounded-full"
                style={{ background: "var(--gradient-hero)" }}
              />
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-xs text-muted-foreground/70">
                Default credentials:{" "}
                <span className="text-primary font-mono">admin / admin</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
