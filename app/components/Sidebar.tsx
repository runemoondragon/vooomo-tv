'use client';

import { useState, useEffect } from 'react';
import {
  TvIcon,
  MusicalNoteIcon,
  TrophyIcon,
  FilmIcon,
  GlobeAltIcon,
  BeakerIcon,
  NewspaperIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  HomeIcon,
  UserGroupIcon,
  ScaleIcon,
  HeartIcon,
  SparklesIcon,
  SunIcon,
  ShoppingBagIcon,
  CloudIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  TruckIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

interface Category {
  name: string;
  icon?: JSX.Element;
  definition?: string;
  header?: boolean;
}

interface SidebarProps {
  onCategoryClick: (category: string) => void;
  activeCategory: string;
  onSearchTermChange: (term: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onCategoryClick, activeCategory, onSearchTermChange, isOpen, onClose }: SidebarProps) {
  const allCategories: readonly Category[] = [
    { name: 'Explore', header: true },
    { name: 'All Channels', icon: <TvIcon className="w-5 h-5" /> },
    { name: 'News', icon: <NewspaperIcon className="w-5 h-5" />, definition: 'Programming is mostly news' },
    { name: 'Music', icon: <MusicalNoteIcon className="w-5 h-5" />, definition: 'Programming is music or music related' },
    { name: 'Sports', icon: <TrophyIcon className="w-5 h-5" />, definition: 'Programming is sports' },
    { name: 'Business', icon: <BuildingOfficeIcon className="w-5 h-5" />, definition: 'Programming related to business' },
    { name: 'Classic', icon: <FilmIcon className="w-5 h-5" />, definition: 'Programming is mostly from earlier decades' },
    { name: 'Comedy', icon: <PuzzlePieceIcon className="w-5 h-5" />, definition: 'Programming is mostly comedy' },
    { name: 'Cooking', icon: <BeakerIcon className="w-5 h-5" />, definition: 'Programs related to cooking or food in general' },
    { name: 'Culture', icon: <GlobeAltIcon className="w-5 h-5" />, definition: 'Programming is mostly about art and culture' },
    { name: 'Documentary', icon: <VideoCameraIcon className="w-5 h-5" />, definition: 'Programming that depicts a person or real-world event' },
    { name: 'Education', icon: <AcademicCapIcon className="w-5 h-5" />, definition: 'Programming is intended to be educational' },
    { name: 'Entertainment', icon: <TvIcon className="w-5 h-5" />, definition: 'Channels with a variety of entertainment programs' },
    { name: 'Kids', icon: <UserGroupIcon className="w-5 h-5" />, definition: 'Programming targeted to children' },
    { name: 'Legislative', icon: <ScaleIcon className="w-5 h-5" />, definition: 'Programming specific to the operation of government' },
    { name: 'Movies', icon: <FilmIcon className="w-5 h-5" />, definition: 'Channels that only show movies' },
    { name: 'Relax', icon: <HomeIcon className="w-5 h-5" />, definition: 'Programming is calm sounding and beautiful views' },
    { name: 'Religious', icon: <BookOpenIcon className="w-5 h-5" />, definition: 'Religious programming' },
    { name: 'Science', icon: <BeakerIcon className="w-5 h-5" />, definition: 'Science and Technology' },
    { name: 'Series', icon: <TvIcon className="w-5 h-5" />, definition: 'Channels that only show series' },
    { name: 'Shop', icon: <ShoppingBagIcon className="w-5 h-5" />, definition: 'Programming is for shopping' },
    { name: 'Travel', icon: <GlobeAltIcon className="w-5 h-5" />, definition: 'Programming is travel related' },
    { name: 'Weather', icon: <CloudIcon className="w-5 h-5" />, definition: 'Programming is focused on weather' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e1e] text-white border-r border-gray-800 flex flex-col z-40 
                  transition-transform duration-300 ease-in-out 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 md:top-14 md:h-[calc(100vh-3.5rem)]`}
    > 
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
        {allCategories.map((item, index) => {
          if (item.header) {
            return (
              <div key={`header-${item.name}-${index}`} className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {item.name}
              </div>
            );
          } else {
            return (
              <button
                key={item.name}
                onClick={() => onCategoryClick(item.name)}
                className={`w-full flex items-center px-4 py-1.5 text-gray-300 hover:bg-gray-700 group text-left transition-colors duration-150 ${
                  activeCategory === item.name ? 'bg-gray-600 text-white' : ''
                }`}
                title={item.definition}
              >
                <span className="w-5 mr-3 flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-sm truncate">{item.name}</span>
              </button>
            );
          }
        })}

       {/* Divider */}
<hr className="my-3 border-gray-700" />

{/* Bottom Section - still scrollable */}
<button className="w-full flex items-center px-4 py-1.5 text-gray-300 hover:bg-gray-700 text-left text-sm">
  <span className="w-5 mr-3"><ChatBubbleBottomCenterTextIcon className="w-5 h-5" /></span>
  About
</button>

<button className="w-full flex items-center px-4 py-1.5 text-gray-300 hover:bg-gray-700 text-left text-sm">
  <span className="w-5 mr-3"><ShieldCheckIcon className="w-5 h-5" /></span>
  Privacy Policy
</button>

<a
  href="https://vooomo.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full flex items-center px-4 py-1.5 text-gray-300 hover:bg-gray-700 text-left text-sm"
>
  <span className="w-5 mr-3"><InboxIcon className="w-5 h-5" /></span>
  Vooomo Movies
</a>

      </nav>
    </aside>
  );
}
