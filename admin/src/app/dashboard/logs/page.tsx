"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Terminal, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

interface ActivityLogItem {
  _id: string;
  email: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLogs = async (pageNum = 1, isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setErrorMsg(null);

    try {
      const data = await apiFetch(`/cms/logs?page=${pageNum}&limit=15`);
      setLogs(data.logs || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotalLogs(data.totalLogs || 0);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const formatLogAction = (action: string) => {
    switch (action) {
      case "LOGIN_SUCCESS":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-green-950/50 text-green-400 border border-green-900/45">LOGIN OK</span>;
      case "LOGIN_FAILED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-950/50 text-red-400 border border-red-900/45">LOGIN FAIL</span>;
      case "2FA_VERIFIED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-900/45">2FA OK</span>;
      case "2FA_FAILED":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-orange-950/50 text-orange-400 border border-orange-900/45">2FA FAIL</span>;
      case "CONTENT_CHANGE":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-950/50 text-blue-400 border border-blue-900/45">CMS EDIT</span>;
      case "FILE_UPLOAD":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950/50 text-cyan-400 border border-cyan-900/45">UPLOAD</span>;
      case "LOGOUT":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-750">LOGOUT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-850 text-zinc-300">{action}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="animate-spin h-5 w-5 text-[#E63925]" />
        <span>RETRIEVING AUDIT LOGS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
            Security Audit Logs
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
            Review detailed access records, user operations, and system alterations
          </p>
        </div>

        <button
          onClick={() => fetchLogs(page, true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#E63925]" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-xs font-mono">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Logs Table Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              System Operations Stream
            </h2>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase">
            Total records: {totalLogs}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 text-zinc-500 uppercase tracking-wider border-b border-zinc-800 text-[10px]">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Identity</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Details</th>
                <th className="py-3.5 px-6">User Agent</th>
                <th className="py-3.5 px-6 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/10 text-zinc-300">
                    <td className="py-3.5 px-6 whitespace-nowrap text-zinc-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-semibold">{log.email}</td>
                    <td className="py-3.5 px-6">{formatLogAction(log.action)}</td>
                    <td className="py-3.5 px-6 text-zinc-400 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3.5 px-6 text-zinc-500 max-w-xs truncate text-[10px]" title={log.userAgent}>
                      {log.userAgent}
                    </td>
                    <td className="py-3.5 px-6 text-right text-zinc-500 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 uppercase tracking-widest text-[10px]">
                    No activity logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/10 font-mono text-xs">
            <span className="text-zinc-500 text-[10px] uppercase">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1.5 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950 cursor-pointer flex items-center gap-1 uppercase text-[10px]"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Prev</span>
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950 cursor-pointer flex items-center gap-1 uppercase text-[10px]"
              >
                <span>Next</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
