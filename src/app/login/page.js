"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Eye, EyeOff } from "lucide-react"; // 👈 Eye/EyeOff import karo

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 Naya state

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password. Try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Check your connection.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-[400px] bg-slate rounded-tile p-8">
        
        <div className="mb-10 text-center">
          <h1 className="disp text-4xl text-ink">
            IRON <span className="text-crimson">TEMPLE</span>
          </h1>
          <p className="eyebrow mt-2">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-ink-faint" strokeWidth={1.75} />
              </div>
              <input
                type={showPassword ? "text" : "password"} // 👈 Type toggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full h-12 pl-10 pr-12 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson transition-colors"
                required
              />
              {/* 👇 Eye Icon Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-ink">
              <span className="text-crimson mt-0.5">•</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-hover active:bg-crimson-press text-white font-bold text-[15px] rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Enter Dashboard
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </>
            )}
          </button>
        </form>

      </div>
    </main>
  );
}