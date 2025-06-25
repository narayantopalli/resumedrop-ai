export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImage(file: File): ImageValidationResult {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select a valid image file (PNG, JPG, GIF, etc.)'
    };
  }

  // Check file size (max 1MB)
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 1MB'
    };
  }

  // Check for common image formats
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image format (PNG, JPG, GIF, WebP)'
    };
  }

  return { isValid: true };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

export function validateImageDimensions(
  file: File, 
  minWidth: number = 100, 
  minHeight: number = 100,
  maxWidth: number = 2048,
  maxHeight: number = 2048
): Promise<ImageValidationResult> {
  return getImageDimensions(file).then(({ width, height }) => {
    if (width < minWidth || height < minHeight) {
      return {
        isValid: false,
        error: `Image dimensions must be at least ${minWidth}x${minHeight} pixels`
      };
    }

    if (width > maxWidth || height > maxHeight) {
      return {
        isValid: false,
        error: `Image dimensions must be no larger than ${maxWidth}x${maxHeight} pixels`
      };
    }

    return { isValid: true };
  }).catch(() => {
    return {
      isValid: false,
      error: 'Failed to validate image dimensions'
    };
  });
} 