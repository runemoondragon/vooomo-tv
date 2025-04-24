'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { DateTime } from 'luxon';
import countryTz from 'country-tz';

interface BottomPanelHandleProps {
  onOpen: () => void;
  targetCountryCode: string | null; // For time display
}

const BottomPanelHandle: React.FC<BottomPanelHandleProps> = ({ onOpen, targetCountryCode }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [timeLabel, setTimeLabel] = useState('Local Time');
  const [timezone, setTimezone] = useState<string | null>(null);

  // Effect to determine timezone (copied from Header, could be refactored to a hook)
  useEffect(() => {
    let determinedTimezone: string | null = null;
    let label = 'Local Time';
    if (targetCountryCode) {
      try {
        const zones = countryTz(targetCountryCode);
        if (zones && zones.length > 0) {
          determinedTimezone = zones[0];
          label = `${targetCountryCode.toUpperCase()} Time`; // Shorter label for mobile
        } else {
          label = 'Local Time';
        }
      } catch (error) {
         label = 'Local Time';
      }
    } else {
      label = 'Local Time';
    }
    setTimezone(determinedTimezone);
    setTimeLabel(label);
  }, [targetCountryCode]);

  // Effect to update time (copied from Header)
  useEffect(() => {
    const updateDisplayTime = () => {
      const now = DateTime.now();
      const displayDt = timezone ? now.setZone(timezone) : now.setZone(DateTime.local().zone);
      const formattedTime = displayDt.toFormat('h:mm a'); 
      setCurrentTime(formattedTime);
    };
    updateDisplayTime();
    const interval = setInterval(updateDisplayTime, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 flex items-center justify-between px-4 text-white z-20 md:hidden"
    >
      <div className='flex items-center gap-2'>
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium">Select a Country</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400">
         <span>{timeLabel}</span>
         <span className="font-medium">{currentTime}</span>
      </div>
    </button>
  );
};

export default BottomPanelHandle; 