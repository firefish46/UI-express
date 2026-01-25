"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, LayoutGrid, Loader2 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // 1. Initial value from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  
  // 2. Use a Ref to keep track of the PREVIOUS search to stop the loop
  const previousSearchRef = useRef(searchParams.get("q") || "");

  useEffect(() => {
    // 3. Only run if the local search term is different from what's already in the URL
    if (searchTerm === previousSearchRef.current) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }

      previousSearchRef.current = searchTerm; // Update the ref

      startTransition(() => {
        // use { scroll: false } to prevent the page from jumping to top
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    }, 400); // Slightly longer debounce for stability

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

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

            <div className="hidden md:block relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isPending ? (
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <input
                type="text"
                placeholder="Search components..."
                className="block w-64 lg:w-96 pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

        <div className="flex items-center gap-4">
  <div className="relative group">
    <Link 
      href="/submit" 
      /* hover:bg-[var(--hover-accent)] uses your global.css variable */
      className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all active:scale-95 hover:bg-[var(--hover)]"
      style={{ anchorName: '--add-button' }} // Connects link to tooltip
    >
      <Plus className="w-4 h-4" />
      <span>ADD NEW</span>
    </Link>

    {/* Tooltip with automatic overflow handling */}
    <div 
      className="absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded"
      style={{
        fontFamily:'exo',
        positionAnchor: '--add-button',
        positionArea: 'left center',      // Default position
        positionTry: 'bottom center',    // Flip here if 'top' overflows screen
        margin: '8px 10px'                  // Spacing from the button
      }}
    >
      Create a new entry
    </div>
  </div>
</div>


        </div>
      </div>
    </nav>
  );
}