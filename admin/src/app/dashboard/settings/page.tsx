"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { apiFetch } from "../../../utils/api";
import { Loader2, ShieldCheck, ShieldAlert, KeyRound, QrCode, PowerOff, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 2FA Setup states
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeDataUrl: string; backupCodes: string[] } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [confirming2fa, setConfirming2fa] = useState(false);
  
  // 2FA Disable states
  const [disableCode, setDisableCode] = useState("");
  const [disabling2fa, setDisabling2fa] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);

  // Terminate sessions state
  const [terminating, setTerminating] = useState(false);

  const is2faEnabled = user?.twoFactorEnabled || false;

  const handleStartSetup = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const data = await apiFetch("/auth/setup-2fa");
      setSetupData(data);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to initialize 2FA setup." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || !totpCode.trim()) return;

    setConfirming2fa(true);
    setStatusMsg(null);

    try {
      await apiFetch("/auth/verify-setup-2fa", {
        method: "POST",
        body: JSON.stringify({
          code: totpCode.trim(),
          secret: setupData.secret,
          backupCodes: setupData.backupCodes,
        }),
      });

      // Update local state store
      if (user) {
        setAuth(useAuthStore.getState().accessToken || "", {
          ...user,
          twoFactorEnabled: true,
        });
      }

      setStatusMsg({ type: "success", text: "Two-factor authentication successfully enabled!" });
      setSetupData(null);
      setTotpCode("");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "2FA verification failed. Please try again." });
    } finally {
      setConfirming2fa(false);
    }
  };

  const handleDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableCode.trim()) return;

    setDisabling2fa(true);
    setStatusMsg(null);

    try {
      await apiFetch("/auth/disable-2fa", {
        method: "POST",
        body: JSON.stringify({ code: disableCode.trim() }),
      });

      // Update local state store
      if (user) {
        setAuth(useAuthStore.getState().accessToken || "", {
          ...user,
          twoFactorEnabled: false,
        });
      }

      setStatusMsg({ type: "success", text: "Two-factor authentication has been disabled." });
      setDisableCode("");
      setShowDisableForm(false);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to disable 2FA. Verify your authenticator code." });
    } finally {
      setDisabling2fa(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure you want to terminate all active sessions? You will be logged out of this device as well.")) return;

    setTerminating(true);
    setStatusMsg(null);

    try {
      await apiFetch("/auth/logout-all", { method: "POST" });
      clearAuth();
      router.push("/login");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to terminate sessions." });
      setTerminating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          Security Settings
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Configure two-factor credentials, backup recovery codes, and manage active system sessions
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-lg text-xs font-mono border
            ${
              statusMsg.type === "success"
                ? "bg-green-950/40 border-green-900/50 text-green-200"
                : "bg-red-950/40 border-red-900/50 text-red-200"
            }
          `}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: 2FA Control Panel */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6 self-start">
          
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <KeyRound className="h-5 w-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                Multi-Factor Authentication (2FA)
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5">
                Google Authenticator / TOTP
              </p>
            </div>
          </div>

          {/* Current Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3
            ${is2faEnabled 
              ? "bg-green-950/20 border-green-900/40 text-green-200" 
              : "bg-yellow-950/20 border-yellow-900/40 text-yellow-250"}
          `}>
            {is2faEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase font-bold">
                Status: {is2faEnabled ? "PROTECTED (2FA ENABLED)" : "UNPROTECTED (2FA DISABLED)"}
              </p>
              <p className="text-[10px] leading-relaxed opacity-80">
                {is2faEnabled 
                  ? "Your account is secured with secondary Google Authenticator challenges on login." 
                  : "We strongly recommend enabling 2FA to prevent unauthorized database modifications."}
              </p>
            </div>
          </div>

          {/* Enable 2FA Area */}
          {!is2faEnabled && !setupData && (
            <button
              onClick={handleStartSetup}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Set Up 2FA ↗</span>}
            </button>
          )}

          {/* 2FA Setup Flow (Secret/QR Code generated) */}
          {!is2faEnabled && setupData && (
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 md:p-6 space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* QR Code */}
                <div className="bg-white p-3 rounded-lg border border-zinc-800 shrink-0 select-none">
                  {setupData.qrCodeDataUrl ? (
                    <img src={setupData.qrCodeDataUrl} alt="Google Authenticator QR Code" className="h-32 w-32 object-contain" />
                  ) : (
                    <div className="h-32 w-32 flex items-center justify-center text-zinc-950 font-mono text-[10px]">QR Code</div>
                  )}
                </div>

                {/* Setup Copy instructions */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex gap-2 items-center text-white">
                    <QrCode className="h-4 w-4 text-[#E63925]" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Scan or Enter Secret</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[10px]">
                    Scan the QR code with Google Authenticator or manual enter this setup secret key:
                  </p>
                  <code className="block bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono text-xs select-all text-center rounded">
                    {setupData.secret}
                  </code>
                </div>
              </div>

              {/* Backup codes warning */}
              <div className="space-y-2.5 border-t border-zinc-850 pt-5">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Backup Recovery Codes
                </p>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                  Store these recovery codes securely. If you lose your mobile device, you can use these to log back in.
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-sm">
                  {setupData.backupCodes.map((code) => (
                    <code key={code} className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono px-3 py-1.5 rounded text-zinc-300 text-center select-all block">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              {/* Verify setup input */}
              <form onSubmit={handleVerifySetup} className="border-t border-zinc-850 pt-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Enter 6-Digit Authenticator Code
                  </label>
                  <div className="flex gap-3 max-w-xs">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-center text-sm text-white tracking-widest outline-none"
                    />
                    <button
                      type="submit"
                      disabled={confirming2fa || totpCode.length !== 6}
                      className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer whitespace-nowrap"
                    >
                      {confirming2fa ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Verify & Enable</span>}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          )}

          {/* Disable 2FA area */}
          {is2faEnabled && (
            <div className="space-y-4 pt-2">
              {!showDisableForm ? (
                <button
                  onClick={() => setShowDisableForm(true)}
                  className="px-5 py-2.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-900/60 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Disable 2FA Protection
                </button>
              ) : (
                <form onSubmit={handleDisable2fa} className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4 max-w-md">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                    <span className="text-[10px] font-mono text-red-400 uppercase font-black tracking-wider">Confirm Disable</span>
                    <button
                      type="button"
                      onClick={() => setShowDisableForm(false)}
                      className="text-zinc-500 hover:text-white font-mono text-[9px] uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                    Provide the current authenticator code to confirm disabling Multi-Factor authentication.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-center text-sm text-white tracking-widest outline-none"
                    />
                    <button
                      type="submit"
                      disabled={disabling2fa || disableCode.length !== 6}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer whitespace-nowrap"
                    >
                      {disabling2fa ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Disable 2FA</span>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right: Sessions Panel */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6 self-start">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <PowerOff className="h-5 w-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                Active Sessions
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5">
                Session Control & Security
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
            If you suspect unauthorized access or have logged in from public computers, you can force-terminate all other active browser session tokens.
          </p>

          <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3">
            <div className="flex gap-2 items-start font-mono text-[10px]">
              <HelpCircle className="h-4 w-4 text-[#E63925] shrink-0 mt-0.5" />
              <span className="text-zinc-400 leading-normal">
                Terminating sessions invalidates all rotated refresh tokens across other platforms, desktop clients, and mobile browsers.
              </span>
            </div>
          </div>

          <button
            onClick={handleLogoutAll}
            disabled={terminating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-650 hover:bg-red-700 text-white border border-red-700/50 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
          >
            {terminating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Terminate All Sessions ↗</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
