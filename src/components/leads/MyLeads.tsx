import React, { useState, useEffect } from 'react';
import AddLeadForm from "./AddLeadForm";
import { PostedLead } from "./types";
import { getPostedLeads } from "@/actions/leads";
import { useSession } from "@/contexts/SessionContext";
import { FiPlus, FiList, FiX, FiMinus } from "react-icons/fi";
import MyLeadsGrid from './MyLeadsGrid';

interface MyLeadsProps {
  onAddLead: (leadData: any) => void;
  onDeleteLead: (leadId: string) => void;
  showAddLead: boolean;
  setShowAddLead: (showAddLead: boolean) => void;
}

export default function MyLeads({ onAddLead, onDeleteLead, showAddLead, setShowAddLead }: MyLeadsProps) {
  const { userMetadata } = useSession();
  const [myLeads, setMyLeads] = useState<PostedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyLeads = async () => {
    if (!userMetadata?.id) return;
    
    try {
      setLoading(true);
      const leadsData = await getPostedLeads(userMetadata.id);
      setMyLeads(leadsData);
      setError(null);
    } catch (err) {
      setError('Failed to load your leads');
      console.error('Error fetching my leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeads();
  }, [userMetadata?.id]);

  const handleAddLead = async (leadData: any) => {
    await onAddLead(leadData);
    // Refresh the leads list after adding
    await fetchMyLeads();
    setShowAddLead(false);
  };

  const handleDeleteLead = async (leadId: string) => {
    await onDeleteLead(leadId);
    // Update local state
    setMyLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Lead Form */}
      {showAddLead ? (
        <div className="bg-gradient-to-r from-orange-50 to-secondary-50 dark:from-orange-900/20 dark:to-secondary-900/20 rounded-xl p-4 sm:p-6 shadow-lg border border-blue-100 dark:border-blue-800">
          <AddLeadForm onAddLead={handleAddLead} />
        </div>
      ) : (
        <MyLeadsGrid leads={myLeads} loading={loading} error={error} onDeleteLead={handleDeleteLead} />
      )}
    </div>
  );
}