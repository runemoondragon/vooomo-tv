'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'; // Use Next Image for potential optimization
import countriesMetadata from '../countries_metadata.json';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import close icon

interface CountryMetadata {
  // Update to match the actual JSON structure
  country: string; 
  capital: string;
  timeZone: string;
  hasChannels: boolean;
}

interface CountryListProps {
  onCountryClick: (countryCode: string) => void;
  onClose: () => void; // Function to close the sidebar on mobile
}

const CountryList: React.FC<CountryListProps> = ({ onCountryClick, onClose }) => {
  // Remove useState for countries, use metadata directly
  // const [countries, setCountries] = useState<CountryMetadata[]>([]);

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
      {/* Header with Close button for mobile */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Country</h2>
        {/* Close button removed - handled by overlay */}
        {/* 
        <button 
           onClick={onClose} 
           className="p-1 text-gray-400 hover:text-white md:hidden"
           aria-label="Close country list"
         >
           <XMarkIcon className="w-5 h-5" />
         </button>
         */}
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