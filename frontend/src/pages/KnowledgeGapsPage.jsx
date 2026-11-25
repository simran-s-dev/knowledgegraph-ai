import React, { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import {
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target
} from 'lucide-react';
import { api } from '../api';

const severityBadgeMap = {
  high: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
  medium: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
  low: 'bg-blue-950/80 text-blue-300 border-blue-500/50'
};

export default function KnowledgeGapsPage() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getKnowledgeGaps()
      .then((data) => {
        setGaps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Automated Ontological Auditing</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Knowledge Gap Insights
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mt-1">
          The system actively identifies weakly supported concepts, missing inter-domain links, and isolated nodes to guide your ongoing study and research.
        </p>
      </div>

      {/* Gaps List */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center col-span-2">Auditing graph for knowledge gaps...</p>
        ) : gaps.length === 0 ? (
          <GlassCard className="text-center py-12 col-span-2">
            <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-slate-300 text-sm">No critical knowledge gaps detected</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your knowledge graph exhibits high conceptual density and well-distributed links.
            </p>
          </GlassCard>
        ) : (
          gaps.map((gap) => (
            <GlassCard key={gap.id} className="p-6 flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {gap.gap_type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      severityBadgeMap[gap.severity] || severityBadgeMap.medium
                    }`}
                  >
                    {gap.severity} Priority
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{gap.title}</span>
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {gap.explanation}
                </p>

                {gap.related_concept && (
                  <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Related Node: <strong className="text-white">{gap.related_concept}</strong></span>
                  </div>
                )}
              </div>

              {gap.suggested_action && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200">
                  <strong className="block mb-0.5 text-amber-300 font-bold">Suggested Remediation:</strong>
                  {gap.suggested_action}
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
