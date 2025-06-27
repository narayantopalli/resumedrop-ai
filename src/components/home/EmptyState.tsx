import Link from 'next/link';
import ToggleSwitch from './ToggleSwitch';

interface EmptyStateProps {
  title?: string;
  icon: 'user' | 'lock';
  heading: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  showToggle?: boolean;
  isPublic?: boolean;
  onToggle?: () => void;
  isUpdating?: boolean;
}

export default function EmptyState({
  title,
  icon,
  heading,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'user':
        return (
          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'lock':
        return (
          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full max-h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      {title && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
      )}
      
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {heading}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
          {description}
        </p>
        
        {actionText && actionHref && (
          <Link 
            href={actionHref}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
} 