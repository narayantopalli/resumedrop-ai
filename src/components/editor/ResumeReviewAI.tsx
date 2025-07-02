'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getChatResponse, getChatsFromDatabase, saveChatsToDatabase, deleteChatsFromDatabase } from '@/actions/chat';
import { useSession } from '@/contexts/SessionContext';
import { updateResumeExtractedHtml } from '@/actions/resume';
import { FiRotateCcw, FiRotateCw, FiCheck, FiX, FiZap } from 'react-icons/fi';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  HTMLContent: string;
  rawContent: string;
  edits?: { original: string; suggested: string; }[];
}

interface ResumeReviewAIProps {
  userMetadata?: any;
  resumeText: string | null;
  setUserMetadata: any;
}

// Template prompts for quick access
const templatePrompts = [
  {
    id: 'review',
    title: 'Grade my resume',
    prompt: 'Can you grade my resume and provide feedback on its content, effectiveness, and specificity. Give a letter and a numerical grade.'
  },
  {
    id: 'keywords',
    title: 'Optimize for keywords',
    prompt: 'Help me optimize my resume with relevant keywords for my target industry and job roles.'
  },
  {
    id: 'career',
    title: 'Give me career advice',
    prompt: 'What are some experiences that professionals in my field did? Quote specific examples and give me advice based on my resume.'
  },
  {
    id: 'edits',
    title: 'Give me a list of edits',
    prompt: 'Give me a list of edits that I can make to improve each section of my resume.'
  },
  {
    id: 'skills',
    title: 'Skills section review',
    prompt: 'Review my skills section and suggest improvements or additional relevant skills I should include.'
  },
  {
    id: 'summary',
    title: 'Write professional summary',
    prompt: 'Help me write a compelling professional summary or objective statement for my resume.'
  },
  {
    id: 'ats',
    title: 'ATS optimization',
    prompt: 'How can I optimize my resume to pass through Applicant Tracking Systems (ATS)?'
  }
];

// Cycling placeholders for AI thinking state
const thinkingPlaceholders = [
  "Analyzing your resume... 📊",
  "Checking for improvements... 🔍",
  "Generating suggestions... 💡",
  "Reviewing content... 📝",
  "Optimizing for ATS... 🤖",
  "Finding keywords... 🔑",
  "Crafting feedback... ✨",
  "Evaluating structure... 📋"
];

