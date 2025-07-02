'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';
import ProfilesSection from '@/components/profiles/ProfilesSection';
import { Profile } from '@/components/profiles/types';
import { getMatches, getProfile } from '@/actions/matches';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import BackButton from '@/components/BackButton';

function MatchesPageContent() {
  const { userMetadata } = useSession();
  const [matches, setMatches] = useState<Profile[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // fetch matches
  useEffect(() => {
    if (!userMetadata?.id) return;
    async function fetchMatches() {
      try {
        const matches = await getMatches(userMetadata.id);
        if (matches) {
          const resolvedMatches = await Promise.all(matches);
          setMatches(resolvedMatches || []);
        } else {
          setMatches([]);
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
        setMatches([]);
      }
    }
    fetchMatches();
  }, [userMetadata?.id]);

  // realtime subscription
  useEffect(() => {
    if (!userMetadata?.id) return;
  
    // if we already have an open channel for this user, do nothing
    if (channelRef.current) return;

    
  
    const channel = supabase
      .channel(`suggested_matches-${userMetadata.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suggested_matches',
          filter: `user_id=eq.${userMetadata.id}`
        },
        async (payload) => {
          // delete
          setMatches(currentMatches => {
            if (payload.eventType === 'DELETE') {
              if (payload.old === null) return currentMatches || [];
              return (currentMatches || []).filter((match: Profile) => match.match_id !== (payload.old as any)?.id);
            }
            return currentMatches || [];
          });

          // insert
          if (payload.eventType === 'INSERT' && payload.new !== null) {
            const newMatch = await getProfile((payload.new as any).match?.id);
            setMatches(currentMatches => {
              if (payload.eventType === 'INSERT') {
                return [...currentMatches, {
                    ...(payload.new as any).match,
                    match_id: (payload.new as any)?.id,
                    name: (newMatch?.name),
                    avatar_url: (newMatch?.avatar_url),
                    contactInfo: (newMatch?.contactInfo),
                  } as Profile]
                }
              return currentMatches || [];
            });
          }

          // update
          setMatches(currentMatches => {
            if (payload.new === null) return currentMatches || [];
            if (payload.eventType === 'UPDATE') {
              return currentMatches.map((match: Profile) => {
                if (match.match_id === (payload.new as any)?.id) {
                  const newMatch = (payload.new as any).match as Profile;
                  return {
                    ...match,
                    name: (newMatch.name === undefined || newMatch.name === null ? match.name : newMatch.name),
                    avatar_url: (newMatch.avatar_url === undefined || newMatch.avatar_url === null ? match.avatar_url : newMatch.avatar_url),
                    contactInfo: (newMatch.contactInfo === undefined || newMatch.contactInfo === null ? match.contactInfo : newMatch.contactInfo),
                    similarity: (newMatch.similarity === undefined || newMatch.similarity === null ? match.similarity : newMatch.similarity),
                    reason: (newMatch.reason === undefined || newMatch.reason === null ? match.reason : newMatch.reason)
                  };
                }
                return match;
              });
            }
            return currentMatches || [];
          });
        }
      )
      .subscribe();
  
    channelRef.current = channel;
  
    // cleanup
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [userMetadata?.id]);

  return (
    <div className="flex flex-col mt-2">
      {/* Tab Content */}
      <div className="flex-1">

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ProfilesSection
              suggestedProfiles={matches}
              userMetadata={userMetadata}
            />
          </div>
      </div>

      {/* Back Button */}
      <div className="my-2">
        <BackButton />
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <MatchesPageContent />
  );
} 