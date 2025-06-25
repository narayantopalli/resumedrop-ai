'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // Get user's email from profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      return {
        success: false,
        error: 'User profile not found'
      };
    }

    // Verify current password by attempting to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Update password using service role
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return {
        success: false,
        error: updateError.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function deleteUserAccount(userId: string, password: string) {
  try {
    // Get user's email from profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      return {
        success: false,
        error: 'User profile not found'
      };
    }

    // Verify password by attempting to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password: password,
    });

    if (signInError) {
      return {
        success: false,
        error: 'Password is incorrect'
      };
    }

    // Delete user profile first
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      return {
        success: false,
        error: 'Failed to delete user profile'
      };
    }

    // Delete user account using service role
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId);

    if (userDeleteError) {
      console.error('Error deleting user account:', userDeleteError);
      return {
        success: false,
        error: userDeleteError.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
} 