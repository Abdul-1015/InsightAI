import {
  Sparkles,
  Check,
} from "lucide-react";
import { Card } from "../ui/Card";

export function SignUpPage() {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

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
              OAuth is the fastest way to get started
            </span>
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-6">
          <div className="space-y-3">
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why sign up?
            </h3>
            <ul className="space-y-2">
              {[
                "Transform spreadsheets into dashboards with AI",
                "Natural language queries — no SQL needed",
                "Anomaly detection and forecasting",
                "Export to PDF, Excel, or PowerPoint",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-[#4F46E5] mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-[#4F46E5] hover:underline">
            Sign in
          </a>
        </p>

        {/* Features */}
        <div className="mt-6 space-y-2">
          {[
            "14-day free trial with full access",
            "No credit card required",
            "Cancel anytime",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
