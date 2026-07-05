import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, GitBranch, Globe } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-foreground text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              InsightAI
            </span>
          </a>
          <h1 className="mt-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2.5 text-sm bg-transparent border border-border text-foreground hover:bg-muted">
            <GitBranch className="w-4 h-4" />
            Continue with GitHub
          </button>
          <button className="w-full flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2.5 text-sm bg-transparent border border-border text-foreground hover:bg-muted">
            <Globe className="w-4 h-4" />
            Continue with Google
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
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
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border bg-muted" />
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-xs text-[#4F46E5] hover:underline">Forgot password?</a>
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2.5 text-sm bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#4F46E5] hover:underline">Start free trial</a>
        </p>
      </div>
    </div>
  );
}