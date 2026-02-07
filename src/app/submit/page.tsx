"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PartyPopper, ArrowLeft, Send, Trash2, Play } from "lucide-react";
import Link from "next/link";
import { saveComponent } from "@/app/actions";

const TEMPLATES = {
  Buttons: {
    html: '<button class="custom-btn">Hover Me</button>',
    css: `.custom-btn {\n  padding: 12px 24px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n\n.custom-btn:hover {\n  background: #1d4ed8;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);\n}`
  },
  Cards: {
    html: '<div class="custom-card">\n  <h3>Feature Card</h3>\n  <p>Hover over this card to see the effect.</p>\n</div>',
    css: `.custom-card {\n  padding: 24px;\n  background: white;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  transition: transform 0.3s ease;\n}\n\n.custom-card:hover {\n  transform: scale(1.02);\n  border-color: #3b82f6;\n}`
  },
  Inputs: {
    html: '<input type="text" class="custom-input" placeholder="Enter name...">',
    css: `.custom-input {\n  padding: 12px 16px;\n  border: 2px solid #e2e8f0;\n  border-radius: 10px;\n  outline: none;\n  transition: border-color 0.2s;\n}\n\n.custom-input:focus {\n  border-color: #3b82f6;\n}`
  },
  Navbars: {
    html: '<nav class="custom-nav">\n  <a href="#">Home</a>\n  <a href="#">Explore</a>\n  <a href="#">Library</a>\n</nav>',
    css: `.custom-nav {\n  display: flex; gap: 24px; padding: 16px;\n  background: #f8fafc; border-radius: 12px;\n}\n.custom-nav a { text-decoration: none; color: #64748b; font-weight: 600; }\n.custom-nav a:hover { color: #2563eb; }`
  },
  Loaders: {
    html: '<div class="spinner"></div>',
    css: `.spinner {\n  width: 40px; height: 40px;\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #3498db;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
  },
  Footers: {
    html: '<footer class="mini-footer">\n  <p>© 2026 UI Express</p>\n</footer>',
    css: `.mini-footer {\n  padding: 20px;\n  text-align: center;\n  border-top: 1px solid #eee;\n  color: #888;\n  font-size: 14px;\n}`
  }
};

export default function SubmitPage() {
  const previewRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState(() => {
    if (typeof window !== "undefined") {
      const savedHtml = localStorage.getItem("draft-html");
      const savedCss = localStorage.getItem("draft-css");
      const savedTitle = localStorage.getItem("draft-title");
      const savedAuthor = localStorage.getItem("draft-author");
      const savedJs = localStorage.getItem("draft-js") || "";

      return {
        title: savedTitle || "",
        author: savedAuthor || "",
        category: "Buttons",
        html: savedHtml || TEMPLATES.Buttons.html,
        css: savedCss || TEMPLATES.Buttons.css,
        js: savedJs
      };
    }
    return {
      title: "", author: "", category: "Buttons",
      html: TEMPLATES.Buttons.html, css: TEMPLATES.Buttons.css, js: ""
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("draft-title", draft.title);
      localStorage.setItem("draft-author", draft.author);
      localStorage.setItem("draft-html", draft.html);
      localStorage.setItem("draft-css", draft.css);
      localStorage.setItem("draft-js", draft.js);
    }
  }, [draft]);

  const runJavaScript = () => {
    if (!previewRef.current) return;
    const oldScript = previewRef.current.querySelector("#preview-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "preview-script";
    script.innerHTML = `
      (function() {
        try {
          console.clear();
          ${draft.js}
        } catch (err) {
          console.error("Runtime JS Error:", err);
        }
      })();
    `;
    previewRef.current.appendChild(script);
  };

  const handleCategoryChange = (newCat: string) => {
    const currentTemplate = TEMPLATES[draft.category as keyof typeof TEMPLATES];
    if (draft.html === currentTemplate.html || draft.html === "") {
      const template = TEMPLATES[newCat as keyof typeof TEMPLATES];
      setDraft((prev) => ({
        ...prev,
        category: newCat,
        html: template.html,
        css: template.css,
      }));
    } else {
        setDraft(prev => ({ ...prev, category: newCat }));
    }
  };

  const handleReset = () => {
    if (confirm("Clear all progress?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    const result = await saveComponent(draft);
    if (result.success) {
      setIsSubmitting(false);
      setShowSuccess(true);
      localStorage.clear();
    } else {
      setIsSubmitting(false);
      alert("Error: " + result.error);
    }
  };

  if (typeof window === "undefined") return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'exo' }}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-sm w-full">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
                Published! <PartyPopper size={24} className="text-yellow-500" />
              </h2>
              <p className="text-slate-500 mb-8">Your creation is now live in the library.</p>
              <Link href="/" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg text-center">
                Go to Library
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b bg-white sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={18} /> <span>Exit Editor</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="hidden md:flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-tight mr-4">
            <Trash2 size={14} /> Clear Draft
          </button>
          <button onClick={handlePublish} disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
            {isSubmitting ? "Publishing..." : "Publish"} <Send size={18} />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-77px)]">
        {/* LEFT SIDE: EDITORS */}
        <div className="p-6 md:p-10 bg-slate-50 border-r overflow-y-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Metadata</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text" placeholder="Component Name"
                className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
              <select
                className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                value={draft.category} onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {Object.keys(TEMPLATES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <input
              type="text" placeholder="Your Name (Author)"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={draft.author} onChange={(e) => setDraft((prev) => ({ ...prev, author: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">HTML</h2>
            <textarea
              className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner resize-none"
              value={draft.html} onChange={(e) => setDraft((prev) => ({ ...prev, html: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">CSS</h2>
            <textarea
              className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner resize-none"
              value={draft.css} onChange={(e) => setDraft((prev) => ({ ...prev, css: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-widest">JavaScript</h2>
            <textarea
              className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none shadow-inner"
              value={draft.js} onChange={(e) => setDraft((prev) => ({ ...prev, js: e.target.value }))}
              placeholder="// Write interactivity... Click 'Run JS' to test."
            />
          </div>
        </div>

        {/* RIGHT SIDE: LIVE CANVAS */}
        <div className="bg-white flex flex-col relative h-full">
          {/* Canvas Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Canvas</span>
            </div>
            <button 
              onClick={runJavaScript}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-950 rounded-xl text-xs font-black hover:bg-yellow-500 transition-all active:scale-95 shadow-md uppercase tracking-tighter"
            >
              <Play size={14} fill="currentColor" /> Run JavaScript
            </button>
          </div>

          {/* Actual Preview Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden p-12">
            <div ref={previewRef} className="preview-wrap relative z-10 w-full flex justify-center">
              <style dangerouslySetInnerHTML={{ __html: draft.css }} />
              <div dangerouslySetInnerHTML={{ __html: draft.html }} />
            </div>
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
        </div>
      </main>
    </div>
  );
}