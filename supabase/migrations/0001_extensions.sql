-- NeuralForge Layer 0: Required PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";   -- title trigram dedup (L2 dedup stage)
create extension if not exists "vector";    -- pgvector: embeddings + ANN search (L3 dedup + semantic search)
