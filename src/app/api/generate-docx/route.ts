import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseResumeText(resumeText: string): Promise<any> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: `
                You are a helpful assistant that parses resume text and returns a JSON object:
                Output a JSON object with the following structure:
                {
                    "full_name": // their full name,
                    "email": // their email,
                    "phone": // their phone number, if they don't have a phone number, could be another social media contact,
                    "linkedin": // their linkedin profile,
                    "website": // could be their website, github, etc.
                    "university_college": // their university and the college within,
                    "university_location": // their university location, state and city,
                    "degree": // their degree, ie. Bachelor of Science in Computer Science,
                    "graduation": // their graduation month and year, ie. May 2025,
                    "gpa": // their gpa if listed otherwise None,
                    "relevant_courses": // relevant courses they have taken as a comma separated list,
                    "skills": [{"skill": // the skill ie. software development, "frameworks": "a comma separated list of frameworks they have used for this skill"}, ...],
                    "experiences": [
                        {
                            "experience": // the experience ie. Software Engineer,
                            "dates": // the dates of the experience ie. May 2024 - June 2025,
                            "company_or_program": // the company or program they worked for,
                            "location": // the location of the experience, ie. either state and city or remote,
                            "contributions": [{"contribution": // the contribution they made to the company or program}, ...]
                        }
                    ],
                    "activities": [
                        {
                            "activity": // the activity ie. hackathon,
                            "role": // the role they had in the activity, ie. Team Lead,
                            "dates": // the dates of the activity ie. May 2024 - June 2025,
                            "location": // the location of the activity, ie. either state and city or remote,
                            "contributions": [{"contribution": // the contribution they made to the activity}, ...]
                        }
                    ],
                    "languages": // a comma separated list of languages they are proficient in,
                    "interests": // a comma separated list of interests they have,
                }
                The output should be a valid JSON object.
                Do not include any other text in your response.
                Do not change the resume text in any way, just parse it.
                Do not lose any information from the resume text.
                IMPORTANT: Ensure all strings are properly quoted and closed. Do not leave any unterminated strings.
                `},
            { role: "user", content: "This is the resume text: " + resumeText }
        ],
        max_tokens: 2000,
        temperature: 0.1,
    });
    const res = response.choices[0].message.content;
    
    // Try to parse the JSON with error handling
    try {
        const json = JSON.parse(res || '{}');
        return json;
    } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response:', res);
        
        // Try to fix common JSON issues
        let fixedResponse = res || '{}';
        
        // Remove any trailing commas before closing braces/brackets
        fixedResponse = fixedResponse.replace(/,(\s*[}\]])/g, '$1');
        
        // Try to fix unterminated strings by finding the last quote and closing it
        const lines = fixedResponse.split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            const quoteCount = (line.match(/"/g) || []).length;
            if (quoteCount % 2 === 1) {
                // Odd number of quotes means unterminated string
                lines[i] = line + '"';
                break;
            }
        }
        fixedResponse = lines.join('\n');
        
        try {
            const json = JSON.parse(fixedResponse);
            console.log('Successfully parsed JSON after fixing');
            return json;
        } catch (secondError) {
            console.error('Failed to parse JSON even after fixing:', secondError);
            // Return a minimal valid structure
            return {
                full_name: 'Error parsing resume',
                email: '',
                phone: '',
                linkedin: '',
                website: '',
                university_college: '',
                university_location: '',
                degree: '',
                graduation: '',
                gpa: 'None',
                relevant_courses: '',
                skills: [],
                experiences: [],
                activities: [],
                languages: '',
                interests: ''
            };
        }
    }
}

export async function POST(request: NextRequest) {
  try {
    const { text, fileName = 'resume.docx' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Read the template file
    const templatePath = path.join(process.cwd(), 'src', 'app', 'templates', 'resume-template.docx');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: 'Template file not found' },
        { status: 500 }
      );
    }

    const templateContent = fs.readFileSync(templatePath);
    const zip = new PizZip(templateContent);

    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const resumeData = await parseResumeText(text);

    // Set the template variables
    doc.setData({
      full_name: resumeData.full_name || '**Add full name here**',
      email: resumeData.email || '**Add email here**',
      phone: resumeData.phone || '**Add phone number here**',
      linkedin: resumeData.linkedin || '**Add linkedin profile here**',
      website: resumeData.website || '**Add website here**',
      university_college: resumeData.university_college || '**Add university and college here**',
      university_location: resumeData.university_location || '**Add university location here**',
      degree: resumeData.degree || '**Add degree here**',
      graduation: resumeData.graduation || '**Add graduation month and year here**',
      gpa: resumeData.gpa || '**Add GPA here**',
      relevant_courses: resumeData.relevant_courses || '**Add relevant courses here**',
      skills: resumeData.skills || '**Add skills here**',
      experiences: resumeData.experiences || '**Add experiences here**',
      activities: resumeData.activities || '**Add activities here**',
      languages: resumeData.languages || '**Add languages here**',
      interests: resumeData.interests || '**Add interests here**'
    });

    // Render the document
    doc.render();

    // Get the generated document as a buffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Return the DOCX file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('DOCX generation error:', error);
    
    // Provide more specific error messages
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Failed to parse resume data. The AI model returned invalid JSON. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate DOCX. Please check the template and data format.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method with text data to generate DOCX' },
    { status: 405 }
  );
}
