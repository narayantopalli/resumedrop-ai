"use client";

import { FiX, FiFileText } from "react-icons/fi";

interface ResumeViewModalProps {
  resumeUrl: string;
  onClose: () => void;
  fileName?: string;
  name: string;
  updatedAt: string | null;
  fileExt: string | null;
  extractedText?: string | null;
}

export default function ResumeViewModal({ resumeUrl, onClose, fileName, name, updatedAt, fileExt, extractedText }: ResumeViewModalProps) {
  const isDocx = fileExt?.toLowerCase() === 'docx';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-4xl w-full h-full flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white">
              {fileName || `${name} Resume${updatedAt ? ` - ${new Date(updatedAt).toLocaleDateString()}` : ''}${fileExt ? `.${fileExt}` : ''}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
        
        <div className="flex-1 min-h-0 p-6">
          <div className="w-full h-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            {isDocx ? (
              <div className="w-full h-full bg-white dark:bg-neutral-900 p-6 overflow-y-auto">
                {extractedText ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div 
                      className="font-sans text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: extractedText }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-neutral-600 dark:text-neutral-400">
                      <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No text content available</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <iframe
                src={resumeUrl}
                className="w-full h-full"
                title="Resume Preview"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 