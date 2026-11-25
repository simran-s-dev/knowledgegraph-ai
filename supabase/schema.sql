-- ==============================================================================
-- KnowledgeGraph AI - Database Schema (Supabase PostgreSQL)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT NOT NULL, -- 'pdf', 'docx', 'txt', 'note'
    file_size BIGINT DEFAULT 0,
    storage_path TEXT,
    raw_text TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    concept_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Document Chunks Table (for chunking and future semantic retrieval)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Extracted Concepts Table
CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General', -- 'Theory', 'Process', 'Algorithm', 'Tool', 'Entity', 'Metric'
    explanation TEXT NOT NULL,
    evidence TEXT,
    source_document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    source_document_title TEXT,
    importance_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, normalized_name)
);

-- 5. Relationships Table (Edges in the Knowledge Graph)
CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    target_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    source_concept_name TEXT NOT NULL,
    target_concept_name TEXT NOT NULL,
    relationship_type TEXT NOT NULL, -- 'depends_on', 'part_of', 'validates', 'relates_to', 'implements', 'improves'
    explanation TEXT NOT NULL,
    evidence TEXT,
    source_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    is_cross_document BOOLEAN DEFAULT FALSE,
    confidence FLOAT DEFAULT 0.9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Cross-Document Discovered Connections
CREATE TABLE IF NOT EXISTS public.cross_document_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_a_name TEXT NOT NULL,
    concept_b_name TEXT NOT NULL,
    doc_a_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    doc_b_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    doc_a_title TEXT NOT NULL,
    doc_b_title TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    explanation TEXT NOT NULL,
    evidence TEXT,
    is_inferred BOOLEAN DEFAULT TRUE,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Knowledge Gap Insights Table
CREATE TABLE IF NOT EXISTS public.knowledge_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    gap_type TEXT NOT NULL, -- 'isolated_concept', 'weak_explanation', 'missing_link', 'unexplored_topic'
    explanation TEXT NOT NULL,
    related_concept TEXT,
    suggested_action TEXT,
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. AI Chat Conversations & Messages
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_document_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Standard user isolation RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own document chunks" ON public.document_chunks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own concepts" ON public.concepts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own relationships" ON public.relationships FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cross-doc connections" ON public.cross_document_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own knowledge gaps" ON public.knowledge_gaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat conversations" ON public.chat_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_concepts_user_norm ON public.concepts(user_id, normalized_name);
CREATE INDEX IF NOT EXISTS idx_relationships_user ON public.relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_cross_doc_user ON public.cross_document_connections(user_id);
