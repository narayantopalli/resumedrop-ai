'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { validatePassword } from '@/utils/passwordValidation';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supportedColleges = await supabase.from('colleges').select('*').then(res => res.data)

export async function getCollege(email: string) {
  const emailDomain = email.split('@')[1];
  return supportedColleges?.find(college => college.domain === emailDomain);
}

export async function validateSignup(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const { name, email, password, confirmPassword } = formData;
  const errors: string[] = [];
  let college = null;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    errors.push("Please fill out all fields");
  }

  // Validate name
  if (name && name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  // Validate email format
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  // Validate college and get college info
  if (email && supportedColleges) {
    college = await getCollege(email);
  }

  // Validate password requirements
  if (password) {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  // Validate passwords match
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    success: errors.length === 0,
    errors,
    message: errors.length === 0 ? "Validation passed" : "Validation failed",
    college: college?.name
  };
}

export async function updateUserCollege(userId: string, college: string | null) {
  try {
    // First check if the profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if profile doesn't exist
      console.error('Error fetching existing profile:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (existingProfile) {
      // Profile exists, just update the college field
      const { error } = await supabase
        .from('profiles')
        .update({ college: college || null })
        .eq('id', userId);
      
      return { success: error === null, error: error?.message };
    } else {
      // Profile doesn't exist, we can't create it without a name
      // Just return success since we can't update what doesn't exist
      console.warn('Profile does not exist for user:', userId);
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error in updateUserCollege:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    
    // Create a server client with cookies
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Sign out the user
    const { error } = await supabaseServer.auth.signOut();
    
    if (error) {
      console.error('Signout error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Successfully signed out'
    };
  } catch (error) {
    console.error('Signout error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during signout'
    };
  }
}
