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
  MagnifyingGlassIcon,
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
}

export default function Sidebar({ onCategoryClick, activeCategory, onSearchTermChange }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchTermChange(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearchTermChange]);

  const allCategories: readonly Category[] = [
    { name: 'Explore', header: true },
    { name: 'All Channels', icon: <TvIcon className="w-5 h-5" /> },
    { name: 'Top News', icon: <NewspaperIcon className="w-5 h-5" /> },
    { name: 'News', icon: <NewspaperIcon className="w-5 h-5" />, definition: 'Programming is mostly news' },
    { name: 'Music', icon: <MusicalNoteIcon className="w-5 h-5" />, definition: 'Programming is music or music related' },
    { name: 'Sports', icon: <TrophyIcon className="w-5 h-5" />, definition: 'Programming is sports' },
    { name: 'Auto', icon: <TruckIcon className="w-5 h-5" />, definition: 'Programming related to cars, motorcycles, and other automobiles' },
    { name: 'Animation', icon: <SparklesIcon className="w-5 h-5" />, definition: 'Programming is mostly 2D or 3D animation' },
    { name: 'Business', icon: <BuildingOfficeIcon className="w-5 h-5" />, definition: 'Programming related to business' },
    { name: 'Classic', icon: <FilmIcon className="w-5 h-5" />, definition: 'Programming is mostly from earlier decades' },
    { name: 'Comedy', icon: <PuzzlePieceIcon className="w-5 h-5" />, definition: 'Programming is mostly comedy' },
    { name: 'Cooking', icon: <BeakerIcon className="w-5 h-5" />, definition: 'Programs related to cooking or food in general' },
    { name: 'Culture', icon: <GlobeAltIcon className="w-5 h-5" />, definition: 'Programming is mostly about art and culture' },
    { name: 'Documentary', icon: <VideoCameraIcon className="w-5 h-5" />, definition: 'Programming that depicts a person or real-world event' },
    { name: 'Education', icon: <AcademicCapIcon className="w-5 h-5" />, definition: 'Programming is intended to be educational' },
    { name: 'Entertainment', icon: <TvIcon className="w-5 h-5" />, definition: 'Channels with a variety of entertainment programs' },
    { name: 'Family', icon: <UserGroupIcon className="w-5 h-5" />, definition: 'Programming that is suitable for all members of a family' },
    { name: 'General', icon: <TvIcon className="w-5 h-5" />, definition: 'Provides a variety of different programming' },
    { name: 'Kids', icon: <UserGroupIcon className="w-5 h-5" />, definition: 'Programming targeted to children' },
    { name: 'Legislative', icon: <ScaleIcon className="w-5 h-5" />, definition: 'Programming specific to the operation of government' },
    { name: 'Lifestyle', icon: <HeartIcon className="w-5 h-5" />, definition: 'Programs related to health, fitness, leisure, fashion, decor, etc.' },
    { name: 'Movies', icon: <FilmIcon className="w-5 h-5" />, definition: 'Channels that only show movies' },
    { name: 'Outdoor', icon: <SunIcon className="w-5 h-5" />, definition: 'Programming related to outdoor activities like fishing, hunting, etc.' },
    { name: 'Relax', icon: <HomeIcon className="w-5 h-5" />, definition: 'Programming is calm sounding and beautiful views' },
    { name: 'Religious', icon: <BookOpenIcon className="w-5 h-5" />, definition: 'Religious programming' },
    { name: 'Science', icon: <BeakerIcon className="w-5 h-5" />, definition: 'Science and Technology' },
    { name: 'Series', icon: <TvIcon className="w-5 h-5" />, definition: 'Channels that only show series' },
    { name: 'Shop', icon: <ShoppingBagIcon className="w-5 h-5" />, definition: 'Programming is for shopping' },
    { name: 'Travel', icon: <GlobeAltIcon className="w-5 h-5" />, definition: 'Programming is travel related' },
    { name: 'Weather', icon: <CloudIcon className="w-5 h-5" />, definition: 'Programming is focused on weather' },
  ];

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-[#1e1e1e] text-white border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-[#1e1e1e] z-10">
         <div className="flex items-center gap-2 mb-3">
           <div className="bg-green-600 p-1.5 rounded flex-shrink-0">
              <TvIcon className="w-6 h-6 text-white" />
           </div>
           <div className="relative flex-grow">
             <input
               type="search"
               placeholder="Search all channels..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-8 pr-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
             />
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
           </div>
         </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
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
                className={`w-full flex items-center px-4 py-1.5 text-gray-300 hover:bg-gray-700 group text-left transition-colors duration-150 ${activeCategory === item.name ? 'bg-gray-600 text-white' : ''}`}
                title={item.definition}
              >
                <span className="w-5 mr-3 flex-shrink-0">{item.icon}</span> 
                <span className="flex-1 text-sm truncate">{item.name}</span>
              </button>
            );
          }
        })}
      </nav>
    </aside>
  );
} 