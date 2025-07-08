'use server';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the docx generation tool
const docxGenerationTool = {
  type: "function" as const,
  function: {
    name: "parse_resume_to_json",
    description: "Parse resume text and extract structured data for DOCX generation",
    parameters: {
      type: "object",
      properties: {
        full_name: {
          type: "string",
          description: "The person's full name"
        },
        email: {
          type: "string",
          description: "Email address"
        },
        phone: {
          type: "string",
          description: "Phone number or alternative contact"
        },
        linkedin: {
          type: "string",
          description: "LinkedIn profile URL"
        },
        websites: {
          type: "array",
          items: {
            type: "object",
            properties: {
              website: {
                type: "string",
                description: "Personal website, GitHub, or other online presence"
              }
            },
            required: ["website"]
          }
        },
        university_college: {
          type: "string",
          description: "University and college name"
        },
        university_location: {
          type: "string",
          description: "University location (city and state)"
        },
        degree: {
          type: "string",
          description: "Degree type (e.g., Bachelor of Science in Computer Science)"
        },
        expected_graduation: {
          type: "string",
          description: "Expected graduation month and year (e.g., May 2025)"
        },
        gpa: {
          type: "string",
          description: "GPA if listed, otherwise null"
        },
        relevant_courses: {
          type: "string",
          description: "Relevant courses as comma-separated list"
        },
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              skill: {
                type: "string",
                description: "Skill name (e.g., software development)"
              },
              frameworks: {
                type: "string",
                description: "Comma-separated list of frameworks used for this skill"
              }
            },
            required: ["skill", "frameworks"]
          }
        },
        experiences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              experience: {
                type: "string",
                description: "Job title or role"
              },
              dates: {
                type: "string",
                description: "Employment dates (e.g., May 2024 - June 2025)"
              },
              company_or_program: {
                type: "string",
                description: "Company name or program name"
              },
              location: {
                type: "string",
                description: "Location (city, state or remote)"
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    skill: {
                      type: "string",
                      description: "Skill used in this role"
                    }
                  },
                  required: ["skill"]
                },
                maxItems: 5
              },
              contributions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    contribution: {
                      type: "string",
                      description: "Contribution made to the company or program"
                    }
                  },
                  required: ["contribution"]
                }
              }
            },
            required: ["experience", "dates", "company_or_program", "location", "skills", "contributions"]
          }
        },
        activities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: {
                type: "string",
                description: "Activity name (e.g., hackathon, club)"
              },
              role: {
                type: "string",
                description: "Role in the activity (e.g., Team Lead)"
              },
              dates: {
                type: "string",
                description: "Activity dates (e.g., May 2024 - June 2025)"
              },
              location: {
                type: "string",
                description: "Location (city, state or remote)"
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    skill: {
                      type: "string",
                      description: "Skill used in this activity"
                    }
                  },
                  required: ["skill"]
                },
                maxItems: 5
              },
              contributions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    contribution: {
                      type: "string",
                      description: "Contribution made to the activity"
                    }
                  },
                  required: ["contribution"]
                }
              }
            },
            required: ["activity", "role", "dates", "location", "skills", "contributions"]
          }
        },
        languages: {
          type: "string",
          description: "Comma-separated list of languages they are proficient in"
        },
        interests: {
          type: "string",
          description: "Comma-separated list of interests"
        },
        achievements: {
          type: "string",
          description: "Comma-separated list of awards and achievements (e.g., Dean's List)"
        }
      },
      required: ["full_name", "email", "phone", "linkedin", "websites", "university_college", "university_location", "degree", "expected_graduation", "gpa", "relevant_courses", "skills", "experiences", "activities", "languages", "interests", "achievements"]
    }
  }
};

