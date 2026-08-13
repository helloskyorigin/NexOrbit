'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface MemorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const MemorySearch: React.FC<MemorySearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search facts, contexts, preferences..."
        className="w-full pl-10 pr-10 py-1.5 h-9 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200/90 hover:border-slate-300 focus:border-indigo-500 rounded-xl outline-none transition-colors"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
