'use client';

import React, { useState, useEffect } from 'react';
import SkillsHeader from './SkillsHeader';
import SkillsSearch from './SkillsSearch';
import JobSearch from './JobSearch';
import PastSearches from './PastSearches';
import { SkillsData } from './types';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSearch } from '@/actions/skills';

type TabType = 'search' | 'history';

export default function SkillsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchID, setSearchID] = useState<string | null>(searchParams.get('id'));
  const [data, setData] = useState<SkillsData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('search');

  const fetchSkillsData = async () => {
    if (!searchID) return;
    try {
      const searchData = await getSearch(searchID);
      setData(searchData);
    } catch (error) {
      setData(null);
      setSearchID(null);
      // Update URL search params
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('id');
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  useEffect(() => {
    if (searchID) {
      fetchSkillsData();
      setActiveTab('search');
    } else {
      setActiveTab('search');
    }
  }, [searchID]);

  const handleSearchComplete = (newSearchID: string, skillsData: SkillsData) => {
    setSearchID(newSearchID);
    setData(skillsData);
    setActiveTab('search');
    
    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('id', newSearchID);
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleSearchSelect = (selectedSearchID: string) => {
    setSearchID(selectedSearchID);
    setActiveTab('search');
    
    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('id', selectedSearchID);
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleNewSearch = () => {
    setSearchID(null);
    setData(null);
    setActiveTab('search');
    
    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('id');
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <div className="w-full h-full max-h-full bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      <SkillsHeader />
      
      {/* Browser-style Tabs */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {/* Search Tab */}
          <button
            onClick={() => setActiveTab('search')}
            className={`relative flex items-center px-6 pr-8 py-3 font-medium transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <svg className={`w-4 h-4 mr-2 ${activeTab === 'search' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Skills Search</span>
            <span className="sm:hidden">Search</span>
            {searchID && (
              <div className="absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </button>
          
          {/* History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`relative flex items-center px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <svg className={`w-4 h-4 mr-2 ${activeTab === 'history' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Search History</span>
            <span className="sm:hidden">History</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {activeTab === 'search' ? (
          searchID ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Skills Recommendations
                </h2>
                <button
                  onClick={handleNewSearch}
                  className="inline-flex items-center border border-blue-500 hover:border-blue-600 dark:border-blue-400 hover:dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">New Search</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
              <SkillsSearch skillsData={data || null} />
            </div>
          ) : (
            <JobSearch onSearchComplete={handleSearchComplete} />
          )
        ) : (
          <PastSearches onSearchSelect={handleSearchSelect} currentSearchId={searchID} />
        )}
      </div>
    </div>
  );
} 