
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (endDate: Date): TimeLeft | null => {
  const difference = +endDate - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-white">{String(value).padStart(2, '0')}</span>
        <span className="text-xs text-gray-400">{label}</span>
    </div>
);

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <div className="text-xl font-bold text-red-500">Auction Ended</div>;
  }

  return (
    <div className="flex space-x-4">
      <TimeSegment value={timeLeft.days} label="Days" />
      <TimeSegment value={timeLeft.hours} label="Hours" />
      <TimeSegment value={timeLeft.minutes} label="Mins" />
      <TimeSegment value={timeLeft.seconds} label="Secs" />
    </div>
  );
};
   