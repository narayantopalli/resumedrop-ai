"use client";

import { useState, useEffect, useRef } from "react";
import ResumeUpload from "@/components/upload/resume/ResumeUpload";
import ResumePreview from "@/components/upload/resume/ResumePreview";
import ResumeViewModal from "@/components/upload/resume/ResumeViewModal";
import { useSession } from '@/contexts/SessionContext';
import { uploadResume, deleteResume, updateResumeExtractedText, extractTextFromResume, extractTextFromFile } from '@/actions/resume';
import { updateUserResume } from '@/actions/profile';
import { validateResume } from '@/utils/resumeValidation';
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { session, userMetadata, setUserMetadata, resumeInfo, setResumeInfo, resumeExtractedText, setResumeExtractedText } = useSession();
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  
  // Text extraction states
  const [extractionError, setExtractionError] = useState<string | null>(null);

  useEffect(() => {
    setLocalPreviewUrl(resumeInfo?.url || null);
  }, [resumeInfo]);

  const handleView = () => {
    setShowViewModal(true);
  };

  const handleViewClose = () => {
    setShowViewModal(false);
  };

  const handleRemove = async () => {
    if (userMetadata?.resume_url) {
      try {
        await deleteResume(userMetadata.resume_url);
        if (session?.user?.id) {
          updateUserResume(session.user.id, "");
          const updateExtractedText = await updateResumeExtractedText(session.user.id, "", true);
          if (!updateExtractedText.success) {
            setError(updateExtractedText.error || 'Failed to save extracted text. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
    
    setResumeInfo(null);
    setLocalPreviewUrl(null);
    setSelectedResume(null);
    setFileName('');
    setResumeExtractedText(null);
    setExtractionError(null);
  };

  const handleTextSubmitted = async (text: string) => {
    // Clear any previous errors
    setError(null);
    setExtractionError(null);
    setIsUploading(true);
    
    try {
      // Create a TXT file from the pasted text
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `resume-text-${timestamp}.txt`;
      
      // Create a File object from the text
      const textFile = new File([text], fileName, { type: 'text/plain' });
      
      // Create preview immediately for better UX
      const textBlob = new Blob([text], { type: 'text/plain' });
      const preview = URL.createObjectURL(textBlob);
      setLocalPreviewUrl(preview);
      setSelectedResume(preview);
      setFileName(fileName);
      
      // Set the extracted text directly (no need to extract from TXT)
      setResumeExtractedText(text);
      setExtractionError(null);
      
      // Upload to Supabase storage using the same process as PDF/DOCX
      if (!session?.user?.id) {
        setError('Please sign in to upload a resume.');
        setIsUploading(false);
        return;
      }
      
      const uploadResult = await uploadResume(textFile, session.user.id);
      
      if (uploadResult.success && uploadResult.url) {
        // Update database using action function
        const updateResult = await updateUserResume(session.user.id, uploadResult.url);
        
        if (!updateResult.success) {
          setError(updateResult.error || 'Failed to save resume. Please try again.');
          // Revert preview on error
          setLocalPreviewUrl(resumeInfo?.url || null);
          setSelectedResume(resumeInfo?.url || null);
          setFileName('');
        } else {
          // Only now remove the old resume and update with new one
          if (userMetadata?.resume_url && userMetadata.resume_url !== uploadResult.url) {
            try {
              await deleteResume(userMetadata.resume_url);
            } catch (error) {
              console.error('Error deleting old resume:', error);
              // Don't fail the upload if old resume deletion fails
            }
          }
          const updateExtractedText = await updateResumeExtractedText(session.user.id, text, true);
          if (!updateExtractedText.success) {
            setError(updateExtractedText.error || 'Failed to save extracted text. Please try again.');
          }
          // Update local metadata
          if (userMetadata) {
            setUserMetadata({
              ...userMetadata,
              resume_url: uploadResult.url
            });
          }
          setResumeInfo({url: preview, updated_at: new Date().toISOString(), fileExt: 'txt'});
        }
      } else {
        setError(uploadResult.error || 'Failed to upload resume. Please try again.');
        // Revert preview on error
        setLocalPreviewUrl(resumeInfo?.url || null);
        setSelectedResume(resumeInfo?.url || null);
        setFileName('');
        setResumeExtractedText(null);
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      // Revert preview on error
      setLocalPreviewUrl(resumeInfo?.url || null);
      setSelectedResume(resumeInfo?.url || null);
      setFileName('');
      setResumeExtractedText(null);
    } finally {
      setIsUploading(false);
      router.push("/home");
    }
  };

  const handleResumeSelected = async (file: File) => {
    // Clear any previous errors
    setError(null);
    setIsUploading(true);

    try {
      // Validate resume first
      const validation = validateResume(file);
      if (!validation.isValid) {
        setError(validation.error!);
        setIsUploading(false);
        return;
      }

      // Create preview immediately for better UX
      const preview = URL.createObjectURL(file);
      setLocalPreviewUrl(preview);
      setSelectedResume(preview);
      setFileName(file.name);

      // Extract text from file
      const textResult = await extractTextFromFile(file);
      if (textResult.success && textResult.text) {
        setResumeExtractedText(textResult.text);
        setExtractionError(null);
      } else {
        setExtractionError(textResult.error || 'Failed to extract text from file');
      }

      // Upload to Supabase storage
      if (!session?.user?.id) {
        setError('Please sign in to upload a resume.');
        setIsUploading(false);
        return;
      }

      const uploadResult = await uploadResume(file, session.user.id);
      
      if (uploadResult.success && uploadResult.url) {
        // Update database using action function
        const updateResult = await updateUserResume(session.user.id, uploadResult.url);

        if (!updateResult.success) {
          setError(updateResult.error || 'Failed to save resume. Please try again.');
          // Revert preview on error
          setLocalPreviewUrl(resumeInfo?.url || null);
          setSelectedResume(resumeInfo?.url || null);
          setFileName('');
        } else {
          // Only now remove the old resume and update with new one
          if (userMetadata?.resume_url && userMetadata.resume_url !== uploadResult.url) {
            try {
              await deleteResume(userMetadata.resume_url);
            } catch (error) {
              console.error('Error deleting old resume:', error);
              // Don't fail the upload if old resume deletion fails
            }
          }
          const updateExtractedText = await updateResumeExtractedText(session.user.id, textResult.text || '', true);
          if (!updateExtractedText.success) {
            setError(updateExtractedText.error || 'Failed to save extracted text. Please try again.');
          }
          // Update local metadata
          if (userMetadata) {
            setUserMetadata({
              ...userMetadata,
              resume_url: uploadResult.url
            });
          }
          setResumeInfo({url: preview, updated_at: new Date().toISOString(), fileExt: file.name.split('.').pop() || ''});
        }
      } else {
        setError(uploadResult.error || 'Failed to upload resume. Please try again.');
        // Revert preview on error
        setLocalPreviewUrl(resumeInfo?.url || null);
        setSelectedResume(resumeInfo?.url || null);
        setFileName('');
        setResumeExtractedText(null);
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      // Revert preview on error
      setLocalPreviewUrl(resumeInfo?.url || null);
      setSelectedResume(resumeInfo?.url || null);
      setFileName('');
      setResumeExtractedText(null);
    } finally {
      setIsUploading(false);
      router.push("/home");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <ResumeUpload 
          error={error} 
          setError={setError} 
          onResumeSelected={handleResumeSelected}
          onTextSubmitted={handleTextSubmitted}
          setLocalPreviewUrl={setLocalPreviewUrl}
        />

        {/* Display Section */}
        <ResumePreview 
          selectedResume={localPreviewUrl || selectedResume}
          onView={handleView}
          onRemove={handleRemove}
          fileName={fileName}
          updatedAt={resumeInfo?.updated_at || null}
          name={userMetadata?.name || ''}
          fileExt={resumeInfo?.fileExt || null}
          extractedText={resumeExtractedText}
        />
      </div>

      {/* Text Extraction Section */}
      {(localPreviewUrl || selectedResume) && resumeExtractedText !== null && (
        <div className="mt-8 bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white flex items-center gap-2">
              <FiFileText className="w-5 h-5" />
              Text Extraction
            </h3>
          </div>

          {extractionError && (
            <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
                <p className="text-error-700 dark:text-error-300 text-sm">{extractionError}</p>
              </div>
            </div>
          )}

          {resumeExtractedText && (
            <div className="space-y-4">              
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 sm:p-4 max-h-64 sm:max-h-96 overflow-y-auto">
                <pre className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-mono leading-relaxed">
                  {resumeExtractedText}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (localPreviewUrl || selectedResume) && (
        <ResumeViewModal
          resumeUrl={localPreviewUrl || selectedResume!}
          onClose={handleViewClose}
          fileName={fileName}
          name={userMetadata?.name || ''}
          updatedAt={resumeInfo?.updated_at || null}
          fileExt={resumeInfo?.fileExt || null}
        />
      )}

      {/* Uploading overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-primary-900 dark:text-white">Uploading resume...</p>
          </div>
        </div>
      )}
    </>
  );
} 