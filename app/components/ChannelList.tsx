'use client';

import React from 'react';
import { useState } from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

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
}

const ChannelList: React.FC<ChannelListProps> = ({ title, channels, onChannelClick, selectedChannelId }) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate" title={title}>{title}</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">{channels.length} channels</p>
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
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 border-b border-gray-800 text-left transition-colors duration-150 ${isSelected ? 'bg-green-600/30' : ''}`}
                onClick={() => onChannelClick(channel)}
                title={`Play ${channel.name}`}
              >
                {/* Country Flag */}
                <span className="text-xl w-6 flex-shrink-0">
                  <img
                    src={`https://flagcdn.com/w40/${channel.country.toLowerCase()}.png`}
                    alt={`${channel.country} flag`}
                    className="w-full h-auto rounded-sm object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </span>

                {/* Channel Name & Language */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" title={channel.name}>{channel.name}</div>
                  <div className="text-xs text-gray-400 uppercase truncate" title={channel.language}>
                    {channel.language}
                  </div>
                </div>

                {/* Play Icon (visible when selected) */}
                {isSelected && (
                  <PlayCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
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