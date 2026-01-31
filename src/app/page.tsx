import { db } from "@/lib/db";
import Link from "next/link";
import { Code2, User, ChevronLeft, ChevronRight } from "lucide-react";
import CategoryFilter from "@/components/CategoryFilter";
import { Prisma } from "@prisma/client";

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const category = resolvedParams.category;
  
  // Pagination logic
  const itemsPerPage = 6; // Load only 6 at a time
  const currentPage = Number(resolvedParams.page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;

  // Build the filter object
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

  // Fetch data and total count for pagination
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
        
        {/* Header with Search Result info and Category Select */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {query ? `Results for "${query}"` : category ? `${category} Collection` : "Explore Components"}
            </h2>
            <p className="text-slate-500 mt-1">
              Found {totalCount} professional components.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400">Filter:</span>
            <CategoryFilter />
          </div>
        </div>

        {/* Grid Layout */}
        {components.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {components.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-[1px] hover:border-gray-400 transition-all duration-300">
                  <div className="h-64 bg-slate-100/50 flex items-center justify-center relative overflow-hidden">
                    <style dangerouslySetInnerHTML={{ __html: `#preview-${item.id} { ${item.css} }` }} />
                    <div id={`preview-${item.id}`}>
                      <div dangerouslySetInnerHTML={{ __html: item.html }} />
                    </div>
                    <div className="absolute top-5 left-5 bg-white shadow-sm border px-3 py-1 rounded-full text-[8px] font-black uppercase text-gray-400">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 style={{fontFamily:"exo"}} className="font-bold text-xl text-slate-900">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-400 mb-4">
                      <User size={14} />
                      <span className="text-xs font-medium">by {item.author}</span>
                    </div>
                    <Link href={`/view/${item.id}`} className="btn-hover w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all">
                      <Code2 size={20} /> Get Code
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <Link
                  href={`/?${new URLSearchParams({ ...resolvedParams, page: (currentPage - 1).toString() })}`}
                  className={`p-2 rounded-lg border ${currentPage === 1 ? 'pointer-events-none opacity-30' : 'hover:bg-white'}`}
                >
                  <ChevronLeft />
                </Link>
                <span className="font-bold text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Link
                  href={`/?${new URLSearchParams({ ...resolvedParams, page: (currentPage + 1).toString() })}`}
                  className={`p-2 rounded-lg border ${currentPage === totalPages ? 'pointer-events-none opacity-30' : 'hover:bg-white'}`}
                >
                  <ChevronRight />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">No components found</h3>
            <Link href="/" className="mt-6 text-blue-600 font-bold hover:underline inline-block">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}