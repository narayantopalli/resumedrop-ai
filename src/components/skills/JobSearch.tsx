'use client';

import React, { useState } from 'react';
import { getSkillsResponse, uploadSearch, getDescriptionUrl } from '@/actions/skills';
import { useSession } from '@/contexts/SessionContext';
import { SkillsData } from './types';

interface JobSearchProps {
  onSearchComplete: (searchId: string, skillsData: SkillsData) => void;
}

type InputMode = 'description' | 'website';

export default function JobSearch({ onSearchComplete }: JobSearchProps) {
  const { userMetadata } = useSession();
  const [inputMode, setInputMode] = useState<InputMode>('website');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let inputValue: string | null = null;

    setLoading(true);
    setError(null);

    try {
      if (inputMode === 'description') {
        inputValue = description.trim();
      } else {
        // For website mode, fetch the content from the URL
        if (!isValidUrl(websiteUrl)) {
          setError('Please enter a valid website URL');
          return;
        }
        inputValue = await getDescriptionUrl(websiteUrl.trim());
      }
      
      if (!inputValue) {
        setError(inputMode === 'description' ? 'Please enter job description' : 'Failed to fetch content from website. Please check the URL and try again.');
        return;
      }
  
      if (!userMetadata?.id) {
        setError('User not authenticated');
        return;
      }
      
      const response = await getSkillsResponse(userMetadata.id, inputValue)

      const searchID = await uploadSearch(userMetadata.id, response.skillsData);
      onSearchComplete(searchID, response.skillsData);
    } catch (err) {
      console.error('Error fetching skills:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load skills recommendations. Please try again.';
      
      if (errorMessage.includes('Resume not found')) {
        setError('RESUME_NOT_FOUND');
      } else {
        setError('Failed to load skills recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError(null);
    // Clear the other input when switching modes
    if (mode === 'description') {
      setWebsiteUrl('');
    } else {
      setDescription('');
    }
  };

  // Show sign-in prompt if no user metadata
  if (!userMetadata) {
    return (
      <div className="text-center py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Unlock Personalized Skills Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Sign in to get AI-powered skills recommendations tailored to your career goals
            </p>
          </div>
          <a
            href="/sign-in"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Get Started
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Input Mode Toggle - Chrome-style tabs */}
            <div className="relative">
              {/* Tab container with background */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-t-xl p-1 flex">
                <button
                  type="button"
                  onClick={() => handleInputModeChange('website')}
                  className={`relative flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    inputMode === 'website'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border-b-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <svg className={`w-4 h-4 mr-2 ${inputMode === 'website' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <span className="hidden sm:inline">Posting URL</span>
                  <span className="sm:hidden">URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputModeChange('description')}
                  className={`relative flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    inputMode === 'description'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border-b-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <svg className={`w-4 h-4 mr-2 ${inputMode === 'description' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Job Description</span>
                  <span className="sm:hidden">Description</span>
                </button>
              </div>
              {/* Tab content area background */}
              <div className="bg-white dark:bg-gray-800 rounded-b-xl border-t-0 border border-gray-200 dark:border-gray-600">
                <div className="p-4">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputMode === 'description' ? (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., We are looking for a software engineer with experience in Python, React, and data analysis. The ideal candidate should have strong project management skills..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                    rows={5}
                    disabled={loading}
                  />
                  <div className="absolute top-3 right-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Paste a job description
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="url"
                    id="websiteUrl"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com/job-posting"
                    className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enter the URL of a job posting
                </p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                    {error}
                  </span>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !(inputMode === 'description' ? description.trim() : websiteUrl.trim())}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Get Recommendations
                </div>
              )}
            </button>
          </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 