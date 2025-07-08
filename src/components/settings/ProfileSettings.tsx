"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { FiUser, FiCalendar, FiMessageCircle, FiCheck, FiX, FiPhone, FiMail, FiInstagram, FiTwitter, FiLinkedin, FiGithub, FiEye, FiEyeOff } from "react-icons/fi";
import { updateUserAvatar, updateUserProfile, updateUserIsPublic } from "@/actions/profile";
import ProfilePictureUpload from "@/components/upload/image/ProfilePictureUpload";

interface ProfileSettingsProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

// Toggle Switch Component
const ToggleSwitch = ({ 
  isOn, 
  onToggle, 
  disabled = false 
}: { 
  isOn: boolean; 
  onToggle: () => void; 
  disabled?: boolean;
}) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
      isOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        isOn ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function ProfileSettings({ onMessage }: ProfileSettingsProps) {
  const { userMetadata, session, setUserMetadata, avatarUrl, setAvatarUrl } = useSession();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    contactInfo: {
      phone: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      email: "",
      github: ""
    }
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (userMetadata) {
      setProfileForm({
        name: userMetadata.name || "",
        contactInfo: {
          phone: userMetadata.contactInfo?.phone || "",
          instagram: userMetadata.contactInfo?.instagram || "",
          twitter: userMetadata.contactInfo?.twitter || "",
          linkedin: userMetadata.contactInfo?.linkedin || "",
          email: userMetadata.email || "",
          github: userMetadata.contactInfo?.github || ""
        }
      });
    }
  }, [userMetadata]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const contactField = name.split('.')[1];
      setProfileForm(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value,
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string | null) => {
    if (!session?.user?.id) return;

    try {
      const result = await updateUserAvatar(session.user.id, avatarUrl || "");
      if (result.success) {
        // Update local user metadata
        setUserMetadata({
          ...userMetadata,
          avatar_url: avatarUrl
        });
        onMessage({ type: "success", text: "Profile picture updated!" });
      } else {
        setAvatarError(result.error || "Failed to update profile picture");
      }
    } catch (error) {
      console.error(error);
      setAvatarError("An unexpected error occurred");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create update object without email since it's read-only
      const updateData = {
        name: profileForm.name,
        contactInfo: {
          phone: profileForm.contactInfo.phone,
          instagram: profileForm.contactInfo.instagram,
          twitter: profileForm.contactInfo.twitter,
          linkedin: profileForm.contactInfo.linkedin,
          email: userMetadata?.email,
          github: profileForm.contactInfo.github
        }
      };

      const result = await updateUserProfile(session?.user?.id!, updateData);
      
      if (result.success) {
        onMessage({ type: "success", text: "Profile updated successfully!" });
        // Update local user metadata
        setUserMetadata({
          ...userMetadata,
          name: profileForm.name,
          contactInfo: {
            ...userMetadata?.contactInfo,
            phone: profileForm.contactInfo.phone,
            instagram: profileForm.contactInfo.instagram,
            twitter: profileForm.contactInfo.twitter,
            linkedin: profileForm.contactInfo.linkedin,
            github: profileForm.contactInfo.github
          },
        });
      } else {
        onMessage({ type: "error", text: result.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error(error);
      onMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = async () => {
    if (!session?.user?.id || isUpdatingPrivacy) return;
    
    setIsUpdatingPrivacy(true);
    try {
      const newIsPublic = !userMetadata?.isPublic;
      const result = await updateUserIsPublic(session.user.id, newIsPublic);
      
      if (result.success) {
        setUserMetadata({
          ...userMetadata,
          isPublic: newIsPublic
        });
        onMessage({ 
          type: "success", 
          text: `Profile is now ${newIsPublic ? 'open' : 'private'}` 
        });
      } else {
        onMessage({ type: "error", text: result.error || "Failed to update privacy setting" });
      }
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      onMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 xl:p-8 2xl:p-10">
      <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-primary-900 dark:text-white mb-6 xl:mb-8">Profile Settings</h3>
      
      {/* Profile Picture Section */}
      <div className="mb-8 xl:mb-10">
        <ProfilePictureUpload
          currentAvatarUrl={avatarUrl}
          setCurrentAvatarUrl={setAvatarUrl}
          onAvatarUpdate={handleAvatarUpdate}
          error={avatarError}
          setError={setAvatarError}
          userName={userMetadata?.name}
          userId={session?.user.id!}
          avatar_public_url={userMetadata?.avatar_url}
        />
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6 xl:space-y-8">
        {/* Basic Profile Information */}
        <div>
          <label htmlFor="name" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
            Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
            <input
              type="text"
              id="name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 xl:pt-8">
          <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-primary-900 dark:text-white mb-4 xl:mb-6">Contact Information</h4>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="tel"
                  id="phone"
                  name="contactInfo.phone"
                  value={profileForm.contactInfo.phone}
                  onChange={handleProfileChange}
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="text"
                  id="email"
                  name="contactInfo.email"
                  value={profileForm.contactInfo.email}
                  readOnly
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-neutral-100 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed xl:text-lg"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                Instagram Handle
              </label>
              <div className="relative">
                <FiInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="text"
                  id="instagram"
                  name="contactInfo.instagram"
                  value={profileForm.contactInfo.instagram}
                  onChange={handleProfileChange}
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                Twitter Handle
              </label>
              <div className="relative">
                <FiTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="text"
                  id="twitter"
                  name="contactInfo.twitter"
                  value={profileForm.contactInfo.twitter}
                  onChange={handleProfileChange}
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                LinkedIn Profile
              </label>
              <div className="relative">
                <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="text"
                  id="linkedin"
                  name="contactInfo.linkedin"
                  value={profileForm.contactInfo.linkedin}
                  onChange={handleProfileChange}
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="github" className="block text-sm xl:text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1 xl:mb-2">
                Github Profile
              </label>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 xl:w-5 xl:h-5" />
                <input
                  type="text"
                  id="github"
                  name="contactInfo.github"
                  value={profileForm.contactInfo.github}
                  onChange={handleProfileChange}
                  className="w-full pl-10 xl:pl-12 pr-3 py-2 xl:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white xl:text-lg"
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 xl:pt-8">
          <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-primary-900 dark:text-white mb-4 xl:mb-6">Privacy Settings</h4>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 xl:p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 xl:gap-4">
                {userMetadata?.isPublic ? (
                  <FiEye className="w-5 h-5 xl:w-6 xl:h-6 text-green-500" />
                ) : (
                  <FiEyeOff className="w-5 h-5 xl:w-6 xl:h-6 text-red-500" />
                )}
                <div>
                  <h5 className="font-medium text-primary-900 dark:text-white xl:text-lg">
                    Profile Visibility
                  </h5>
                  <p className="text-sm xl:text-base text-neutral-600 dark:text-neutral-400">
                    {userMetadata?.isPublic 
                      ? "Your profile is open and visible to other students" 
                      : "Your profile is private and hidden from other students"
                    }
                  </p>
                </div>
              </div>
              <ToggleSwitch 
                isOn={userMetadata?.isPublic || false} 
                onToggle={handlePrivacyToggle}
                disabled={isUpdatingPrivacy}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 xl:py-3 px-4 xl:px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors xl:text-lg xl:font-medium"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
} 