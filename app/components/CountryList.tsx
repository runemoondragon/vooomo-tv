import { useState, useEffect } from 'react';
import countriesMetadata from '../countries_metadata.json';

interface Country {
  code: string;
  country: string;
  hasChannels: boolean;
}

interface CountryListProps {
  onCountryClick: (countryCode: string) => void;
}

export default function CountryList({ onCountryClick }: CountryListProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    // Convert countries metadata to array and sort by country name
    const sortedCountries = Object.entries(countriesMetadata)
      .map(([code, data]) => ({
        code,
        country: data.country,
        hasChannels: data.hasChannels
      }))
      .sort((a, b) => a.country.localeCompare(b.country));

    setCountries(sortedCountries);
  }, []);

  return (
    <div className="fixed right-0 top-14 w-80 h-[calc(100vh-3.5rem)] bg-gray-900 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">Countries</h2>
        <div className="space-y-2">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => onCountryClick(country.code)}
              className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors
                ${country.hasChannels ? 'opacity-100' : 'opacity-50'}`}
              disabled={!country.hasChannels}
            >
              <img
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                alt={`${country.country} flag`}
                className="w-8 h-6 object-cover rounded"
              />
              <span className="ml-3 text-white">{country.country}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 