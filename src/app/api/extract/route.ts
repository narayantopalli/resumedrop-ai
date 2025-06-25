import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if the file is a DOCX
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return NextResponse.json(
        { error: 'File must be a DOCX' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from DOCX using mammoth
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages.length > 0) {
      console.warn('Mammoth warnings:', result.messages);
    }

    // Return the extracted text with metadata
    return NextResponse.json({
      text: result.value,
      pages: 1, // DOCX doesn't have explicit page count like PDF
      info: {},
      metadata: {},
    });

  } catch (error) {
    console.error('DOCX extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from DOCX. Please ensure the file is a valid DOCX document.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method with a DOCX file to extract text' },
    { status: 405 }
  );
}
