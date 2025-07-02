'use server';

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { normalizeTextForEditComparison } from '@/utils/serverUtils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MAX_PROMPT_TOKENS = 1024;
const CHARS_PER_TOKEN = 4;
const MAX_PROMPT_CHARS = MAX_PROMPT_TOKENS * CHARS_PER_TOKEN;

// Function to format AI response with proper markdown styling
const formatAIResponse = (text: string): string => {
  return text
    // Bold text with ** or __
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic text with * or _
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Bullet points and numbered lists
    .replace(/^[-*]\s+(.+)$/gm, '• $1')
    .replace(/^\d+\.\s+(.+)$/gm, (match, content) => {
      const numberMatch = match.match(/^\d+/);
      const number = numberMatch ? numberMatch[0] : '1';
      return `${number}. ${content}`;
    })
    // Headers - handle all levels (1-6)
    .replace(/^#{6}\s+(.+)$/gm, '<h6 class="text-sm font-semibold mt-2 mb-1">$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5 class="text-base font-semibold mt-2 mb-1">$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4 class="text-lg font-semibold mt-3 mb-2">$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-3">$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-5 mb-4">$1</h1>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Horizontal rules (---)
    .replace(/^---$/gm, '<hr class="my-1 border-gray-300 dark:border-gray-600" />')
    // Line breaks
    .replace(/\n/g, '<br />');
};

export const getChatResponse = async (resumeText: string, pastMessages: string, message: string, userId: string): Promise<{rawResponse: string, formattedResponse: string, edits: {original: string, suggested: string}[]}> => {
    let userMetadata: any;
    try {
        const { data: userData, error: userMetadataError } = await supabase.from('profiles').select('responses_left').eq('id', userId).single();
        if (userMetadataError) {
            console.error('Error getting user metadata:', userMetadataError);
            throw new Error('Failed to get user metadata');
        }

        if (userData.responses_left <= 0) {
            throw new Error('You have reached the maximum number of responses');
        }

        userMetadata = userData;

        const message_length = message.length;
        if (message_length > MAX_PROMPT_CHARS) {
            console.log("Message is too long");
            throw new Error('Message is too long');
        }

        // update responses left
        const { error: updatedUserMetadataError } = await supabase.from('profiles').update({responses_left: userMetadata.responses_left - 1}).eq('id', userId);
        if (updatedUserMetadataError) {
            console.error('Error updating user metadata:', updatedUserMetadataError);
            throw new Error('Failed to update user metadata');
        }

        const PROMPT_CHARS_LEFT = MAX_PROMPT_CHARS - message_length;
        const message_history_length = pastMessages.length;
        const past_messages = message_history_length > PROMPT_CHARS_LEFT ? pastMessages.substring(message_history_length - PROMPT_CHARS_LEFT) : pastMessages;

        const { data: resumeSummary, error: resumeSummaryError } = await supabase.from('resume_embeddings').select('summary').eq('id', userId).single();
        if (resumeSummaryError) {
            console.error('Error getting resume summary:', resumeSummaryError);
            throw new Error('Failed to get resume summary');
        }

        const messageEmbedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: resumeSummary.summary + " " + message,
        });

        // get examples from the database
        const { data: examples, error: examplesError } = await supabase.rpc('get_excerpts', {
            query_embedding: messageEmbedding.data[0].embedding,
            neighbors: 25
        });
        if (examplesError) {
            console.error('Error getting examples:', examplesError);
            throw new Error('Failed to get examples');
        }
        const examples_text = examples.map((example: any) => example.content).join("\n");

        let summary_text = 'No Previous Conversation History';
        if (past_messages.length > 10) {
          const summary = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            temperature: 0.1,
            max_tokens: 256,
            messages: [
              { role: "system", content: "Summarise this chat in <150 words to be used as context for the following prompt: " + message },
              { role: "user", content: past_messages }
            ]
          });
          summary_text = summary.choices[0]?.message?.content || 'No Previous Conversation History';
        }

        const examples_content_summary = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          temperature: 0.1,
          max_tokens: 256,
          messages: [
            { role: "system", content: "In <200 words, summarise the content of the following resume excerpts from other professionals to provide context in answering the user's prompt about improving their resume: " + examples_text },
            { role: "user", content: "The user's prompt is: " + message },
          ]
        });

        const examples_content_summary_text = `
          This is a summary of the content of the other professionals' resume excerpts that should be used as context to improve the user's resume and give them advice:
          --------------------------------
          ${examples_content_summary.choices[0]?.message?.content || 'No Examples Content Summary'}
          --------------------------------
        `;

        const instructions = `
            You are a professional resume reviewer. Focus on:
            • Specific, quantified achievements with concrete numbers and metrics
            • Action verbs that demonstrate impact and results
            • Concrete tools, frameworks, and technologies used
            • Measurable outcomes and business impact

            Do not focus on formatting, just focus on the content!
            Do not focus on rewording the user's resume, just focus on improving the content.
            
            CRITICAL: DO NOT USE generic, vague language like:
            - "innovation/innovative"
            - "excellence/outstanding/excellent"
            - "strong/proven track record"
            - "technical expertise/skills"
            - "data-driven"
            - "strategic/strategies"
            - "customer-centric"
            - "process optimization"
            - "solutions"
            - "insights"
            - "impactful"
            - "seeking opportunities"
            - "deliver measurable results"
            - "contributed to"
            - "sharing technical"
            - "improved strategies"
            - "project execution"
            - "automation"
            - "workflows"
            - "team ..." (e.g. team collaboration, team efficiency, team performance, team productivity, team success, team achievements, team goals, team objectives)
            - etc.
            
            Instead, use specific, measurable language that demonstrates concrete value and impact.
            
            Format your responses using markdown:
            - Use **bold** for emphasis and section headers
            - Use bullet points (- or *) for lists
            - Use numbered lists (1., 2., etc.) for sequential items
            - Structure your response with clear sections and proper formatting

            Be concise.
            Important: Do not add any information (numbers, quantities, experiences, examples, etc.) that is not strictly in the user's resume.
            You are not allowed to answer prompts that do not relate to the user's resume or career.

            Provide a detailed analysis of the resume first, then use the tool to suggest specific text edits.

            YOU MUST REMEMBER TO CALL THE TOOL AND GENERATE SPECIFIC HTML EDITS!
        `;
        const context = `
            This is the extracted html of the user's resume:
            --------------------------------
            ${resumeText}
            --------------------------------
        `;
        const past_messages_context = `
            This is a summary of the past messages between the you and the user:
            --------------------------------
            ${summary_text}
            --------------------------------
        `;
        
        // Get response with edits using tool calls
        const completion = await openai.chat.completions.create({
          model: "gpt-4.1",
          messages: [
            {
              role: "system",
              content: examples_content_summary_text,
            },
            {
              role: "system",
              content: context,
            },
            {
              role: "system",
              content: past_messages_context,
            },
            {
              role: "system",
              content: instructions,
            },
            {
              role: "user",
              content: message,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_resume_edits",
                description: "Generate specific html edits to improve the resume. Use X, Y, Z placeholders for quantities you don't know (e.g., '<p>increased efficiency by X%</p>', '<p>managed team of Y people</p>', '<p>completed project in Z months</p>').",
                parameters: {
                  type: "object",
                  properties: {
                    edits: {
                      type: "array",
                      description: "Array of edit objects containing original and suggested html.",
                      items: {
                        type: "object",
                        properties: {
                          original: {
                            type: "string",
                            description: "HTML from the resume that needs improvement, make sure this matches exactly to the original html in the resume"
                          },
                          suggested: {
                            type: "string",
                            description: "Improved version of the html. Edits should be concise and to the point."
                          }
                        },
                        required: ["original", "suggested"]
                      },
                      maxItems: 5
                    }
                  },
                  required: ["edits"]
                }
              }
            }
          ],
          tool_choice: "auto",
          max_tokens: 1000,
          temperature: 0.3,
        });

        const analysis = completion.choices[0]?.message?.content || 'No analysis generated';
        const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

        if (toolCall && toolCall.function.name === "generate_resume_edits") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const rawEdits = args.edits && Array.isArray(args.edits) ? args.edits.filter((edit: any) => 
              edit && 
              typeof edit === 'object' && 
              edit.original && 
              edit.suggested &&
              typeof edit.original === 'string' &&
              typeof edit.suggested === 'string'
            ) : [];
            
            // Normalize the edits to handle newline differences
            const normalizedEdits = rawEdits.map((edit: any) => ({
              original: normalizeTextForEditComparison(edit.original),
              suggested: normalizeTextForEditComparison(edit.suggested)
            }));

            return {
              rawResponse: analysis,
              formattedResponse: formatAIResponse(analysis),
              edits: normalizedEdits
            };
          } catch (parseError) {
            console.warn('Failed to parse tool call arguments:', parseError);
            return {
              rawResponse: analysis,
              formattedResponse: formatAIResponse(analysis),
              edits: []
            };
          }
        } else {
          return {
            rawResponse: analysis,
            formattedResponse: formatAIResponse(analysis),
            edits: []
          };
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        // update responses left
        await supabase.from('profiles').update({responses_left: userMetadata.responses_left}).eq('id', userId);
        throw new Error('Failed to get response from AI');
    }
}

export const saveChatsToDatabase = async (userId: string, chats: any) => {
  const { data, error } = await supabase.from('chats').upsert({
    id: userId,
    chats: chats
  });

  if (error) {
    console.error('Error saving chats to database:', error);
    throw new Error('Failed to save chats to database');
  }

  return data;
}

export const getChatsFromDatabase = async (userId: string) => {
  const { data, error } = await supabase.from('chats').select('chats').eq('id', userId);

  if (data === undefined || data === null || data.length === 0) {
    return null;
  }

  if (error) {
    console.error('Error getting chats from database:', error);
    throw new Error('Failed to get chats from database');
  }

  return data[0].chats;
}

export const deleteChatsFromDatabase = async (userId: string) => {
  const { data, error } = await supabase.from('chats').delete().eq('id', userId);

  if (error) {
    console.error('Error deleting chats from database:', error);
    throw new Error('Failed to delete chats from database');
  }

  return data;
}
