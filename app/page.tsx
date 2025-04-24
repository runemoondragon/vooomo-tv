'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import CountryList from './components/CountryList';
import Header from './components/Header';
import countriesMetadata from './countries_metadata.json'; // Import metadata
import BottomPanelHandle from './components/BottomPanelHandle';
import ListOverlay from './components/ListOverlay';

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
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [selectedCapital, setSelectedCapital] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [rightSidebarView, setRightSidebarView] = useState<'countries' | 'channels' | 'search'>('countries');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Channel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  // --- Mobile Panel State --- Only affects mobile overlay
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<'countries' | 'channels' | 'search'>('countries');
  // -------------------------

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const closePanel = () => setIsPanelOpen(false);

  const fetchChannels = useCallback(async (url: string, type: 'category' | 'country' | 'search') => {
    const loadingSetter = type === 'search' ? setIsSearching : setIsLoading;
    const errorSetter = type === 'search' ? setSearchError : setError;
    const resultsSetter = type === 'search' ? setSearchResults : setChannels;
    const targetView = type === 'search' ? 'search' : 'channels';

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
      
      // Set state for BOTH views
      setRightSidebarView(targetView);
      setPanelContent(targetView);
      setIsPanelOpen(true);

      setIsLeftSidebarOpen(false);
    } catch (err) {
      console.error(`Error loading ${type} results:`, err);
      errorSetter(err instanceof Error ? err.message : 'An unknown error occurred');
      resultsSetter([]);
    } finally {
      loadingSetter(false);
    }
  }, []);

  const handleCountryClick = (countryCode: string) => {
    const upperCode = countryCode.toUpperCase();
    const metadata = typedCountriesMetadata[upperCode];
    setSelectedCountry(upperCode);
    setSelectedCountryName(metadata?.country || upperCode);
    setSelectedCapital(metadata?.capital || null);
    setCurrentCategory('');
    setSearchTerm(''); 
    fetchChannels(`/api/countries/${countryCode.toLowerCase()}`, 'country');
  };

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setSelectedCountry(null);
    setSelectedCountryName(null);
    setSelectedCapital(null);
    setSearchTerm(''); 
    fetchChannels(`/api/categories/${category.toLowerCase()}`, 'category');
  };

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
       setSearchResults([]);
       setIsSearching(false);
       setSearchError(null);
       setRightSidebarView('countries');
       setPanelContent('countries');
       setIsPanelOpen(false);
       setCurrentCategory('');
       setSelectedCountry(null);
       setSelectedCountryName(null); 
       setSelectedCapital(null);
    } else {
       setCurrentCategory('');
       setSelectedCountry(null);
       setSelectedCountryName(null); 
       setSelectedCapital(null);
       fetchChannels(`/api/search?q=${encodeURIComponent(term.trim())}`, 'search');
    }
  }, [fetchChannels]);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
    setIsLeftSidebarOpen(false);
  };

  const handleCloseRightView = () => {
      setPanelContent('countries');
      setRightSidebarView('countries');
      setChannels([]);
      setSearchResults([]);
      setCurrentCategory('');
      setSelectedCountry(null);
      setSelectedCountryName(null); 
      setSelectedCapital(null);
      setError(null);
      setSearchError(null);
      setSearchTerm(''); 
  };

  const channelsToDisplay = 
     (rightSidebarView === 'search' || panelContent === 'search') ? searchResults 
     : channels;
  const isLoadingList = 
     (rightSidebarView === 'search' || panelContent === 'search') ? isSearching 
     : isLoading;
  const listError = 
     (rightSidebarView === 'search' || panelContent === 'search') ? searchError 
     : error;

  const targetCountryCode = selectedCountry || selectedChannel?.country || null;
  const listDisplayTitle = 
      rightSidebarView === 'search' ? `Search: "${searchTerm}"`
      : currentCategory ? currentCategory
      : "";

  return (
    <div className="flex h-screen flex-col bg-black text-white overflow-hidden">
      <Header
        onToggleLeftSidebar={toggleLeftSidebar}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
      />

      <div className="flex flex-1 overflow-hidden pt-14"> 
         <Sidebar 
            onCategoryClick={handleCategoryClick} 
            activeCategory={currentCategory} 
            onSearchTermChange={handleSearchTermChange}
            isOpen={isLeftSidebarOpen}
            onClose={toggleLeftSidebar}
         />
         
         <main 
            className={`flex-1 relative overflow-hidden transition-all duration-300 ease-in-out 
                      md:ml-64 
                      md:mr-80 
                      ${isLeftSidebarOpen ? 'ml-64' : 'ml-0'} 
                      md:pb-0`
            }
         >
           {showPlayer && selectedChannel && (
             <VideoPlayer
               streamUrl={selectedChannel.iptv_urls[0] || selectedChannel.youtube_urls[0] || ''}
               onClose={() => setShowPlayer(false)}
               channelName={selectedChannel.name}
             />
           )}
           {!showPlayer && (
             <InteractiveGlobe onCountrySelect={handleCountryClick} />
           )}
         </main>

         <aside 
            className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-80 bg-gray-900 border-l border-gray-700 flex flex-col z-20 
                      transform transition-transform duration-300 ease-in-out 
                      translate-x-full md:translate-x-0`
            }
          > 
            {rightSidebarView === 'countries' ? (
              <CountryList 
                onCountryClick={handleCountryClick} 
                onClose={handleCloseRightView} 
                targetCountryCode={targetCountryCode}
              />
            ) : ( 
              isLoadingList ? (
                 <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
              ) : listError ? (
                 <div className="flex items-center justify-center h-full p-4 text-center text-red-400"><p>Error: {listError}</p></div>
              ) : (
                <ChannelList
                  title={listDisplayTitle}
                  countryName={selectedCountryName}
                  capital={selectedCapital}
                  channels={channelsToDisplay}
                  onChannelClick={handleChannelClick}
                  selectedChannelId={selectedChannel?.nanoid}
                  onClose={handleCloseRightView}
                  onBack={handleCloseRightView}
                />
              )
            )}
          </aside>
      </div>

      <BottomPanelHandle 
         onOpen={() => { setPanelContent('countries'); setIsPanelOpen(true); }} 
         targetCountryCode={targetCountryCode} 
      />
      
      <ListOverlay 
         isOpen={isPanelOpen} 
         onClose={closePanel}
         content={panelContent}
         onBack={handleCloseRightView}
         isPlayerOpen={showPlayer}
         listDisplayTitle={listDisplayTitle}
         selectedCountryName={selectedCountryName}
         selectedCapital={selectedCapital}
         channelsToDisplay={channelsToDisplay}
         isLoading={isLoadingList}
         error={listError}
         onCountryClick={handleCountryClick}
         onChannelClick={handleChannelClick}
         selectedChannelId={selectedChannel?.nanoid}
      />

      {isLeftSidebarOpen && (
         <div onClick={toggleLeftSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>
      )}
    </div>
  );
} 