'use server';

import { createClient } from '@supabase/supabase-js';
import { validateImage } from '@/utils/imageValidation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadProfilePicture(file: File, userId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate image using utility function
    const validation = validateImage(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-pictures/${userId}.${fileExt}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading profile picture:', error);
      return {
        success: false,
        error: 'Failed to upload image. Please try again.'
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function deleteProfilePicture(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract file path from URL
    const urlParts = avatarUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `profile-pictures/${fileName}`;

    // Delete from Supabase storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting profile picture:', error);
      return {
        success: false,
        error: 'Failed to delete image. Please try again.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteProfilePicture:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

export async function getImageBlob(url: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
        // Handle different URL formats
        let fileName: string;
        
        if (!url) {
            return {
                success: false,
                error: 'No image URL provided'
            };
        }

        // If it's already a Supabase URL, extract the filename
        if (url.includes('supabase.co')) {
            const urlParts = url.split('/');
            fileName = urlParts[urlParts.length - 1];
        } else {
            // If it's just a filename or relative path
            fileName = url.includes('/') ? url.split('/').pop()! : url;
        }

        // Validate filename
        if (!fileName || fileName.trim() === '') {
            return {
                success: false,
                error: 'Invalid filename extracted from URL'
            };
        }

        // Construct the file path
        const filePath = `profile-pictures/${fileName}`;

        // Download the file from Supabase storage
        const { data, error } = await supabase.storage
            .from('avatars')
            .download(filePath);

        if (error) {
            console.error('Error downloading profile picture:', error);
            return {
                success: false,
                error: 'Failed to download image. Please try again.'
            };
        }

        if (!data) {
            return {
                success: false,
                error: 'No image data received'
            };
        }

        // Return the blob data for client-side processing
        return {
            success: true,
            blob: data
        };
    } catch (error) {
        console.error('Error in getLocalProfilePictureUrl:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}