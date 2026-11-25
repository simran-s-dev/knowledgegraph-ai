import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';

// Initialize Supabase if credentials are provided
let supabase = null;
if (config.isSupabaseConfigured) {
  try {
    const key = config.supabaseServiceKey || config.supabaseAnonKey;
    supabase = createClient(config.supabaseUrl, key);
    console.log('✓ Connected to Supabase PostgreSQL at:', config.supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed, falling back to local store:', err.message);
  }
}

// ---------------- In-Memory Fallback Seed Data ---------------- //
const localState = {
  documents: [
    {
      id: 'doc-1',
      title: 'Machine Learning Foundations',
      file_name: 'ML_Foundations.pdf',
      file_type: 'pdf',
      file_size: 142800,
      status: 'completed',
      concept_count: 5,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'doc-2',
      title: 'Software Quality & Testing',
      file_name: 'QA_Frameworks.docx',
      file_type: 'docx',
      file_size: 98400,
      status: 'completed',
      concept_count: 4,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],
  concepts: [
    {
      id: 'c-1',
      name: 'Supervised Learning',
      normalized_name: 'supervised learning',
      category: 'Theory',
      explanation: 'Machine learning paradigm where models train on labeled input-output pairs.',
      evidence: 'Supervised learning constructs mapping functions from labeled datasets.',
      source_document_id: 'doc-1',
      source_document_title: 'Machine Learning Foundations'
    },
    {
      id: 'c-2',
      name: 'Loss Function',
      normalized_name: 'loss function',
      category: 'Algorithm',
      explanation: 'Mathematical formulation measuring discrepancy between predictions and ground truth.',
      evidence: 'The loss function quantifies empirical error during optimization epochs.',
      source_document_id: 'doc-1',
      source_document_title: 'Machine Learning Foundations'
    },
    {
      id: 'c-3',
      name: 'Gradient Descent',
      normalized_name: 'gradient descent',
      category: 'Algorithm',
      explanation: 'First-order iterative optimization algorithm for finding a local minimum of a differentiable function.',
      evidence: 'Gradient descent computes parameter updates iteratively across parameter space.',
      source_document_id: 'doc-1',
      source_document_title: 'Machine Learning Foundations'
    },
    {
      id: 'c-4',
      name: 'Model Evaluation',
      normalized_name: 'model evaluation',
      category: 'Process',
      explanation: 'Assessing generalization capability using hold-out validation and test distributions.',
      evidence: 'Rigorous model evaluation prevents overfitting and data leakage.',
      source_document_id: 'doc-1',
      source_document_title: 'Machine Learning Foundations'
    },
    {
      id: 'c-5',
      name: 'Cross-Validation',
      normalized_name: 'cross-validation',
      category: 'Metric',
      explanation: 'Resampling procedure used to evaluate machine learning models on a limited data sample.',
      evidence: 'K-fold cross-validation estimates out-of-sample performance variance.',
      source_document_id: 'doc-1',
      source_document_title: 'Machine Learning Foundations'
    },
    {
      id: 'c-6',
      name: 'Software Testing',
      normalized_name: 'software testing',
      category: 'Process',
      explanation: 'Systematic examination of software artifacts to ensure functional correctness and reliability.',
      evidence: 'Software testing validates functional requirements against test oracles.',
      source_document_id: 'doc-2',
      source_document_title: 'Software Quality & Testing'
    },
    {
      id: 'c-7',
      name: 'Automated Test Suite',
      normalized_name: 'automated test suite',
      category: 'Tool',
      explanation: 'Continuous integration regression suites that verify code integrity automatically.',
      evidence: 'Automated test suites catch breaking changes in staging builds.',
      source_document_id: 'doc-2',
      source_document_title: 'Software Quality & Testing'
    },
    {
      id: 'c-8',
      name: 'Regression Testing',
      normalized_name: 'regression testing',
      category: 'Process',
      explanation: 'Re-running functional and non-functional tests to ensure previously developed software still performs.',
      evidence: 'Regression tests preserve backward compatibility across releases.',
      source_document_id: 'doc-2',
      source_document_title: 'Software Quality & Testing'
    },
    {
      id: 'c-9',
      name: 'Code Coverage',
      normalized_name: 'code coverage',
      category: 'Metric',
      explanation: 'Quantitative measure describing the degree to which source code is executed when a test runs.',
      evidence: 'Targeting over 85% branch coverage maintains high release confidence.',
      source_document_id: 'doc-2',
      source_document_title: 'Software Quality & Testing'
    }
  ],
  relationships: [
    {
      id: 'r-1',
      source: 'Supervised Learning',
      target: 'Loss Function',
      relationship_type: 'depends_on',
      explanation: 'Supervised training algorithms require a differentiable loss objective to measure error.',
      evidence: 'Defined in ML Foundations Section 2.',
      source_document_id: 'doc-1'
    },
    {
      id: 'r-2',
      source: 'Loss Function',
      target: 'Gradient Descent',
      relationship_type: 'optimizes',
      explanation: 'Gradient descent minimizes the objective loss value across weight updates.',
      evidence: 'Optimization formulation chapter.',
      source_document_id: 'doc-1'
    },
    {
      id: 'r-3',
      source: 'Gradient Descent',
      target: 'Model Evaluation',
      relationship_type: 'part_of',
      explanation: 'Trained model weights undergo empirical evaluation on unseen test datasets.',
      evidence: 'Validation protocol section.',
      source_document_id: 'doc-1'
    },
    {
      id: 'r-4',
      source: 'Model Evaluation',
      target: 'Cross-Validation',
      relationship_type: 'validates',
      explanation: 'Cross-validation provides statistical confidence bounds for model evaluation metrics.',
      evidence: 'Evaluation benchmarks in Section 4.',
      source_document_id: 'doc-1'
    },
    {
      id: 'r-5',
      source: 'Software Testing',
      target: 'Automated Test Suite',
      relationship_type: 'implements',
      explanation: 'Modern testing practices implement automated test runners in CI/CD pipelines.',
      evidence: 'QA Architecture Guide.',
      source_document_id: 'doc-2'
    },
    {
      id: 'r-6',
      source: 'Automated Test Suite',
      target: 'Regression Testing',
      relationship_type: 'enables',
      explanation: 'Automated test runners execute fast regression verification on pull requests.',
      evidence: 'Continuous Quality Protocols.',
      source_document_id: 'doc-2'
    },
    {
      id: 'r-7',
      source: 'Regression Testing',
      target: 'Code Coverage',
      relationship_type: 'improves',
      explanation: 'Expanding regression scenarios directly increases test branch code coverage.',
      evidence: 'Test metrics chapter.',
      source_document_id: 'doc-2'
    },
    // Cross document relationship
    {
      id: 'r-cross-1',
      source: 'Model Evaluation',
      target: 'Software Testing',
      relationship_type: 'relates_to',
      explanation: 'Cross-document bridge: Model evaluation in ML serves as the probabilistic equivalent of software testing in traditional engineering.',
      evidence: 'Interdisciplinary synthesis between statistical validation and functional test harnesses.',
      is_cross_document: true
    }
  ],
  crossDocConnections: [
    {
      id: 'cross-1',
      conceptA: 'Model Evaluation',
      conceptB: 'Software Testing',
      docA: 'Machine Learning Foundations',
      docB: 'Software Quality & Testing',
      relationship_type: 'validates',
      explanation: 'Model Evaluation in AI acts as the non-deterministic counterpart to deterministic Software Testing in traditional software pipelines.',
      evidence: 'Both methodologies safeguard system quality and detect regression before deployment.',
      is_inferred: true
    },
    {
      id: 'cross-2',
      conceptA: 'Cross-Validation',
      conceptB: 'Code Coverage',
      docA: 'Machine Learning Foundations',
      docB: 'Software Quality & Testing',
      relationship_type: 'relates_to',
      explanation: 'Both metrics serve as empirical rigor indicators: Cross-Validation quantifies generalizability, while Code Coverage measures verification completeness.',
      evidence: 'Comparative metric analysis across ML & Software Engineering.',
      is_inferred: true
    }
  ],
  knowledgeGaps: [
    {
      id: 'gap-1',
      title: 'Isolated Hyperparameter Tuning',
      gap_type: 'isolated_concept',
      explanation: 'Model optimization algorithms are defined, but hyperparameter search (e.g. Bayesian, Grid) lacks explicit documentation.',
      related_concept: 'Gradient Descent',
      suggested_action: 'Upload a document covering Hyperparameter Optimization or AutoML architectures.',
      severity: 'medium'
    },
    {
      id: 'gap-2',
      title: 'Missing Production Monitoring Bridge',
      gap_type: 'missing_link',
      explanation: 'Software testing has automated suites, but Model Monitoring / Drift Detection in production is missing.',
      related_concept: 'Model Evaluation',
      suggested_action: 'Add reference material on MLOps and continuous data drift monitoring.',
      severity: 'high'
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      sender: 'assistant',
      content: 'Hello! I am your **KnowledgeGraph AI Assistant**. I can answer questions grounded directly in your uploaded documents and explain relationships across your graph network. How can I help you today?',
      citations: []
    }
  ]
};

// ---------------- Database Store Methods ---------------- //

export const store = {
  // Documents
  async getDocuments(userId = 'default') {
    if (supabase) {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localState.documents;
  },

  async addDocument(doc) {
    const documentRecord = {
      id: doc.id || uuidv4(),
      title: doc.title,
      file_name: doc.fileName || doc.title,
      file_type: doc.fileType || 'txt',
      file_size: doc.fileSize || 0,
      status: doc.status || 'completed',
      raw_text: doc.rawText || '',
      concept_count: doc.conceptCount || 0,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('documents').insert(documentRecord).select().single();
      if (!error && data) return data;
    }

    localState.documents.unshift(documentRecord);
    return documentRecord;
  },

  async deleteDocument(id) {
    if (supabase) {
      await supabase.from('documents').delete().eq('id', id);
    }
    localState.documents = localState.documents.filter(d => d.id !== id);
    localState.concepts = localState.concepts.filter(c => c.source_document_id !== id);
    localState.relationships = localState.relationships.filter(r => r.source_document_id !== id);
    return true;
  },

  // Concepts & Graph
  async getGraph() {
    return {
      nodes: localState.concepts.map(c => ({
        id: c.name,
        name: c.name,
        category: c.category,
        explanation: c.explanation,
        evidence: c.evidence,
        sourceDocument: c.source_document_title
      })),
      edges: localState.relationships.map(r => ({
        id: r.id || `${r.source}-${r.target}`,
        source: r.source,
        target: r.target,
        relationship_type: r.relationship_type,
        explanation: r.explanation,
        evidence: r.evidence,
        is_cross_document: Boolean(r.is_cross_document)
      })),
      categories: ['Theory', 'Process', 'Algorithm', 'Tool', 'Entity', 'Metric'],
      stats: {
        totalDocuments: localState.documents.length,
        totalConcepts: localState.concepts.length,
        totalRelationships: localState.relationships.length,
        crossConnections: localState.crossDocConnections.length
      }
    };
  },

  async addExtractedGraph(documentId, documentTitle, extractionResult) {
    const newConcepts = (extractionResult.concepts || []).map(c => ({
      id: uuidv4(),
      name: c.name,
      normalized_name: c.name.toLowerCase().trim(),
      category: c.category || 'General',
      explanation: c.explanation || '',
      evidence: c.evidence || '',
      source_document_id: documentId,
      source_document_title: documentTitle
    }));

    const newRelationships = (extractionResult.relationships || []).map(r => ({
      id: uuidv4(),
      source: r.source,
      target: r.target,
      relationship_type: r.relationship_type || 'relates_to',
      explanation: r.explanation || '',
      evidence: r.evidence || '',
      source_document_id: documentId
    }));

    // Deduplicate and append
    for (const concept of newConcepts) {
      const existing = localState.concepts.find(c => c.normalized_name === concept.normalized_name);
      if (!existing) {
        localState.concepts.push(concept);
      }
    }

    for (const rel of newRelationships) {
      localState.relationships.push(rel);
    }

    // Update document concept count
    const targetDoc = localState.documents.find(d => d.id === documentId);
    if (targetDoc) {
      targetDoc.concept_count = newConcepts.length;
    }

    return { concepts: newConcepts, relationships: newRelationships };
  },

  // Cross Document Connections
  async getCrossDocConnections() {
    return localState.crossDocConnections;
  },

  async addCrossDocConnection(conn) {
    const newConn = {
      id: uuidv4(),
      ...conn,
      created_at: new Date().toISOString()
    };
    localState.crossDocConnections.unshift(newConn);
    return newConn;
  },

  // Knowledge Gaps
  async getKnowledgeGaps() {
    return localState.knowledgeGaps;
  },

  // Chat
  async getChatMessages() {
    return localState.chatMessages;
  },

  async addChatMessage(sender, content, citations = []) {
    const msg = {
      id: uuidv4(),
      sender,
      content,
      citations,
      created_at: new Date().toISOString()
    };
    localState.chatMessages.push(msg);
    return msg;
  }
};
