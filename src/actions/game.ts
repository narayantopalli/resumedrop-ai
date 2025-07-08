'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveHighScore(score: number, userId: string) {
  try {
    if (typeof score !== 'number' || score < 0) {
      throw new Error('Invalid score provided');
    }

    // Upsert the high score
    const { error: upsertError } = await supabase
      .from('game')
      .upsert({ id: userId, score });

    if (upsertError) {
      console.error('Error upserting high score:', upsertError);
      throw new Error('Failed to save high score');
    }

    return { success: true, score };
  } catch (error) {
    console.error('Error in saveHighScore action:', error);
    throw error;
  }
}

export async function getHighScore(userId: string) {
  try {
    // Get the current high score
    const { data, error } = await supabase
      .from('game')
      .select('score')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching high score:', error);
      return { score: 0 };
    }

    return { score: data?.score || 0 };
  } catch (error) {
    console.error('Error in getHighScore action:', error);
    return { score: 0 };
  }
} 