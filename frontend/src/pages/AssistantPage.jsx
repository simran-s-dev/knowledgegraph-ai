import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/common/GlassCard';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  User,
  HelpCircle
} from 'lucide-react';
import { api } from '../api';

const suggestedPrompts = [
  "Explain the relationship between Model Evaluation and Software Testing.",
  "What is the mathematical role of Loss Function in Gradient Descent?",
  "Summarize all concepts extracted from Machine Learning Foundations.",
  "What are the main knowledge gaps in my graph right now?"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.getChatHistory().then(setMessages).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    // Optimistically add user message
    const tempUserMsg = { id: Date.now().toString(), sender: 'user', content: text };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          content: `⚠️ Error retrieving answer: ${err.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BotMessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Grounded AI Knowledge Assistant</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Answers strictly derived from your uploaded documents and verified graph concepts.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-panel rounded-3xl p-6 overflow-y-auto space-y-4 mb-4 flex flex-col border border-white/10 shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-tr-none shadow-lg'
                  : 'bg-[#0f172a]/90 border border-white/10 text-slate-100 rounded-tl-none shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Citations if available */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold text-slate-400">Sources:</span>
                  {msg.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-[10px] flex items-center gap-1"
                    >
                      <BookOpen className="w-2.5 h-2.5 text-cyan-400" />
                      {cite.document} ({cite.concept})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-md mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
            </div>
            <div className="p-3 rounded-2xl bg-[#0f172a] border border-white/10 text-xs text-slate-400">
              Retrieving grounded facts and reasoning...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-300 hover:text-cyan-400 shrink-0 transition-colors shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel p-2 rounded-2xl flex items-center gap-2 border border-white/10"
      >
        <input
          type="text"
          placeholder="Ask anything grounded in your documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 bg-transparent text-xs font-medium outline-none text-white placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl glow-gradient text-white shadow-lg disabled:opacity-50 transition-all hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
