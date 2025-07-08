'use client';

import React, { useState, useEffect } from 'react';
import LeadsHeader from './LeadsHeader';
import LeadsGrid from './LeadsGrid';
import { PostedLead, MyLead } from './types';
import { getMyLeads, createLead, deleteLead } from '@/actions/leads';
import { useSession } from '@/contexts/SessionContext';
import MyLeads from './MyLeads';
import { FiMinus, FiPlus } from 'react-icons/fi';
import EmptyState from '../EmptyState';

type TabType = 'browse' | 'my_leads';

export default function LeadsContent() {
  const { userMetadata } = useSession();
  const [leads, setLeads] = useState<MyLead[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [showAddLead, setShowAddLead] = useState(false);

  const fetchLeads = async () => {
    if (!userMetadata?.id || !userMetadata?.college || userMetadata.college === null || userMetadata.college === undefined || userMetadata.college === '') return;
    
    try {
      const leadsData = await getMyLeads(userMetadata.id);
      setLeads(leadsData);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [userMetadata?.id]);

  const handleAddLead = async (leadData: Omit<PostedLead, 'id' | 'created_at' | 'user_id' | 'embedding'>) => {
    if (!userMetadata?.id) return;
    
    try {
      await createLead(userMetadata.id, leadData);
      setActiveTab('my_leads');
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Show sign-in prompt if no user metadata
  if (!userMetadata) {
    return (
      <EmptyState
        title="Find Leads"
        icon="user"
        heading="Sign in to view leads"
        description="Browse leads created by peers at your college or post your own"
        actionText="Sign In"
        actionHref="/sign-in"
      />
    );
  }

  // Show sign-in prompt if no user college
  if (!userMetadata?.college || userMetadata?.college === null || userMetadata?.college === undefined || userMetadata?.college === '') {
    return (
      <EmptyState
        title="Find Leads"
        icon="user"
        heading="Sign in with a supported college email to view leads"
        description="Browse leads created by peers at your college or post your own"
      />
    );
  }

  return (
    <div className="w-full min-h-[120vh] max-h-full bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      <LeadsHeader />
      
      {/* Browser-style Tabs */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex">
            {/* Browse Tab */}
            <button
              onClick={() => setActiveTab('browse')}
              className={`relative flex items-center px-3 sm:px-6 pr-4 sm:pr-8 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === 'browse'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-secondary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${activeTab === 'browse' ? 'text-secondary-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden sm:inline">Browse Leads</span>
              <span className="sm:hidden">Browse</span>
            </button>
            
            {/* My Leads Tab */}
            <button
              onClick={() => setActiveTab('my_leads')}
              className={`relative flex items-center px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === 'my_leads'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-secondary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${activeTab === 'my_leads' ? 'text-secondary-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Post Leads</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>

          {/* Add Lead Button - Right side of tabs */}
          {activeTab === 'my_leads' && (
            <div className="flex items-center pr-4 sm:pr-6">
              <button
                onClick={() => setShowAddLead(!showAddLead)}
                className={`
                    inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap
                    ${showAddLead 
                    ? 'border border-red-500 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
                    : 'border border-blue-500 hover:border-blue-600 dark:border-blue-400 hover:dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                    }
                    rounded-md
                `}
                >
                <FiPlus className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${showAddLead ? 'hidden' : 'block'}`} />
                <FiMinus className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${showAddLead ? 'block' : 'hidden'}`} />
                <span className="hidden xs:inline">Add New Lead</span>
                <span className="xs:hidden">Add Lead</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4">
        {activeTab === 'browse' ? (
          <LeadsGrid leads={leads} />
        ) : (
          <MyLeads showAddLead={showAddLead} setShowAddLead={setShowAddLead} onAddLead={handleAddLead} onDeleteLead={handleDeleteLead} />
        )}
      </div>
    </div>
  );
} 