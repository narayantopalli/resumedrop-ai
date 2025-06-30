'use client';

import { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import HiddenToolbar from './HiddenToolbar';
import EditorArea from './EditorArea';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export default function TextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing your resume...",
  className = "",
  readOnly = false
}: TextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);

  // Toolbar commands
  const execCommand = (command: string, value?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    document.execCommand(command, false, value);
  };

  // Format block function
  const formatBlock = (tagName: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    document.execCommand('formatBlock', false, `<${tagName}>`);
    setFormatDropdownOpen(false);
  };

  // Get current block format
  const getCurrentFormat = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return 'p';
    }

    const range = selection.getRangeAt(0);
    let element: Node | null = range.commonAncestorContainer;

    while (element && element.nodeType !== Node.ELEMENT_NODE) {
      element = element.parentElement;
    }

    if (element && element.nodeType === Node.ELEMENT_NODE) {
      const tagName = (element as Element).tagName.toLowerCase();
      if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        return tagName;
      }
    }

    return 'p';
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Toggle toolbar
  const toggleToolbar = () => {
    setToolbarVisible(!toolbarVisible);
  };

  // Handle dropdown button click
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormatDropdownOpen(!formatDropdownOpen);
  };

  // Handle dropdown option click
  const handleFormatOptionClick = (tagName: string) => {
    formatBlock(tagName);
    setFormatDropdownOpen(false);
  };

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-format-dropdown]')) {
        setFormatDropdownOpen(false);
      }
    };

    if (formatDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formatDropdownOpen]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const formatOptions = [
    { value: 'p', label: 'Paragraph' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' },
  ];

  const currentFormat = getCurrentFormat();

  return (
    <div className={`bg-white border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col shadow-sm dark:shadow-gray-900/20 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-white dark:bg-gray-800' : 'h-full'} ${className}`}>
      {toolbarVisible ? (
        <Toolbar
          currentFormat={currentFormat}
          formatOptions={formatOptions}
          onFormatChange={handleFormatOptionClick}
          formatDropdownOpen={formatDropdownOpen}
          onFormatDropdownToggle={handleDropdownClick}
          onBold={() => execCommand('bold')}
          onItalic={() => execCommand('italic')}
          onUnorderedList={() => execCommand('insertUnorderedList')}
          onOrderedList={() => execCommand('insertOrderedList')}
          onAlignLeft={() => execCommand('justifyLeft')}
          onAlignCenter={() => execCommand('justifyCenter')}
          onAlignRight={() => execCommand('justifyRight')}
          onJustify={() => execCommand('justifyFull')}
          isFullscreen={isFullscreen}
          onToggleToolbar={toggleToolbar}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : (
        <HiddenToolbar onShowToolbar={toggleToolbar} />
      )}

      <EditorArea
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        isFullscreen={isFullscreen}
        onChange={onChange}
        onFormatDropdownClose={() => setFormatDropdownOpen(false)}
      />
    </div>
  );
} 