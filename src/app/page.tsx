import { db } from "@/lib/db";
import Link from "next/link";
import { Code2, User, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import CategoryFilter from "@/components/CategoryFilter";
import JSRunner from "@/components/JSRunner"; 
import { Prisma } from "@prisma/client";
import { Suspense } from "react"; // 1. Import Suspense

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const category = resolvedParams.category;
  
  const itemsPerPage = 6;
  const currentPage = Number(resolvedParams.page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;

  const whereClause: Prisma.UIComponentWhereInput = {
    AND: [
      query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ]
      } : {},
      category && category !== "All" ? { category: { equals: category } } : {}
    ]
  };

  const [components, totalCount] = await Promise.all([
    db.uIComponent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip: skip,
    }),
    db.uIComponent.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 font-exo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {query ? `Results for "${query}"` : category ? `${category} Collection` : "Explore Components"}
            </h2>
            <p className="text-slate-500 mt-1">Found {totalCount} professional components.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400">Filter:</span>
            {/* 2. Wrap CategoryFilter in Suspense to fix Vercel Build Error */}
            <Suspense fallback={<div className="h-10 w-32 bg-slate-200 animate-pulse rounded-xl" />}>
              <CategoryFilter />
            </Suspense>
          </div>
        </div>

        {components.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {components.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-400/50 transition-all duration-300 flex flex-col">
                  
                  {/* PREVIEW AREA */}
                  <div className="h-64 bg-slate-100/30 flex items-center justify-center relative overflow-hidden border-b border-slate-50">
                    
                    <style dangerouslySetInnerHTML={{ 
                      __html: `#wrapper-${item.id} { all: revert; } #wrapper-${item.id} ${item.css}` 
                    }} />
                    
                    <div id={`wrapper-${item.id}`} className="w-full h-full flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: item.html }} />
                    </div>

                    {/* Ensure prop names match your JSRunner (scriptCode and componentId) */}
                    {item.js && <JSRunner scriptCode={item.js} componentId={item.id} />}

                    <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-md shadow-sm border px-3 py-1 rounded-full text-[8px] font-black uppercase text-slate-500 tracking-widest">
                      {item.category}
                    </div>
                  </div>

                  {/* INFO AREA */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-slate-400 mb-6">
                        <User size={14} />
                        <span className="text-xs font-medium">by {item.author}</span>
                      </div>
                    </div>
                    <Link href={`/view/${item.id}`} className="btn-hover w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all">
                      <Code2 size={20} /> Get Code
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-6">
                <Link
                  href={`/?${new URLSearchParams({ ...resolvedParams, page: (currentPage - 1).toString() })}`}
                  className={`p-3 rounded-xl border-2 transition-all ${currentPage === 1 ? 'pointer-events-none opacity-20 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-400 text-blue-600'}`}
                >
                  <ChevronLeft />
                </Link>
                <div className="px-6 py-2 bg-white border-2 border-slate-200 rounded-full text-sm font-black text-slate-700">
                  {currentPage} <span className="text-slate-300 mx-1">/</span> {totalPages}
                </div>
                <Link
                  href={`/?${new URLSearchParams({ ...resolvedParams, page: (currentPage + 1).toString() })}`}
                  className={`p-3 rounded-xl border-2 transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-20 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-400 text-blue-600'}`}
                >
                  <ChevronRight />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
               <Code2 size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No components found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or category filters.</p>
            <Link href="/" className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all inline-block shadow-xl shadow-blue-100">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}