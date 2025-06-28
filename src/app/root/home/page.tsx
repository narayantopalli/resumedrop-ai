'use client';

import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfilesSection from '@/components/home/ProfilesSection';
import ResumeReviewAI from '@/components/home/ResumeReviewAI';
import { useSession } from '@/contexts/SessionContext';
import ResumePreview from '@/components/home/ResumePreview';
import ToggleSwitch from '@/components/home/ToggleSwitch';
import Modal from '@/components/Modal';
import { updateUserIsPublic } from '@/actions/profile';
import { Profile } from '@/components/home/types';
import { getMatches, getProfile } from '@/actions/matches';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type TabView = 'resume-review' | 'profiles';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function HomePageContent() {
  const { userMetadata, resumeInfo, resumeExtractedHtml, setUserMetadata } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
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
          if (payload.new === null) return;
          setMatches(currentMatches => {
            // Add null checks to prevent runtime errors
            const newMatchId = (payload.new as any)?.match?.id;
            if (!newMatchId) return currentMatches;
            
            const newMatches = currentMatches.filter((match: any) => {
              // Handle both possible structures: match.match.id and match.id
              const matchId = match?.match?.id || match?.id;
              return matchId !== newMatchId;
            });
            return newMatches;
          });
          
          const newMatch = await getProfile((payload.new as any).match.id);
          
          setMatches(currentMatches => {
            const updatedMatches = [...currentMatches];
            updatedMatches.push({
              ...(payload.new as any).match,
              name: newMatch?.name,
              avatar_url: newMatch?.avatar_url,
              contactInfo: newMatch?.contactInfo
            });
            return updatedMatches;
          });
        }
      ).on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'suggested_matches'
        },
        async (payload) => {
          setMatches(currentMatches => {
            // Add null checks to prevent runtime errors
            const deletedMatchId = (payload.old as any)?.match?.id;
            if (!deletedMatchId) return currentMatches;
            
            return currentMatches.filter((match: any) => {
              // Handle both possible structures: match.match.id and match.id
              const matchId = match?.match?.id || match?.id;
              return matchId !== deletedMatchId;
            });
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
  
  // Tab navigation state - initialize from URL or default to 'resume-review'
  const [activeTab, setActiveTab] = useState<TabView>(() => {
    const tabFromUrl = searchParams.get('tab') as TabView;
    if (tabFromUrl === null || !['resume-review', 'profiles'].includes(tabFromUrl)) {
      return 'resume-review';
    }
    return tabFromUrl;
  });
  
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);
  // Privacy warning modal state
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(false);
  // Resizable divider state
  const [dividerPosition, setDividerPosition] = useState(40); // Default 2/3 width for resume preview
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set default tab in URL if not present
  useEffect(() => {
    if (!searchParams.has('tab') || !['resume-review', 'profiles'].includes(searchParams.get('tab') as TabView)) {
      router.push(`?tab=resume-review`);
    }
  }, [searchParams, router]);

  // Update URL when tab changes
  const updateTabInUrl = useCallback((tab: TabView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  // Handle tab change
  const handleTabChange = useCallback((tab: TabView) => {
    setActiveTab(tab);
    updateTabInUrl(tab);
  }, [updateTabInUrl]);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as TabView;
    if (tabFromUrl && ['resume-review', 'profiles'].includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  const handlePrivacyToggle = async () => {
    if (!userMetadata?.id || isUpdatingPrivacy) return;
    
    // Show warning when making profile private
    if (userMetadata.isPublic) {
      setShowPrivacyWarning(true);
      return;
    }
    
    await updatePrivacySetting();
  };

  const updatePrivacySetting = async () => {
    if (!userMetadata?.id) return;
    
    setIsUpdatingPrivacy(true);
    try {
      const newIsPublic = !userMetadata.isPublic;
      const result = await updateUserIsPublic(userMetadata.id, newIsPublic);
      
      if (result.success) {
        setUserMetadata({
          ...userMetadata,
          isPublic: newIsPublic
        });
      }
    } catch (error) {
      console.error('Error updating privacy setting:', error);
    } finally {
      setIsUpdatingPrivacy(false);
      setShowPrivacyWarning(false);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain the divider position between 40% and 75%
    const constrainedPosition = Math.max(40, Math.min(75, newPosition));
    setDividerPosition(constrainedPosition);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="mb-1">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 justify-between items-center" aria-label="Tabs">
            <div className="flex space-x-8">
              <button
                onClick={() => handleTabChange('resume-review')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resume-review'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Resume Review AI</span>
                  <span className="sm:hidden">Resume AI</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange('profiles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profiles'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Suggested Profiles</span>
                  <span className="sm:hidden">Profiles</span>
                </div>
              </button>
            </div>
            {userMetadata && (
              <div className="flex items-center">
                <ToggleSwitch 
                  isOn={userMetadata?.isPublic} 
                  onToggle={handlePrivacyToggle}
                  disabled={isUpdatingPrivacy}
                />
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {/* Resume Review AI Tab */}
        {activeTab === 'resume-review' && (
          <>
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col gap-4">
              <div className="h-[70vh] w-full">
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedHtml={resumeExtractedHtml}
                />
              </div>
              <div className="h-[70vh] w-full">
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedHtml} setUserMetadata={setUserMetadata} matches={matches} />
              </div>
            </div>

            {/* Desktop Layout with Resizable Divider */}
            <div className="hidden lg:flex items-start gap-4 xl:gap-6 2xl:gap-8" ref={containerRef}>
              <div 
                className="h-[85vh]"
                style={{ width: `${dividerPosition}%` }}
              >
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedHtml={resumeExtractedHtml}
                />
              </div>
              
              <div
                className="w-1 xl:w-1.5 2xl:w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative group"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute transform w-1 xl:w-1.5 2xl:w-2 h-[85vh] bg-gray-400 dark:bg-gray-500 rounded opacity-100 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-all duration-200" />
              </div>
              
              <div 
                className="h-[85vh]"
                style={{ width: `${100 - dividerPosition}%` }}
              >
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedHtml} setUserMetadata={setUserMetadata} matches={matches} />
              </div>
            </div>
          </>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ProfilesSection
              suggestedProfiles={matches}
              userMetadata={userMetadata}
            />
          </div>
        )}
      </div>

      {/* Privacy Warning Modal */}
      <Modal
        isOpen={showPrivacyWarning}
        onClose={() => setShowPrivacyWarning(false)}
        onConfirm={updatePrivacySetting}
        title="Make Profile Private"
        message="Are you sure you want to make your profile private? Only open profiles are able to network!"
        confirmText="Make Private"
        cancelText="Keep Open"
        confirmButtonVariant="danger"
        declineButtonVariant="success"
      />
    </div>
  );
}

// Loading fallback component
function HomePageLoading() {
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 justify-between items-center" aria-label="Tabs">
            <div className="flex space-x-8">
              <div className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Resume Review AI</span>
                  <span className="sm:hidden">Resume AI</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="flex-1">
        <div className="animate-pulse">
          <div className="h-[600px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageContent />
    </Suspense>
  );
} 