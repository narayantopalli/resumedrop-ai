// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2.46.1";

const MAX_CONCURRENT_OPENAI_REQUESTS = 3; // Limit concurrent OpenAI requests
const OPENAI_REQUEST_DELAY = 1000; // 1 second delay between OpenAI requests

// Simple semaphore implementation for rate limiting
class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  release(): void {
    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift()!;
      resolve();
    } else {
      this.permits++;
    }
  }
}

// Create a semaphore for OpenAI requests
const openaiSemaphore = new Semaphore(MAX_CONCURRENT_OPENAI_REQUESTS);

const getSummary = async (text: string) => {
    // Acquire semaphore before making OpenAI request
    await openaiSemaphore.acquire();
    
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
              You are a helpful assistant that converts a resume into a few sentences summary.
              Use specific keywords and phrases that are relevant to the resume and capture the following:
                - Candidate's skill level
                - Candidate's experience
                - Candidate's projects
                - Candidate's achievements
                - Candidate's interests
              Be specific and concise with sentences and don't include personally identifiable information.
              Return as a comma separated list of sentences.
              `
            },
            {
              role: "user",
              content: `Resume: ${text}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });

      if (!openaiRes.ok) {
        const err = await openaiRes.text();
        throw new Error(`OpenAI error: ${err}`);
      }

      const { choices } = await openaiRes.json();
      const summary = choices[0].message.content;
      return summary;
    } finally {
      // Always release the semaphore, even if there's an error
      openaiSemaphore.release();
      // Add delay after each OpenAI request
      await new Promise(resolve => setTimeout(resolve, OPENAI_REQUEST_DELAY));
    }
}

const getEmbedding = async (text: string) => {
    // Acquire semaphore before making OpenAI request
    await openaiSemaphore.acquire();
    
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text
        })
      });
    
      if (!openaiRes.ok) {
        const err = await openaiRes.text();
        throw new Error(`OpenAI error: ${err}`);
      }
    
      const { data } = await openaiRes.json();
      const embedding = data[0].embedding;
      return embedding;
    } finally {
      // Always release the semaphore, even if there's an error
      openaiSemaphore.release();
      // Add delay after each OpenAI request
      await new Promise(resolve => setTimeout(resolve, OPENAI_REQUEST_DELAY));
    }
}

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token      = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return new Response('Missing bearer token', { status: 401 });
    }

    const supabaseClient = createClient(
      Deno.env.get('_SUPABASE_URL') ?? '', 
      token ?? ''
    );

    const { data: resumesToUpdate, error: resumesToUpdateError } = await supabaseClient
      .from('resume_embeddings')
      .select('id, isUpdated, profile:profiles!resume-embeddings_id_fkey(id)')
      .eq('isUpdated', false)
      .eq('profile.isPublic', true);

    if (resumesToUpdateError) {
      return new Response(JSON.stringify({ error: 'Failed to get resumes to update' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (resumesToUpdate.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No resumes to update' }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: resumes, error: resumesError } = await supabaseClient
      .from('resume_text')
      .select('id, public_extraction')
      .in('id', resumesToUpdate.map((resume: { id: string }) => resume.id));

    if (resumesError) {
      return new Response(JSON.stringify({ error: 'Failed to get resumes' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter out resumes with empty or invalid public_extraction text
    const validResumes = resumes.filter((resume: { id: string; public_extraction: string }) => 
      resume.public_extraction && 
      resume.public_extraction.trim() !== '' &&
      resume.public_extraction.length > 10 // Minimum reasonable length
    );

    if (validResumes.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No resumes with valid text to process' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const embeddings: any[] = [];
    const errors: any[] = [];
    
    // Process resumes in parallel with semaphore-based rate limiting
    const processingPromises = validResumes.map(async (resume: { id: string; public_extraction: string }) => {
      try {
        const summary = await getSummary(resume.public_extraction);
        const embedding = await getEmbedding(summary);
        return {
          id: resume.id,
          summary: summary,
          embedding: embedding,
          isUpdated: true
        };
      } catch (error) {
        console.error(`Error processing resume ${resume.id}:`, error);
        return { id: resume.id, error: (error as Error).message };
      }
    });
    
    const results = await Promise.all(processingPromises);
    
    // Separate successful embeddings from errors
    for (const result of results) {
      if ('error' in result) {
        errors.push(result);
      } else {
        embeddings.push(result);
      }
    }

    if (embeddings.length === 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to process any resumes',
        errors: errors 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error: embeddingsError } = await supabaseClient.from('resume_embeddings').upsert(embeddings);

    if (embeddingsError) {
      return new Response(JSON.stringify({ error: 'Failed to upsert embeddings' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return success even if some resumes failed, as long as at least one succeeded
    return new Response(JSON.stringify({
      success: true,
      processed: embeddings.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    return new Response(JSON.stringify({ error: 'Failed to process resume' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-embedded-resumes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
