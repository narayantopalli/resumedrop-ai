import { generateDocx } from '@/actions/docx';

export interface GenerateDOCXResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const generateDOCXFromText = async (
  text: string,
  fileName: string = 'resume.docx',
  userId: string
): Promise<GenerateDOCXResult> => {
  if (!text) {
    return {
      success: false,
      error: 'No text provided for DOCX generation'
    };
  }

  try {
    const result = await generateDocx(text, fileName, userId);

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate DOCX');
    }

    // Convert base64 string back to blob
    const binaryString = atob(result.data!);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    return {
      success: true,
      url
    };
  } catch (err) {
    console.error('Error generating DOCX:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate DOCX'
    };
  }
};

export const downloadDOCX = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 