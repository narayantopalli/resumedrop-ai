'use client';

import { useRef, useEffect } from 'react';

interface EditorAreaProps {
  value: string;
  placeholder: string;
  readOnly: boolean;
  isFullscreen: boolean;
  onChange: (value: string) => void;
  onFormatDropdownClose: () => void;
}

export default function EditorArea({ 
  value, 
  placeholder, 
  readOnly, 
  isFullscreen, 
  onChange, 
  onFormatDropdownClose 
}: EditorAreaProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Handle paste to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onPaste={handlePaste}
        onBlur={(e) => {
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (relatedTarget && relatedTarget.closest('.format-dropdown')) {
            return;
          }
          if (!e.currentTarget.contains(relatedTarget)) {
            onFormatDropdownClose();
          }
        }}
        className={`
          text-editor w-full h-full p-3 sm:p-4 text-gray-800 dark:text-gray-200 
          focus:outline-none focus:ring-0 overflow-y-auto
          ${readOnly ? 'cursor-default' : 'cursor-text'}
          ${isFullscreen ? 'pb-8' : ''}
        `}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.6',
          fontSize: '14px'
        }}
        data-placeholder={placeholder}
      />
      
      {!value && !readOnly && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-400 dark:text-gray-500 pointer-events-none select-none text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
} 