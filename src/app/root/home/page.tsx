'use client';

import React, { useState, useRef, useCallback } from 'react';
import ProfilesSection from '@/components/home/ProfilesSection';
import ResumeReviewAI from '@/components/home/ResumeReviewAI';
import { useSession } from '@/contexts/SessionContext';
import ResumePreview from '@/components/home/ResumePreview';

type TabView = 'resume-review' | 'profiles';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  contactInfo: {
    email?: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  }
}

export default function HomePage() {
  const { userMetadata, resumeInfo, resumeExtractedText, setUserMetadata } = useSession();
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<TabView>('resume-review');
  
  // Resizable divider state
  const [dividerPosition, setDividerPosition] = useState(40); // Default 2/3 width for resume preview
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const suggestedProfiles: Profile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/60/60',
      reason: 'You both have a passion for React development and a strong interest in building scalable applications. You should connect and discuss your projects and ideas.',
      contactInfo: {
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        github: 'sarah_dev',
        instagram: 'sarah_dev',
        twitter: 'sarahjohnson',
        linkedin: 'linkedin.com/in/sarahjohnson'
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/api/placeholder/60/60',
      reason: 'Shared interest in product strategy and user experience design. Great opportunity to collaborate on innovative solutions.',
      contactInfo: {
        email: 'michael.chen@email.com',
        phone: '+1 (555) 987-6543',
        github: 'mike_dev',
        instagram: 'mikechen',
        linkedin: 'linkedin.com/in/michaelchen'
      }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '/api/placeholder/60/60',
      reason: 'Both experienced in full-stack development with focus on performance optimization and modern web technologies.',
      contactInfo: {
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 456-7890',
        github: 'emily_dev',
        twitter: 'emilyrodriguez',
        linkedin: 'linkedin.com/in/emilyrodriguez'
      }
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('resume-review')}
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
              onClick={() => setActiveTab('profiles')}
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
                <span className="hidden sm:inline">Suggested Matches</span>
                <span className="sm:hidden">Matches</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {/* Resume Review AI Tab */}
        {activeTab === 'resume-review' && (
          <>
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-4">
              <div className="h-[400px] w-full">
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedText={resumeExtractedText}
                />
              </div>
              <div className="h-[400px] w-full">
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedText} setUserMetadata={setUserMetadata} />
              </div>
            </div>

            {/* Desktop Layout with Resizable Divider */}
            <div className="hidden md:flex items-start gap-4" ref={containerRef}>
              <div 
                className="h-[550px]"
                style={{ width: `${dividerPosition}%` }}
              >
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedText={resumeExtractedText}
                />
              </div>
              
              <div
                className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative group"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute transform w-1 h-[550px] bg-gray-400 dark:bg-gray-500 rounded opacity-100 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-all duration-200" />
              </div>
              
              <div 
                className="h-[550px]"
                style={{ width: `${100 - dividerPosition}%` }}
              >
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedText} setUserMetadata={setUserMetadata} />
              </div>
            </div>
          </>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ProfilesSection
              suggestedProfiles={suggestedProfiles}
              userMetadata={userMetadata}
            />
          </div>
        )}
      </div>
    </div>
  );
} 