"use client";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme

export default function CodeBox({ code, lang }: { code: string; lang: string }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className="relative group">
      <pre className="rounded-lg !bg-gray-900 !m-0 overflow-auto max-h-96">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}