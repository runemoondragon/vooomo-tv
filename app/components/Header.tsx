'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onToggleLeftSidebar: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export default function Header({ 
  onToggleLeftSidebar, 
  searchTerm, 
  onSearchTermChange 
}: HeaderProps) {

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#1e1e1e] text-white z-50 flex items-center justify-between px-2 md:px-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        {/* Hamburger Menu Button - Mobile Only */}
        <button 
           onClick={onToggleLeftSidebar} 
           className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
           aria-label="Open sidebar"
         >
           <Bars3Icon className="h-6 w-6 text-white" />
         </button>
        {/* Show Title on Mobile OR Desktop */} 
        <span className="text-xl font-semibold">Vooomo Tv</span> 
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
 {/* Allow search to take more space */}
         {/* Search Input */}
        <div className="relative flex-grow">
          <input
            type="search"
            placeholder="Search all channels.."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
} 