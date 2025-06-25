/**
 * Utility functions for clipboard operations
 */

/**
 * Copies text to clipboard with fallback support for older browsers
 * @param text - The text to copy to clipboard
 * @returns Promise<boolean> - True if copy was successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;
  
  try {
    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    // Try fallback method if clipboard API fails
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (fallbackErr) {
      console.error('Both clipboard methods failed:', fallbackErr);
      return false;
    }
  }
}; 