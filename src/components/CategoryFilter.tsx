//src/components/CategoryFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "Buttons", "Cards", "Inputs", "Navbars", "Footers"];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page"); // Reset page when category changes
    router.push(`/?${params.toString()}`);
  };

  return (
    <select 
      value={currentCategory}
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
    >
      {CATEGORIES.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}