// Maximum file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export interface ResumeValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateResume(file: File): ResumeValidationResult {
  // Check file type - support DOCX, PDF, and TXT
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/pdf', // PDF
    'text/plain' // TXT
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid DOCX, PDF, or TXT file.'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // Check if file has content
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty. Please choose a valid resume file.'
    };
  }

  return { isValid: true };
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
} 