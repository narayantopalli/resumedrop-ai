// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2.46.1";

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

    const { data: allLeads, error: allLeadsError }
     = await supabaseClient.from('leads')
    .select('id, embedding, selectiveness, profile:profiles!leads_user_id_fkey(id, college)')
    .not('embedding', 'is', null)

    if (allLeadsError) {
      return new Response(JSON.stringify({ error: 'Failed to get leads ' + allLeadsError.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!allLeads || allLeads.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        processed: 0,
        message: 'No leads to process'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const leadsToUsers: any[] = [];
    const errors: any[] = [];

    // Process each lead to find matches
    for (const lead of allLeads) {
      try {
        const { data: num_profiles_data, error: num_profiles_error } = await supabaseClient.from('profiles').select('id').eq('college', lead.profile.college);
        if (num_profiles_error) {
          console.error('Error getting number of profiles:', num_profiles_error);
          continue;
        }
        // calculate number of neighbors to show the lead to
        const num_profiles = num_profiles_data.length;
        const neighbors = Math.ceil(num_profiles * (101 - lead.selectiveness) / 101);
        
        // get profiles that are relevant to the lead
        const { data, error } = await supabaseClient.rpc("relevant_profiles", {
          query_embedding: lead.embedding,
          user_id: lead.profile.id,
          search_college: lead.profile.college,
          neighbors: neighbors
        });

        if (error) {
          console.error(`Error getting relevant profiles for lead ${lead.id}:`, error);
          continue;
        }

        if (!data || data.length === 0) {
          continue;
        }

        // Create leads to users records
        for (const leadToUser of data) {
          leadsToUsers.push({
            user_id: leadToUser.profile.id,
            lead_id: lead.id,
            similarity: leadToUser.similarity
          });
        }
      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
        errors.push({ leadId: lead.id, error: (error as Error).message });
      }
    }

    // Insert all leads to users into the database
    if (leadsToUsers.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('leads_to_users')
        .upsert(leadsToUsers, { 
          onConflict: 'user_id,lead_id',
          ignoreDuplicates: true 
        });

      if (insertError) {
        console.error('Error inserting leads to users:', insertError);
        return new Response(JSON.stringify({ 
          error: 'Failed to insert leads to users',
          details: insertError 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: leadsToUsers.length,
      errors: errors.length > 0 ? errors : undefined
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing leads:', error);
    return new Response(JSON.stringify({ error: 'Failed to process leads ' + error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-leads' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{}'

*/
