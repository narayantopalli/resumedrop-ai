'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import FlappyBirdGame from '@/components/game/FlappyBirdGame';
import { useSession } from '@/contexts/SessionContext';
import { getAvatarData } from '@/utils/avatarUtils';
import { saveHighScore, getHighScore } from '@/actions/game';

export default function GamePageContent() {
  const [gameLoaded, setGameLoaded] = useState(false);
  const { avatarUrl, session, userMetadata } = useSession()
  const [defaultHighScore, setDefaultHighScore] = useState(0);

  // Get avatar data based on user session
  const avatarData = getAvatarData(
    avatarUrl,
    !!session
  );

  useEffect(() => {
    if (!session?.user.id) {
      setDefaultHighScore(0);
      return;
    }
    const fetchHighScore = async () => {
      try {
        const { score } = await getHighScore(session.user.id);
        setDefaultHighScore(score);
      } catch (error) {
        console.error('Error fetching high score:', error);
        setDefaultHighScore(0);
      }
    };
    fetchHighScore();
  }, [session]);

  const onHighScore = async (score: number) => {
    if (!session?.user.id) {
      return;
    }
    try {
      await saveHighScore(score, session.user.id);
    } catch (err) {
      console.error('Exception during high score save:', err);
    }
  };

  return (
    <div className="mt-2 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50 dark:from-blue-400/30 dark:via-purple-400/40 dark:to-indigo-400/30 rounded-2xl">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 relative">
        <div className="absolute top-4 sm:top-8 left-4 z-10">
          <BackButton />
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 mt-12 sm:mt-0">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center justify-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Flappy{userMetadata?.name.split(' ')[0] || 'Recruit'}</span>
              </h1>
            </div>
          </div>

          {/* Game Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Game Frame */}
            <div className="relative w-full h-[400px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
              {/* Loading State */}
              {!gameLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-2xl z-10">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Game Canvas */}
              <div
                className="w-full h-full"
                style={{
                  opacity: gameLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                <FlappyBirdGame 
                  onGameLoaded={() => setGameLoaded(true)} 
                  avatarData={avatarData}
                  defaultHighScore={defaultHighScore}
                  onHighScore={onHighScore}
                />
              </div>
            </div>

            {/* Instructions Section */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm min-h-[44px] sm:h-[52px]">
                      <kbd className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md font-mono text-xs sm:text-sm font-bold shadow-sm">Add</kbd>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">a profile picture to replace the default emoji</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm min-h-[44px] sm:h-[52px]">
                      <kbd className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md font-mono text-xs sm:text-sm font-bold shadow-sm">Space</kbd>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">or</span>
                      <kbd className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md font-mono text-xs sm:text-sm font-bold shadow-sm">Click</kbd>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">to flap</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm min-h-[44px] sm:h-[52px]">
                      <kbd className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md font-mono text-xs sm:text-sm font-bold shadow-sm">Tap</kbd>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">on mobile devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 