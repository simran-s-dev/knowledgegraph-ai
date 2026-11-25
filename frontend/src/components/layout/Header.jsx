import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, CheckCircle2, AlertCircle, Database, Sparkles, User } from 'lucide-react';
import { api } from '../../api';

export default function Header({ pageTitle = 'Dashboard' }) {
  const [configStatus, setConfigStatus] = useState({
    geminiConfigured: false,
    supabaseConfigured: false
  });

  useEffect(() => {
    api.getConfig().then(setConfigStatus).catch(() => {});
  }, []);

  return (
    <header className="h-16 border-b border-white/10 bg-[#090d18]/70 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Status Pills */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/app/settings"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-white/10 transition-colors bg-white/5 hover:bg-white/10"
            title="Configure in Settings"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">AI:</span>
            {configStatus.geminiConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live Gemini
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3 text-amber-400" /> Demo Mode
              </span>
            )}
          </Link>

          <Link
            to="/app/settings"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-white/10 transition-colors bg-white/5 hover:bg-white/10"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300">DB:</span>
            {configStatus.supabaseConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Supabase
              </span>
            ) : (
              <span className="text-indigo-400 flex items-center gap-1 font-bold">
                In-Memory
              </span>
            )}
          </Link>
        </div>

        {/* Quick Upload CTA */}
        <Link
          to="/app/documents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white glow-gradient shadow-md shadow-indigo-500/30 hover:scale-105 transition-all"
        >
          <UploadCloud className="w-4 h-4 text-white" />
          <span>Upload Document</span>
        </Link>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 to-purple-900 border border-white/20 flex items-center justify-center text-cyan-300 font-bold text-xs shadow-inner">
          <User className="w-4 h-4 text-cyan-300" />
        </div>
      </div>
    </header>
  );
}