async function parseResumeText(resumeText: string): Promise<any> {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: `
                You are a helpful assistant that parses resume text and extracts structured data for DOCX generation.
                Analyze the provided resume text and extract all relevant information into the structured format.
                Do not change or modify the resume text in any way, just parse and extract the information.
                Ensure all required fields are populated. If information is missing, use appropriate placeholder text.
                The template should not be less words than the original resume text.
                Choose the most reasonable section to put each piece of information in from the resume text.
                `},
            { role: "user", content: "Parse this resume text: " + resumeText }
        ],
        tools: [docxGenerationTool],
        tool_choice: { type: "function", function: { name: "parse_resume_to_json" } },
        max_tokens: 2000,
        temperature: 0.1,
    });
    
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "parse_resume_to_json") {
        throw new Error("Failed to get structured data from AI model");
    }
    
    try {
        const json = JSON.parse(toolCall.function.arguments);
        return json;
    } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw tool call arguments:', toolCall.function.arguments);
        
        // Return a minimal valid structure as fallback
        return {
            full_name: 'Error parsing resume',
            email: '',
            phone: '',
            linkedin: '',
            websites: [],
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

export async function generateDocx(text: string, userId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  let userMetadata: any;
  try {
    if (!text) {
      return { success: false, error: 'No text provided' };
    }

    // Get saves left
    const { data: userData, error: userMetadataError } = await supabase.from('profiles').select('saves_left').eq('id', userId).single();
    if (userMetadataError) {
      console.error('Error getting user metadata:', userMetadataError);
      throw new Error('Failed to get user metadata');
    }

    userMetadata = userData;

    if (userMetadata.saves_left <= 0) {
      return { success: false, error: 'You have no saves left.' };
    }

    // Get template from supabase storage
    const { data: templateContent, error: templateContentError } = await supabase.storage.from('templates').download('resume-template.docx');
    if (templateContentError) {
      return { success: false, error: 'Template file not found' };
    }
    const arrayBuffer = await templateContent.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const resumeData = await parseResumeText(text);

    // Validate and ensure all required arrays exist
    if (!resumeData) {
      throw new Error('Failed to parse resume data');
    }

    // Ensure all arrays are defined
    resumeData.experiences = resumeData.experiences || [];
    resumeData.activities = resumeData.activities || [];
    resumeData.skills = resumeData.skills || [];
    resumeData.websites = resumeData.websites || [];

    // Update saves left
    await supabase.from('profiles').update({ saves_left: userMetadata.saves_left - 1 }).eq('id', userId);

    const templated_experiences = (resumeData.experiences || []).map((experience: any) => {
      if (!experience || typeof experience !== 'object') {
        return {
          experience: '**Add experience here**',
          dates: '**Add dates here**',
          company_or_program: '**Add company here**',
          location: '**Add location here**',
          skills: '**Add skills here**',
          contributions: '**Add contributions here**'
        };
      }
      return {
        experience: experience.experience && experience.experience !== undefined ? experience.experience : '**Add experience here**',
        dates: experience.dates && experience.dates !== undefined ? experience.dates : '**Add dates here**',
        company_or_program: experience.company_or_program && experience.company_or_program !== undefined ? experience.company_or_program : '**Add company here**',
        location: experience.location && experience.location !== undefined ? experience.location : '**Add location here**',
        skills: experience.skills && experience.skills !== undefined ? experience.skills : '**Add skills here**',
        contributions: experience.contributions && experience.contributions !== undefined ? experience.contributions : '**Add contributions here**'
      }
    });

    const templated_activities = (resumeData.activities || []).map((activity: any) => {
      if (!activity || typeof activity !== 'object') {
        return {
          activity: '**Add activity here**',
          role: '**Add role here**',
          dates: '**Add dates here**',
          location: '**Add location here**',
          skills: '**Add skills here**',
          contributions: '**Add contributions here**'
        };
      }
      return {
        activity: activity.activity && activity.activity !== undefined ? activity.activity : '**Add activity here**',
        role: activity.role && activity.role !== undefined ? activity.role : '**Add role here**',
        dates: activity.dates && activity.dates !== undefined ? activity.dates : '**Add dates here**',
        location: activity.location && activity.location !== undefined ? activity.location : '**Add location here**',
        skills: activity.skills && activity.skills !== undefined ? activity.skills : '**Add skills here**',
        contributions: activity.contributions && activity.contributions !== undefined ? activity.contributions : '**Add contributions here**'
      }
    });

    const templated_skills = (resumeData.skills || []).map((skill: any) => {
      if (!skill || typeof skill !== 'object') {
        return {
          skill: '**Add skill here**',
          frameworks: '**Add frameworks here**'
        };
      }
      return {
        skill: skill.skill && skill.skill !== undefined ? skill.skill : '**Add skill here**',
        frameworks: skill.frameworks && skill.frameworks !== undefined ? skill.frameworks : '**Add frameworks here**'
      }
    });

    const templated_websites = (resumeData.websites || []).map((website: any) => {
      if (!website || typeof website !== 'object') {
        return {
          website: '**Add website here**'
        };
      }
      return {
        website: website.website && website.website !== undefined ? website.website : '**Add website here**'
      }
    });

    // Set the template variables
    doc.setData({
      full_name: resumeData.full_name && resumeData.full_name !== undefined ? resumeData.full_name : '**Add full name here**',
      email: resumeData.email && resumeData.email !== undefined ? resumeData.email : '**Add email here**',
      phone: resumeData.phone && resumeData.phone !== undefined ? resumeData.phone : '**Add phone number here**',
      linkedin: resumeData.linkedin && resumeData.linkedin !== undefined ? resumeData.linkedin : '**Add linkedin profile here**',
      websites: templated_websites,
      university_college: resumeData.university_college && resumeData.university_college !== undefined ? resumeData.university_college : '**Add university and college here**',
      university_location: resumeData.university_location && resumeData.university_location !== undefined ? resumeData.university_location : '**Add university location here**',
      degree: resumeData.degree && resumeData.degree !== undefined ? resumeData.degree : '**Add degree here**',
      graduation: resumeData.expected_graduation && resumeData.expected_graduation !== undefined ? resumeData.expected_graduation : '**Add graduation month and year here**',
      gpa: resumeData.gpa && resumeData.gpa !== undefined ? resumeData.gpa : '**Add GPA here**',
      relevant_courses: resumeData.relevant_courses && resumeData.relevant_courses !== undefined ? resumeData.relevant_courses : '**Add relevant courses here**',
      skills: templated_skills,
      experiences: templated_experiences,
      activities: templated_activities,
      languages: resumeData.languages && resumeData.languages !== undefined ? resumeData.languages : '**Add languages here**',
      interests: resumeData.interests && resumeData.interests !== undefined ? resumeData.interests : '**Add interests here**',
      achievements: resumeData.achievements && resumeData.achievements !== undefined ? resumeData.achievements : '**Add achievements here**'
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
    // Update saves left
    await supabase.from('profiles').update({ saves_left: userMetadata.saves_left }).eq('id', userId);
    // Provide more specific error messages
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return { success: false, error: 'Failed to parse resume data. The AI model returned invalid JSON. Please try again.' };
    }
    
    if (error instanceof TypeError && error.message.includes('map')) {
      return { success: false, error: 'Failed to process resume data. Some required sections are missing. Please try again.' };
    }
    
    return { success: false, error: 'Failed to generate DOCX. Please check the template and data format.' };
  }
} 