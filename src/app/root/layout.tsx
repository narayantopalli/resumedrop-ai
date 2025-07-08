"use client";

import { ReactNode } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import Logo from "@/components/Logo";
import { useScrollDirection } from "@/hooks/useScrollDirection";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isVisible } = useScrollDirection();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-8xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
            </div>
            
            {/* Hamburger Menu with User Profile */}
            <HamburgerMenu />
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="max-w-7xl xl:max-w-8xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-1 pb-16">
        {children}
      </main>
    </div>
  );
}
