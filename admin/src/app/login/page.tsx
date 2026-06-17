"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { KeyRound, Mail, ShieldAlert, Loader2, Sparkles } from "lucide-react";

// Standard router import is from next/navigation
import { useRouter as useNextRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useNextRouter();
  const { setAuth, setPending2fa, isAuthenticated } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (isRegisterMode) {
        // Register first admin account
        await apiFetch("/auth/register-admin", {
          method: "POST",
          body: JSON.stringify(data),
          skipAuth: true,
        });
        setIsRegisterMode(false);
        setErrorMsg("Initial admin registered successfully! Please log in now.");
      } else {
        // Normal Login
        const res = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify(data),
          skipAuth: true,
        });

        if (res.status === "PENDING_2FA") {
          setPending2fa(res.token);
          router.push("/verify-2fa");
        } else if (res.accessToken) {
          setAuth(res.accessToken, res.user);
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 shadow-inner">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              {isRegisterMode ? "Setup Admin Portal" : "Admin Panel Sign In"}
            </h1>
            <p className="text-zinc-400 text-xs font-mono tracking-wider">
              {isRegisterMode ? "Register the first root account" : "Enter credentials to gain session access"}
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-3 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-xs font-mono">
              <ShieldAlert className="h-4.5 w-4.5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all outline-none
                    ${errors.email ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
                  `}
                />
                <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
              </div>
              {errors.email && (
                <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all outline-none
                    ${errors.password ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
                  `}
                />
                <KeyRound className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
              </div>
              {errors.password && (
                <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isRegisterMode ? "Register Root Admin" : "Authenticate Session ↗"}</span>
              )}
            </button>
          </form>

          {/* Setup Initial Account Trigger */}
          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isRegisterMode ? "Back to normal login" : "Register initial admin account (First Setup)"}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
