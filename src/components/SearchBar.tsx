"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const previousSearchRef = useRef(searchParams.get("q") || "");

  useEffect(() => {
    if (searchTerm === previousSearchRef.current) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) params.set("q", searchTerm);
      else params.delete("q");

      previousSearchRef.current = searchTerm;

      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
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
  );
}