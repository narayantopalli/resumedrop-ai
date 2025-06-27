'use client';

import { FiX, FiPhone, FiMail, FiInstagram, FiTwitter, FiLinkedin, FiUser, FiGithub } from "react-icons/fi";
import Avatar from "../Avatar";

interface ContactInfo {
  phone?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    avatar_url: string;
    contactInfo?: ContactInfo;
  };
}

export default function ContactModal({ isOpen, onClose, profile }: ContactModalProps) {
  if (!isOpen) return null;

  const contactInfo = profile.contactInfo || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar
              src={profile.avatar_url}
              name={profile.name}
              size="md"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact Information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Email */}
          {contactInfo.email && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {contactInfo.email}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {contactInfo.phone && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiPhone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {contactInfo.phone}
                </p>
              </div>
            </div>
          )}

          {/* Instagram */}
          {contactInfo.instagram && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiInstagram className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Instagram</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  @{contactInfo.instagram}
                </p>
              </div>
            </div>
          )}

          {/* Twitter */}
          {contactInfo.twitter && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiTwitter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Twitter</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  @{contactInfo.twitter}
                </p>
              </div>
            </div>
          )}

          {/* LinkedIn */}
          {contactInfo.linkedin && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiLinkedin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">LinkedIn</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {contactInfo.linkedin}
                </p>
              </div>
            </div>
          )}

          {/* Github */}
          {contactInfo.github && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiGithub className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Github</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {contactInfo.github}
                </p>
              </div>
            </div>
          )}

          {/* No contact info available */}
          {!contactInfo.email && !contactInfo.phone && !contactInfo.instagram && !contactInfo.twitter && !contactInfo.linkedin && !contactInfo.github && (
            <div className="text-center py-8">
              <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No contact information available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 