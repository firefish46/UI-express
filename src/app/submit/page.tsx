"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PartyPopper, ArrowLeft, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { saveComponent } from "@/app/actions";
const TEMPLATES = {
  Buttons: {
    html: '<button class="custom-btn">Hover Me</button>',
    css: `.custom-btn {
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
}`
  },
  Cards: {
    html: '<div class="custom-card">\n  <h3>Feature Card</h3>\n  <p>Hover over this card to see the effect.</p>\n</div>',
    css: `.custom-card {
  padding: 24px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: transform 0.3s ease;
}

.custom-card:hover {
  transform: scale(1.02);
  border-color: #3b82f6;
}`
  },
  Inputs: {
    html: '<input type="text" class="custom-input" placeholder="Enter name...">',
    css: `.custom-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.custom-input:focus {
  border-color: #3b82f6;
}`
  },
  Navbars: {
    html: '<nav class="custom-nav">\n  <a href="#">Home</a>\n  <a href="#">Explore</a>\n  <a href="#">Library</a>\n</nav>',
    css: `.custom-nav {
  display: flex; gap: 24px; padding: 16px;
  background: #f8fafc; border-radius: 12px;
}
.custom-nav a { text-decoration: none; color: #64748b; font-weight: 600; }
.custom-nav a:hover { color: #2563eb; }`
  },
  Loaders: {
    html: '<div class="spinner"></div>',
    css: `.spinner {
  width: 40px; height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
  },
  Footers: {
    html: '<footer class="mini-footer">\n  <p>© 2026 UI Express</p>\n</footer>',
    css: `.mini-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #eee;
  color: #888;
  font-size: 14px;
}`
  }
};

export default function SubmitPage() {
  const [draft, setDraft] = useState(() => {
    if (typeof window !== "undefined") {
      const savedHtml = localStorage.getItem("draft-html");
      const savedCss = localStorage.getItem("draft-css");
      const savedTitle = localStorage.getItem("draft-title");
      const savedAuthor = localStorage.getItem("draft-author");

      return {
        title: savedTitle || "",
        author: savedAuthor || "",
        category: "Buttons",
        html: savedHtml || TEMPLATES.Buttons.html,
        css: savedCss || TEMPLATES.Buttons.css
      };
    }
    return {
      title: "",
      author: "",
      category: "Buttons",
      html: TEMPLATES.Buttons.html,
      css: TEMPLATES.Buttons.css
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
    }
  }, [draft]);

  const handleCategoryChange = (newCat: string) => {
    const currentTemplate = TEMPLATES[draft.category as keyof typeof TEMPLATES];
    if (draft.html === currentTemplate.html || draft.html === "") {
      applyTemplate(newCat);
    }
    // If the user has custom HTML, do nothing (or you can show a confirmation modal if needed)
  };

  const applyTemplate = (cat: string) => {
    const template = TEMPLATES[cat as keyof typeof TEMPLATES];
    setDraft((prev) => ({
      ...prev,
      category: cat,
      html: template.html,
      css: template.css
    }));
  };

  const handleReset = () => {
    localStorage.removeItem("draft-title");
    localStorage.removeItem("draft-html");
    localStorage.removeItem("draft-css");
    localStorage.removeItem("draft-author");
    setDraft({
      title: "",
      author: "",
      category: "Buttons",
      html: TEMPLATES.Buttons.html,
      css: TEMPLATES.Buttons.css
    });
  };

const handlePublish = async () => {
  setIsSubmitting(true);

  // 2. Call the server action with your draft state
  const result = await saveComponent(draft);

  if (result.success) {
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // 3. Clean up LocalStorage drafts since it's now in the cloud
    localStorage.removeItem("draft-title");
    localStorage.removeItem("draft-html");
    localStorage.removeItem("draft-css");
  } else {
    setIsSubmitting(false);
    alert("Error: " + result.error);
  }
};
  if (typeof window === "undefined") return <div className="min-h-screen bg-white" />;

  const { title, author, category, html, css } = draft;

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{fontFamily:'exo'}}>
      {/* success modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-sm w-full relative overflow-hidden">
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

      <header className="border-b bg-white sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
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
        {/* LEFT SIDE */}
        <div className="p-6 md:p-10 bg-slate-50 border-r overflow-y-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Metadata</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Component Name"
                className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
            <select
  className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
  value={category}
  onChange={(e) => {
    const newCat = e.target.value;
    setDraft(prev => ({ ...prev, category: newCat })); // Update category state
    handleCategoryChange(newCat); // Trigger template swap
  }}
>
  <option value="Buttons">Buttons</option>
  <option value="Cards">Cards</option>
  <option value="Inputs">Inputs</option>
  <option value="Navbars">Navbars</option>
  <option value="Loaders">Loaders</option>
  <option value="Footers">Footers</option>
</select>
            </div>

            <input
              type="text"
              placeholder="Your Name (Author)"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={author}
              onChange={(e) => setDraft((prev) => ({ ...prev, author: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">HTML</h2>
            <textarea
              className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner resize-none"
              value={html}
              onChange={(e) => setDraft((prev) => ({ ...prev, html: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">CSS</h2>
            <textarea
              className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner resize-none"
              value={css}
              onChange={(e) => setDraft((prev) => ({ ...prev, css: e.target.value }))}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white flex items-center justify-center p-12 relative overflow-hidden min-h-[300px]">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Canvas
            </span>
          </div>

          <div className="preview-wrap relative z-10">
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
      </main>
    </div>
  );
}
