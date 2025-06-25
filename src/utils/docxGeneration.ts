export interface GenerateDOCXResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const generateDOCXFromText = async (
  text: string,
  fileName: string = 'resume.docx'
): Promise<GenerateDOCXResult> => {
  if (!text) {
    return {
      success: false,
      error: 'No text provided for DOCX generation'
    };
  }

  try {
    const response = await fetch('/api/generate-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        fileName
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate DOCX');
    }

    // Get the DOCX blob
    const blob = await response.blob();
    
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