'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import CountryList from './components/CountryList';
import Header from './components/Header';
import countriesMetadata from './countries_metadata.json'; // Import metadata

const InteractiveGlobe = dynamic(() => import('./components/InteractiveGlobe'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><p className="text-center text-gray-400">Loading Globe...</p></div>
});

// Define type for metadata entries (matching the JSON structure)
interface CountryMetaData {
  country: string;
  capital: string;
  timeZone: string;
  hasChannels: boolean;
}

interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
}

// Cast the imported JSON to the correct type
const typedCountriesMetadata = countriesMetadata as Record<string, CountryMetaData>;

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null); // State for full name
  const [selectedCapital, setSelectedCapital] = useState<string | null>(null); // State for capital
  const [channels, setChannels] = useState<Channel[]>([]);
  const [rightSidebarView, setRightSidebarView] = useState<'countries' | 'channels' | 'search'>('countries');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Channel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // --- Mobile State ---
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  // Right sidebar on mobile is implicitly open when view is channels/search
  // ---------------------

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);

  const fetchChannels = useCallback(async (url: string, type: 'category' | 'country' | 'search') => {
    const loadingSetter = type === 'search' ? setIsSearching : setIsLoading;
    const errorSetter = type === 'search' ? setSearchError : setError;
    const resultsSetter = type === 'search' ? setSearchResults : setChannels;

    loadingSetter(true);
    errorSetter(null);
    if (type !== 'search') {
      setShowPlayer(false);
      setSelectedChannel(null);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${type} results`);
      }
      const data = await response.json();
      resultsSetter(data);
      if (type === 'category' || type === 'country') {
        setRightSidebarView('channels');
      } else if (type === 'search') {
        setRightSidebarView('search');
      }
      setIsLeftSidebarOpen(false); // Close left sidebar on mobile after selection
    } catch (err) {
      console.error(`Error loading ${type} results:`, err);
      errorSetter(err instanceof Error ? err.message : 'An unknown error occurred');
      resultsSetter([]);
      if (type !== 'search') {
        setRightSidebarView('countries');
      }
    } finally {
      loadingSetter(false);
    }
  }, []);

  const handleCountryClick = (countryCode: string) => {
    const upperCode = countryCode.toUpperCase();
    const metadata = typedCountriesMetadata[upperCode];

    setSelectedCountry(upperCode); // Store uppercase code consistent with metadata keys
    setSelectedCountryName(metadata?.country || upperCode); // Store name, fallback to code
    setSelectedCapital(metadata?.capital || null); // Store capital if available
    setCurrentCategory('');
    setSearchTerm(''); 
    setSearchResults([]); 
    fetchChannels(`/api/countries/${countryCode.toLowerCase()}`, 'country');
  };

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setSelectedCountry(null);
    setSelectedCountryName(null); // Clear country details
    setSelectedCapital(null);
    setSearchTerm(''); 
    setSearchResults([]); 
    fetchChannels(`/api/categories/${category.toLowerCase()}`, 'category');
  };

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      setRightSidebarView('countries');
      setCurrentCategory('');
      setSelectedCountry(null);
      setSelectedCountryName(null); // Clear country details
      setSelectedCapital(null);
    } else {
      setCurrentCategory('');
      setSelectedCountry(null);
      setSelectedCountryName(null); // Clear country details
      setSelectedCapital(null);
      fetchChannels(`/api/search?q=${encodeURIComponent(term.trim())}`, 'search');
    }
  }, [fetchChannels]);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
    setIsLeftSidebarOpen(false); // Close sidebars when player opens
  };

  const handleBackToCountries = () => {
    setRightSidebarView('countries');
    setChannels([]);
    setSearchResults([]);
    setCurrentCategory('');
    setSelectedCountry(null);
    setSelectedCountryName(null); // Clear country details
    setSelectedCapital(null);
    setSelectedChannel(null);
    setShowPlayer(false);
    setError(null);
    setSearchError(null);
    setSearchTerm('');
    setIsLeftSidebarOpen(false);
  };

  const channelsToDisplay = rightSidebarView === 'search' ? searchResults : channels;
  const isLoadingRightSidebar = rightSidebarView === 'search' ? isSearching : isLoading;
  const rightSidebarError = rightSidebarView === 'search' ? searchError : error;

  const targetCountryCode = selectedCountry || selectedChannel?.country || null;

  // Determine if right sidebar should be visually open on mobile
  const isRightSidebarVisuallyOpen = rightSidebarView === 'channels' || rightSidebarView === 'search';

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Header
        onBackToCountries={handleBackToCountries}
        showBackButton={isRightSidebarVisuallyOpen}
        targetCountryCode={targetCountryCode}
        onToggleLeftSidebar={toggleLeftSidebar}
      />
      <Sidebar
        onCategoryClick={handleCategoryClick}
        activeCategory={currentCategory}
        onSearchTermChange={handleSearchTermChange}
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
      />

      <main 
        className={`flex-1 transition-all duration-300 ease-in-out mt-14 relative overflow-hidden 
          ${isLeftSidebarOpen ? 'md:ml-64' : 'ml-0'} 
          md:ml-64 
          ${isRightSidebarVisuallyOpen ? 'md:mr-80' : 'mr-0'} 
          md:mr-80`}
      >
        {showPlayer && selectedChannel ? (
          <VideoPlayer
            streamUrl={selectedChannel.iptv_urls[0] || selectedChannel.youtube_urls[0] || ''}
            onClose={() => setShowPlayer(false)}
            channelName={selectedChannel.name}
          />
        ) : (
          <InteractiveGlobe onCountrySelect={handleCountryClick} />
        )}
      </main>

      <aside 
        className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-full max-w-xs sm:max-w-sm md:w-80 bg-gray-900 border-l border-gray-700 flex flex-col 
          transition-transform duration-300 ease-in-out z-30 
          md:translate-x-0 
          ${isRightSidebarVisuallyOpen && !showPlayer ? 'translate-x-0' : 'translate-x-full'}`
        }
      >
        {rightSidebarView === 'countries' ? (
          <CountryList onCountryClick={handleCountryClick} onClose={handleBackToCountries} />
        ) : (
          isLoadingRightSidebar ? (
            <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
          ) : rightSidebarError ? (
            <div className="flex items-center justify-center h-full p-4 text-center text-red-400">
              <p>Error: {rightSidebarError}</p>
            </div>
          ) : (
            <ChannelList
              title={currentCategory || `Search: "${searchTerm}"`}
              countryName={selectedCountryName}
              capital={selectedCapital}
              channels={channelsToDisplay}
              onChannelClick={handleChannelClick}
              selectedChannelId={selectedChannel?.nanoid}
              onClose={handleBackToCountries}
            />
          )
        )}
      </aside>

      {isLeftSidebarOpen && (
        <div 
          onClick={toggleLeftSidebar} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
} 