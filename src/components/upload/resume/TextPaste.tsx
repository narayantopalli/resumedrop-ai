"use client";

import { useState } from "react";
import { FiFileText, FiAlertCircle, FiCopy, FiUpload } from "react-icons/fi";

interface TextPasteProps {
  setError: (error: string | null) => void;
  onTextSubmitted?: (text: string) => void;
}

export default function TextPaste({ setError, onTextSubmitted }: TextPasteProps) {
  const [pastedText, setPastedText] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedText(text);
    
    // Clear any previous errors
    setError(null);
    
    // Validate text length (minimum 50 characters)
    const isValidText = text.trim().length >= 50;
    setIsValid(isValidText);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text');
    if (pastedData) {
      setPastedText(pastedData);
      setError(null);
      
      const isValidText = pastedData.trim().length >= 50;
      setIsValid(isValidText);
    }
  };

  const handleClear = () => {
    setPastedText("");
    setIsValid(false);
    setError(null);
  };

  const handleUpload = async () => {
    if (!isValid || !pastedText.trim()) {
      setError('Please enter at least 50 characters before uploading.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      if (onTextSubmitted) {
        await onTextSubmitted(pastedText.trim());
      }
    } catch (err) {
      setError('Failed to upload text. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 h-80 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="relative flex-1">
            <textarea
              value={pastedText}
              onChange={handleTextChange}
              onPaste={handlePaste}
              placeholder="Paste your resume here... (minimum 50 characters)"
              className={`w-full h-full p-4 border rounded-lg resize-none transition-colors ${
                isValid
                  ? 'border-success-300 dark:border-success-600 bg-success-50 dark:bg-success-900/20'
                  : pastedText.length > 0
                  ? 'border-warning-300 dark:border-warning-600 bg-warning-50 dark:bg-warning-900/20'
                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900'
              } focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400 text-neutral-900 dark:text-white`}
            />
            
            {pastedText.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">
              {pastedText.length} characters
            </span>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!isValid || isUploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-neutral-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 