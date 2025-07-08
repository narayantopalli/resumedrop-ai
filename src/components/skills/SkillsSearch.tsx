'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/contexts/SessionContext';
import EmptyState from '../EmptyState';
import SkillsHeader from './SkillsHeader';
import SkillsLoadingState from './SkillsLoadingState';
import SkillsErrorState from './SkillsErrorState';
import SkillsGrid from './SkillsGrid';
import SkillsInfoSection from './SkillsInfoSection';
import { SkillsData } from './types';

export default function SkillsSearch({ skillsData }: { skillsData: SkillsData | null }) {
  const { userMetadata } = useSession();

  const handleSkillClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Show sign-in prompt if no user metadata
  if (!userMetadata) {
    return (
      <EmptyState
        title="Skills Recommendations"
        icon="user"
        heading="Sign in to view skills recommendations"
        description="AI-powered suggestions to improve skills relevant to your dream job"
        actionText="Sign In"
        actionHref="/sign-in"
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Loading State */}
      {!skillsData && <SkillsLoadingState />}

      {/* Skills Grid */}
      {skillsData && (
        <div className="space-y-4">
          {/* Job Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800">
            <div className="space-y-3 sm:space-y-4">
              {skillsData.job_title && skillsData.job_title !== 'Not Specified' && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                    {skillsData.company_name}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {skillsData.job_title}
                  </p>
                  {skillsData.work_arrangement && skillsData.work_arrangement !== 'Work Arrangement Not Specified' && (
                    <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                      {skillsData.work_arrangement}
                    </p>
                  )}
                </div>
              )}
              
              {skillsData.job_keywords && skillsData.job_keywords.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Requirements & Details
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {skillsData.job_keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Skills to Improve
            </h3>
          </div>
          <SkillsGrid 
            skills={skillsData.skills_to_improve} 
            onSkillClick={handleSkillClick} 
          />
          <div className="mt-6">
            <SkillsInfoSection />
          </div>
        </div>
      )}
    </div>
  );
} 