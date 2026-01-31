import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, User } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import LikeButton from "@/components/LikeButton"; // We will create this next

export default async function ViewComponentPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const component = await db.uIComponent.findUnique({ where: { id } });

  if (!component) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-exo">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-slate-900">{component.title}</h1>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase">
              {component.category}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PREVIEW */}
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 h-[500px] flex items-center justify-center relative overflow-hidden shadow-sm">
            <style dangerouslySetInnerHTML={{ __html: component.css }} />
            <div dangerouslySetInnerHTML={{ __html: component.html }} />
          </div>
          
          {/* Simplified Author & Like Line */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <User size={14} />
              <span>Created by <span className="font-bold text-slate-900">{component.author}</span></span>
            </div>
           <LikeButton 
  componentId={component.id} 
  initialLikes={component.likes ?? 0} 
/>
          </div>
        </div>

        {/* CODE BLOCKS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">HTML</span><CopyButton code={component.html} /></div>
            <pre className="bg-[#1e1e1e] p-6 rounded-2xl text-[13px] overflow-x-auto max-h-48 border border-slate-800">
              <code className="text-blue-300">{component.html}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">CSS</span><CopyButton code={component.css} /></div>
            <pre className="bg-[#1e1e1e] p-6 rounded-2xl text-[13px] overflow-x-auto max-h-64 border border-slate-800">
              <code className="text-orange-200">{component.css}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}