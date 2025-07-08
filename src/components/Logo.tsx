'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  // Show a placeholder during SSR and before hydration
  if (!mounted) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div 
          className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
          style={{
            width: size === 'sm' ? 24 : size === 'md' ? 32 : 48,
            height: size === 'sm' ? 24 : size === 'md' ? 32 : 48
          }}
        />
        {showText && (
          <div className={`h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${textSizes[size]}`} style={{ width: '120px' }} />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="ResumeDrop AI Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
        className={`${sizeClasses[size]} flex-shrink-0 dark:hidden rounded-full`}
      />
      <Image
        src="/logo-dark.png"
        alt="ResumeDrop AI Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
        className={`${sizeClasses[size]} flex-shrink-0 hidden dark:block rounded-full`}
      />
      {showText && (
        <h1 className={`font-semibold text-secondary-600 dark:text-secondary-400 ${textSizes[size]}`}>
          resumedrop.ai
        </h1>
      )}
    </div>
  );
} 