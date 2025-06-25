'use client';

import { getResumeBlob } from "@/actions/resume";

/**
 * Downloads a resume from Supabase storage and returns a local blob URL
 * @param url - The Supabase URL or filename of the resume
 * @returns Promise with success status and local URL or error
 */
export async function createLocalResumeUrl(url: string): Promise<{ success: boolean; url?: string; error?: string; updated_at?: string; fileExt?: string }> {
    try {
        // Get the blob data from the server action
        const result = await getResumeBlob(url);
        
        if (!result.success || !result.blob) {
            return {
                success: false,
                error: result.error || 'Failed to download resume'
            };
        }

        // Create a local blob URL on the client side
        const localUrl = URL.createObjectURL(result.blob);

        return {
            success: true,
            url: localUrl,
            updated_at: result.updated_at,
            fileExt: result.fileExt
        };
    } catch (error) {
        console.error('Error creating local resume URL:', error);
        return {
            success: false,
            error: 'Failed to create local URL'
        };
    }
}

/**
 * Revokes a blob URL to free up memory
 * @param url - The blob URL to revoke
 */
export function revokeLocalUrl(url: string): void {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
} 