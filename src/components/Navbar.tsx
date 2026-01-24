import Link from 'next/link';

export default function Navbar() {
  return (
    
    <nav className="flex justify-between items-center p-4 border-b bg-white"
    
    
    >
      <Link href="/" className="font-bold text-xl ">UI express</Link>
      
      <div className="flex gap-4 items-center border-l pl-4 border-gray-200 border-r pr-4">
        {/* Browse usually just points back to the homepage grid */}
       <Link href="/" className="  border-black-500 hover:text-blue-600 transition-colors border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 border-radius-md"
       
       >
       
   Browse
</Link>
        {/* Submit points to our new editor page */}
        <Link 
          href="/submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Submit
        </Link>
      </div>
    </nav>
  );
}