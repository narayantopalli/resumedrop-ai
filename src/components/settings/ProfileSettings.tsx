"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { FiUser, FiCalendar, FiMessageCircle, FiCheck, FiX, FiPhone, FiMail, FiInstagram, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";
import { updateUserAvatar, updateUserProfile } from "@/actions/profile";
import ProfilePictureUpload from "@/components/upload/image/ProfilePictureUpload";

interface ProfileSettingsProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

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

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-6">Profile Settings</h3>
      
      {/* Profile Picture Section */}
      <div className="mb-8">
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

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Basic Profile Information */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              id="name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <h4 className="text-md font-semibold text-primary-900 dark:text-white mb-4">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="tel"
                  id="phone"
                  name="contactInfo.phone"
                  value={profileForm.contactInfo.phone}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  id="email"
                  name="contactInfo.email"
                  value={profileForm.contactInfo.email}
                  readOnly
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-neutral-100 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Instagram Handle
              </label>
              <div className="relative">
                <FiInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  id="instagram"
                  name="contactInfo.instagram"
                  value={profileForm.contactInfo.instagram}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Twitter Handle
              </label>
              <div className="relative">
                <FiTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  id="twitter"
                  name="contactInfo.twitter"
                  value={profileForm.contactInfo.twitter}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                LinkedIn Profile
              </label>
              <div className="relative">
                <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  id="linkedin"
                  name="contactInfo.linkedin"
                  value={profileForm.contactInfo.linkedin}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Github Profile
              </label>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  id="github"
                  name="contactInfo.github"
                  value={profileForm.contactInfo.github}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
} 