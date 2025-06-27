'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createUserProfile(userId: string, profileData: {
  name: string;
  email: string;
  college: string;
}) {
  try {
    const { name, email, college } = profileData;

    // Validate required fields
    if (!name || !email || !userId || !college) {
      return {
        success: false,
        error: 'Missing required fields'
      };
    }

    // Insert user profile using service role key (bypasses RLS)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name,
        email,
        college,
        isPublic: true,
        contactInfo: {
          phone: "",
          github: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          email: email
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function updateUserAvatar(userId: string, avatar_url: string) {
  try {
    // Update user avatar using service role key (bypasses RLS)
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user avatar:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserAvatar:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function updateUserResume(userId: string, resume_url: string) {
    try {
      // Update user avatar using service role key (bypasses RLS)
      const { data, error } = await supabase
        .from('profiles')
        .update({ resume_url })
        .eq('id', userId)
        .select()
        .single();
  
      if (error) {
        console.error('Error updating user resume:', error);
        return {
          success: false,
          error: error.message
        };
      }
  
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateUserResume:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
}

export async function updateUserIsPublic(userId: string, isPublic: boolean) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ isPublic })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user isPublic:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserIsPublic:', error);
    return {
      success: false, 
      error: 'Internal server error'
    };
  }
}

export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  contactInfo?: {
    phone?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}) {
  try {
    // Validate that at least one field is provided
    if (!profileData.name && !profileData.contactInfo) {
      return {
        success: false,
        error: 'No fields to update'
      };
    }

    const errors: string[] = [];

    // Validate name (same as validateSignup)
    if (profileData.name) {
      if (profileData.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return {
        success: false,
        error: errors[0]
      };
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (profileData.name) updateData.name = profileData.name;
    if (profileData.contactInfo) updateData.contactInfo = profileData.contactInfo;

    // Update user profile using service role key (bypasses RLS)
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
} 