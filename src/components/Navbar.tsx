"use client"; // Keep it as client for the interactive tooltips/plus button

import Link from 'next/link';
import { Plus, LayoutGrid } from 'lucide-react';
import { Suspense } from 'react';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md" style={{ fontFamily: 'exo' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <LayoutGrid className="text-white w-5 h-5" />
              </div>
              <span className="font-rampart text-2xl tracking-tighter uppercase">
                UI <span className="text-blue-600">Express</span>
              </span>
            </Link>

            {/* WRAP THE SEARCHBAR HERE TOO */}
            <Suspense fallback={<div className="h-10 w-64 bg-slate-100 animate-pulse rounded-xl" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/submit" 
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all active:scale-95 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}