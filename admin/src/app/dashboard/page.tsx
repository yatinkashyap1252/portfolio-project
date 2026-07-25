"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";
import {
  FolderKanban,
  Code2,
  Award,
  CalendarDays,
  Clock,
  RefreshCw,
  Terminal,
  ShieldCheck,
  UserCheck,
  LogOut,
  PlusCircle,
  FileEdit,
} from "lucide-react";

interface DashboardCounts {
  projects: number;
  skills: number;
  certificates: number;
  experience: number;
  education: number;
}

interface ActivityLogItem {
  _id: string;
  email: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboardData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch("/cms/dashboard");
      setCounts(data.counts);
      setLastUpdated(data.lastUpdated);
      setRecentLogs(data.recentActivity || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch dashboard summaries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatLogAction = (action: string) => {
    switch (action) {
      case "LOGIN_SUCCESS":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-green-950/50 text-green-400 border border-green-900/40">LOGIN OK</span>;
      case "LOGIN_FAILED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-950/50 text-red-400 border border-red-900/40">LOGIN FAIL</span>;
      case "2FA_VERIFIED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">2FA OK</span>;
      case "2FA_FAILED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-orange-950/50 text-orange-400 border border-orange-900/40">2FA FAIL</span>;
      case "CONTENT_CHANGE":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-950/50 text-blue-400 border border-blue-900/40">CMS EDIT</span>;
      case "FILE_UPLOAD":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950/50 text-cyan-400 border border-cyan-900/40">UPLOAD</span>;
      case "LOGOUT":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50">LOGOUT</span>;
      case "PORTFOLIO_VISIT":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950/50 text-purple-400 border border-purple-900/40">VISIT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-850 text-zinc-300">{action}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
            SYSTEM DASHBOARD
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
            Overall status metrics and configuration records
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#E63925]" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-xs font-mono">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Projects */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <FolderKanban className="h-8 w-8" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Projects</p>
            <p className="text-3xl font-black text-white">{counts?.projects || 0}</p>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Code2 className="h-8 w-8" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Skills Entries</p>
            <p className="text-3xl font-black text-white">{counts?.skills || 0}</p>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <CalendarDays className="h-8 w-8" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Experiences</p>
            <p className="text-3xl font-black text-white">{counts?.experience || 0}</p>
          </div>
        </div>

        {/* Education */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <CalendarDays className="h-8 w-8" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Education Blocks</p>
            <p className="text-3xl font-black text-white">{counts?.education || 0}</p>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Award className="h-8 w-8" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Certificates</p>
            <p className="text-3xl font-black text-white">{counts?.certificates || 0}</p>
          </div>
        </div>
      </div>

      {/* Meta Indicators */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
        <Clock className="h-4 w-4 text-[#E63925]" />
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
          DATABASE LAST REFRESHED ON:{" "}
          <span className="text-white">
            {lastUpdated ? new Date(lastUpdated).toLocaleString() : "NEVER"}
          </span>
        </span>
      </div>

      {/* Activity Log Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Recent System Activity
            </h2>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            LAST 8 AUDIT LOGS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 text-zinc-500 uppercase tracking-wider border-b border-zinc-800 text-[10px]">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Identity</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Activity Details</th>
                <th className="py-3 px-6 text-right">Origin (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/20 text-zinc-300">
                    <td className="py-3.5 px-6 whitespace-nowrap text-zinc-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-semibold">{log.email}</td>
                    <td className="py-3.5 px-6">{formatLogAction(log.action)}</td>
                    <td className="py-3.5 px-6 max-w-xs truncate text-zinc-400" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3.5 px-6 text-right text-zinc-500 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 uppercase tracking-widest text-[10px]">
                    No activity logs recorded in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Simple inline Loader svg since we want to keep it simple and clean
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-[#E63925] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
