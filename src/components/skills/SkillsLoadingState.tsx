import React from 'react';
import Spinner from '@/components/Spinner';

export default function SkillsLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Spinner size="lg" />
      <p className="mt-6 text-gray-600 dark:text-gray-400 text-center max-w-md">
        Analyzing your resume and generating personalized recommendations...
      </p>
    </div>
  );
} 