import React from 'react';
import { FiAlertCircle, FiUpload } from 'react-icons/fi';

interface SkillsErrorStateProps {
  error: string;
}

export default function SkillsErrorState({ error }: SkillsErrorStateProps) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <FiAlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            {error === 'RESUME_NOT_FOUND' ? 'Resume Required' : 'Error Loading Recommendations'}
          </h3>
          <p className="text-red-700 dark:text-red-300 leading-relaxed mb-4">
            {error === 'RESUME_NOT_FOUND' 
              ? 'No resume found. Please upload your resume first to get personalized skills recommendations.'
              : error
            }
          </p>
        </div>
      </div>
    </div>
  );
} 