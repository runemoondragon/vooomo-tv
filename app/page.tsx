'use client';

import { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import CountryList from './components/CountryList';
import Header from './components/Header';

interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
}

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [rightSidebarView, setRightSidebarView] = useState<'countries' | 'channels' | 'search'>('countries');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Channel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

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
    setSelectedCountry(countryCode);
    setCurrentCategory('');
    setSearchTerm('');
    setSearchResults([]);
    fetchChannels(`/api/countries/${countryCode.toLowerCase()}`, 'country');
  };

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setSelectedCountry(null);
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
    } else {
      setCurrentCategory('');
      setSelectedCountry(null);
      fetchChannels(`/api/search?q=${encodeURIComponent(term.trim())}`, 'search');
    }
  }, [fetchChannels]);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
  };

  const handleBackToCountries = () => {
    setRightSidebarView('countries');
    setChannels([]);
    setSearchResults([]);
    setCurrentCategory('');
    setSelectedCountry(null);
    setSelectedChannel(null);
    setShowPlayer(false);
    setError(null);
    setSearchError(null);
    setSearchTerm('');
  };

  const channelListTitle = rightSidebarView === 'search' ? `Search: "${searchTerm}"` : selectedCountry ? selectedCountry.toUpperCase() : currentCategory;
  const channelsToDisplay = rightSidebarView === 'search' ? searchResults : channels;
  const isLoadingRightSidebar = rightSidebarView === 'search' ? isSearching : isLoading;
  const rightSidebarError = rightSidebarView === 'search' ? searchError : error;

  const targetCountryCode = selectedCountry || selectedChannel?.country || null;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Header
        onBackToCountries={handleBackToCountries}
        showBackButton={rightSidebarView === 'channels' || rightSidebarView === 'search'}
        targetCountryCode={targetCountryCode}
      />
      <Sidebar
        onCategoryClick={handleCategoryClick}
        activeCategory={currentCategory}
        onSearchTermChange={handleSearchTermChange}
      />

      <main className="flex-1 ml-64 mr-80 mt-14 p-4 overflow-y-auto">
        {showPlayer && selectedChannel ? (
          <VideoPlayer
            streamUrl={selectedChannel.iptv_urls[0] || selectedChannel.youtube_urls[0] || ''}
            onClose={() => setShowPlayer(false)}
            channelName={selectedChannel.name}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to VooomoTV</h1>
              <p className="text-gray-400 text-lg">
                Select a category, country, or search for channels.
              </p>
            </div>
          </div>
        )}
      </main>

      <aside className="fixed top-14 right-0 w-80 h-[calc(100vh-3.5rem)] bg-gray-900 border-l border-gray-700 flex flex-col">
        {rightSidebarView === 'countries' ? (
          <CountryList onCountryClick={handleCountryClick} />
        ) : (
          isLoadingRightSidebar ? (
            <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
          ) : rightSidebarError ? (
            <div className="flex items-center justify-center h-full p-4 text-center text-red-400">
              <p>Error: {rightSidebarError}</p>
            </div>
          ) : (
            <ChannelList
              title={channelListTitle}
              channels={channelsToDisplay}
              onChannelClick={handleChannelClick}
              selectedChannelId={selectedChannel?.nanoid}
            />
          )
        )}
      </aside>
    </div>
  );
} 