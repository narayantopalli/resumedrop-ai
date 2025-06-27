"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createLocalImageUrl } from '@/utils/imageUtils';
import { createLocalResumeUrl } from '@/utils/resumeUtils';
import { getResumeExtractedText } from '@/actions/resume';
import { signOut as signOutServer } from '@/actions/auth';

interface SessionContextType {
  loadingSession: boolean;
  userMetadata: any | null;
  session: Session | null;
  signOut: () => Promise<void>;
  setUserMetadata: any;
  avatarUrl: string | null;
  setAvatarUrl: any;
  resumeInfo: {url: string, updated_at: string, fileExt: string} | null;
  setResumeInfo: any;
  resumeExtractedText: string | null;
  setResumeExtractedText: any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [loadingSession, setLoadingSession] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userMetadata, setUserMetadata] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [resumeInfo, setResumeInfo] = useState<{url: string, updated_at: string, fileExt: string} | null>(null);
  const [resumeExtractedText, setResumeExtractedText] = useState<string | null>(null);

  // Memoize userMetadata values to prevent unnecessary re-renders
  const avatarUrlFromMetadata = useMemo(() => userMetadata?.avatar_url, [userMetadata?.avatar_url]);
  const resumeUrlFromMetadata = useMemo(() => userMetadata?.resume_url, [userMetadata?.resume_url]);
  const userId = useMemo(() => userMetadata?.id, [userMetadata?.id]);

  useEffect(() => {
    if (avatarUrlFromMetadata) {
      createLocalImageUrl(avatarUrlFromMetadata).then((result: any) => {
        if (result.success) {
          setAvatarUrl(result.url);
        } else {
          setAvatarUrl(null);
        }
      });
    } else {
      setAvatarUrl(null);
    }
  }, [avatarUrlFromMetadata]);

  useEffect(() => {
    if (resumeUrlFromMetadata && userId) {
      // Fetch extracted text
      getResumeExtractedText(userId).then((result: any) => {
        if (result.success) {
          setResumeExtractedText(result.text);
        } else {
          setResumeExtractedText(null);
        }
      });

      // Create local resume URL
      createLocalResumeUrl(resumeUrlFromMetadata).then((result: any) => {
        if (result.success) {
          setResumeInfo({url: result.url, updated_at: result.updated_at, fileExt: result.fileExt});
        } else {
          setResumeInfo(null);
        }
      });
    } else {
      setResumeInfo(null);
      setResumeExtractedText(null);
    }
  }, [resumeUrlFromMetadata, userId]);

  // Ensure we're mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserMetadata = async (userId: string | undefined) => {
    if (!userId) {
      setUserMetadata(null);
      return;
    }
    
    try {
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user metadata:', error);
        signOut();
        setUserMetadata(null);
      } else {
        setUserMetadata(user);
      }
    } catch (error) {
      console.error('Error fetching user metadata:', error);
      signOut();
      setUserMetadata(null);
    }
  }

  // Initialize Supabase session
  useEffect(() => {
    if (!mounted) return;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        if (session?.user?.id) {
          await getUserMetadata(session.user.id)
        }
        setLoadingSession(false)
      } catch (error) {
        console.error('Failed to get initial session:', error);
        setLoadingSession(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user?.id) {
          await getUserMetadata(session.user.id)
        } else {
          setUserMetadata(null)
        }
        setLoadingSession(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [mounted]);

  // Sign out function
  const signOut = async () => {
    console.log('signing out');
    try {
      const result = await signOutServer();
      if (!result.success) {
        console.error('Failed to sign out:', result.error);
      } else {
        console.log('signed out successfully');
        // Clear local state
        setSession(null);
        setUserMetadata(null);
        setAvatarUrl(null);
        setResumeInfo(null);
        setResumeExtractedText(null);
        
        // Clear all localStorage fields
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('editHistory');
            localStorage.removeItem('currentHistoryIndex');
            // Clear any other localStorage items that might exist
            localStorage.clear();
          } catch (error) {
            console.warn('Failed to clear localStorage:', error);
          }
          
          // Clear all sessionStorage fields
          try {
            sessionStorage.removeItem('signup_form_data');
            sessionStorage.removeItem('signup_accept_terms');
            // Clear any other sessionStorage items that might exist
            sessionStorage.clear();
          } catch (error) {
            console.warn('Failed to clear sessionStorage:', error);
          }
        }
      }
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return (
    <SessionContext.Provider value={{ 
      loadingSession, 
      userMetadata, 
      session,
      signOut,
      setUserMetadata,
      avatarUrl,
      setAvatarUrl,
      resumeInfo,
      setResumeInfo,
      resumeExtractedText,
      setResumeExtractedText
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
