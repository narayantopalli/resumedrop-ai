import pickle
import os
import numpy as np
from tqdm import tqdm
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
import time
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

# Configuration
CHUNKS_PATH = "chunks/chunks.pkl"
BATCH_SIZE = 1000  # Process chunks in batches to avoid rate limits
EMBEDDING_MODEL = "text-embedding-3-small"  # OpenAI embedding model

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

client = OpenAI(api_key=openai_api_key)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role key for admin operations

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required")

supabase: Client = create_client(supabase_url, supabase_key)

def load_chunks() -> List[str]:
    """Load chunks from pickle file"""
    print(f"Loading chunks from {CHUNKS_PATH}...")
    with open(CHUNKS_PATH, "rb") as f:
        chunks = pickle.load(f)
    print(f"Loaded {len(chunks)} chunks")
    return chunks

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Get embeddings for a list of texts using OpenAI"""
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts
        )
        return [embedding.embedding for embedding in response.data]
    except Exception as e:
        print(f"Error getting embeddings: {e}")
        raise

def upload_to_supabase(chunks: List[str], embeddings: List[List[float]]) -> None:
    """Upload chunks and embeddings to Supabase vector database"""
    print("Uploading to Supabase...")
    
    # Prepare data for insertion
    records = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        records.append({
            "content": chunk,
            "embedding": embedding,
        })
    
    # Insert in batches
    for i in tqdm(range(0, len(records), BATCH_SIZE), desc="Uploading batches"):
        batch = records[i:i + BATCH_SIZE]
        try:
            # Insert into excerpt_embeddings table
            result = supabase.table("excerpt_embeddings").insert(batch).execute()
            if hasattr(result, 'error') and result.error:
                print(f"Error inserting batch {i//BATCH_SIZE + 1}: {result.error}")
            else:
                print(f"Successfully inserted batch {i//BATCH_SIZE + 1}")
        except Exception as e:
            print(f"Error inserting batch {i//BATCH_SIZE + 1}: {e}")
        
        # Rate limiting
        time.sleep(0.1)

def main():
    """Main function to process chunks and upload to vector database"""
    print("Starting vector database upload process...")
    
    # Check if chunks file exists
    if not os.path.exists(CHUNKS_PATH):
        print(f"Chunks file not found at {CHUNKS_PATH}")
        print("Please run chunks.py first to generate the chunks file")
        return
    
    # Load chunks
    chunks = load_chunks()
    
    if not chunks:
        print("No chunks found in the pickle file")
        return
    
    # Process chunks in batches
    all_embeddings = []
    for i in tqdm(range(0, len(chunks), BATCH_SIZE), desc="Processing chunks"):
        batch_chunks = chunks[i:i + BATCH_SIZE]
        
        # Get embeddings for this batch
        try:
            batch_embeddings = get_embeddings(batch_chunks)
            all_embeddings.extend(batch_embeddings)
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"Error processing batch {i//BATCH_SIZE + 1}: {e}")
            continue
    
    print(f"Generated {len(all_embeddings)} embeddings")
    
    # Upload to Supabase
    if all_embeddings:
        upload_to_supabase(chunks, all_embeddings)
        print("Vector database upload completed successfully!")
    else:
        print("No embeddings generated. Upload skipped.")

if __name__ == "__main__":
    main()
