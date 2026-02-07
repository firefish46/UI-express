import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Code2, Eye } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import LikeButton from "@/components/LikeButton";
import JSRunner from "@/components/JSRunner";

export default async function ViewComponentPage({ params }: { params: { id: string } }) {
  // Await params for Next.js 15 compatibility
  const { id } = await params;
  
  const component = await db.uIComponent.findUnique({ 
    where: { id } 
  });

  if (!component) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-exo">
      {/* NAVIGATION HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
            <ArrowLeft size={18} /> 
            <span className="hidden md:inline">Back to Library</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <h1 className="text-sm font-black text-slate-900 leading-none">{component.title}</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">ID: {component.id.slice(0,8)}</p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm shadow-blue-100">
              {component.category}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: LIVE PREVIEW */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Eye size={16} />
            <h2 className="text-xs font-bold uppercase tracking-widest">Live Preview</h2>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 h-[550px] flex items-center justify-center relative overflow-hidden shadow-xl shadow-slate-200/50">
            {/* Scoped CSS Injection */}
            <style dangerouslySetInnerHTML={{ __html: component.css }} />
            
            {/* HTML Structure Injection */}
            <div dangerouslySetInnerHTML={{ __html: component.html }} />
            
            {/* CLIENT-SIDE JS RUNNER: This is the secret to making JS work on this page */}
            {component.js && (
              <JSRunner scriptCode={component.js} componentId={component.id} />
            )}

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          
          {/* Author & Stats Section */}
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center border border-white shadow-inner">
                <User size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Crafted By</p>
                <p className="font-bold text-slate-900">{component.author}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LikeButton 
                componentId={component.id} 
                initialLikes={component.likes ?? 0} 
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SOURCE CODE */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Code2 size={16} />
            <h2 className="text-xs font-bold uppercase tracking-widest">Source Code</h2>
          </div>

          {/* HTML BLOCK */}
          <div className="group relative">
            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton code={component.html} />
            </div>
            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-800">
              <div className="px-4 py-2 bg-[#2d2d2d] border-b border-slate-800 flex justify-between">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">index.html</span>
              </div>
              <pre className="p-6 text-[13px] overflow-x-auto max-h-40 scrollbar-thin scrollbar-thumb-slate-700">
                <code className="text-blue-300 font-mono leading-relaxed">{component.html}</code>
              </pre>
            </div>
          </div>

          {/* CSS BLOCK */}
          <div className="group relative">
            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton code={component.css} />
            </div>
            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-800">
              <div className="px-4 py-2 bg-[#2d2d2d] border-b border-slate-800 flex justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">style.css</span>
              </div>
              <pre className="p-6 text-[13px] overflow-x-auto max-h-56 scrollbar-thin scrollbar-thumb-slate-700">
                <code className="text-orange-200 font-mono leading-relaxed">{component.css}</code>
              </pre>
            </div>
          </div>

          {/* JAVASCRIPT BLOCK */}
          <div className="group relative">
            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton code={component.js ?? ""} />
            </div>
            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-800">
              <div className="px-4 py-2 bg-[#2d2d2d] border-b border-slate-800 flex justify-between">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">script.js</span>
              </div>
              <pre className="p-6 text-[13px] overflow-x-auto max-h-56 scrollbar-thin scrollbar-thumb-slate-700">
                <code className="text-yellow-100 font-mono leading-relaxed">
                  {component.js || "// No interactivity logic provided"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}