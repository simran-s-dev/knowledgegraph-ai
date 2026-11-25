import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl shadow-indigo-950/40">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glow-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-0.5">
              KnowledgeGraph<span className="text-cyan-400">.ai</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              GenAI Core
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          <Link to="/app/settings" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Live APIs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white glow-gradient shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
}
