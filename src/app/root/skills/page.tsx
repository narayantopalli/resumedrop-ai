import React, { Suspense } from 'react';
import BackButton from '@/components/BackButton';
import SkillsContent from '@/components/skills/SkillsContent';

function SkillsPageContent() {

  return (
    <div className="flex flex-col mt-2">
      {/* Header */}
      <div className="flex-1">
        <Suspense fallback={
          <div className="w-full h-full max-h-full bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        }>
          <SkillsContent />
        </Suspense>
      </div>

      {/* Back Button */}
      <div className="my-2">
        <BackButton />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <SkillsPageContent />
  );
} 