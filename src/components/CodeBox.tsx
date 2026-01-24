"use client";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; 

export default function CodeBox({ code, lang }: { code: string; lang: string }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

return (
  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
    <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800/50">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
      <span className="ml-2 text-[10px] text-gray-500 font-mono uppercase">{lang}</span>
    </div>
    <pre className="p-4 overflow-auto max-h-80">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  </div>
);}