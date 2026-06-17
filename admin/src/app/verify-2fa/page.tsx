"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { ShieldCheck, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

const codeSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Code must be at least 6 digits/characters." })
    .max(12, { message: "Code must not exceed 12 characters." }),
});

type CodeFormData = z.infer<typeof codeSchema>;

export default function Verify2faPage() {
  const router = useRouter();
  const { setAuth, isPending2fa, clearAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If not pending 2FA state, redirect back to login
  useEffect(() => {
    if (!isPending2fa) {
      router.push("/login");
    }
  }, [isPending2fa, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmit = async (data: CodeFormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ code: data.code }),
        skip2faToken: true, // Use the 2faPendingToken inside the store
      });

      if (res.accessToken) {
        setAuth(res.accessToken, res.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#E63925] shadow-inner">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              2FA Authentication
            </h1>
            <p className="text-zinc-400 text-xs font-mono tracking-wider">
              Enter authenticator code or backup recovery code
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
              <label htmlFor="code" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                autoComplete="off"
                placeholder="123456 or ABCDEFGH"
                {...register("code")}
                className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white placeholder-zinc-700 text-center tracking-[0.2em] uppercase transition-all outline-none
                  ${errors.code ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
                `}
              />
              {errors.code && (
                <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider text-center">{errors.code.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#E63925] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-red-600 transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Token ↗</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
