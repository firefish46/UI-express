"use client";

import { useState, use } from "react";
import { components as staticComponents } from "@/data/components";
import { notFound } from "next/navigation";
import Link from "next/link";
import ComponentViewer from "@/components/ComponentViewer";
import { UIComponent } from "@/types";

export default function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap the async params
  const { id } = use(params);

  // 2. Lazy initialize the item state
  // This runs ONCE during the initial mount, preventing cascading renders.
  const [item] = useState<UIComponent | null>(() => {
    // A. Check static components first
    const staticItem = staticComponents.find((c) => c.id === id);
    if (staticItem) return staticItem;

    // B. Check localStorage if we are in the browser
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("local-library");
      if (localData) {
        const localComponents: UIComponent[] = JSON.parse(localData);
        return localComponents.find((c) => c.id === id) || null;
      }
    }

    return null;
  });

  // 3. If the item doesn't exist in either place, show 404
  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/" 
          className="text-gray-500 hover:text-black mb-8 inline-block transition-colors font-medium"
        >
          ← Back to Library
        </Link>
        <ComponentViewer item={item} />
      </div>
    </div>
  );
}