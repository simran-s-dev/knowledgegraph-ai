import React, { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import {
  Share2,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  BookOpen,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../api';

export default function CrossDocumentDiscoveryPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCrossDocConnections()
      .then((data) => {
        setConnections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cross-Corpus Synthesis</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Cross-Document Connection Discovery
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mt-1">
          The AI engine analyzes concepts appearing in disparate documents to discover hidden interdisciplinary bridges, analogies, and dependencies.
        </p>
      </div>

      {/* Discovery List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center">Scanning corpus for cross-document bridges...</p>
        ) : connections.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-slate-300 text-sm">No cross-document connections detected</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Upload at least 2 distinct documents to enable AI multi-document correlation.
            </p>
          </GlassCard>
        ) : (
          connections.map((conn) => (
            <GlassCard key={conn.id} className="p-6 relative overflow-hidden border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {conn.relationship_type || 'validates'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    AI Semantic Bridge
                  </span>
                </div>

                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence Alignment
                </div>
              </div>

              {/* Connected Concepts Visual Bridge */}
              <div className="grid md:grid-cols-2 gap-4 items-center bg-white/5 p-5 rounded-2xl border border-white/5 mb-4">
                <div className="p-4 rounded-xl bg-[#090d18] border border-indigo-500/30 shadow-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{conn.docA}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{conn.conceptA}</h4>
                </div>

                <div className="p-4 rounded-xl bg-[#090d18] border border-purple-500/30 shadow-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>{conn.docB}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{conn.conceptB}</h4>
                </div>
              </div>

              {/* Explanation & Evidence */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-slate-300 mb-1">Conceptual Bridge Explanation:</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{conn.explanation}</p>
                </div>

                {conn.evidence && (
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span><strong>Grounding Evidence:</strong> {conn.evidence}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
