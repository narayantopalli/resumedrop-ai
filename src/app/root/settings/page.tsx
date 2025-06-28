"use client";

import Settings from "@/components/settings/Settings";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
      <div className="mb-4 text-center">
        <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-primary-900 dark:text-white">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 xl:text-lg 2xl:text-xl">
          Manage your profile, password, and account settings
        </p>
      </div>
      
      <Settings />
    </div>
  );
} 