'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useSession } from '@/contexts/SessionContext';
import ResumeReviewAI from '@/components/editor/ResumeReviewAI';
import ResumePreview from '@/components/editor/ResumePreview';
import BackButton from '@/components/BackButton';

function EditorPageContent() {
  const { userMetadata, resumeInfo, resumeExtractedHtml, setUserMetadata } = useSession();
  // Resizable divider state
  const [dividerPosition, setDividerPosition] = useState(40); // Default 2/3 width for resume preview
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain the divider position between 40% and 75%
    const constrainedPosition = Math.max(40, Math.min(75, newPosition));
    setDividerPosition(constrainedPosition);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col mt-2">
      {/* Tab Content */}
      <div className="flex-1">
        {/* Resume Review AI Tab */}
          <>
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col gap-4">
              <div className="h-[70vh] w-full">
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedHtml={resumeExtractedHtml}
                />
              </div>
              <div className="h-[70vh] w-full">
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedHtml} setUserMetadata={setUserMetadata} />
              </div>
            </div>

            {/* Desktop Layout with Resizable Divider */}
            <div className="hidden lg:flex items-start gap-4 xl:gap-6 2xl:gap-8" ref={containerRef}>
              <div 
                className="h-[90vh]"
                style={{ width: `${dividerPosition}%` }}
              >
                <ResumePreview
                  resumeUpdatedAt={resumeInfo?.updated_at || null}
                  resumeExtractedHtml={resumeExtractedHtml}
                />
              </div>
              
              <div
                className="w-1 xl:w-1.5 2xl:w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative group"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute transform w-1 xl:w-1.5 2xl:w-2 h-[90vh] bg-gray-400 dark:bg-gray-500 rounded opacity-100 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-all duration-200" />
              </div>
              
              <div 
                className="h-[90vh]"
                style={{ width: `${100 - dividerPosition}%` }}
              >
                <ResumeReviewAI userMetadata={userMetadata} resumeText={resumeExtractedHtml} setUserMetadata={setUserMetadata} />
              </div>
            </div>
          </>
      </div>

      {/* Back Button */}
      <div className="my-2">
        <BackButton />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
      <EditorPageContent />
  );
} 