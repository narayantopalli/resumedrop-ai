"use client";

import Settings from "@/components/settings/Settings";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your profile, password, and account settings
        </p>
      </div>
      
      <Settings />
    </div>
  );
} 