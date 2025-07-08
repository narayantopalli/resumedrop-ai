"use client";

import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import Logo from "@/components/Logo";
import useDarkMode from "@/hooks/useDarkMode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-800 flex">
      {/* Dark mode toggle - positioned absolutely */}
      {mounted && (
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 z-50 p-2 rounded-md text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-100 to-secondary-50 dark:from-primary-900 dark:to-secondary-900 flex-col justify-center items-center px-12">
        <div className="max-w-md text-center text-neutral-800 dark:text-neutral-200">
          <div className="mb-2">
            <Logo size="lg" className="justify-center" />
          </div>
          <p className="text-xl mb-8 text-primary-700 dark:text-primary-300">
            The ultimate platform for college networking!
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 dark:bg-primary-200 rounded-full"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Discover opportunities for you on campus</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 dark:bg-primary-200 rounded-full"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Build skills that will land you your dream internship</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 dark:bg-primary-200 rounded-full"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Get instant resume improvements based on industry standards</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 dark:bg-primary-200 rounded-full"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Connect with peers who have similar interests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 my-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mb-2">
              <Logo size="md" className="justify-center" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              The ultimate platform for college networking!
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 