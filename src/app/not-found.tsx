import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 font-exo">
      <h1 className="text-9xl font-black text-slate-100">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-[-2rem]">Component Not Found</h2>
      <p className="text-slate-500 text-center mt-4 max-w-sm">
        The page youre looking for doesnt exist or has been moved to a new collection.
      </p>
      <Link 
        href="/" 
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
      >
        Back to Library
      </Link>
    </div>
  );
}