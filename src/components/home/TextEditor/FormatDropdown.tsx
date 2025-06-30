import { FiChevronDown } from "react-icons/fi";
import { useEffect, useRef } from "react";

interface FormatDropdownProps {
  currentFormat: string;
  formatOptions: Array<{ value: string; label: string }>;
  onFormatChange: (tagName: string) => void;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export default function FormatDropdown({ 
  currentFormat, 
  formatOptions, 
  onFormatChange, 
  isOpen, 
  onToggle 
}: FormatDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentFormatLabel = formatOptions.find(opt => opt.value === currentFormat)?.label || 'Paragraph';

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.bottom + 4; // 4px margin
      const left = rect.left;
      
      document.documentElement.style.setProperty('--dropdown-top', `${top}px`);
      document.documentElement.style.setProperty('--dropdown-left', `${left}px`);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex-shrink-0 format-dropdown" data-format-dropdown style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-200"
        title="Text Format"
      >
        <span className="hidden sm:inline">{currentFormatLabel}</span>
        <span className="sm:hidden">Format</span>
        <FiChevronDown className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div 
          className="fixed flex flex-col justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-xl z-[9999] py-1"
          style={{
            top: 'var(--dropdown-top, 0px)',
            left: 'var(--dropdown-left, 0px)'
          }}
        >
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFormatChange(option.value)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 ${
                currentFormat === option.value 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 