// Component to display suggested edits in a diff-like format
const SuggestedEdits = ({ 
  edits, 
  resumeText, 
  onEditApplied 
}: { 
  edits: { original: string; suggested: string; }[]; 
  resumeText: string;
  onEditApplied: (edit: { original: string; suggested: string; }) => void;
}) => {
  if (!edits || edits.length === 0) return null;

  const applyEdit = (edit: { original: string; suggested: string; }) => {
    if (typeof window !== 'undefined' && (window as any).applyResumeEdit) {
      (window as any).applyResumeEdit(edit);
      // Call the callback to mark this edit as applied
      onEditApplied(edit);
    }
  };

  const declineEdit = (edit: { original: string; suggested: string; }) => {
    // Call the callback to mark this edit as applied (which will hide it)
    onEditApplied(edit);
  };

  const validEdits = edits.filter(edit => resumeText.includes(edit.original));

  if (validEdits.length === 0) return null;

  return (
    <div className="mt-3 xl:mt-4 space-y-2 xl:space-y-3">
      <div className="text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Suggested Edits
      </div>
      <div className="space-y-2 xl:space-y-3">
        {validEdits.map((edit, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 xl:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2 xl:gap-3">
              <div className="flex-shrink-0 w-2 h-2 xl:w-3 xl:h-3 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 xl:mb-2">Original</div>
                <div className="text-sm xl:text-base text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 px-2 py-1 xl:px-3 xl:py-2 rounded border-l-2 border-red-500">
                  {edit.original}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 xl:gap-3 mt-2 xl:mt-3">
              <div className="flex-shrink-0 w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 xl:mb-2">Suggested</div>
                <div className="text-sm xl:text-base text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-2 py-1 xl:px-3 xl:py-2 rounded border-l-2 border-green-500">
                  {edit.suggested}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 xl:gap-3 mt-3 xl:mt-4">
              <button
                onClick={() => applyEdit(edit)}
                className="flex items-center gap-1 xl:gap-2 px-2 py-1 xl:px-3 xl:py-1.5 bg-green-600 text-white text-xs xl:text-sm rounded hover:bg-green-700 transition-colors"
              >
                <FiCheck className="w-3 h-3 xl:w-4 xl:h-4" />
                Apply
              </button>
              <button
                onClick={() => declineEdit(edit)}
                className="flex items-center gap-1 xl:gap-2 px-2 py-1 xl:px-3 xl:py-1.5 bg-gray-500 text-white text-xs xl:text-sm rounded hover:bg-gray-600 transition-colors"
              >
                <FiX className="w-3 h-3 xl:w-4 xl:h-4" />
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ResumeReviewAI({ userMetadata, resumeText, setUserMetadata }: ResumeReviewAIProps) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (userMetadata) {
        const chats = await getChatsFromDatabase(userMetadata.id);
        if (chats) {
          setMessages(chats);
        } else {
          setMessages([]);
        }
      }
    }
    fetchChats();
  }, [userMetadata?.id]);

  useEffect(() => {
    if (messages && userMetadata?.id) {
      saveChatsToDatabase(userMetadata.id, messages);
    }
  }, [messages, userMetadata?.id]);

  // Cycling placeholder effect
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % thinkingPlaceholders.length);
      }, 2000); // Change placeholder every 2 seconds

      return () => clearInterval(interval);
    } else {
      setCurrentPlaceholderIndex(0);
    }
  }, [isAnalyzing]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing]);

  const handleEditApplied = (edit: { original: string; suggested: string; }) => {
    // Remove the edit from the messages by filtering out messages that contain this specific edit
    setMessages(prev => {
      if (!prev) return [];
      
      return prev.map(message => {
        if (message.edits && message.edits.length > 0) {
          // Filter out the applied edit from this message's edits
          const filteredEdits = message.edits.filter(e => 
            !(e.original === edit.original && e.suggested === edit.suggested)
          );
          
          // If there are no edits left, return the message without edits
          if (filteredEdits.length === 0) {
            const { edits, ...messageWithoutEdits } = message;
            return messageWithoutEdits;
          }
          
          // Return the message with the filtered edits
          return {
            ...message,
            edits: filteredEdits
          };
        }
        
        return message;
      });
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isAnalyzing || !resumeText || userMetadata?.responses_left <= 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      HTMLContent: inputText,
      rawContent: inputText
    };
    setInputText('');
    setIsAnalyzing(true);
    setError(null);

    sendMessageToAI(inputText, userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateClick = async (prompt: string) => {
    if (isAnalyzing || !resumeText || userMetadata?.responses_left <= 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      HTMLContent: prompt,
      rawContent: prompt
    };
    setIsAnalyzing(true);
    setError(null);

    sendMessageToAI(prompt, userMessage);
  };

  const sendMessageToAI = async (prompt: string, userMessage: ChatMessage) => {
    if (!resumeText) return;

    const message_history = messages?.map(message => `${message.type === 'user' ? 'Them: ' : 'You: '}${message.rawContent}`).join('\n') || '';
    setMessages(prev => [...(prev || []), userMessage]);

    try {
      const {rawResponse, formattedResponse, edits} = await getChatResponse(resumeText, message_history, prompt, userMetadata.id);

      const validEdits = edits.filter(edit => resumeText.includes(edit.original));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        HTMLContent: formattedResponse,
        rawContent: rawResponse,
        edits: validEdits
      };

      setUserMetadata((prev: any) => ({
        ...prev,
        responses_left: prev.responses_left - 1
      }));

      setMessages(prev => [...(prev || []), aiMessage]);
    } catch (err) {
      console.error('Error getting chat response:', err);
      setError('Sorry, I encountered an error while processing your request. Please try again.');
      
      // Remove the user message since the AI response failed
      setMessages(prev => prev ? prev.slice(0, -1) : []);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleDeleteChats = async () => {
    if (!userMetadata) return;
    
    setIsDeleting(true);
    try {
      await deleteChatsFromDatabase(userMetadata.id);
      setMessages([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting chats:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const chatHeader = (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resume Review AI
            </h2>
            {userMetadata && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userMetadata?.responses_left} responses left today
              </p>
            )}
          </div>
        </div>
        {messages && messages.length > 0 && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete all chats"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  // Show sign-in prompt if no user metadata
  if (!userMetadata) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Chat Header */}
        {chatHeader}
        
        <div className="flex-1 p-8 flex flex-col items-center justify-center mb-36 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sign in to use Resume Review AI
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            Get personalized feedback on your resume tailored to your college and fields of interest.
          </p>
          <Link 
            href="/sign-in"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Chat Header */}
      {chatHeader}
      
      {/* Chat Messages */}
      <div ref={messagesContainerRef} className="flex-1 p-4 xl:p-6 space-y-4 xl:space-y-6 overflow-y-auto min-h-0">
        {messages && messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] px-3 py-2 xl:px-4 xl:py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div 
                className="text-sm xl:text-base font-medium leading-relaxed"
                style={{
                  fontFamily: `"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive`
                }}
                dangerouslySetInnerHTML={{
                  __html: message.HTMLContent
                }}
              />
              {/* Display suggested edits for AI messages */}
              {message.type === 'ai' && message.edits && message.edits.length > 0 && (
                (() => {
                  // Find the index of the last AI message
                  const aiMessages = messages?.filter(m => m.type === 'ai') || [];
                  const lastAiMessage = aiMessages[aiMessages.length - 1];
                  const isLastAiMessage = lastAiMessage?.id === message.id;
                  
                  // Only show edits for the most recent AI message
                  return isLastAiMessage ? (
                    <SuggestedEdits 
                      edits={message.edits} 
                      resumeText={resumeText || ''} 
                      onEditApplied={handleEditApplied} 
                    />
                  ) : null;
                })()
              )}
              <div className={`text-xs xl:text-sm mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
              </div>
            </div>
          </div>
        ))}

        {/* Error Message */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 xl:px-6 xl:py-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 xl:gap-3">
                <svg className="w-5 h-5 xl:w-6 xl:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm xl:text-base font-medium" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                  {error}
                </span>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 xl:px-6 xl:py-4 rounded-lg">
              <div className="flex items-center gap-2 xl:gap-3">
                <div className="animate-spin rounded-full h-4 w-4 xl:h-5 xl:w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm xl:text-base font-medium" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                  {thinkingPlaceholders[currentPlaceholderIndex]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Prompts */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 relative mb-14 xl:mb-16">
        <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-600 z-10">
            <div className="flex gap-1.5 xl:gap-2 overflow-x-auto scrollbar-hide p-3 xl:p-4">
              {templatePrompts.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template.prompt)}
                  className="group flex-shrink-0 px-3 py-2 xl:px-4 xl:py-2.5 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 text-xs xl:text-sm font-medium rounded-xl hover:bg-white hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-300 border border-white/20 dark:border-gray-600/50 hover:border-white/40 dark:hover:border-gray-500/70 hover:shadow-lg hover:scale-105 whitespace-nowrap relative overflow-hidden backdrop-blur-sm"
                  title={template.prompt}
                >
                  <div className="flex items-center gap-2 xl:gap-3 relative z-10">
                    <div className="w-2 h-2 xl:w-3 xl:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"></div>
                    <span>{template.title}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 xl:p-6 pt-2 xl:pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex gap-2 xl:gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything! ✨"
            className="flex-1 px-3 py-2 xl:px-4 xl:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white text-sm xl:text-base"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isAnalyzing}
            className="px-4 py-2 xl:px-6 xl:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed self-end xl:text-base xl:font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete All Chats
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete all your chat history? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChats}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 