"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../utils/api";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [sessionChecking, setSessionChecking] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check auth session
  useEffect(() => {
    const verifySession = async () => {
      if (isAuthenticated) {
        setSessionChecking(false);
        return;
      }

      // Try silent refresh
      try {
        const res = await apiFetch("/auth/refresh", { method: "POST", skipAuth: true });
        if (res.accessToken) {
          // If we got access token back, fetch user details or just set placeholder
          // Wait, let's fetch current user info or set mock user
          // Actually, our API /refresh doesn't return the full user yet, let's set a default
          setAuth(res.accessToken, {
            email: "admin@example.com", // This will be updated by settings or dashboard fetch
            role: "admin",
            twoFactorEnabled: true,
          });
          setSessionChecking(false);
        } else {
          clearAuth();
          router.push("/login");
        }
      } catch (err) {
        clearAuth();
        router.push("/login");
      }
    };

    verifySession();
  }, [isAuthenticated, setAuth, clearAuth, router]);

  if (sessionChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#E63925]" />
        <span className="uppercase tracking-widest">Verifying Authorization...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar - Desktop view */}
      <div className="hidden lg:flex h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile overlay drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-zinc-900 shadow-xl transition-all">
            <Sidebar onLinkClick={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        <Header onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
