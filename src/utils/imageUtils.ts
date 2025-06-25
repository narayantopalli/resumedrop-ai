'use client';

import { getImageBlob } from "@/actions/storage";

/**
 * Downloads an image from Supabase storage and returns a local blob URL
 * @param url - The Supabase URL or filename of the picture
 * @returns Promise with success status and local URL or error
 */
export async function createLocalImageUrl(url: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Get the blob data from the server action
        const result = await getImageBlob(url);
        
        if (!result.success || !result.blob) {
            return {
                success: false,
                error: result.error || 'Failed to download image'
            };
        }

        // Create a local blob URL on the client side
        const localUrl = URL.createObjectURL(result.blob);

        return {
            success: true,
            url: localUrl
        };
    } catch (error) {
        console.error('Error creating local profile picture URL:', error);
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