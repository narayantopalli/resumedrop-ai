import React from 'react';
import SkillCard from './SkillCard';
import { SkillRecommendation } from './types';

interface SkillsGridProps {
  skills: SkillRecommendation[];
  onSkillClick: (url: string) => void;
}

export default function SkillsGrid({ skills, onSkillClick }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {skills.map((skill, index) => (
        <SkillCard
          key={index}
          skill={skill}
          onSkillClick={onSkillClick}
        />
      ))}
    </div>
  );
} 