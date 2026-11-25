import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GlassCard from '../components/common/GlassCard';
import {
  Search,
  Filter,
  Maximize2,
  RotateCcw,
  Sparkles,
  BookOpen,
  Info,
  X,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { api } from '../api';

const categoryColorMap = {
  Theory: {
    bg: 'bg-purple-950/90',
    border: 'border-purple-500/80',
    text: 'text-purple-200',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
    dot: 'bg-purple-400',
    edgeColor: '#a855f7'
  },
  Algorithm: {
    bg: 'bg-blue-950/90',
    border: 'border-blue-500/80',
    text: 'text-blue-200',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
    dot: 'bg-blue-400',
    edgeColor: '#38bdf8'
  },
  Process: {
    bg: 'bg-emerald-950/90',
    border: 'border-emerald-500/80',
    text: 'text-emerald-200',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
    dot: 'bg-emerald-400',
    edgeColor: '#10b981'
  },
  Tool: {
    bg: 'bg-amber-950/90',
    border: 'border-amber-500/80',
    text: 'text-amber-200',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    dot: 'bg-amber-400',
    edgeColor: '#f59e0b'
  },
  Metric: {
    bg: 'bg-pink-950/90',
    border: 'border-pink-500/80',
    text: 'text-pink-200',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-400/50',
    dot: 'bg-pink-400',
    edgeColor: '#ec4899'
  },
  Entity: {
    bg: 'bg-indigo-950/90',
    border: 'border-indigo-500/80',
    text: 'text-cyan-200',
    badge: 'bg-indigo-500/20 text-cyan-300 border-indigo-400/50',
    dot: 'bg-cyan-400',
    edgeColor: '#6366f1'
  }
};

// Custom Node Component
function CustomConceptNode({ data }) {
  const styling = categoryColorMap[data.category] || categoryColorMap.Entity;

  return (
    <div
      className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border ${styling.bg} ${styling.border} transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/40 cursor-pointer min-w-[170px] text-center relative`}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !w-2.5 !h-2.5 !border-2 !border-slate-900" />
      <Handle type="target" id="left" position={Position.Left} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-2 !border-slate-900" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-indigo-400 !w-2.5 !h-2.5 !border-2 !border-slate-900" />

      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${styling.dot} animate-pulse shadow-sm shadow-cyan-400/80`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styling.badge}`}>
          {data.category}
        </span>
      </div>
      <div className={`text-xs font-bold ${styling.text} truncate`}>{data.name}</div>
    </div>
  );
}

export default function KnowledgeGraphPage() {
  const [rawGraph, setRawGraph] = useState({ nodes: [], edges: [], categories: [] });
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({ conceptNode: CustomConceptNode }), []);

  const loadGraph = useCallback(async () => {
    try {
      const [graphData, docsData] = await Promise.all([
        api.getGraph(),
        api.getDocuments()
      ]);
      setRawGraph(graphData);
      setDocuments(docsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Compute filtered nodes & layout
  const { nodes, edges } = useMemo(() => {
    if (!rawGraph.nodes || rawGraph.nodes.length === 0) {
      return { nodes: [], edges: [] };
    }

    // 1. Filter nodes based on selected document, category, and search query
    const visibleNodesList = rawGraph.nodes.filter((node) => {
      const matchDoc = selectedDoc === 'All' || node.sourceDocument === selectedDoc;
      const matchCategory = selectedCategory === 'All' || node.category === selectedCategory;
      const matchSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDoc && matchCategory && matchSearch;
    });

    const visibleNodeIds = new Set(visibleNodesList.map((n) => n.id));

    // 2. Position visible nodes in a clean, spacious ring or grid
    const total = visibleNodesList.length;
    let radius = 220;
    if (total > 4) radius = 280;
    if (total > 8) radius = 350;
    if (total > 12) radius = 420;

    const centerX = 480;
    const centerY = 320;

    const flowNodes = visibleNodesList.map((node, index) => {
      // If 1-3 nodes, position horizontally or triangularly
      let x, y;
      if (total === 1) {
        x = centerX;
        y = centerY;
      } else if (total === 2) {
        x = centerX + (index === 0 ? -180 : 180);
        y = centerY;
      } else if (total === 3) {
        const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
        x = centerX + 200 * Math.cos(angles[index]);
        y = centerY + 180 * Math.sin(angles[index]);
      } else {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        x = centerX + radius * Math.cos(angle);
        y = centerY + (radius * 0.8) * Math.sin(angle);
      }

      return {
        id: node.id,
        type: 'conceptNode',
        position: { x, y },
        data: {
          ...node,
          name: node.name,
          category: node.category,
          sourceDocument: node.sourceDocument
        }
      };
    });

    // 3. Filter edges: ONLY show edges where BOTH source and target are currently visible!
    const flowEdges = rawGraph.edges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .map((edge, i) => {
        const isCross = edge.is_cross_document;
        const strokeColor = isCross ? '#10b981' : '#38bdf8';

        return {
          id: edge.id || `edge-${i}`,
          source: edge.source,
          target: edge.target,
          label: edge.relationship_type ? edge.relationship_type.replace(/_/g, ' ') : 'relates to',
          animated: isCross,
          type: 'default', // smooth bezier curve instead of stepped lines!
          style: {
            stroke: strokeColor,
            strokeWidth: 2.5,
            strokeDasharray: isCross ? '5,5' : 'none'
          },
          labelStyle: { fill: '#e2e8f0', fontSize: 10, fontWeight: 700 },
          labelBgStyle: { fill: '#0c101b', rx: 6, ry: 6, fillOpacity: 0.95 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
            width: 14,
            height: 14
          },
          data: edge
        };
      });

    return { nodes: flowNodes, edges: flowEdges };
  }, [rawGraph, selectedDoc, selectedCategory, searchQuery]);

  const [currentNodes, setNodes, onNodesChange] = useNodesState([]);
  const [currentEdges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data);
    setSelectedEdge(null);
  };

  const onEdgeClick = (_, edge) => {
    setSelectedEdge(edge.data);
    setSelectedNode(null);
  };

  return (
    <div className="relative h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Top Filter and Controls Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 glass-panel p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filter by Document Dropdown */}
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedDoc}
            onChange={(e) => {
              setSelectedDoc(e.target.value);
              setSelectedNode(null);
              setSelectedEdge(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#0c101b] border border-cyan-500/40 text-xs text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
          >
            <option value="All">All Documents ({documents.length})</option>
            {documents.map((d) => (
              <option key={d.id} value={d.title}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['All', 'Theory', 'Algorithm', 'Process', 'Tool', 'Metric'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedNode(null);
                setSelectedEdge(null);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={loadGraph}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors"
          title="Reset Graph Layout"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#070a12]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
            Synthesizing Knowledge Topology...
          </div>
        ) : currentNodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm">
            <Layers className="w-10 h-10 text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">No concepts match the selected filter</p>
            <p className="text-xs text-slate-500 mt-1">Try switching the Document dropdown to "All Documents".</p>
          </div>
        ) : (
          <ReactFlow
            nodes={currentNodes}
            edges={currentEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="bg-[#0c101b] text-white border border-white/10 rounded-xl overflow-hidden" />
          </ReactFlow>
        )}

        {/* Slide-out Node Inspector Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-96 max-w-full glass-panel-dark text-white rounded-3xl p-6 shadow-2xl z-50 border border-white/15 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                {selectedNode.category}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-black text-white mb-2">{selectedNode.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {selectedNode.explanation}
            </p>

            {/* Evidence Quote */}
            {selectedNode.evidence && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Grounding Evidence</span>
                </div>
                <p className="text-slate-300 text-[11px] italic leading-relaxed">
                  "{selectedNode.evidence}"
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Source Document:</span>
              <span className="font-bold text-cyan-300 truncate max-w-[160px]">
                {selectedNode.sourceDocument || 'Primary Corpus'}
              </span>
            </div>
          </div>
        )}

        {/* Selected Edge Inspector Banner */}
        {selectedEdge && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-lg w-full px-4 z-50">
            <div className="glass-panel-dark text-white rounded-2xl p-4 shadow-2xl border border-cyan-500/40 flex items-center justify-between gap-4">
              <div className="text-xs">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-0.5">
                  <span>{selectedEdge.source}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span>{selectedEdge.target}</span>
                  <span className="ml-2 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                    {selectedEdge.relationship_type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{selectedEdge.explanation}</p>
              </div>
              <button
                onClick={() => setSelectedEdge(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
