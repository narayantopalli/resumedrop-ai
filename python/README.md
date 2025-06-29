# Resume Vector Database Setup

This directory contains Python scripts for processing resume data and uploading it to a Supabase vector database.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the `python/` directory with the following variables:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Usage

1. First, generate chunks from your resume dataset:
```bash
python chunks.py
```

2. Then, upload chunks to the vector database:
```bash
python vector_db.py
```

## Scripts

### chunks.py
- Loads resume data from `dataset/resumes.csv`
- Splits resumes into chunks using LangChain's RecursiveCharacterTextSplitter
- Saves chunks to `chunks/chunks.pkl`

### vector_db.py
- Loads chunks from `chunks/chunks.pkl`
- Generates embeddings using OpenAI's text-embedding-3-small model
- Uploads chunks and embeddings to Supabase vector database
- Processes data in batches to avoid rate limits

## Database Schema

The script expects a `resume_embeddings` table in your Supabase database with the following schema:

```sql
CREATE TABLE resume_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536),  -- Adjust dimension based on your embedding model
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON resume_embeddings USING ivfflat (embedding vector_cosine_ops);
```

## Notes

- The script processes chunks in batches of 100 to avoid OpenAI rate limits
- It includes rate limiting (1 second delay between batches)
- Make sure you have sufficient OpenAI API credits for embedding generation
- The service role key is required for admin operations on Supabase 