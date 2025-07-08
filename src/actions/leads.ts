'use server';

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { PostedLead, MyLead, CreateLeadData } from '@/components/leads/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getPostedLeads = async (userId: string): Promise<PostedLead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('id, contact, title, description, requirements, created_at, selectiveness')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!data || data.length === 0) {
    return [];
  }

  if (error) {
    throw new Error('Failed to get leads');
  }

  return data as PostedLead[];
};

export const getMyLeads = async (userId: string): Promise<MyLead[]> => {
  const { data, error } = await supabase
    .from('leads_to_users')
    .select('similarity, lead:leads!leads_to_people_lead_id_fkey(id, contact, title, description, requirements, created_at)')
    .eq('user_id', userId)
    .order('similarity', { ascending: false });

  if (!data || data.length === 0) {
    return [];
  }

  if (error) {
    throw new Error('Failed to get leads');
  }

  return data.map((lead) => ({
    id: (lead.lead as any).id,
    similarity: lead.similarity,
    contact: (lead.lead as any).contact,
    title: (lead.lead as any).title,
    description: (lead.lead as any).description,
    created_at: (lead.lead as any).created_at,
  }));
};


export const createLead = async (userId: string, leadData: CreateLeadData) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: leadData.requirements,
  });

  const { data, error } = await supabase
    .from('leads')
    .insert({ ...leadData, user_id: userId, embedding: embedding.data[0].embedding })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create lead');
  }

  return data as PostedLead;
};

export const deleteLead = async (leadId: string) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    throw new Error('Failed to delete lead');
  }

  return true;
};