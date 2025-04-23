'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { DateTime } from 'luxon';
import countryTz from 'country-tz';

interface HeaderProps {
  onBackToCountries: () => void;
  showBackButton: boolean;
  targetCountryCode: string | null; // Added prop for country code
}

export default function Header({ onBackToCountries, showBackButton, targetCountryCode }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [timeLabel, setTimeLabel] = useState('Local Time');
  const [timezone, setTimezone] = useState<string | null>(null);

  // Effect to determine timezone based on targetCountryCode
  useEffect(() => {
    let determinedTimezone: string | null = null;
    let label = 'Local Time';

    if (targetCountryCode) {
      try {
        // Try calling the default import directly as the function
        const zones = countryTz(targetCountryCode);
        if (zones && zones.length > 0) {
          determinedTimezone = zones[0];
          label = `Time in ${targetCountryCode.toUpperCase()}`;
        } else {
          console.warn(`No timezone found for country code: ${targetCountryCode}`);
          label = 'Local Time';
        }
      } catch (error) {
         console.error("Error calling country-tz:", error);
         label = 'Local Time'; // Fallback on error
      }
    } else {
      label = 'Local Time';
    }

    setTimezone(determinedTimezone);
    setTimeLabel(label);

  }, [targetCountryCode]);

  // Effect to update the displayed time every minute
  useEffect(() => {
    const updateDisplayTime = () => {
      const now = DateTime.now();
      // Use the determined timezone state, or default to local system time
      const displayDt = timezone ? now.setZone(timezone) : now.setZone(DateTime.local().zone);
      
      // Format: 5:58 PM (Offset optional)
      const formattedTime = displayDt.toFormat('h:mm a'); 
      // Maybe add ZZZZ for offset display: displayDt.toFormat('h:mm a ZZZZ')
      setCurrentTime(formattedTime);
    };

    updateDisplayTime(); // Initial update
    const interval = setInterval(updateDisplayTime, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval
  }, [timezone]); // Re-run timer setup if the timezone changes

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#1e1e1e] text-white z-50 flex items-center justify-between px-4 border-b border-gray-800">
      <div className="flex items-center">
        {/* Placeholder for future logo/search if needed */}
        <span className="text-xl font-semibold">vooomoTV</span>
      </div>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={onBackToCountries}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            title="Back to Countries"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm">Countries</span>
          </button>
        )}
        {/* Updated Time Display */}
        <div className="flex items-center gap-2" title={timezone || 'System Timezone'}> 
          <span className="text-sm text-gray-400 whitespace-nowrap">{timeLabel}</span>
          <span className="text-sm text-gray-400 font-medium">{currentTime}</span>
        </div>
      </div>
    </header>
  );
} 