"use client";
import { useState } from "react";
import { components as staticComponents } from "@/data/components";
import ComponentCard from "@/components/ComponentCard";
import { Search } from "lucide-react";
import { UIComponent } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Initialize state once from both sources. 
  // This function runs once, preventing the "cascading render" error.
  const [allComponents] = useState<UIComponent[]>(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("local-library");
      const localComponents = localData ? JSON.parse(localData) : [];
      // Combine local submissions first, then static ones
      return [...localComponents, ...staticComponents];
    }
    return staticComponents;
  });

  // 2. Derive filtered items during render
  const filteredItems = allComponents.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-black text-slate-900">Browse Library</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search buttons, cards, animations..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
          <p className="text-gray-400 font-medium">No results for `{searchQuery}`</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <ComponentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}