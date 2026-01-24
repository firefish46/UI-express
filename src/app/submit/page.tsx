"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PartyPopper, ArrowLeft, Send, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  // --- 1. LAZY STATE INITIALIZATION ---
  // This avoids the "setState in useEffect" error by setting the value during the first render.
  const [title, setTitle] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("draft-title") || "";
    return "";
  });

  const [author, setAuthor] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("draft-author") || "";
    return "";
  });

  const [category, setCategory] = useState("Buttons");

  const [html, setHtml] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("draft-html") || '<button class="custom-btn">Hover Me</button>';
    }
    return '<button class="custom-btn">Hover Me</button>';
  });

  const [css, setCss] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("draft-css") || `.custom-btn {
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}`;
    }
    return "";
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 2. PERSISTENCE EFFECT ---
  // Saves to localStorage whenever a value changes
  useEffect(() => {
    localStorage.setItem("draft-title", title);
    localStorage.setItem("draft-author", author);
    localStorage.setItem("draft-html", html);
    localStorage.setItem("draft-css", css);
  }, [title, author, html, css]);

const handlePublish = (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  // 1. Create the new component object
  const newComponent = {
    id: Date.now().toString(), // Unique ID based on time
    title: title || "Untitled Component",
    author: author || "Anonymous",
    category: category,
    html: html,
    css: css,
    description: "User submitted component"
  };

  // 2. Get existing local components or start a new list
  const existingItems = JSON.parse(localStorage.getItem("local-library") || "[]");
  
  // 3. Add the new one to the list
  const updatedLibrary = [newComponent, ...existingItems];
  
  // 4. Save the updated list back to LocalStorage
  localStorage.setItem("local-library", JSON.stringify(updatedLibrary));

  setTimeout(() => {
    setIsSubmitting(false);
    setShowSuccess(true);
    // Clear only the draft keys, not the whole library!
    localStorage.removeItem("draft-title");
    localStorage.removeItem("draft-html");
    localStorage.removeItem("draft-css");
  }, 1500);
};
  const handleReset = () => {
    if (confirm("Reset editor? This will delete your current draft.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* --- SUCCESS MODAL --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-sm w-full relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-4 right-4 text-yellow-500 opacity-30"
              >
                <PartyPopper size={40} />
              </motion.div>

              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
                Published! <PartyPopper size={24} className="text-yellow-500" />
              </h2>
              <p className="text-slate-500 mb-8">Your creation is now live in the library.</p>

              <Link
                href="/"
                className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
              >
                Go to Library
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="border-b bg-white sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={18} />
          <span>Exit Editor</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="hidden md:flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-tight mr-4"
          >
            <Trash2 size={14} /> Clear Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
            <Send size={18} />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-77px)]">
        {/* --- LEFT SIDE: THE EDITOR --- */}
        <div className="p-6 md:p-10 bg-slate-50 border-r overflow-y-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Metadata</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Component Name"
                className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select 
                className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Buttons</option>
                <option>Cards</option>
                <option>Inputs</option>
                <option>Navbars</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Your Name (Author)"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">HTML</h2>
            <textarea
              className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner resize-none"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">CSS</h2>
            <textarea
              className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner resize-none"
              value={css}
              onChange={(e) => setCss(e.target.value)}
            />
          </div>
        </div>

        {/* --- RIGHT SIDE: LIVE PREVIEW --- */}
        <div className="bg-white flex items-center justify-center p-12 relative overflow-hidden min-h-[300px]">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Canvas</span>
          </div>

          {/* User Code Injection */}
          <div className="preview-wrap relative z-10">
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {/* Grid Background Decoration */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
      </main>
    </div>
  );
}