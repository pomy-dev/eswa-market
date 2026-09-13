import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, signin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("demo@eswa.market");
  const [password, setPassword] = useState("demo123");
  const [name, setName] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signin();
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to marketplace
        </Link>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl">
              {/* <Leaf className="size-5 text-accent-foreground" /> */}
              <img src="/icon/logo.png" alt="" />
            </div>
            <div>
              <p className="font-serif text-lg font-bold">Eswa-Market</p>
              <p className="text-xs text-muted-foreground">Seller workspace</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1">
            <button type="button" onClick={() => setMode("signin")} className={`rounded-md py-2 text-sm font-medium transition-colors ${mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              Log in
            </button>
            <button type="button" onClick={() => setMode("signup")} className={`rounded-md py-2 text-sm font-medium transition-colors ${mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              Create account
            </button>
          </div>

          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Start selling online"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Use the demo account to open your dashboard." : "Create a demo seller account in seconds."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Amina Eswa" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
            </div>
            {error && <p className="text-sm text-destructive">{error.message}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLoading ? "Opening workspace..." : mode === "signin" ? "Log in to dashboard" : "Create demo account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">Demo mode accepts any valid email and a password with 6 or more characters.</p>
        </section>
      </div>
    </main>
  );
}