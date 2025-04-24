'use client';

import React from 'react';
import { useState } from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
}

interface ChannelListProps {
  title: string;
  channels: Channel[];
  onChannelClick: (channel: Channel) => void;
  selectedChannelId?: string;
  onClose: () => void;
  onBack: () => void;
  countryName?: string | null;
  capital?: string | null;
}

const ChannelList: React.FC<ChannelListProps> = ({ title, channels, onChannelClick, selectedChannelId, onClose, onBack, countryName, capital }) => {
  const displayTitle = countryName || title;
  // Capital city is now secondary info, channel count will be separate
  // const secondaryInfo = countryName && capital ? capital : `${channels.length} channels`; 

  return (
    <div className="w-full h-full bg-gray-900 text-white flex flex-col">
      {/* Header with Close button & Channel Count for mobile */}
      <div className="p-3 md:p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10 flex items-center justify-between gap-2">
        {/* Left side: Title and Capital */}
        <div className="flex items-center gap-2 flex-shrink min-w-0">
          {/* Back button - Desktop Sidebar Only */}
          <button 
            onClick={onBack} 
            className="p-1 text-gray-400 hover:text-white hidden md:block"
            aria-label="Back to countries"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          {/* Title/Capital container */}
          <div className="flex-shrink min-w-0">
            <h2 className="text-base md:text-lg font-semibold truncate" title={displayTitle}>{displayTitle}</h2>
            {/* Show capital only if available */} 
            {countryName && capital && (
               <p className="text-xs md:text-sm text-gray-400 mt-1 truncate" title={capital}>{capital}</p>
            )}
          </div>
        </div>
        
        {/* Right side: Channel Count & Close Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">
                {channels.length} channels
            </span>
             {/* Close button removed - handled by overlay/player state */}
            {/* 
            <button 
              onClick={onClose} 
              className="p-1 text-gray-400 hover:text-white md:hidden"
              aria-label="Close channel list"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            */}
        </div>
      </div>

      {/* Channel List - Make scrollable */}
      <div className="flex-1 overflow-y-auto">
        {channels.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No channels found for {title}.
          </div>
        ) : (
          channels.map((channel) => {
            const isSelected = channel.nanoid === selectedChannelId;
            return (
              <button
                key={channel.nanoid}
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 hover:bg-gray-700 border-b border-gray-800 text-left transition-colors duration-150 ${isSelected ? 'bg-green-600/30' : ''}`}
                onClick={() => onChannelClick(channel)}
                title={`Play ${channel.name}`}
              >
                {/* Country Flag */}
                <span className="text-lg w-5 md:w-6 flex-shrink-0">
                  <img
                    src={`https://flagcdn.com/w40/${channel.country.toLowerCase()}.png`}
                    alt={`${channel.country} flag`}
                    width={24}
                    height={16}
                    className="rounded-sm object-contain h-auto"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </span>

                {/* Channel Name & Language */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium truncate" title={channel.name}>{channel.name}</div>
                  <div className="text-xs text-gray-400 uppercase truncate" title={channel.language}>
                    {channel.language}
                  </div>
                </div>

                {/* Play Icon (visible when selected) */}
                {isSelected && (
                  <PlayCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChannelList; 