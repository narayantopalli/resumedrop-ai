'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AvatarData, createAvatarImage } from '@/utils/avatarUtils';

interface FlappyBirdGameProps {
  onGameLoaded: () => void;
  avatarData: AvatarData;
  defaultHighScore: number;
  onHighScore: (score: number) => void;
}

interface Pipe {
  x: number;
  topH: number;
  scored?: boolean;   // new
}

const CANVAS_W = 800;
const CANVAS_H = 400;
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_GAP = 150;
const PIPE_W = 50;
const PIPE_INTERVAL = 1500; // ms
const PIPE_SPEED = 2;

const getRandomPipe = (): Pipe => {
  const minTop = 10;
  const maxTop = CANVAS_H - PIPE_GAP;
  const topH = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
  return { x: CANVAS_W, topH };
};

// High score storage key
const HIGH_SCORE_KEY = 'flappy-bird-high-score';

export default function FlappyBirdGame({ onGameLoaded, defaultHighScore, onHighScore, avatarData }: FlappyBirdGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastPipeRef = useRef<number>(0);
  const [birdImage, setBirdImage] = useState<HTMLImageElement | null>(null);

  const [birdY, setBirdY] = useState(CANVAS_H / 2);
  const velRef = useRef(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [pipesPassed, setPipesPassed] = useState(0);
  const [gameOverCooldown, setGameOverCooldown] = useState(false);
  const [initialDelay, setInitialDelay] = useState(true);

  // Memoize the default high score to prevent unnecessary recalculations
  const memoizedDefaultHighScore = useMemo(() => defaultHighScore, [defaultHighScore]);

  // Load high score from localStorage on component mount
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
      if (savedHighScore) {
        if (memoizedDefaultHighScore && memoizedDefaultHighScore > parseInt(savedHighScore, 10)) {
          setHighScore(memoizedDefaultHighScore);
        } else {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } else if (memoizedDefaultHighScore) {
        setHighScore(memoizedDefaultHighScore);
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  }, [memoizedDefaultHighScore]);

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      onHighScore(score);
      setHighScore(score);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }
  }, [score, highScore]);

  useEffect(() => {
    setScore(Math.round(pipesPassed / 2));
  }, [pipesPassed]);

  // Load bird image from avatar data
  useEffect(() => {
    const loadAvatarImage = async () => {
      try {
        const imageDataUrl = await createAvatarImage(avatarData, 30);
        const img = new Image();
        img.onload = () => {
          setBirdImage(img);
        };
        img.onerror = () => {
          setBirdImage(null);
        };
        img.src = imageDataUrl;
      } catch (error) {
        console.error('Failed to create avatar image:', error);
        setBirdImage(null);
      }
    };

    loadAvatarImage();
  }, [avatarData]);

  // Reset game state
  const init = useCallback(() => {
    setPipes([]);
    setScore(0);
    setPipesPassed(0);
    setBirdY(CANVAS_H / 2);
    velRef.current = 0;
    lastPipeRef.current = 0;
    setIsRunning(true);
    setGameOverCooldown(false);
    setInitialDelay(false); // No delay on restart
  }, []);

  // Helper function to draw text with shadow
  const drawTextWithShadow = useCallback((ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: string, color: string, shadowColor: string = 'rgba(0, 0, 0, 0.5)') => {
    ctx.font = fontSize;
    ctx.textAlign = 'center';
    
    // Draw shadow
    ctx.fillStyle = shadowColor;
    ctx.fillText(text, x + 2, y + 2);
    
    // Draw main text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }, []);

  // Main game loop
  const loop = useCallback(
    (ts: number) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      // Bird properties
      const birdSize = 30;
      const birdX = 50;

      // Clear canvas
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Physics update - only if not in initial delay
      let newY = birdY;
      if (!initialDelay) {
        velRef.current += GRAVITY;
        newY = birdY + velRef.current;
        setBirdY(newY);
      }

      // Spawn pipes - only if not in initial delay
      if (!initialDelay && ts - lastPipeRef.current > PIPE_INTERVAL) {
        setPipes((prev) => [...prev, getRandomPipe()]);
        lastPipeRef.current = ts;
      }

      // Move & draw pipes
      setPipes(prev =>
        prev.map(p => {
          const nextX = p.x - PIPE_SPEED;

          // Score exactly once, when the pipe has just moved past the bird's X.
          if (!p.scored && nextX + PIPE_W < birdX) {
            setPipesPassed(s => s + 1);
            return { ...p, x: nextX, scored: true };
          }

          return { ...p, x: nextX };
        }).filter(p => p.x + PIPE_W > 0)
      );

      // Draw pipes
      pipes.forEach(({ x, topH }) => {
        const bottomY = topH + PIPE_GAP;

        // Draw top pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(x, 0, PIPE_W, topH);

        // Draw bottom pipe
        ctx.fillRect(x, bottomY, PIPE_W, CANVAS_H - bottomY);
      });

      // Draw bird (profile image or fallback to yellow circle)
      
      if (birdImage) {
        // Save context for rotation and clipping
        ctx.save();
        
        // Calculate rotation based on velocity (tilt up when jumping, down when falling)
        const rotation = Math.min(Math.max(velRef.current * 0.1, -0.5), 0.5);
        
        // Move to bird center for rotation
        ctx.translate(birdX + birdSize / 2, newY + birdSize / 2);
        ctx.rotate(rotation);
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(0, 0, birdSize / 2, 0, 2 * Math.PI);
        ctx.clip();
        
        // Draw profile image
        ctx.drawImage(
          birdImage, 
          -birdSize / 2, 
          -birdSize / 2, 
          birdSize, 
          birdSize
        );
        
        // Restore context
        ctx.restore();
      } else {
        // Fallback to yellow circle
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(birdX + birdSize / 2, newY + birdSize / 2, birdSize / 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw score and high score
      drawTextWithShadow(
        ctx,
        `Score: ${score}`,
        CANVAS_W / 2,
        40,
        'bold 28px "Segoe UI", Arial, sans-serif',
        '#FFFFFF',
        'rgba(0, 0, 0, 0.7)'
      );
      
      drawTextWithShadow(
        ctx,
        `High Score: ${highScore}`,
        CANVAS_W / 2,
        70,
        'bold 20px "Segoe UI", Arial, sans-serif',
        '#FFD700',
        'rgba(0, 0, 0, 0.7)'
      );

      // Collision detection - more forgiving
      const hitGround = newY + birdSize >= CANVAS_H;
      const hitCeil = newY <= 0;
      let hitPipe = false;
      
      // Use a smaller collision radius for more forgiving collisions
      const collisionRadius = birdSize * 0.35; // Reduced from 0.5 to 0.35
      
      pipes.forEach(({ x, topH }) => {
        // Check if bird's X position overlaps with pipe's X position
        if (x < birdX + birdSize && x + PIPE_W > birdX) {
          const birdCenterX = birdX + birdSize / 2;
          const birdCenterY = newY + birdSize / 2;
          
          // Check collision with top pipe - more forgiving
          if (newY < topH) {
            // Bird is above the top pipe opening
            const closestX = Math.max(x, Math.min(birdCenterX, x + PIPE_W));
            const closestY = Math.max(topH, Math.min(birdCenterY, topH));
            const distanceX = birdCenterX - closestX;
            const distanceY = birdCenterY - closestY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            if (distance < collisionRadius) {
              hitPipe = true;
            }
          }
          
          // Check collision with bottom pipe - more forgiving
          const bottomPipeY = topH + PIPE_GAP;
          if (newY + birdSize > bottomPipeY) {
            // Bird is below the bottom pipe opening
            const closestX = Math.max(x, Math.min(birdCenterX, x + PIPE_W));
            const closestY = Math.max(bottomPipeY, Math.min(birdCenterY, bottomPipeY));
            const distanceX = birdCenterX - closestX;
            const distanceY = birdCenterY - closestY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            if (distance < collisionRadius) {
              hitPipe = true;
            }
          }
        }
      });

      if (hitGround || hitCeil || hitPipe) {
        // Game over
        setIsRunning(false);
        setGameOverCooldown(true);
        
        // Set cooldown timer to prevent spam
        setTimeout(() => {
          setGameOverCooldown(false);
        }, 500); // 0.5 second cooldown
        
        // Game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        
        // Check if new high score was achieved
        const isNewHighScore = score >= highScore && score > 0;
        
        // Game Over text
        drawTextWithShadow(
          ctx,
          'GAME OVER',
          CANVAS_W / 2,
          CANVAS_H / 2 - 60,
          'bold 48px "Segoe UI", Arial, sans-serif',
          '#FF6B6B',
          'rgba(0, 0, 0, 0.8)'
        );
        
        // New High Score message
        if (isNewHighScore) {
          drawTextWithShadow(
            ctx,
            'NEW HIGH SCORE! 🎉',
            CANVAS_W / 2,
            CANVAS_H / 2 - 20,
            'bold 24px "Segoe UI", Arial, sans-serif',
            '#FFD700',
            'rgba(0, 0, 0, 0.8)'
          );
        }
        
        // Final Score text
        drawTextWithShadow(
          ctx,
          `Final Score: ${score}`,
          CANVAS_W / 2,
          CANVAS_H / 2 + 20,
          'bold 32px "Segoe UI", Arial, sans-serif',
          '#FFFFFF',
          'rgba(0, 0, 0, 0.8)'
        );
        
        // High Score text
        drawTextWithShadow(
          ctx,
          `High Score: ${highScore}`,
          CANVAS_W / 2,
          CANVAS_H / 2 + 50,
          'bold 24px "Segoe UI", Arial, sans-serif',
          '#FFD700',
          'rgba(0, 0, 0, 0.8)'
        );
        
        // Restart instruction
        const restartText = 'Click, tap, or press SPACE to restart';
        const restartColor = '#E0E0E0';
        
        drawTextWithShadow(
          ctx,
          restartText,
          CANVAS_W / 2,
          CANVAS_H / 2 + 100,
          '20px "Segoe UI", Arial, sans-serif',
          restartColor,
          'rgba(0, 0, 0, 0.6)'
        );
        return;
      }

      // Next frame
      rafRef.current = requestAnimationFrame((timestamp) => loop(timestamp));
    },
    [birdY, pipes, score, birdImage, drawTextWithShadow, initialDelay]
  );

  // Start / stop loop
  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame((timestamp) => loop(timestamp));
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, loop]);

  // Flap handler
  const flap = useCallback(() => {
    if (!isRunning) {
      // Only allow restart if cooldown is over
      if (!gameOverCooldown) {
        init();
      }
      return;
    }
    // Don't allow flapping during initial delay
    if (initialDelay) {
      setInitialDelay(false);
    }
    velRef.current = FLAP_STRENGTH;
  }, [init, isRunning, gameOverCooldown, initialDelay]);

  // Keyboard control
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flap]);

  // Initialize game when component mounts
  useEffect(() => {
    // Set up initial game state
    setPipes([]);
    setScore(0);
    setPipesPassed(0);
    setBirdY(CANVAS_H / 2);
    velRef.current = 0;
    lastPipeRef.current = 0;
    setIsRunning(true);
    setGameOverCooldown(false);
    setInitialDelay(true); // Start with delay on first load
    
    // Start the game after 5 second delay
    setTimeout(() => {
      setInitialDelay(false);
    }, 5000);
    
    onGameLoaded();
  }, []); // Only run once on mount

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="border-0 rounded-t-2xl cursor-pointer"
        style={{ 
          imageRendering: 'pixelated',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto'
        }}
        onClick={flap}
        tabIndex={0}
      />
    </div>
  );
} 