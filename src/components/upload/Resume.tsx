"use client";

import { useState, useEffect, useRef } from "react";
import ResumeUpload from "@/components/upload/resume/ResumeUpload";
import ResumePreview from "@/components/upload/resume/ResumePreview";
import ResumeViewModal from "@/components/upload/resume/ResumeViewModal";
import { useSession } from '@/contexts/SessionContext';
import { uploadResume, deleteResume, updateResumeExtractedHtml, extractTextFromResume, extractTextFromFile } from '@/actions/resume';
import { updateUserResume } from '@/actions/profile';
import { validateResume } from '@/utils/resumeValidation';
import { plainTextToHtml } from '@/actions/html';
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Cycling placeholders for upload processing state
const uploadPlaceholders = [
  "Analyzing your resume... 📊",
  "Extracting text content... 📝",
  "Processing document format... 📄",
  "Optimizing for storage... 💾",
  "Generating preview... 👀",
  "Saving to database... 🗄️",
  "Almost done... ⚡",
  "Finalizing upload... ✨"
];

export default function ResumePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { session, userMetadata, setUserMetadata, resumeInfo, setResumeInfo, resumeExtractedHtml, setResumeExtractedHtml } = useSession();
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  
  // Text extraction states
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Loading animation states
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  useEffect(() => {
    setLocalPreviewUrl(resumeInfo?.url || null);
  }, [resumeInfo]);

  // Cycling placeholder effect for upload animation
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setCurrentPlaceholderIndex((prev) => {
          // Stop cycling after reaching the last placeholder
          if (prev >= uploadPlaceholders.length - 1) {
            clearInterval(interval);
            return prev; // Keep the last placeholder
          }
          return prev + 1;
        });
      }, 1000); // Change placeholder every 3 seconds

      return () => clearInterval(interval);
    } else {
      setCurrentPlaceholderIndex(0);
    }
  }, [isUploading]);

  // Helper function to convert File to base64
  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Store additional metadata with the base64 string
        const fileData = {
          base64: base64String,
          name: file.name,
          type: file.type,
          size: file.size
        };
        resolve(JSON.stringify(fileData));
      };
      reader.onerror = error => reject(error);
    });
  };



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
          const updateExtractedText = await updateResumeExtractedHtml(session.user.id, "", true);
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
    setResumeExtractedHtml(null);
    setExtractionError(null);
  };

  const handleTextSubmitted = async (text: string) => {
    // Clear any previous errors
    setError(null);
    setExtractionError(null);
    setIsUploading(true);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('resumeText', text);
      console.log(text);
    }

    if (!session) {
      router.push('/sign-in');
      return;
    }
    
    try {
      // Convert plain text to HTML
      let htmlContent = text;
      try {
        const convertedHtml = await plainTextToHtml(text);
        if (convertedHtml) {
          htmlContent = convertedHtml;
        } else {
          setError('Failed to convert text to HTML format. Please try again.');
          setIsUploading(false);
          return;
        }
      } catch (htmlError) {
        console.error('HTML conversion error:', htmlError);
        setError('Failed to convert text to HTML format. Please try again.');
        setIsUploading(false);
        return;
      }
      
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
      
      // Set the extracted text as HTML
      setResumeExtractedHtml(htmlContent);
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
          const updateExtractedText = await updateResumeExtractedHtml(session.user.id, htmlContent, true);
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
        setResumeExtractedHtml(null);
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      // Revert preview on error
      setLocalPreviewUrl(resumeInfo?.url || null);
      setSelectedResume(resumeInfo?.url || null);
      setFileName('');
      setResumeExtractedHtml(null);
    } finally {
      setIsUploading(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedResume');
        localStorage.removeItem('resumeText');
      }
      router.push("/home");
    }
  };

  const handleResumeSelected = async (file: File) => {
    // Clear any previous errors
    setError(null);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const base64Data = await fileToBase64(file);
        localStorage.setItem('selectedResume', base64Data);
        console.log('File saved as base64:', file.name);
      } catch (error) {
        console.error('Error saving file to localStorage:', error);
      }
    }

    if (!session) {
      router.push('/sign-in');
      return;
    }

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
        setResumeExtractedHtml(textResult.text);
        setExtractionError(null);
      } else {
        setExtractionError(textResult.error || 'Failed to extract text from file');
        setError(textResult.error || 'Failed to extract text from file');
        setIsUploading(false);
        return;
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
          const updateExtractedText = await updateResumeExtractedHtml(session.user.id, textResult.text || '', true);
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
        setResumeExtractedHtml(null);
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      // Revert preview on error
      setLocalPreviewUrl(resumeInfo?.url || null);
      setSelectedResume(resumeInfo?.url || null);
      setFileName('');
      setResumeExtractedHtml(null);
    } finally {
      setIsUploading(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedResume');
        localStorage.removeItem('resumeText');
      }
      router.push("/home");
    }
  };

  useEffect(() => {
    if (!session) return;
    const resumeText = localStorage.getItem('resumeText');
    console.log('resumeText', resumeText);
    if (resumeText) {
      handleTextSubmitted(resumeText);
    }
  }, []);

  // Helper function to convert base64 back to File
  const base64ToFile = async (base64Data: string): Promise<File | null> => {
    try {
      const fileData = JSON.parse(base64Data);
      const base64String = fileData.base64;
      
      // Convert base64 to blob
      const response = await fetch(base64String);
      const blob = await response.blob();
      
      // Create new File object with original metadata
      return new File([blob], fileData.name, { type: fileData.type });
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!session) return;
    const selectedResume = localStorage.getItem('selectedResume');
    console.log('selectedResume', selectedResume);
    if (selectedResume) {
      base64ToFile(selectedResume).then(file => {
        if (file) {
          handleResumeSelected(file);
        }
      });
    }
  }, []);

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
          extractedText={resumeExtractedHtml}
        />
      </div>

      {/* Text Extraction Section */}
      {(localPreviewUrl || selectedResume) && resumeExtractedHtml !== null && (
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

          {resumeExtractedHtml && (
            <div className="space-y-4">              
              <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 max-h-64 sm:max-h-96 overflow-y-auto">
                <div 
                  className="text-sm text-neutral-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: resumeExtractedHtml }}
                />
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
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 flex flex-col items-center gap-6 w-96 mx-4">
            {/* Animated spinner with gradient */}
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-secondary-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            {/* Engaging message */}
            <div className="text-center">
              <p className="text-primary-900 dark:text-white text-lg font-medium mb-2">
                {uploadPlaceholders[currentPlaceholderIndex]}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                This will only take a moment...
              </p>
            </div>
            
            {/* Progress dots */}
            <div className="flex space-x-2">
              {uploadPlaceholders.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPlaceholderIndex
                      ? 'bg-primary-600 scale-125'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 