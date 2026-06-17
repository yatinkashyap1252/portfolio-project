"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../utils/api";
import { LogOut, User, Loader2, Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      clearAuth();
      setLoggingOut(false);
      router.push("/login");
    }
  };

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
          <span>ROOT ACCESS CONTROL PANEL</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/50 px-3 py-1.5 rounded-full select-none">
          <User className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-mono text-[10px] text-zinc-300">
            {user?.email || "admin@example.com"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
          ) : (
            <>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
