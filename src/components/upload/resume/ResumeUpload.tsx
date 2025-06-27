"use client";

import { useRef, useState } from "react";
import { FiUpload, FiAlertCircle, FiFileText, FiType } from "react-icons/fi";
import { validateResume } from "@/utils/resumeValidation";
import TextPaste from "./TextPaste";

interface ResumeUploadProps {
  error: string | null;
  setError: (error: string | null) => void;
  onResumeSelected?: (file: File) => void;
  onTextSubmitted?: (text: string) => void;
  setLocalPreviewUrl: (url: string | null) => void;
}

type UploadMode = 'file' | 'text';

export default function ResumeUpload({ error, setError, onResumeSelected, onTextSubmitted, setLocalPreviewUrl }: ResumeUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (file: File) => {
    // Clear any previous errors and messages
    setError(null);

    try {
      // Validate the resume file
      const validation = validateResume(file);
      
      if (!validation.isValid) {
        setError(validation.error!);
        return;
      }
  
      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(blobUrl);
      
      // Trigger callback if provided
      if (onResumeSelected) {
        onResumeSelected(file);
      }
    } catch (err) {
      console.error('Error in handleResumeUpload:', err);
      setError('Failed to load resume. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextSubmitted = (text: string) => {
    if (onTextSubmitted) {
      onTextSubmitted(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-1 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
        <div className="flex">
          <button
            onClick={() => setUploadMode('file')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'file'
                ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FiFileText className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setUploadMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'text'
                ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FiType className="w-4 h-4" />
            Paste Text
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      {uploadMode === 'file' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 h-80 hover:shadow-lg transition-all duration-300">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors h-full flex flex-col justify-center ${
              isDragOver
                ? 'border-secondary-400 bg-secondary-50 dark:bg-secondary-900/20'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-secondary-300 dark:hover:border-secondary-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                  <FiFileText className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-primary-900 dark:text-white">
                  Drop your resume here
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  or click to browse files
                </p>
              </div>
              
              <button
                onClick={handleButtonClick}
                className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <FiUpload className="w-4 h-4" />
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Paste Section */}
      {uploadMode === 'text' && (
        <TextPaste 
          error={error} 
          setError={setError} 
          onTextSubmitted={handleTextSubmitted}
        />
      )}

      {error && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-error-500 flex-shrink-0" />
            <p className="text-error-700 dark:text-error-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Requirements */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">
          Upload Requirements
        </h3>
        <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
            <span>Supported formats: DOCX, PDF, TXT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
            <span>Maximum file size: 5MB</span>
          </div>
        </div>
      </div>
    </div>
  );
} 