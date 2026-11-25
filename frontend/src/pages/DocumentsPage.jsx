import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  BookOpen,
  Network
} from 'lucide-react';
import { api } from '../api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [recentExtraction, setRecentExtraction] = useState(null);
  const [inspectDoc, setInspectDoc] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setRecentExtraction(null);
    setFeedback({ type: 'info', message: `Analyzing "${file.name}" with Gemini AI and generating ontological graph...` });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const result = await api.uploadDocument(formData);
      setFeedback({
        type: 'success',
        message: `Extracted ${result.extractedConcepts} concepts and ${result.extractedRelationships} relationships!`
      });
      setRecentExtraction(result);
      loadDocuments();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    setUploading(true);
    setRecentExtraction(null);
    setFeedback({ type: 'info', message: 'Extracting knowledge concepts and relationships with Gemini AI...' });

    try {
      const result = await api.uploadNote(noteTitle, noteContent);
      setFeedback({
        type: 'success',
        message: `Extracted ${result.extractedConcepts} concepts and ${result.extractedRelationships} relationships!`
      });
      setRecentExtraction(result);
      setShowNoteModal(false);
      setNoteTitle('');
      setNoteContent('');
      loadDocuments();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" and its associated concepts?`)) return;
    try {
      await api.deleteDocument(id);
      loadDocuments();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Document Library</h1>
          <p className="text-slate-400 text-sm">
            Upload PDFs, DOCX, TXT or paste text notes. AI extracts structured knowledge automatically.
          </p>
        </div>

        <button
          onClick={() => setShowNoteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 border border-white/20 hover:bg-white/20 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Add Text Note</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
              : feedback.type === 'error'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
              : 'bg-indigo-950/80 text-cyan-300 border border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          {feedback.type === 'success' && (
            <Link
              to="/app/graph"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <span>View in Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* RECENT EXTRACTION RESULTS CARD (Shows user immediate live result!) */}
      {recentExtraction && recentExtraction.concepts && recentExtraction.concepts.length > 0 && (
        <GlassCard className="border border-cyan-500/40 bg-gradient-to-br from-[#0c101b] via-indigo-950/40 to-[#070a12] p-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  Extraction Results: {recentExtraction.document?.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Gemini successfully extracted {recentExtraction.extractedConcepts} concepts and {recentExtraction.extractedRelationships} relationships.
                </p>
              </div>
            </div>

            <Link
              to="/app/graph"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white glow-gradient shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
            >
              <Network className="w-4 h-4" />
              <span>Explore These in Knowledge Graph</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Concepts Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentExtraction.concepts.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    {c.category}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs mb-1">{c.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Drag & Drop Upload Zone */}
      <GlassCard className="border-2 border-dashed border-cyan-500/40 bg-cyan-950/10 text-center p-8 hover:border-cyan-400 transition-colors">
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-cyan-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {uploading ? 'Processing & Extracting with AI...' : 'Click to Upload Document'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Supports PDF, DOCX (Word), or plain TXT files up to 25MB.
          </p>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white glow-gradient shadow-md shadow-indigo-500/30">
            Select File from Device
          </span>
        </label>
      </GlassCard>

      {/* Document List */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">Uploaded Documents ({documents.length})</h3>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading document repository...</p>
        ) : documents.length === 0 ? (
          <GlassCard className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-slate-300 text-sm">No documents found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Upload your first document above to kick off knowledge graph generation.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                    {doc.file_type || 'PDF'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                        <Sparkles className="w-3 h-3" /> {doc.concept_count || 4} concepts
                      </span>
                      <span>•</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/app/graph"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Graph</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c101b] rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/10 text-white">
            <h3 className="font-bold text-lg text-white mb-2">Create Direct Text Note</h3>
            <p className="text-xs text-slate-400 mb-4">
              Write or paste research notes, paper summaries, or syllabus requirements.
            </p>

            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Algorithms"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content / Notes</label>
                <textarea
                  rows={6}
                  placeholder="Paste paragraph or document text here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white glow-gradient shadow-md"
                >
                  {uploading ? 'Extracting with Gemini...' : 'Extract & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
