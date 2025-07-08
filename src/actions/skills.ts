'use server';

import OpenAI from 'openai';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { htmlToPlainText } from '@/utils/serverUtils';
import { SkillsData } from '@/components/skills/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const getSearch = async (searchID: string) => {
  const { data, error } = await supabase
    .from('searches')
    .select('*')
    .eq('id', searchID)
    .single();

  if (error) {
    throw new Error('Failed to get search');
  }

  return data.data as SkillsData;
};

export const getUserSearches = async (userId: string) => {
  const { data, error } = await supabase
    .from('searches')
    .select('id, created_at, data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error('Failed to get user searches');
  }

  return data.map(search => ({
    id: search.id,
    createdAt: search.created_at,
    jobTitle: search.data.job_title || 'Untitled Search',
    companyName: search.data.company_name || 'Unknown Company'
  }));
};

// get the job description from web page
export const getDescriptionUrl = async (websiteUrl: string): Promise<string | null> => {
  try {
    // Validate URL format
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = 'https://' + websiteUrl;
    }

    // Validate URL structure
    try {
      new URL(websiteUrl);
    } catch {
      console.error('Invalid URL format:', websiteUrl);
      return null;
    }

    // Add headers to mimic a browser request and avoid some CORS issues
    const response = await axios.get(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
    });

    // Check if response is HTML
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      console.error('Response is not HTML content:', contentType);
      return null;
    }

    // Convert HTML to plain text using the existing utility
    const plainText = htmlToPlainText(response.data);
    
    // Check if we got meaningful content
    if (!plainText || plainText.trim().length < 50) {
      console.error('Extracted content is too short or empty');
      return null;
    }

    const description = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts the job description from a webpage. Make sure to extract the requirements and qualifications for candidates. Make sure to extract the work arrangement and location details, ie. "Remote", "On-site, Seattle WA", "Hybrid, Redmond WA", "In-office, Austin TX", etc. All information must be stated in the job description.' },
        { role: 'user', content: plainText }
      ]
    });
    
    // Return the plain text content
    return description.choices[0].message.content;
  } catch (error) {
    console.error('getDescriptionUrl error:', error);
    
    // Provide more specific error messages
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused to:', websiteUrl);
      } else if (error.code === 'ENOTFOUND') {
        console.error('Domain not found:', websiteUrl);
      } else if (error.response?.status === 403) {
        console.error('Access forbidden (403) for:', websiteUrl);
      } else if (error.response?.status === 404) {
        console.error('Page not found (404) for:', websiteUrl);
      } else if (error.response?.status && error.response.status >= 500) {
        console.error('Server error for:', websiteUrl);
      }
    }
    
    return null;
  }
};

// upload search to supabase
export const uploadSearch = async (userId: string, searchJson: any) => {
  const { data, error } = await supabase
    .from('searches')
    .upsert({ user_id: userId, data: searchJson }).select('id').single();

  if (error) {
    throw new Error('Failed to upload search');
  }

  return data.id;
};

