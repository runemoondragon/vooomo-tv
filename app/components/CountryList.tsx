'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'; // Use Next Image for potential optimization
import countriesMetadata from '../countries_metadata.json';
import { DateTime } from 'luxon';
import countryTz from 'country-tz';

interface CountryMetadata {
  // Update to match the actual JSON structure
  country: string; 
  capital: string;
  timeZone: string;
  hasChannels: boolean;
}

interface CountryListProps {
  onCountryClick: (countryCode: string) => void;
  onClose: () => void; // Keep for potential future use
  targetCountryCode: string | null; // Add prop for time display
}

const CountryList: React.FC<CountryListProps> = ({ onCountryClick, onClose, targetCountryCode }) => {
  // Remove useState for countries, use metadata directly
  // const [countries, setCountries] = useState<CountryMetadata[]>([]);

  // --- Time Display Logic (copied from Header) --- 
  const [currentTime, setCurrentTime] = useState(''); 
  const [timeLabel, setTimeLabel] = useState('Local Time'); 
  const [timezone, setTimezone] = useState<string | null>(null); 

  useEffect(() => {
    let determinedTimezone: string | null = null;
    let label = 'Local Time';
    if (targetCountryCode) {
      try {
        const zones = countryTz(targetCountryCode);
        if (zones && zones.length > 0) {
          determinedTimezone = zones[0];
          label = `Time in ${targetCountryCode.toUpperCase()}`;
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
  // --- End Time Display Logic ---

  // Sort countries alphabetically using the correct property
  const sortedCountries = useMemo(() => {
    return Object.entries(countriesMetadata as Record<string, CountryMetadata>)
      .map(([code, data]) => ({
         code: code.toLowerCase(), 
         name: data.country, // Use data.country for the name
         hasChannels: data.hasChannels // Keep hasChannels for potential future use (e.g., dimming)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // useEffect removed as we use useMemo now

  return (
    // Use full height and make list scrollable
    <div className="w-full h-full bg-gray-900 text-white flex flex-col">
      {/* Header with Time Display */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Country</h2>
        {/* Time Display */}
        <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm" title={timezone || 'System Timezone'}> 
          <span className="text-gray-400 whitespace-nowrap">{timeLabel}</span>
          <span className="text-gray-400 font-medium">{currentTime}</span>
        </div>
      </div>

      {/* Country List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {sortedCountries.map(({ code, name }) => (
          <button
            key={code}
            className="w-full px-3 py-2.5 md:px-4 md:py-3 flex items-center gap-3 hover:bg-gray-700 border-b border-gray-800 text-left transition-colors duration-150"
            onClick={() => onCountryClick(code)}
            title={`Show channels for ${name}`}
          >
            {/* Country Flag */}
            <span className="text-xl w-6 flex-shrink-0">
              <img
                src={`https://flagcdn.com/w40/${code}.png`}
                alt={`${name} flag`}
                width={24} // Provide width/height for potential optimization
                height={16}
                className="rounded-sm object-contain h-auto" // Adjust styling as needed
                onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if flag fails
              />
            </span>
            {/* Country Name */}
            <span className="flex-1 text-sm truncate" title={name}>
              {name} 
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryList; 