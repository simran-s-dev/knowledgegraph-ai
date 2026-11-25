import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import apiRoutes from './routes/api.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev / flexible deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'KnowledgeGraph AI Backend API',
    status: 'running',
    docs: '/api/health',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`
==================================================
  KnowledgeGraph AI Backend Service
  Status: Online & Ready
  Port: ${PORT}
  Gemini Configured: ${config.isGeminiConfigured ? 'YES (' + config.geminiModel + ')' : 'NO (Hybrid Fallback Active)'}
  Supabase Configured: ${config.isSupabaseConfigured ? 'YES' : 'NO (Local Store Active)'}
==================================================
  `);
});
