"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PartyPopper, ArrowLeft, Send, Trash2, Play } from "lucide-react";
import Link from "next/link";
import { saveComponent } from "@/app/actions";

const TEMPLATES = {
  Buttons: {
    html: `<button class="btn">Get Started</button>`,
    css: `.btn {
  padding: 12px 28px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
}
.btn:active {
  transform: translateY(0);
  box-shadow: none;
}`
  },
  Cards: {
    html: `<div class="card">
  <div class="card-icon">✦</div>
  <h3>Feature Title</h3>
  <p>A concise description of this feature and the value it delivers to users.</p>
</div>`,
    css: `.card {
  padding: 28px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e8edf4;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.25s, box-shadow 0.25s;
  max-width: 300px;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.card-icon {
  font-size: 24px;
  margin-bottom: 16px;
  color: #2563eb;
}
.card h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #0f172a;
}
.card p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 14px;
}`
  },
  Inputs: {
    html: `<div class="input-group">
  <label for="name">Full Name</label>
  <input id="name" type="text" class="input" placeholder="John Doe" />
</div>`,
    css: `.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.input {
  padding: 11px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}`
  },
  Navbar: {
    html: `<nav class="navbar">
  <span class="navbar-brand">Brand</span>
  <div class="navbar-links">
    <a href="#">Home</a>
    <a href="#">Explore</a>
    <a href="#">Library</a>
    <a href="#" class="navbar-cta">Sign Up</a>
  </div>
</nav>`,
    css: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e8edf4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.navbar-brand {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}
.navbar-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.navbar-links a {
  text-decoration: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}
.navbar-links a:hover { color: #2563eb; }
.navbar-cta {
  padding: 8px 18px;
  background: #2563eb;
  color: #fff !important;
  border-radius: 8px;
  font-weight: 600 !important;
}
.navbar-cta:hover {
  background: #1d4ed8;
  color: #fff !important;
}`
  },
  Loader: {
    html: `<div class="spinner"></div>`,
    css: `.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`
  },
  Footer: {
    html: `<footer class="footer">
  <p class="footer-brand">Brand</p>
  <p class="footer-copy">© 2026 Brand, Inc. All rights reserved.</p>
</footer>`,
    css: `.footer {
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e8edf4;
  width: 100%;
  box-sizing: border-box;
}
.footer-brand {
  font-weight: 700;
  color: #0f172a;
  font-size: 15px;
  margin: 0;
}
.footer-copy {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}`
  },
  Forms: {
    html: `<form class="form">
  <div class="form-header">
    <h2>Welcome back</h2>
    <p>Sign in to your account</p>
  </div>
  <input type="text" placeholder="Email address" />
  <input type="password" placeholder="Password" />
  <button type="submit">Sign In</button>
</form>`,
    css: `.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e8edf4;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  max-width: 360px;
}
.form-header { margin-bottom: 6px; }
.form-header h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #0f172a;
}
.form-header p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}
.form input {
  padding: 11px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.form button {
  padding: 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.form button:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}`
  },
  Breadcrumb: {
    html: `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li><a href="#">Library</a></li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>`,
    css: `.breadcrumb {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
.breadcrumb li { color: #94a3b8; }
.breadcrumb li + li::before {
  content: '/';
  margin-right: 6px;
  color: #cbd5e1;
}
.breadcrumb li a {
  text-decoration: none;
  color: #2563eb;
  font-weight: 500;
  transition: color 0.2s;
}
.breadcrumb li a:hover { color: #1d4ed8; }
.breadcrumb li[aria-current] {
  color: #0f172a;
  font-weight: 500;
}`
  },
  Modals: {
    html: `<button class="btn open-modal">Open Modal</button>
<div class="modal-overlay">
  <div class="modal">
    <h2>Confirm Action</h2>
    <p>Are you sure you want to proceed? This action cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn-ghost close-modal">Cancel</button>
      <button class="btn">Confirm</button>
    </div>
  </div>
</div>`,
    css: `.btn {
  padding: 11px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}
.btn-ghost {
  padding: 11px 24px;
  background: transparent;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover {
  border-color: #94a3b8;
  color: #374151;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}
.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}
.modal {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.15);
}
.modal h2 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #0f172a;
}
.modal p {
  margin: 0 0 24px;
  color: #64748b;
  line-height: 1.6;
  font-size: 14px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}`
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