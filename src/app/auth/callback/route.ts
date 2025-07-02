import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { upsertOAuthUserProfile } from '@/actions/profile';
import { getCollege } from '@/actions/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');

  if (code) {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    try {
      const { data, error } = await supabaseServer.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/sign-in?error=oauth_error', requestUrl.origin));
      }

      if (data.user) {
        try {
          // Validate email domain before proceeding
          const userEmail = data.user.email;
          if (!userEmail) {
            console.error('No email found in OAuth user data');
            return NextResponse.redirect(new URL('/sign-in?error=no_email', requestUrl.origin));
          }

          const college = await getCollege(userEmail);

          const profileResult = await upsertOAuthUserProfile(data.user.id, {
            email: userEmail,
            college: college?.name ?? null
          });

          if (!profileResult.success) {
            console.error('Error creating OAuth user profile:', profileResult.error);
          }

          // Check if user has a resume uploaded
          const { data: resumeExtractedHtml, error: resumeExtractedHtmlError } = await supabase
            .from('resume_text')
            .select('extraction')
            .eq('id', data.user.id)
            .single();

          if (resumeExtractedHtmlError || !resumeExtractedHtml || resumeExtractedHtml.extraction === null || resumeExtractedHtml.extraction === '' || resumeExtractedHtml.extraction === undefined) {
            // User doesn't have a resume, redirect to upload page
            return NextResponse.redirect(new URL('/upload', requestUrl.origin));
          } else {
            // User has a resume, redirect to home page
            return NextResponse.redirect(new URL('/home', requestUrl.origin));
          }
        } catch (error) {
          console.error('Error handling OAuth user:', error);
          // If there's an error, redirect to upload page as fallback
          return NextResponse.redirect(new URL('/upload', requestUrl.origin));
        }
      }
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      return NextResponse.redirect(new URL('/sign-in?error=oauth_error', requestUrl.origin));
    }
  }

  // Fallback redirect to sign-in page if no code or user
  return NextResponse.redirect(new URL('/sign-in', requestUrl.origin));
}