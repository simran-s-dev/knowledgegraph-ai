import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import {
  FileText,
  Network,
  Share2,
  Lightbulb,
  UploadCloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalDocuments: 2,
    totalConcepts: 9,
    totalRelationships: 8,
    crossDocConnections: 2,
    knowledgeGaps: 2,
    recentDocuments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-cyan-950/40 border border-white/10 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-3 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Knowledge Space Ready</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome back to your <span className="glow-text">Knowledge Engine</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Your documents have been transformed into an interconnected semantic graph. Discover cross-disciplinary connections, detect gaps, or consult your grounded AI assistant.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/app/documents"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white glow-gradient shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Upload New Document</span>
            </Link>
            <Link
              to="/app/graph"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 shadow-sm hover:scale-105 transition-all"
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Explore Full Graph</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalDocuments}</div>
            <div className="text-xs font-semibold text-slate-400">Uploaded Documents</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalConcepts}</div>
            <div className="text-xs font-semibold text-slate-400">Extracted Concepts</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-cyan-500">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalRelationships}</div>
            <div className="text-xs font-semibold text-slate-400">Mapped Relationships</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.crossDocConnections}</div>
            <div className="text-xs font-semibold text-slate-400">Cross-Doc Bridges</div>
          </div>
        </GlassCard>
      </div>

      {/* Two Column Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Documents Card */}
        <GlassCard>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Recent Documents</span>
            </h3>
            <Link to="/app/documents" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentDocuments && stats.recentDocuments.length > 0 ? (
              stats.recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                      {doc.file_type || 'PDF'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{doc.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {doc.concept_count || 4} concepts extracted • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No documents uploaded yet.</p>
            )}
          </div>
        </GlassCard>

        {/* Knowledge Graph Quick Preview */}
        <GlassCard>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              <span>Graph Network Topology</span>
            </h3>
            <Link to="/app/graph" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              Interactive Canvas <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#070a12] text-white relative overflow-hidden h-44 flex flex-col justify-between border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Clustered Categories: 5</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Synchronized
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center py-2">
              <span className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-500/50 text-xs font-bold text-purple-200">
                Supervised Learning
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-950 border border-blue-500/50 text-xs font-bold text-blue-200">
                Loss Function
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-xs font-bold text-emerald-200">
                Model Evaluation
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-950 border border-amber-500/50 text-xs font-bold text-amber-200">
                Software Testing
              </span>
            </div>

            <Link
              to="/app/graph"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-center text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/30"
            >
              Open Fullscreen Interactive Graph
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
