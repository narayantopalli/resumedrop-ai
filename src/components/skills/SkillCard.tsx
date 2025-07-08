import React from 'react';
import { FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { SkillRecommendation } from './types';

interface SkillCardProps {
  skill: SkillRecommendation;
  onSkillClick: (url: string) => void;
}

const providerIcons: Record<string, React.ReactElement> = {
    'LinkedIn Learning': (
      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
}

export default function SkillCard({ skill, onSkillClick }: SkillCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 relative overflow-hidden flex flex-col h-full">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                {skill.skill}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5">
                  {providerIcons[skill.provider] || null}
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {skill.provider}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {skill.url && skill.url !== '#' && (
            <button
              onClick={() => onSkillClick(skill.url)}
              className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              title="Learn more"
            >
              <FiExternalLink className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-base flex-1">
          {skill.explanation}
        </p>

        <div className="mt-auto">
          {skill.url && skill.url !== '#' && (
            <button
              onClick={() => onSkillClick(skill.url)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiExternalLink className="w-4 h-4" />
              Learn More
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 