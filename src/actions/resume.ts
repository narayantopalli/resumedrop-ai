'use server';

import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import parse from 'pdf-parse/lib/pdf-parse.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ResumeUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadResume(file: File, userId: string): Promise<ResumeUploadResult> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const filePath = `resumes/${userId}@${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading resume:', error);
      return {
        success: false,
        error: 'Failed to upload resume. Please try again.'
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    return {
      success: false,
      error: 'Failed to upload resume. Please try again.'
    };
  }
}

export async function deleteResume(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `resumes/${fileName}`;

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from('resumes')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting resume:', error);
      return {
        success: false,
        error: 'Failed to delete resume. Please try again.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return {
      success: false,
      error: 'Failed to delete resume. Please try again.'
    };
  }
}

export async function getResumeBlob(url: string): Promise<{ success: boolean; blob?: Blob; error?: string; updated_at?: string; fileExt?: string }> {
  try {
    // Handle different URL formats
    let fileName: string;
    
    if (!url) {
      return {
        success: false,
        error: 'No resume URL provided'
      };
    }

    // If it's already a Supabase URL, extract the filename
    if (url.includes('supabase.co')) {
      const urlParts = url.split('/');
      fileName = urlParts[urlParts.length - 1];
    } else {
      // If it's just a filename or relative path
      fileName = url.includes('/') ? url.split('/').pop()! : url;
    }

    // Validate filename
    if (!fileName || fileName.trim() === '') {
      return {
        success: false,
        error: 'Invalid filename extracted from URL'
      };
    }

    // Construct the file path
    const filePath = `resumes/${fileName}`;
    const timestamp = fileName.split('@')[1].split('.')[0];
    const fileExt = fileName.split('.')[1];
    
    // Convert milliseconds timestamp to datetime string
    const updated_at = new Date(parseInt(timestamp)).toISOString();

    // Download the file from Supabase storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .download(filePath);

    if (error) {
      console.error('Error downloading resume:', error);
      return {
        success: false,
        error: 'Failed to download resume. Please try again.'
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'No resume data received'
      };
    }

    // Return the blob data for client-side processing
    return {
      success: true,
      blob: data,
      updated_at: updated_at,
      fileExt: fileExt
    };
  } catch (error) {
    console.error('Error in getResumeBlob:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function updateResumeExtractedText(userId: string, text: string, publicUpdate: boolean = false): Promise<{ success: boolean; error?: string }> {
  try {
    let error: any;
    if (publicUpdate) {
      ({ error } = await supabase.from('resume_text').upsert({ extraction: text, created_at: new Date().toISOString(), id: userId, public_extraction: text}));
    } else { 
      ({ error } = await supabase.from('resume_text').upsert({ extraction: text, created_at: new Date().toISOString(), id: userId}));
    }
    if (error) {
      console.error('Error updating resume extracted text:', error);
      return {
        success: false,
        error: 'Failed to update resume extracted text. Please try again.'
      };
    }
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating resume extracted text:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function getResumeExtractedText(userId: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const { data, error } = await supabase.from('resume_text').select('extraction').eq('id', userId);
    if (error) {
      console.error('Error getting resume extracted text:', error);
      return {
        success: false,
        error: 'Failed to get resume extracted text. Please try again.'
      };
    }
    if (data.length === 0) {
      return {
        success: true,
        text: ''
      };
    }
    return {
      success: true,
      text: data[0].extraction
    };
  } catch (error) {
    console.error('Error getting resume extracted text:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export interface TextExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function extractTextFromResume(url: string): Promise<TextExtractionResult> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch resume file'
      };
    }

    // Check if it's a TXT file by URL extension
    const urlLower = url.toLowerCase();
    const isTxt = urlLower.endsWith('.txt');
    
    if (isTxt) {
      // For TXT files, read the text directly
      try {
        const text = await response.text();
        return {
          success: true,
          text: text
        };
      } catch (txtError) {
        console.error('TXT reading error:', txtError);
        return {
          success: false,
          error: 'Failed to read TXT file. The file might be corrupted.'
        };
      }
    }

    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Check if it's a PDF by looking at the first few bytes
    const isPDF = uint8Array.length >= 4 && 
      uint8Array[0] === 0x25 && // %
      uint8Array[1] === 0x50 && // P
      uint8Array[2] === 0x44 && // D
      uint8Array[3] === 0x46;   // F

    if (isPDF) {
      // Extract text from PDF
      try {
        const pdfData = await parse(Buffer.from(uint8Array));
        return {
          success: true,
          text: pdfData.text
        };
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return {
          success: false,
          error: 'Failed to extract text from PDF. The file might be corrupted or password protected.'
        };
      }
    } else {
      // Extract text from DOCX
      try {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(uint8Array) });
        return {
          success: true,
          text: result.value
        };
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return {
          success: false,
          error: 'Failed to extract text from DOCX. The file might be corrupted.'
        };
      }
    }
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    return {
      success: false,
      error: 'Failed to extract text from resume'
    };
  }
}

export async function extractTextFromFile(file: File): Promise<TextExtractionResult> {
  try {
    // Check if it's a TXT file by extension
    const fileName = file.name.toLowerCase();
    const isTxt = fileName.endsWith('.txt');
    
    if (isTxt) {
      // For TXT files, read the text directly
      try {
        const text = await file.text();
        return {
          success: true,
          text: text
        };
      } catch (txtError) {
        console.error('TXT reading error:', txtError);
        return {
          success: false,
          error: 'Failed to read TXT file. The file might be corrupted.'
        };
      }
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Check if it's a PDF by looking at the first few bytes
    const isPDF = uint8Array.length >= 4 && 
      uint8Array[0] === 0x25 && // %
      uint8Array[1] === 0x50 && // P
      uint8Array[2] === 0x44 && // D
      uint8Array[3] === 0x46;   // F

    if (isPDF) {
      // Extract text from PDF
      try {
        const pdfData = await parse(Buffer.from(uint8Array));
        return {
          success: true,
          text: pdfData.text
        };
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return {
          success: false,
          error: 'Failed to extract text from PDF. The file might be corrupted or password protected.'
        };
      }
    } else {
      // Extract text from DOCX
      try {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(uint8Array) });
        return {
          success: true,
          text: result.value
        };
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return {
          success: false,
          error: 'Failed to extract text from DOCX. The file might be corrupted.'
        };
      }
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return {
      success: false,
      error: 'Failed to extract text from file'
    };
  }
}
