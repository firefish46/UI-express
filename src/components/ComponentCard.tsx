"use client";
import { useState } from "react";
import Link from "next/link";
import { UIComponent } from "@/types";
import { Clipboard, Check } from "lucide-react"; // Make sure to install lucide-react

export default function ComponentCard({ item }: { item: UIComponent }) {
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents clicking the button from triggering a link
    navigator.clipboard.writeText(item.css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* 1. PREVIEW AREA */}
      <Link href={`/component/${item.id}`} className="relative h-52 w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-gray-100 cursor-pointer">
        <style dangerouslySetInnerHTML={{ __html: item.css }} />
        <div className="relative z-10" dangerouslySetInnerHTML={{ __html: item.html }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      </Link>

      {/* 2. INFO & ACTIONS */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{item.title}</h3>
            <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
              {item.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {/* Main Action: Go to Detail Page */}
          <Link 
            href={`/component/${item.id}`}
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
          >
            View Code
          </Link>
          
          {/* Quick Action: Copy CSS directly */}
          <button 
            onClick={handleQuickCopy}
            className={`flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-xs font-bold rounded-xl transition-all ${
              copied ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? "Copied!" : "Quick CSS"}
          </button>
        </div>
      </div>
    </div>
  );
}