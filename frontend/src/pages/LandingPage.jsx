import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/common/GlassCard';
import {
  Network,
  Sparkles,
  ArrowRight,
  FileSearch,
  Share2,
  Route,
  Lightbulb,
  ShieldCheck,
  CheckCircle,
  Cpu,
  Layers,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 relative overflow-hidden">
      {/* Background Decorative Neon Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-cyan-500/30 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[750px] -left-40 w-[600px] h-[600px] bg-purple-700/20 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1200px] -right-40 w-[600px] h-[600px] bg-cyan-700/15 blur-[130px] pointer-events-none -z-10" />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-cyan-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-indigo-500/20 border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Generation Knowledge Engineering</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
          Turn Your Documents Into <br className="hidden sm:inline" />
          <span className="glow-text">Connected Knowledge.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Upload multi-format documents, automatically extract key concepts & relationships with Google Gemini, and navigate your personal interactive knowledge graph.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white glow-gradient shadow-2xl shadow-indigo-500/40 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-slate-200 glass-panel hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
          >
            <span>How It Works</span>
          </a>
        </div>

        {/* Live Interactive Graph Preview Teaser */}
        <div className="mt-16 p-2.5 rounded-3xl glass-panel shadow-2xl shadow-indigo-500/20 border border-white/15 max-w-4xl mx-auto">
          <div className="bg-[#0b0f19] rounded-2xl p-6 md:p-8 text-left border border-white/5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                </div>
                <span className="text-xs font-bold text-slate-400">Live Graph Visualizer — Topology Preview</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Active Nodes: 9
              </span>
            </div>

            {/* Visual Node Graph Mockup */}
            <div className="relative h-64 w-full bg-[#070a12] rounded-xl overflow-hidden p-6 flex items-center justify-center text-white border border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

              <div className="relative z-10 grid grid-cols-3 gap-6 w-full max-w-lg items-center text-center">
                <div className="p-3.5 rounded-2xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-bold shadow-xl shadow-purple-500/30 hover:scale-105 transition-transform">
                  Supervised Learning
                  <div className="text-[10px] text-purple-400 font-normal">Theory</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 text-xs font-bold shadow-xl shadow-cyan-500/30 hover:scale-105 transition-transform">
                  Model Evaluation
                  <div className="text-[10px] text-cyan-400 font-normal">Process</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-bold shadow-xl shadow-emerald-500/30 hover:scale-105 transition-transform">
                  Software Testing
                  <div className="text-[10px] text-emerald-400 font-normal">Cross-Doc Bridge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
            Streamlined 3-Step Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Raw Documents to Structured Intelligence
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mx-auto mb-6 shadow-md shadow-indigo-500/20">
              01
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Upload Your Documents</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Drag-and-drop PDFs, Word documents (.docx), text files, or raw notes. Extracted text is normalized and chunked on the backend.
            </p>
          </GlassCard>

          <GlassCard className="text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-xl mx-auto mb-6 shadow-md shadow-purple-500/20">
              02
            </div>
            <h3 className="font-bold text-lg text-white mb-2">AI Extraction & Discovery</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Google Gemini identifies atomic concepts, categorizes them, extracts supporting evidence, and maps inter-concept relationships.
            </p>
          </GlassCard>

          <GlassCard className="text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mx-auto mb-6 shadow-md shadow-cyan-500/20">
              03
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Explore & Query Graph</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Interact with the visual React Flow network, discover cross-document semantic bridges, and chat with a grounded AI assistant.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
            Production Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered for Deep Information Synthesis
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center mb-4">
              <Network className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Interactive React Flow Graph</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pan, zoom, search, and inspect concept nodes with color-coded category tags and dynamic edge descriptions.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Cross-Document Discovery</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Uncover hidden analogies and conceptual bridges between isolated files with citation backing.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
              <Route className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Explain Connection Path</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pick any two concepts to trace the multi-hop topological path and read a clear plain-English explanation.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Knowledge Gap Insights</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify isolated entities, unproven claims, and missing domain topics to prioritize future research.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Grounded AI Knowledge Chat</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Conversational assistant strictly restricted to user documents with verifiable source citations and zero hallucination.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Supabase + Node.js Core</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full Row Level Security, relational PostgreSQL tables, and clean Node.js backend architecture.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070a12]/90 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-7 h-7 rounded-lg glow-gradient flex items-center justify-center text-white">
              <Network className="w-4 h-4" />
            </div>
            <span>KnowledgeGraph AI</span>
          </div>

          <div className="flex gap-6 text-xs text-slate-400">
            <Link to="/app" className="hover:text-cyan-400">Dashboard</Link>
            <Link to="/app/documents" className="hover:text-cyan-400">Documents</Link>
            <Link to="/app/graph" className="hover:text-cyan-400">Knowledge Graph</Link>
            <Link to="/app/settings" className="hover:text-cyan-400">API Settings</Link>
          </div>

          <p className="text-xs text-slate-500">
            Production GenAI Software Engineering Portfolio Project.
          </p>
        </div>
      </footer>
    </div>
  );
}
