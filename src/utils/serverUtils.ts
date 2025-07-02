/**
 * Converts HTML content to plain text (server-side compatible)
 * @param html - The HTML string to convert
 * @returns Plain text with preserved line breaks and formatting
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags and convert common block elements to line breaks
  const text = html
    // Replace block elements with line breaks
    .replace(/<\/?(div|p|h1|h2|h3|h4|h5|h6|br|li)[^>]*>/gi, '\n')
    // Replace other HTML tags with empty string
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remove extra whitespace and normalize line breaks
    .replace(/\n\s*\n/g, '\n\n') // Replace multiple consecutive line breaks with double line breaks
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  return text;
}

/**
 * Normalizes text for edit comparison by handling newlines and whitespace
 * Server-side compatible version
 * @param text - The text to normalize
 * @returns Normalized text suitable for edit matching
 */
export function normalizeTextForEditComparison(text: string): string {
  if (!text) return '';
  
  return text
    // Normalize newlines first
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove extra whitespace between lines
    .replace(/\n\s*\n/g, '\n')
    // Remove leading/trailing whitespace from each line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    // Final trim
    .trim();
} 