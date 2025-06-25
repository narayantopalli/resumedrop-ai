'use client';

import { useState } from 'react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import ContactModal from './ContactModal';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  }
}

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
      <div className="w-full h-full max-h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Similar Profiles
          </h2>
        </div>
        
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sign in to view similar profiles
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            Connect with students from your college and discover opportunities together.
          </p>
          <Link 
            href="/sign-in"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full max-h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Similar To You At {userMetadata?.college}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <CountdownTimer />
          </p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedProfiles.map((profile, index) => (
              <div
                key={profile.id}
                onClick={() => handleViewContact(profile)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer flex flex-col h-full"
              >
                {index === 0 && (
                  <div className="absolute">
                    <span className="text-xs font-bold text-white bg-orange-500 dark:bg-orange-600 px-2 py-1 rounded-full">
                      Best Match
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mt-8">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                          {profile.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  {profile.reason && (
                    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-200 font-serif italic">
                        {profile.reason}
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleViewContact(profile)}
                  className="w-full mt-3 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                >
                  View Contact
                </button>
              </div>
            ))}
          </div>
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