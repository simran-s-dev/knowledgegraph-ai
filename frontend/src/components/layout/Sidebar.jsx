import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Network,
  Share2,
  Route,
  Lightbulb,
  BotMessageSquare,
  Settings,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const navItems = [
  { name: 'Overview', to: '/app', icon: LayoutDashboard, exact: true },
  { name: 'My Documents', to: '/app/documents', icon: FileText },
  { name: 'Knowledge Graph', to: '/app/graph', icon: Network },
  { name: 'Cross-Doc Discovery', to: '/app/discovery', icon: Share2 },
  { name: 'Explain Connection', to: '/app/explain', icon: Route },
  { name: 'Knowledge Gaps', to: '/app/gaps', icon: Lightbulb },
  { name: 'AI Assistant', to: '/app/assistant', icon: BotMessageSquare },
  { name: 'Settings & Keys', to: '/app/settings', icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#090d18]/80 backdrop-blur-2xl flex flex-col h-screen sticky top-0 z-40">
      {/* Brand */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl glow-gradient flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-none">
              KnowledgeGraph
            </h1>
            <span className="text-[11px] font-semibold text-cyan-400">AI Intelligence Core</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 font-bold border border-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* AI Pro Badge Banner */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 text-xs shadow-inner">
        <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Gemini 2.5 Flash Grounded</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
          Deep concept relationship extraction with verified source citations.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Public Landing
        </Link>
      </div>
    </aside>
  );
}
