'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  className?: string;
}

export default function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('');

  useEffect(() => {
    const calculateTimeUntilRefresh = () => {
      const now = new Date();
      const gmtNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      
      // Set target time to 12:00 GMT today or tomorrow
      const targetTime = new Date(gmtNow);
      targetTime.setUTCHours(12, 0, 0, 0);
      
      // If it's already past 12:00 GMT today, set target to tomorrow
      if (gmtNow.getUTCHours() >= 12) {
        targetTime.setUTCDate(targetTime.getUTCDate() + 1);
      }
      
      const timeDiff = targetTime.getTime() - gmtNow.getTime();
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeUntilRefresh(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeUntilRefresh();
    const interval = setInterval(calculateTimeUntilRefresh, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className}>
      Refreshes in: {timeUntilRefresh}
    </span>
  );
} 