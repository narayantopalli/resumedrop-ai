'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiFileText, FiUpload, FiEye, FiCalendar, FiEdit3, FiSave, FiX, FiCopy, FiCheck, FiRotateCcw, FiRotateCw, FiDownload, FiCpu } from "react-icons/fi";
import Link from "next/link";
import { useSession } from '@/contexts/SessionContext';
import { updateResumeExtractedText } from '@/actions/resume';
import { copyToClipboard } from '@/utils/clipboardUtils';
import { generateDOCXFromText, downloadDOCX } from '@/utils/docxGeneration';

interface ResumePreviewProps {
  resumeUpdatedAt: string | null;
  resumeExtractedText: string | null;
}

export default function ResumePreview({ 
  resumeUpdatedAt,
  resumeExtractedText
}: ResumePreviewProps) {
  const { session, setResumeExtractedText, userMetadata } = useSession();
  const hasResume = resumeExtractedText != null;
  
  // Editable text states
  const [editableText, setEditableText] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Copy button states
  const [copied, setCopied] = useState(false);

  // DOCX download states
  const [isGeneratingDOCX, setIsGeneratingDOCX] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  // Undo/Redo state
  const [editHistory, setEditHistory] = useState<{ original: string; suggested: string; appliedText: string; }[] | null>(null);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);

  // Animated ellipsis state
  const [ellipsisDots, setEllipsisDots] = useState('');

  // load edit history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('editHistory');
    if (savedHistory) {
      setEditHistory(JSON.parse(savedHistory));
    } else {
      setEditHistory([]);
    }
    const savedCurrentHistoryIndex = localStorage.getItem('currentHistoryIndex');
    if (savedCurrentHistoryIndex) {
      setCurrentHistoryIndex(parseInt(savedCurrentHistoryIndex));
    } else {
      setCurrentHistoryIndex(-1);
    }
  }, []);
  // save edit history and current history index to local storage
  useEffect(() => {
    if (editHistory) {
      localStorage.setItem('editHistory', JSON.stringify(editHistory));
    }
    if (currentHistoryIndex !== null) {
      localStorage.setItem('currentHistoryIndex', currentHistoryIndex.toString());
    }
  }, [editHistory, currentHistoryIndex]);

  // Initialize editable text when resumeExtractedText changes
  useEffect(() => {
    if (resumeExtractedText) {
      setEditableText(resumeExtractedText);
    }
  }, [resumeExtractedText]);

  // Animate ellipsis when AI is thinking
  useEffect(() => {
    if (isGeneratingDOCX) {
      const interval = setInterval(() => {
        setEllipsisDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setEllipsisDots('');
    }
  }, [isGeneratingDOCX]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original text
      setEditableText(resumeExtractedText || '');
      setError(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (!session?.user?.id) {
        setError('Please sign in to save the edited text.');
        setIsSaving(false);
        return;
      }
      
      const updateResult = await updateResumeExtractedText(session.user.id, editableText);
      if (updateResult.success) {
        // Add user edit to history
        if (editHistory && currentHistoryIndex !== null) {
          const newHistoryItem = {
            original: resumeExtractedText || '',
            suggested: editableText,
            appliedText: editableText
          };
          
          // Remove any future history items if we're not at the end
          const newHistory = editHistory.slice(0, currentHistoryIndex + 1);
          newHistory.push(newHistoryItem);
          
          setEditHistory(newHistory);
          setCurrentHistoryIndex(newHistory.length - 1);
        }
        
        setResumeExtractedText(editableText);
        setIsEditing(false);
      } else {
        setError(updateResult.error || 'Failed to save edited text. Please try again.');
      }
    } catch (err) {
      console.error('Error saving edited text:', err);
      setError('Failed to save edited text. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyText = async () => {
    const textToCopy = isEditing ? editableText : resumeExtractedText;
    if (!textToCopy) return;
    
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadDOCX = async () => {
    const textToDownload = isEditing ? editableText : resumeExtractedText;
    if (!textToDownload) {
      setDocxError('No text available to download');
      return;
    }

    setIsGeneratingDOCX(true);
    setDocxError(null);

    try {
      // Generate filename with user's name and current date
      const userName = userMetadata?.name || 'Resume';
      const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
      const fileName = `${userName}_Resume_${currentDate}.docx`;

      const result = await generateDOCXFromText(textToDownload, fileName);
      
      if (result.success && result.url) {
        downloadDOCX(result.url, fileName);
      } else {
        setDocxError(result.error || 'Failed to generate DOCX');
      }
    } catch (err) {
      console.error('Error generating DOCX:', err);
      setDocxError('Failed to generate DOCX. Please try again.');
    } finally {
      setIsGeneratingDOCX(false);
    }
  };

  // Apply edit from chat
  const applyEdit = async (edit: { original: string; suggested: string; }) => {
    if (!resumeExtractedText || !session?.user?.id || !editHistory || currentHistoryIndex === null) return;

    setIsApplyingEdit(true);
    try {
      // Replace the original text with suggested text
      const newText = resumeExtractedText.replace(edit.original, edit.suggested);
      
      // Update the resume text in the database
      const updateResult = await updateResumeExtractedText(session.user.id, newText);
      
      if (updateResult.success) {
        // Update the global state
        setResumeExtractedText(newText);
        setEditableText(newText);
        
        // Add to edit history
        const newHistoryItem = {
          original: edit.original,
          suggested: edit.suggested,
          appliedText: newText
        };
        
        // Remove any future history items if we're not at the end
        const newHistory = editHistory.slice(0, currentHistoryIndex + 1);
        newHistory.push(newHistoryItem);
        
        setEditHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
      }
    } catch (error) {
      console.error('Error applying edit:', error);
    } finally {
      setIsApplyingEdit(false);
    }
  };

  // Undo last edit
  const undoEdit = async () => {
    if (currentHistoryIndex === null || currentHistoryIndex < 0 || !session?.user?.id || !editHistory) return;

    setIsApplyingEdit(true);
    try {
      const historyItem = editHistory[currentHistoryIndex];
      const previousText = currentHistoryIndex > 0 
        ? editHistory[currentHistoryIndex - 1].appliedText 
        : resumeExtractedText?.replace(historyItem.suggested, historyItem.original) || '';

      const updateResult = await updateResumeExtractedText(session.user.id, previousText);
      
      if (updateResult.success) {
        setResumeExtractedText(previousText);
        setEditableText(previousText);
        setCurrentHistoryIndex(currentHistoryIndex - 1);
      }
    } catch (error) {
      console.error('Error undoing edit:', error);
    } finally {
      setIsApplyingEdit(false);
    }
  };

  // Redo last undone edit
  const redoEdit = async () => {
    if (currentHistoryIndex === null || !editHistory || currentHistoryIndex >= editHistory.length - 1 || !session?.user?.id) return;

    setIsApplyingEdit(true);
    try {
      const historyItem = editHistory[currentHistoryIndex + 1];
      const updateResult = await updateResumeExtractedText(session.user.id, historyItem.appliedText);
      
      if (updateResult.success) {
        setResumeExtractedText(historyItem.appliedText);
        setEditableText(historyItem.appliedText);
        setCurrentHistoryIndex(currentHistoryIndex + 1);
      }
    } catch (error) {
      console.error('Error redoing edit:', error);
    } finally {
      setIsApplyingEdit(false);
    }
  };

  // Expose applyEdit function to parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).applyResumeEdit = applyEdit;
    }
  }, [resumeExtractedText, session?.user?.id, editHistory, currentHistoryIndex]);

  // Calculate undo/redo states
  const canUndo = useMemo(() => {
    return currentHistoryIndex !== null && currentHistoryIndex >= 0;
  }, [currentHistoryIndex]);

  const canRedo = useMemo(() => {
    return currentHistoryIndex !== null && editHistory && currentHistoryIndex < editHistory.length - 1;
  }, [currentHistoryIndex, editHistory]);

  if (!hasResume) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full flex items-center justify-center">
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Resume Uploaded
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Upload your resume to get personalized AI feedback and connect with similar peers.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiUpload className="w-4 h-4" />
            Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Current Resume
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={undoEdit}
                disabled={!canUndo || isApplyingEdit}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                title="Undo last edit"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={redoEdit}
                disabled={!canRedo || isApplyingEdit}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                title="Redo last edit"
              >
                <FiRotateCw className="w-4 h-4" />
              </button>
            </div>
            {resumeUpdatedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiCalendar className="w-3 h-3" />
                <span>
                  {new Date(resumeUpdatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-full flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 flex-shrink-0">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
              Extracted Text
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                {copied ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleEditToggle}
                disabled={isSaving || isApplyingEdit}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isEditing ? <FiX className="w-3 h-3" /> : <FiEdit3 className="w-3 h-3" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <FiSave className="w-3 h-3" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
              <p className="text-red-700 dark:text-red-300 text-xs">{error}</p>
            </div>
          )}

          {docxError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
              <p className="text-red-700 dark:text-red-300 text-xs">{docxError}</p>
            </div>
          )}

          {isApplyingEdit && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-blue-700 dark:text-blue-300 text-xs">Applying edit...</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isEditing ? (
              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full h-full p-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Edit the extracted text here..."
              />
            ) : (
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {resumeExtractedText}
              </div>
            )}
          </div>

          {/* Download DOCX Button at Bottom */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
            <button
              onClick={handleDownloadDOCX}
              disabled={isGeneratingDOCX}
              className={`w-full px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium ${
                isGeneratingDOCX 
                  ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isGeneratingDOCX ? (
                <FiCpu className="w-4 h-4 animate-spin" />
              ) : (
                <FiDownload className="w-4 h-4" />
              )}
              {isGeneratingDOCX ? (
                <span className="flex items-center">
                  AI thinking
                  <span className="flex ml-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </span>
              ) : (
                <span className="whitespace-nowrap flex-shrink-0 text-base md:text-sm lg:text-base">Download AI-formatted DOCX</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}