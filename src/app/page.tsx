// src/app/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";
import { Code2, User, Layers } from "lucide-react";

export const revalidate = 0;

// Update the type to a Promise
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>; // Next.js 15+ requirement
}) {
  // Await the searchParams before using them
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;

  const components = await db.uIComponent.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20" style={{fontFamily:'exo'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {query ? `Results for "${query}"` : "Explore Components"}
            </h2>
            <p className="text-slate-500 mt-1">
              {components.length} professional components ready to use.
            </p>
          </div>
        </div>

        {components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {components.map((item) => (
              <div 
                key={item.id} 
             className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-[2px] hover:border-black transition-all duration-300"
>
                <div className="h-64 bg-slate-100/50 flex items-center justify-center relative overflow-hidden">
                  <style dangerouslySetInnerHTML={{ 
                    __html: `#preview-${item.id} { ${item.css} }` 
                  }} />
                  <div id={`preview-${item.id}`}>
                    <div dangerouslySetInnerHTML={{ __html: item.html }} />
                  </div>
                  <div className="absolute top-5 left-5 bg-white shadow-sm border px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600">
                    {item.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-slate-900">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-slate-400 mb-4">
                    <User size={14} />
                    <span className="text-xs font-medium">by {item.author}</span>
                  </div>
                  
                  <Link 
                    href={`/view/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-400 transition-all"
                  >
                    <Code2 size={18} />
                    Get Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">No components found</h3>
            <Link href="/" className="mt-6 text-blue-600 font-bold hover:underline inline-block">
              Clear search
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}