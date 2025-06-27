declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFData {
    text: string;
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }

  interface PDFParseOptions {
    max?: number;
    version?: string;
  }

  function parse(buffer: Buffer, options?: PDFParseOptions): Promise<PDFData>;
  
  export = parse;
} 