"use client";

import { useState } from "react";
import { FiUser, FiLock, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import ProfileSettings from "./ProfileSettings";
import PasswordSettings from "./PasswordSettings";
import DeleteAccountSettings from "./DeleteAccountSettings";

export default function Settings() {
  // UI state
  const [activeSection, setActiveSection] = useState("profile");
  
  // Messages
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMessage = (message: { type: "success" | "error"; text: string }) => {
    setMessage(message);
  };

  const sections = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "password", label: "Password", icon: FiLock },
    { id: "delete", label: "Delete Account", icon: FiTrash2 },
  ];

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-success-50 text-success-800 border border-success-200" 
            : "bg-error-50 text-error-800 border border-error-200"
        }`}>
          {message.type === "success" ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-white dark:bg-neutral-800 p-1 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => {setActiveSection(section.id); setMessage(null)}}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 sm:flex-1 xl:px-6 2xl:px-8 ${
                isActive
                  ? "bg-secondary-600 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}
            >
              <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
              <span style={{ whiteSpace: 'nowrap' }}>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <ProfileSettings onMessage={handleMessage} />
      )}

      {/* Password Section */}
      {activeSection === "password" && (
        <PasswordSettings onMessage={handleMessage} />
      )}

      {/* Delete Account Section */}
      {activeSection === "delete" && (
        <DeleteAccountSettings onMessage={handleMessage} />
      )}
    </div>
  );
} 