import React, { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import {
  Route,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function ExplainConnectionPage() {
  const [concepts, setConcepts] = useState([]);
  const [conceptA, setConceptA] = useState('');
  const [conceptB, setConceptB] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getGraph().then((data) => {
      setConcepts(data.nodes || []);
      if (data.nodes.length >= 2) {
        setConceptA(data.nodes[0].name);
        setConceptB(data.nodes[3]?.name || data.nodes[1].name);
      }
    }).catch(console.error);
  }, []);

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!conceptA || !conceptB) return;
    if (conceptA === conceptB) {
      setError('Please select two different concepts.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await api.explainConnection(conceptA, conceptB);
      setAnalysis(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-3 border border-cyan-500/30">
          <Route className="w-3.5 h-3.5 text-cyan-400" />
          <span>Topological Pathway Reasoning</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Explain Connection
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mt-1">
          Select any two concepts from your knowledge graph to trace their relational path and generate a beginner-friendly narrative synthesis.
        </p>
      </div>

      {/* Concept Selector Form */}
      <GlassCard className="border border-white/10">
        <form onSubmit={handleExplain} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Concept A (Source)
              </label>
              <select
                value={conceptA}
                onChange={(e) => setConceptA(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-semibold bg-[#0c101b] text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {concepts.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Concept B (Target)
              </label>
              <select
                value={conceptB}
                onChange={(e) => setConceptB(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-semibold bg-[#0c101b] text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {concepts.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm text-white glow-gradient shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Tracing Topological Path with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Analyze & Explain Connection Path</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>

      {/* Analysis Result Display */}
      {analysis && (
        <GlassCard className="p-8 border border-cyan-500/30 bg-gradient-to-b from-[#0c101b] to-indigo-950/30">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connection Pathway Discovered</span>
          </div>

          {/* Path Visualizer */}
          <div className="flex flex-wrap items-center justify-center gap-3 p-5 rounded-2xl bg-[#070a12] text-white mb-6 border border-white/10">
            {analysis.path.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="px-4 py-2 rounded-xl bg-indigo-950 border border-cyan-500/40 text-xs font-black text-cyan-200 shadow-md shadow-cyan-500/20">
                  {step}
                </span>
                {idx < analysis.path.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Simple Explanation Narrative */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Plain Language Synthesis:
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {analysis.simple_explanation}
              </p>
            </div>

            {analysis.evidence && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <strong className="text-cyan-400 block mb-1">Supporting Context:</strong>
                {analysis.evidence}
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
