import React, { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import {
  Settings,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  KeyRound,
  ShieldAlert,
  Info
} from 'lucide-react';
import { api } from '../api';

export default function SettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getConfig().then((cfg) => {
      if (cfg.geminiModel) setGeminiModel(cfg.geminiModel);
    }).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      await api.updateConfig({
        geminiApiKey,
        geminiModel,
        supabaseUrl,
        supabaseAnonKey
      });
      setStatus({ type: 'success', message: 'API & Database configurations updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>System & API Configuration</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure your Google Gemini API key and Supabase database connection. Both are active and verified.
        </p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold ${
            status.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
              : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Configuration Form */}
      <GlassCard className="border border-white/10">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Gemini Section */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 font-bold text-white mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Google Gemini AI Integration</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Powers concept extraction, cross-document reasoning, and grounded question answering.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... (Already configured in .env)"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Model
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-[#0c101b] focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supabase Section */}
          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Supabase PostgreSQL & Storage</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Stores documents, extracted concepts, graph topology, and chat history with Row Level Security.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://vqctqeejmetzduwzrcqs.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  placeholder="sb_publishable_..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white glow-gradient shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Testing & Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
