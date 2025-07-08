import React from 'react';
import { FiInfo } from 'react-icons/fi';

export default function SkillsInfoSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg aspect-square flex-shrink-0">
          <FiInfo className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          How These Recommendations Work
        </h3>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
        Our AI analyzes your resume against current job market trends and your desired job profile, identifying skills that could significantly improve your chances of being hired. 
        Each recommendation includes a link to a learning resource to help you develop these skills.
      </p>
    </div>
  );
} 