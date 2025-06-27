'use server';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseResumeText(resumeText: string): Promise<any> {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: `
                You are a helpful assistant that parses resume text and returns a JSON object:
                Output a JSON object with the exact following structure:
                {
                    "full_name": // their full name,
                    "email": // their email,
                    "phone": // their phone number, if they don't have a phone number, could be another social media contact,
                    "linkedin": // their linkedin profile,
                    "websites": [{"website": // could be their personal website, github, etc.}, ...]
                    "university_college": // their university and the college within,
                    "university_location": // their university location, state and city,
                    "degree": // their degree, ie. Bachelor of Science in Computer Science,
                    "expected_graduation": // their expected graduation month and year, ie. May 2025,
                    "gpa": // their gpa if listed otherwise None,
                    "relevant_courses": // relevant courses they have taken as a comma separated list,
                    "skills": [{"skill": // the skill ie. software development, "frameworks": "a comma separated list of frameworks they have used for this skill"}, ...] // ensure that every skill has at least one framework!,
                    "experiences": [
                        {
                            "experience": // the experience ie. Software Engineer,
                            "dates": // the dates of the experience ie. May 2024 - June 2025,
                            "company_or_program": // the company or program they worked for,
                            "location": // the location of the experience, ie. either state and city or remote,
                            "contributions": [{"contribution": // the contribution they made to the company or program}, ...] // this needs to be a list of dictionaries
                        }
                    ],
                    "activities": [
                        {
                            "activity": // the activity ie. hackathon,
                            "role": // the role they had in the activity, ie. Team Lead,
                            "dates": // the dates of the activity ie. May 2024 - June 2025,
                            "location": // the location of the activity, ie. either state and city or remote,
                            "contributions": [{"contribution": // the contribution they made to the activity}, ...] // this needs to be a list of dictionaries
                        }
                    ],
                    "languages": // a comma separated list of languages they are proficient in,
                    "interests": // a comma separated list of interests they have,
                    "achievements": // a comma separated list of awards they have won, ie. Dean's List, etc.
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
                expected_graduation: '',
                gpa: '',
                relevant_courses: '',
                skills: [],
                experiences: [],
                activities: [],
                languages: '',
                interests: '',
                achievements: ''
            };
        }
    }
}

export async function generateDocx(text: string, userId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  let userMetadata: any;
  try {
    if (!text) {
      return { success: false, error: 'No text provided' };
    }

    // get saves left
    const { data: userData, error: userMetadataError } = await supabase.from('profiles').select('saves_left').eq('id', userId).single();
    if (userMetadataError) {
      console.error('Error getting user metadata:', userMetadataError);
      throw new Error('Failed to get user metadata');
    }

    userMetadata = userData;

    if (userMetadata.saves_left <= 0) {
      return { success: false, error: 'You have no saves left.' };
    }

    let zip: PizZip;
    try {
      const templateContent = fs.readFileSync(path.resolve('public/assets/resume-template.docx'));
      zip = new PizZip(templateContent);
    } catch (error) {
      return { success: false, error: 'Template file not found' + fs.readdirSync(process.cwd()) + error};
    }

    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const resumeData = await parseResumeText(text);

    // update saves left
    await supabase.from('profiles').update({ saves_left: userMetadata.saves_left - 1 }).eq('id', userId);

    // Set the template variables
    doc.setData({
      full_name: resumeData.full_name || '**Add full name here**',
      email: resumeData.email || '**Add email here**',
      phone: resumeData.phone || '**Add phone number here**',
      linkedin: resumeData.linkedin || '**Add linkedin profile here**',
      websites: resumeData.websites || '**Add personal websites here**',
      university_college: resumeData.university_college || '**Add university and college here**',
      university_location: resumeData.university_location || '**Add university location here**',
      degree: resumeData.degree || '**Add degree here**',
      graduation: resumeData.expected_graduation || '**Add graduation month and year here**',
      gpa: resumeData.gpa || '**Add GPA here**',
      relevant_courses: resumeData.relevant_courses || '**Add relevant courses here**',
      skills: resumeData.skills || '**Add skills here**',
      experiences: resumeData.experiences || '**Add experiences here**',
      activities: resumeData.activities || '**Add activities here**',
      languages: resumeData.languages || '**Add languages here**',
      interests: resumeData.interests || '**Add interests here**',
      achievements: resumeData.achievements || '**Add achievements here**'
    });

    // Render the document
    doc.render();

    // Get the generated document as a buffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Convert buffer to base64 string for serialization
    const base64Data = buffer.toString('base64');

    return { success: true, data: base64Data };

  } catch (error) {
    console.error('DOCX generation error:', error);
    // update saves left
    await supabase.from('profiles').update({ saves_left: userMetadata.saves_left }).eq('id', userId);
    // Provide more specific error messages
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return { success: false, error: 'Failed to parse resume data. The AI model returned invalid JSON. Please try again.' };
    }
    
    return { success: false, error: 'Failed to generate DOCX. Please check the template and data format.' };
  }
} 