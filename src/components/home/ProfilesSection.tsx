'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import ContactModal from './ContactModal';
import ProfileCard from '../home/ProfileCard';
import EmptyState from '../home/EmptyState';
import Spinner from '../Spinner';
import { Profile } from './types';
import { getMatches } from '@/actions/matches';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { createLocalImageUrl } from '@/utils/imageUtils';

interface ProfilesSectionProps {
  suggestedProfiles: Profile[];
  userMetadata: any;
}

export default function ProfilesSection({
  suggestedProfiles,
  userMetadata
}: ProfilesSectionProps) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedProfiles, setProcessedProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process profiles with local avatar URLs
  useEffect(() => {
    const processProfiles = async () => {
      if (suggestedProfiles.length === 0) {
        setProcessedProfiles([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const profilesWithLocalAvatar = await Promise.all(suggestedProfiles.map(async (profile) => ({
        ...profile,
        avatar_url: profile.avatar_url ? await createLocalImageUrl(profile.avatar_url).then((result) => result.url ?? '').catch(() => '') : ''
      })));
      
      const sorted = [...profilesWithLocalAvatar].sort((a, b) => b.similarity - a.similarity);
      setProcessedProfiles(sorted);
      setIsLoading(false);
    };

    processProfiles();
  }, [suggestedProfiles]);

  // Sort profiles by similarity using useMemo to avoid unnecessary re-sorting
  const sortedProfilesWithLocalAvatar = useMemo(() => {
    return processedProfiles;
  }, [processedProfiles]);

  const handleViewContact = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Show sign-in prompt if no user metadata
  if (!userMetadata) {
    return (
      <EmptyState
        title="Similar Profiles"
        icon="user"
        heading="Sign in to view similar profiles"
        description="Connect with students from your college and discover opportunities together."
        actionText="Sign In"
        actionHref="/sign-in"
      />
    );
  }

  return (
    <>
      <div className="w-full h-full max-h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-md md:text-lg font-semibold text-gray-900 dark:text-white">
                {userMetadata.isPublic 
                  ? `Similar To You At ${userMetadata?.college}`
                  : 'Similar Profiles'
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {!userMetadata.isPublic ? (
            <EmptyState
              title=""
              icon="lock"
              heading="Profile is Private"
              description="Make your profile open to network!"
              actionText="Go to Settings"
              actionHref="/settings"
            />
          ) : suggestedProfiles.length === 0 ? (
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <Spinner />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading profiles...</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <CountdownTimer />
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 md:gap-6 lg:gap-8">
                {isLoading ? (
                  <div className="col-span-full flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  sortedProfilesWithLocalAvatar.map((profile, index) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isBestMatch={index === 0}
                      onViewContact={() => handleViewContact(profile)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedProfile && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={selectedProfile}
        />
      )}
    </>
  );
} 