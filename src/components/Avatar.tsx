"use client";

import { FiUser } from "react-icons/fi";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ 
  src, 
  alt = "Profile", 
  name, 
  size = "md",
  className = "" 
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm", 
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  if (name) {
    return (
      <div className={`rounded-full bg-primary-600 text-white flex items-center justify-center font-medium ${sizeClasses[size]} ${className}`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <FiUser className="w-1/2 h-1/2 text-gray-600 dark:text-gray-400" />
    </div>
  );
} 