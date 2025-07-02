'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('name, avatar_url, contactInfo').eq('id', userId).single();
    if (error) {
        console.error('Error getting profile:', error);
        return null;
    }
    return {
        name: data.name,
        avatar_url: data.avatar_url,
        contactInfo: data.contactInfo
    };
}

export const getMatches = async (userId: string) => {
    const { data, error } = await supabase.from('suggested_matches').select('*').eq('user_id', userId);
    if (error) {
        console.error('Error getting matches:', error);
        return null;
    }
    return data.map(async (match: any) => {
        const profile = await getProfile(match.match.id);
        return {
            ...match.match,
            match_id: match.id,
            name: profile?.name,
            avatar_url: profile?.avatar_url,
            contactInfo: profile?.contactInfo
        };
    });
}