// Tool for the AI to use to get the skills
const skillsTool = {
  type: 'function' as const,
  function: {
    name: 'get_skills',
    description:
      'Get the skills the person should improve on based on their resume and job profile',
    parameters: {
      type: 'object',
      properties: {
        skills_to_improve: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              skill: {
                type: 'string',
                description:
                  'Skill name (e.g., Python, Java, Excel, Public Speaking, etc.) Should be in title case! Must match one of the available courses in the courses.json file.',
              },
              explanation: {
                type: 'string',
                description: `
                Explanation of why this skill is important based on the person's resume and the job profile.
                The explanation should be concise and to the point.
                The explanation should be based on the person's resume and the job profile.
                This should be professional.
                When refering to the candidate, use second person words like "you" or "your".
                Do not use vague language.
                Do not use words like "important" or "necessary".
                Do not use words like "essential" or "critical".
                Do not use words like "must have" or "required".
                Do not use words like "highly recommended" or "strongly recommended".
                Do not use words like "highly important" or "strongly important".
                `,
              },

            },
            required: ['skill', 'explanation'],
          },
          maxItems: 10,
        },
        job_title: {
          type: 'string',
          description: 'The job title only, ie. "Software Engineer", "Data Analyst", "Project Manager", etc. Do NOT include company name. Return "Not Specified" if job title not found.',
        },
        company_name: {
          type: 'string',
          description: 'The company name from the job description, ie. "Google", "Amazon", "Microsoft", etc. Do NOT include job title. Return "Not Specified" if company name not found.',
        },
        work_arrangement: {
          type: 'string',
          description: 'The work arrangement and location details, ie. "Remote", "On-site, Seattle WA", "Hybrid, Redmond WA", "In-office, Austin TX", etc. Find this from the job description.',
        },
        job_keywords: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Extract comprehensive keywords from both the job description and resume. Include: 1) Technical skills and tools mentioned in the job (e.g., "Python", "React", "Data Analysis"), 2) Candidate requirements from the job description (e.g., "Bachelor\'s Degree in Computer Science", "3+ Years Experience", "Senior Level"), 3) Industry-specific terms and methodologies. All keywords should be in title case and be specific to the job requirements.',
          },
        },
      },
      required: ['skills_to_improve', 'job_title', 'company_name', 'work_arrangement', 'job_keywords'],
    },
  },
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const getSkillsResponse = async (
  userId: string,
  jobDescription: string
): Promise<{ skillsData: any }> => {
  try {
    // Get resume text
    const { data: resume, error: resumeError } = await supabase
      .from('resume_text')
      .select('extraction')
      .eq('id', userId)
      .single();

    if (resumeError) throw new Error('Resume not found');

    const userResume = htmlToPlainText(resume.extraction);

    // Get courses.json from supabase storage
    const { data: coursesData, error: coursesDataError } = await supabase.storage.from('templates').download('courses.json');
    if (coursesDataError) throw new Error('Courses data not found');
    const coursesDataArrayBuffer = await coursesData.arrayBuffer();
    const coursesDataString = new TextDecoder().decode(coursesDataArrayBuffer);
    const coursesDataJson = JSON.parse(coursesDataString);

    // Get available courses for the AI to choose from
    const availableCourses = Object.keys(coursesDataJson).join(', ');

    // Get skills from AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
          You are a professional career advisor.

          WORK ARRANGEMENT EXTRACTION INSTRUCTIONS:
          - Extract the work arrangement from the job description
          - You must imply the work arrangement from the job description
          - Do not make up a work arrangement, all information must be implied from the job description
          
          CRITICAL RULES FOR SKILL DETECTION:
          - Only return skills that are NOT already present in the person's resume and are relevant to the job description.
          - Only choose skills from the available courses list provided
          - ONLY suggest skills that are EXPLICITLY mentioned or clearly required in the job description
          - The skill must be directly referenced in the job requirements, responsibilities, or qualifications
          
          KEYWORD EXTRACTION GUIDELINES:
          - Extract comprehensive keywords from the job description
          - Include technical skills, tools, and technologies mentioned in the job
          - Include candidate requirements (education level, experience years, certifications)
          - All keywords should be in title case and specific to the job requirements
          `,
        },
        {
          role: 'user',
          content: `
Resume:
${userResume}

Job profile description:
${jobDescription}

Available courses to choose from:
${availableCourses}
        `,
        },
      ],
      tools: [skillsTool],
      tool_choice: { type: 'function' as const, function: { name: 'get_skills' } },
      max_tokens: 500,
      temperature: 0.1,
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call response received');
    }

    const parsedData = JSON.parse(toolCall.function.arguments);

    // Map the skills to their corresponding URLs from courses.json
    const skillsWithLinks = parsedData.skills_to_improve.map((item: any) => {
      const courseData = (coursesDataJson as any)[item.skill];
      if (!courseData) {
        console.warn(`Course not found for skill: ${item.skill}`);
        return null;
      }
      return {
        ...item,
        url: courseData.url,
        provider: courseData.provider
      };
    }).filter(Boolean); // Remove null entries

    return {
      skillsData: {
        skills_to_improve: skillsWithLinks,
        job_title: parsedData.job_title,
        company_name: parsedData.company_name,
        work_arrangement: parsedData.work_arrangement,
        job_keywords: parsedData.job_keywords
      },
    };
  } catch (err) {
    console.error('getSkillsResponse error:', err);
    throw new Error('Failed to get response from AI');
  }
};
