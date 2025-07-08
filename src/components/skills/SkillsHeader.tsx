import React from 'react';
import { FiTarget } from 'react-icons/fi';

export default function SkillsHeader() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg aspect-square">
            <FiTarget className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Skill Building
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enhance your chances of being hired by improving specific, industry-relevant skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 