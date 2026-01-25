import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
// Note: We'll create a Client Component for the "Copy" logic to keep this page fast
import CopyButton from "@/components/CopyButton"; 

export default async function ViewComponentPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const component = await db.uIComponent.findUnique({
    where: { id },
  });

  if (!component) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sub-Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
            <ArrowLeft size={18} /> Back to Gallery
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">{component.title}</h1>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">
              {component.category}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Live Preview */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Preview</h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 h-[500px] flex items-center justify-center relative overflow-hidden shadow-sm">
            <style dangerouslySetInnerHTML={{ __html: component.css }} />
            <div dangerouslySetInnerHTML={{ __html: component.html }} />
          </div>
        </div>

        {/* Right Side: The Code */}
        <div className="space-y-6">
          {/* HTML Block */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">HTML Code</h2>
              <CopyButton code={component.html} />
            </div>
            <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-xs overflow-x-auto max-h-48 border border-slate-800">
              <code>{component.html}</code>
            </pre>
          </div>

          {/* CSS Block */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">CSS Code</h2>
              <CopyButton code={component.css} />
            </div>
            <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-xs overflow-x-auto max-h-64 border border-slate-800">
              <code>{component.css}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}