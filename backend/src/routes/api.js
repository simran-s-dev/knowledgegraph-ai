import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { extractTextFromFile } from '../services/documentExtractor.js';
import { 
  extractConceptsAndRelationships, 
  discoverCrossDocumentConnections, 
  explainConnectionPath, 
  answerAssistantQuery 
} from '../services/geminiService.js';
import { store } from '../services/store.js';

const router = express.Router();
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// 1. Health & Config
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KnowledgeGraph AI Backend (Node.js/Express)',
    geminiConfigured: config.isGeminiConfigured,
    supabaseConfigured: config.isSupabaseConfigured
  });
});

router.get('/config', (req, res) => {
  res.json({
    geminiConfigured: config.isGeminiConfigured,
    geminiModel: config.geminiModel,
    supabaseConfigured: config.isSupabaseConfigured,
    mode: config.isGeminiConfigured && config.isSupabaseConfigured ? 'production' : 'demo-hybrid'
  });
});

// Update Keys from UI Settings
router.post('/config', (req, res) => {
  const { geminiApiKey, geminiModel, supabaseUrl, supabaseAnonKey } = req.body;
  if (geminiApiKey) {
    config.geminiApiKey = geminiApiKey.trim();
    config.isGeminiConfigured = true;
  }
  if (geminiModel) config.geminiModel = geminiModel.trim();
  if (supabaseUrl) config.supabaseUrl = supabaseUrl.trim();
  if (supabaseAnonKey) {
    config.supabaseAnonKey = supabaseAnonKey.trim();
    config.isSupabaseConfigured = true;
  }
  res.json({ success: true, message: 'Configuration updated successfully.' });
});

// 2. Stats Overview
router.get('/stats', async (req, res) => {
  try {
    const docs = await store.getDocuments();
    const graph = await store.getGraph();
    const cross = await store.getCrossDocConnections();
    const gaps = await store.getKnowledgeGaps();

    res.json({
      totalDocuments: docs.length,
      totalConcepts: graph.nodes.length,
      totalRelationships: graph.edges.length,
      crossDocConnections: cross.length,
      knowledgeGaps: gaps.length,
      recentDocuments: docs.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Document Management
router.get('/documents', async (req, res) => {
  try {
    const docs = await store.getDocuments();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload document (PDF, DOCX, TXT or Note)
router.post('/documents/upload', upload.single('file'), async (req, res) => {
  try {
    let title = req.body.title || 'Untitled Document';
    let fileType = 'note';
    let extractedText = '';
    let fileSize = 0;
    let fileName = title;

    if (req.file) {
      fileSize = req.file.size;
      fileName = req.file.originalname;
      title = req.body.title || fileName.replace(/\.[^/.]+$/, "");
      fileType = fileName.split('.').pop().toLowerCase();
      
      // Extract text using PDF/Docx parser
      extractedText = await extractTextFromFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    } else if (req.body.textNote) {
      extractedText = req.body.textNote.trim();
      fileSize = Buffer.byteLength(extractedText, 'utf8');
      fileType = 'note';
    } else {
      return res.status(400).json({ error: 'Please provide either a file upload or a text note.' });
    }

    if (!extractedText || extractedText.length < 10) {
      return res.status(400).json({ error: 'Document appears empty or contains unreadable text.' });
    }

    // 1. Save document with pending status
    const docRecord = await store.addDocument({
      title,
      fileName,
      fileType,
      fileSize,
      status: 'processing',
      rawText: extractedText
    });

    // 2. Perform AI Concept & Relationship Extraction
    const extractionResult = await extractConceptsAndRelationships(extractedText, title);

    // 3. Update Graph with Extracted Concepts & Relationships
    await store.addExtractedGraph(docRecord.id, title, extractionResult);

    // 4. Mark status completed
    docRecord.status = 'completed';
    docRecord.concept_count = (extractionResult.concepts || []).length;

    res.status(201).json({
      message: 'Document uploaded and analyzed successfully.',
      document: docRecord,
      extractedConcepts: extractionResult.concepts.length,
      extractedRelationships: extractionResult.relationships.length,
      concepts: extractionResult.concepts,
      relationships: extractionResult.relationships
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: `Processing error: ${err.message}` });
  }
});

router.delete('/documents/:id', async (req, res) => {
  try {
    await store.deleteDocument(req.params.id);
    res.json({ success: true, message: 'Document deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Interactive Knowledge Graph
router.get('/graph', async (req, res) => {
  try {
    const graph = await store.getGraph();
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Cross-Document Connection Discovery
router.get('/discovery/cross-document', async (req, res) => {
  try {
    const connections = await store.getCrossDocConnections();
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Explain Connection
router.post('/discovery/explain-connection', async (req, res) => {
  try {
    const { conceptA, conceptB } = req.body;
    if (!conceptA || !conceptB) {
      return res.status(400).json({ error: 'Both conceptA and conceptB are required.' });
    }

    const graph = await store.getGraph();
    const result = await explainConnectionPath(conceptA, conceptB, graph.nodes, graph.edges);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Knowledge Gap Insights
router.get('/insights/gaps', async (req, res) => {
  try {
    const gaps = await store.getKnowledgeGaps();
    res.json(gaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Grounded AI Knowledge Assistant Chat
router.get('/chat', async (req, res) => {
  try {
    const messages = await store.getChatMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Save user message
    await store.addChatMessage('user', message);

    // Retrieve graph context
    const graph = await store.getGraph();
    const history = await store.getChatMessages();

    // Call grounded AI Assistant
    const aiResponse = await answerAssistantQuery(
      message,
      { concepts: graph.nodes, relationships: graph.edges },
      history.slice(-6)
    );

    // Save assistant reply
    const savedReply = await store.addChatMessage('assistant', aiResponse.answer, aiResponse.citations);

    res.json(savedReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
