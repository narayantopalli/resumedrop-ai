// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2.46.1";

const NUM_MATCHES = 3;
const MAX_CONCURRENT_OPENAI_REQUESTS = 30; // Limit concurrent OpenAI requests
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

const getNote = async (userProfile: string, name1: string, profile1: string, name2: string, profile2: string, name3: string, profile3: string) => {
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
          model: "gpt-4.1",
          messages: [
            {
              role: "system",
              content: `
              You are a professional networking assistant.
              You are given a user's profile and a list of other profiles.
              You are to write a brief, professional note about potential connections between the user and each other person.
              Each note should be no more than 100 words and written in a natural, conversational tone.
              
              Guidelines:
              - Focus on 1-2 specific professional or academic interests they share
              - Mention concrete reasons for the connection (same field, similar projects, etc.) BE SPECIFIC!
              - Suggest 1-2 casual specific activities they might enjoy together (coffee, lunch, campus events, etc.)
              - Keep the tone professional but friendly - avoid overly enthusiastic language
              - Use the person's name naturally
              - Write in second person
              - If a person is null, return null for that note
              
              Avoid phrases like "spark exciting conversations", "geek out", "tinkering and building", or overly casual language.
              `
            },
            {
              role: "user",
              content: `
              User's profile: ${userProfile}
              `
            },
            {
              role: "user",
              content: `
              Person 1 (name: ${name1}): ${profile1}
              Person 2 (name: ${name2}): ${profile2}
              Person 3 (name: ${name3}): ${profile3}
              `
            }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_match_notes",
                description: "Create personalized notes for potential matches",
                parameters: {
                  type: "object",
                  properties: {
                    note1: {
                      type: "string",
                      description: "Note about why the user should connect with person 1"
                    },
                    note2: {
                      type: "string",
                      description: "Note about why the user should connect with person 2"
                    },
                    note3: {
                      type: "string",
                      description: "Note about why the user should connect with person 3"
                    }
                  },
                  required: ["note1", "note2", "note3"]
                }
              }
            }
          ],
          tool_choice: {
            type: "function",
            function: {
              name: "create_match_notes"
            }
          },
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!openaiRes.ok) {
        const err = await openaiRes.text();
        throw new Error(`OpenAI error: ${err}`);
      }

      const { choices } = await openaiRes.json();
      const toolCall = choices[0].message.tool_calls?.[0];
      
      if (toolCall && toolCall.function.name === "create_match_notes") {
        return JSON.parse(toolCall.function.arguments);
      } else {
        throw new Error("Expected tool call response from OpenAI");
      }
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

    const { data: allPublicResumes, error: allPublicResumesError }
     = await supabaseClient.from('resume_embeddings')
    .select('id, embedding, summary, profile:profiles!resume_embeddings_id_fkey(id, college)')
    .eq('profile.isPublic', true)
    .not('profile.college', 'is', null)
    .not('profile.college', 'eq', '')
    .eq('isMatched', false);

    if (allPublicResumesError) {
      return new Response(JSON.stringify({ error: 'Failed to get resumes' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!allPublicResumes || allPublicResumes.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        processed: 0,
        message: 'No resumes to process'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mark resumes as matched to avoid conflicts
    await supabaseClient
      .from('resume_embeddings')
      .update({ isMatched: true })
      .in('id', allPublicResumes.map((resume: any) => resume.id));

    const orderedRandomSample = (array: any[], num: number) => {
      const randomSample = array.sort(() => Math.random() - 0.5).slice(0, num);
      return randomSample.sort((a: any, b: any) => a.similarity - b.similarity);
    }

    const processedMatches: any[] = [];
    const errors: any[] = [];

    // Process each resume to find matches
    for (const resume of allPublicResumes) {
      try {
        const { data, error } = await supabaseClient.rpc("similar_profiles", {
          query_embedding: resume.embedding,
          user_id: resume.profile.id,
          search_college: resume.profile.college,
          neighbors: 50
        });

        if (error) {
          console.error(`Error getting similar profiles for resume ${resume.id}:`, error);
          errors.push({ resumeId: resume.id, error: error.message });
          continue;
        }

        if (!data || data.length === 0) {
          continue;
        }

        // Get top matches
        const topMatches = data.length > NUM_MATCHES 
          ? orderedRandomSample(data, NUM_MATCHES)
          : data;

        // Don't process resumes with a summary less than 25 characters
        if (resume.summary.length < 25) {
          throw new Error('Resume summary is too short');
        }

        // Generate notes for the matches
        const note = await getNote(resume.summary, topMatches[0]?.profile.name || '', topMatches[0]?.summary || '', topMatches[1]?.profile.name || '', topMatches[1]?.summary || '', topMatches[2]?.profile.name || '', topMatches[2]?.summary || '');

        // Create match records
        let i = 0;
        for (const match of topMatches) {
          processedMatches.push({
            user_id: resume.profile.id,
            match: {
              id: match.profile.id,
              reason: note[`note${i + 1}`],
              similarity: match.similarity,
            },
          });
          i++;
        }
      } catch (error) {
        // Mark this resume as not matched
        await supabaseClient
          .from('resume_embeddings')
          .update({ isMatched: false })
          .eq('id', resume.id);

        console.error(`Error processing resume ${resume.id}:`, error);
        errors.push({ resumeId: resume.id, error: (error as Error).message });
      }
    }

    // Insert all matches into the database
    if (processedMatches.length > 0) {
      const { error: matchesError } = await supabaseClient
        .from('suggested_matches')
        .insert(processedMatches);

      if (matchesError) {
        // Mark all resumes as not matched
        await supabaseClient
          .from('resume_embeddings')
          .update({ isMatched: false })
          .in('id', allPublicResumes.map((resume: any) => resume.id));

        return new Response(JSON.stringify({ 
          error: 'Failed to insert matches',
          details: matchesError 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: processedMatches.length,
      errors: errors.length > 0 ? errors : undefined
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing resumes:', error);
    return new Response(JSON.stringify({ error: 'Failed to process resumes' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-matches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{}'

*/
