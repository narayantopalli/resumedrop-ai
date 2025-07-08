export interface AvatarData {
  type: 'image' | 'emoji';
  src?: string;
  name?: string;
}

export function getAvatarData(
  avatarUrl: string | null,
  isSignedIn: boolean
): AvatarData {
  // If user is not signed in, return crying emoji
  if (!isSignedIn) {
    return {
      type: 'emoji',
      src: '/emoji.png'
    };
  }

  // If user has a profile picture, use it
  if (avatarUrl) {
    return {
      type: 'image',
      src: avatarUrl
    };
  }

  // If user has no profile picture, use crying emoji
  return {
    type: 'emoji',
    src: '/emoji.png'
  };
}

export function createAvatarImage(avatarData: AvatarData, size: number = 30): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    canvas.width = size;
    canvas.height = size;

    if (avatarData.type === 'image' && avatarData.src) {
      // Load and draw profile image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Create circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.clip();
        
        // Draw the image
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();
        
        resolve(canvas.toDataURL());
      };
      img.onerror = () => {
        // Fallback to crying emoji if image fails to load
        drawCryingFace(ctx, size);
        resolve(canvas.toDataURL());
      };
      img.src = avatarData.src;
    } else if (avatarData.type === 'emoji' && avatarData.src) {
      // Load and draw emoji
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL());
      };
      img.onerror = () => {
        // Fallback to simple crying face
        drawCryingFace(ctx, size);
        resolve(canvas.toDataURL());
      };
      img.src = avatarData.src;
    } else {
      // Ultimate fallback
      drawCryingFace(ctx, size);
      resolve(canvas.toDataURL());
    }
  });
}

function drawCryingFace(ctx: CanvasRenderingContext2D, size: number) {
  // Background circle
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Eyes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  
  // Left eye
  ctx.beginPath();
  ctx.arc(size * 0.35, size * 0.4, 2, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Right eye
  ctx.beginPath();
  ctx.arc(size * 0.65, size * 0.4, 2, 0, 2 * Math.PI);
  ctx.stroke();

  // Sad mouth
  ctx.beginPath();
  ctx.arc(size / 2, size * 0.7, size * 0.15, 0, Math.PI);
  ctx.stroke();
} 