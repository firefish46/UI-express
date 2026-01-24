"use client";
import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import CodeBox from "@/components/CodeBox";
import { UIComponent } from "@/types";  
export default function ComponentViewer({ item }: { item: UIComponent }) {
  const [viewMode, setViewMode] = useState("desktop");

  const widths: Record<string, string> = {
    mobile: "375px",
    tablet: "640px",
    desktop: "100%",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Side: Live Preview */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-400 uppercase">Preview</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setViewMode("mobile")} className={`p-2 rounded ${viewMode === "mobile" ? "bg-white shadow-sm" : "text-gray-400"}`}><Smartphone size={16} /></button>
            <button onClick={() => setViewMode("tablet")} className={`p-2 rounded ${viewMode === "tablet" ? "bg-white shadow-sm" : "text-gray-400"}`}><Tablet size={16} /></button>
            <button onClick={() => setViewMode("desktop")} className={`p-2 rounded ${viewMode === "desktop" ? "bg-white shadow-sm" : "text-gray-400"}`}><Monitor size={16} /></button>
          </div>
        </div>

        <div className="border border-gray-100 rounded-3xl bg-slate-50 flex items-center justify-center relative overflow-hidden min-h-[400px] transition-all duration-500 ease-in-out mx-auto"
             style={{ width: widths[viewMode] }}>
          <style dangerouslySetInnerHTML={{ __html: item.css }} />
          <div dangerouslySetInnerHTML={{ __html: item.html }} />
        </div>
      </div>

      {/* Right Side: Code snippets */}
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-black">{item.title}</h1>
        <CodeBox code={item.html} lang="html" />
        <CodeBox code={item.css} lang="css" />
      </div>
    </div>
  );
}