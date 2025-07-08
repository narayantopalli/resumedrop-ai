import React from 'react';
import BackButton from '@/components/BackButton';
import LeadsContent from '@/components/leads/LeadsContent';

export default function LeadsPage() {
  return (
    <div className="flex flex-col mt-2">
      {/* Header */}
      <div className="flex-1">
        <LeadsContent />
      </div>

      {/* Back Button */}
      <div className="my-2">
        <BackButton />
      </div>
    </div>
  );
}
