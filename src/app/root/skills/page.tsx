import React from 'react';
import BackButton from '@/components/BackButton';
import SkillsContent from '@/components/skills/SkillsContent';

function SkillsPageContent() {

  return (
    <div className="flex flex-col mt-2">
      {/* Header */}
      <div className="flex-1">
        <SkillsContent />
      </div>

      {/* Back Button */}
      <div className="my-2">
        <BackButton />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <SkillsPageContent />
  );
} 