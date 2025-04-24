'use client';

import React from 'react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CountryList from './CountryList';
import ChannelList from './ChannelList';

// Reuse Channel interface (consider moving to a shared types file)
interface Channel {
    nanoid: string;
    name: string;
    iptv_urls: string[];
    youtube_urls: string[];
    language: string;
    country: string;
    isGeoBlocked: boolean;
}

interface ListOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    content: 'countries' | 'channels' | 'search';
    // Props to pass down to CountryList/ChannelList
    listDisplayTitle: string;
    selectedCountryName: string | null;
    selectedCapital: string | null;
    channelsToDisplay: Channel[];
    isLoading: boolean;
    error: string | null;
    onCountryClick: (countryCode: string) => void;
    onChannelClick: (channel: Channel) => void;
    selectedChannelId?: string;
    isPlayerOpen: boolean;
}

const ListOverlay: React.FC<ListOverlayProps> = ({ 
    isOpen, 
    onClose, 
    onBack,
    content, 
    listDisplayTitle, 
    selectedCountryName, 
    selectedCapital, 
    channelsToDisplay,
    isLoading,
    error,
    onCountryClick,
    onChannelClick,
    selectedChannelId,
    isPlayerOpen
}) => {
  if (!isOpen) return null;

  const containerHeight = isPlayerOpen ? 'h-[50%]' : 'h-[85%]';
  const contentPaddingTop = isPlayerOpen ? 'pt-1' : 'pt-4';

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex flex-col justify-end md:hidden"
      onClick={onClose} // Close on overlay click
    >
        <div 
           className={`bg-gray-900 ${containerHeight} rounded-t-xl flex flex-col overflow-hidden`}
           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
         >
            {/* Header Area with Buttons */}
            <div className="relative h-12 border-b border-gray-700/50 flex-shrink-0"> {/* Added explicit header div */}
                 {/* Back Button - Absolute positioning within relative header */}
             {(content === 'channels' || content === 'search') && (
                 <button 
                     onClick={onBack} 
                     className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white z-50" /* Positioned left */
                     aria-label="Back to countries"
                 >
                     <ArrowLeftIcon className="w-6 h-6" />
                 </button>
             )}
             {/* Close Button - Absolute positioning within relative header */}
             <button 
               onClick={onClose} 
               className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white z-50" /* Positioned right */
               aria-label="Close list"
             >
               <XMarkIcon className="w-6 h-6" />
             </button>
             </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto pt-2`}> {/* Reduced padding-top as header now occupies space */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full p-4 text-center text-red-400">
                        <p>Error: {error}</p>
                    </div>
                ) : content === 'countries' ? (
                    <CountryList 
                       onCountryClick={onCountryClick} 
                       onClose={onClose} // Pass onClose for internal header button (although header is hidden now)
                     />
                ) : (
                    <ChannelList
                        title={listDisplayTitle}
                        countryName={selectedCountryName}
                        capital={selectedCapital}
                        channels={channelsToDisplay}
                        onChannelClick={onChannelClick}
                        selectedChannelId={selectedChannelId}
                        onBack={onBack}
                        onClose={onClose} // Pass onClose for internal header button
                    />
                )}
            </div>
        </div>
    </div>
  );
};

export default ListOverlay;