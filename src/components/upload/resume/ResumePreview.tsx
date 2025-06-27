"use client";

import { useState } from "react";
import { FiFileText, FiX, FiType, FiEye, FiDownload } from "react-icons/fi";
import ResumeViewModal from "./ResumeViewModal";

interface ResumePreviewProps {
  selectedResume: string | null;
  onView?: () => void;
  onRemove: () => void;
  fileName?: string;
  updatedAt: string | null;
  name: string;
  fileExt: string | null;
  extractedText?: string | null;
}

export default function ResumePreview({ selectedResume, onRemove, fileName, updatedAt, name, fileExt, extractedText }: ResumePreviewProps) {
  const [showViewModal, setShowViewModal] = useState(false);

  const handleView = () => {
    setShowViewModal(true);
  };

  const handleViewClose = () => {
    setShowViewModal(false);
  };

  const handleDownload = () => {
    if (!selectedResume) return;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = selectedResume;
    link.download = fileName || `${name} Resume${fileExt ? `.${fileExt}` : ''}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">
            Document Preview
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Your last uploaded document
          </p>
        </div>

        {selectedResume ? (
          <div className="space-y-6">
            {/* File Preview Card */}
            <div className="mx-10 relative bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-800/30 rounded-xl p-6 border-2 border-dashed border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 transition-colors duration-200">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiFileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white mb-1 line-clamp-2">
                    {fileName || `${name} Resume${fileExt ? `.${fileExt}` : ''}`}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    {fileExt ? `${fileExt.toUpperCase()} Document` : 'Document'}
                  </p>
                  {updatedAt && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      Updated {new Date(updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleView}
                  className="group px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <FiEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  View
                </button>
                <button
                  onClick={onRemove}
                  className="group px-4 py-3 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <FiX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Remove
                </button>
              </div>
              
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={handleDownload}
                  className="w-full group px-4 py-2.5 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <FiDownload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Download Document
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              No Document Uploaded
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Upload a resume or paste text to see a preview here
            </p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedResume && (
        <ResumeViewModal
          resumeUrl={selectedResume}
          onClose={handleViewClose}
          fileName={fileName}
          name={name}
          updatedAt={updatedAt}
          fileExt={fileExt}
          extractedText={extractedText}
        />
      )}
    </div>
  );
} 