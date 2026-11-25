const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Health & Config
  getHealth: () => fetchJson('/health'),
  getConfig: () => fetchJson('/config'),
  updateConfig: (data) => fetchJson('/config', { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () => fetchJson('/stats'),

  // Documents
  getDocuments: () => fetchJson('/documents'),
  uploadDocument: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData, // multipart/form-data doesn't use Content-Type: application/json
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Upload failed');
    }
    return await res.json();
  },
  uploadNote: (title, textNote) => fetchJson('/documents/upload', {
    method: 'POST',
    body: JSON.stringify({ title, textNote })
  }),
  deleteDocument: (id) => fetchJson(`/documents/${id}`, { method: 'DELETE' }),

  // Knowledge Graph
  getGraph: () => fetchJson('/graph'),

  // Cross Document Discovery
  getCrossDocConnections: () => fetchJson('/discovery/cross-document'),
  explainConnection: (conceptA, conceptB) => fetchJson('/discovery/explain-connection', {
    method: 'POST',
    body: JSON.stringify({ conceptA, conceptB })
  }),

  // Knowledge Gap Insights
  getKnowledgeGaps: () => fetchJson('/insights/gaps'),

  // Grounded AI Chat Assistant
  getChatHistory: () => fetchJson('/chat'),
  sendMessage: (message) => fetchJson('/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  })
};
