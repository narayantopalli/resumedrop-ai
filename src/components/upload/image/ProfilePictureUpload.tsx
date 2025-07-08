"use client";

import { useRef, useState, useEffect } from "react";
import { FiUpload, FiAlertCircle, FiUser, FiX, FiCamera } from "react-icons/fi";
import { uploadProfilePicture, deleteProfilePicture } from "@/actions/storage";
import Spinner from "@/components/Spinner";
import Avatar from "@/components/Avatar";
import { validateImage } from "@/utils/imageValidation";

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string | null;
  setCurrentAvatarUrl: any;
  onAvatarUpdate: (avatarUrl: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  userName?: string;
  userId: string;
  avatar_public_url: string | null;
}

export default function ProfilePictureUpload({ 
  currentAvatarUrl,
  setCurrentAvatarUrl,
  onAvatarUpdate,
  error, 
  setError,
  userName,
  userId,
  avatar_public_url
}: ProfilePictureUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update previewUrl when currentAvatarUrl changes
  useEffect(() => {
    setPreviewUrl(currentAvatarUrl || null);
  }, [currentAvatarUrl]);

  const handleImageUpload = async (file: File) => {
    // Clear any previous errors
    setError(null);
    setIsUploading(true);

    try {
      // Validate image
      const validation = validateImage(file);
      if (!validation.isValid) {
        setError(validation.error!);
        setIsUploading(false);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Supabase storage
      const uploadResult = await uploadProfilePicture(file, userId);
      
      if (uploadResult.success && uploadResult.url) {
        // Delete old profile picture if it exists
        if (avatar_public_url && avatar_public_url !== uploadResult.url) {
          await deleteProfilePicture(avatar_public_url);
        }
        setCurrentAvatarUrl(preview);
        // Update parent component
        onAvatarUpdate(uploadResult.url);
      } else {
        setError(uploadResult.error || 'Failed to upload image. Please try again.');
        // Revert preview on error
        setPreviewUrl(currentAvatarUrl || null);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      // Revert preview on error
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
      handleImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    if (avatar_public_url) {
      try {
        await deleteProfilePicture(avatar_public_url);
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
    }
    
    // Clear preview and update parent
    setPreviewUrl(null);
    onAvatarUpdate(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-primary-900 dark:text-white">Profile Picture</h4>
      </div>

      {/* Current/Preview Image */}
      {previewUrl && (
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <Avatar
              src={previewUrl}
              name={userName}
              size="xl"
              className="w-40 h-40"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Spinner size="sm" />
              </div>
            )}
          </div>
          <button
            onClick={handleRemoveImage}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md transition-all duration-200 hover:border-red-300 dark:hover:border-red-700"
          >
            <FiX className="w-4 h-4" />
            <span>Remove Picture</span>
          </button>
        </div>  
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-3">
          {previewUrl ? (
            <FiCamera className="mx-auto h-8 w-8 text-primary-500" />
          ) : (
            <FiUser className="mx-auto h-8 w-8 text-neutral-400" />
          )}
          
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {previewUrl 
                ? "Click to change your profile picture" 
                : "Drag and drop an image here, or click to select"
              }
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              PNG, JPG, GIF, WebP up to 5MB
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload className="w-4 h-4 mr-2" />
                {previewUrl ? "Change Picture" : "Upload Picture"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <FiAlertCircle className="h-4 w-4 text-error-400 mr-2" />
            <p className="text-sm text-error-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 