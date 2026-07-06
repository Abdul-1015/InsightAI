import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card } from "../ui/Card";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const error = params.get("error");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span
              className="font-bold text-foreground text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              InsightAI
            </span>
          </a>
          <h1
            className="mt-6 text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 text-center">
            {error === "missing_code"
              ? "Authorization failed. Please try again."
              : error === "oauth_failed"
                ? "OAuth authentication failed. Please try again."
                : error === "userinfo_failed"
                  ? "Failed to fetch user info. Please try again."
                  : "An error occurred. Please try again."}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2.5 text-sm bg-transparent border border-border text-foreground hover:bg-muted"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Email/password auth placeholder — not implemented yet
              alert(
                "Email/password sign-in is not yet implemented. Please use Google."
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-muted"
                />
                <span className="text-xs text-muted-foreground">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-xs text-[#4F46E5] hover:underline">
                Forgot password?
              </a>
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2.5 text-sm bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#4F46E5] hover:underline">
            Start free trial
          </a>
        </p>
      </div>
    </div>
  );
}
