import "./globals.css";
import Navbar from "@/components/Navbar";
import { Exo, Rampart_One } from "next/font/google"; 
import Footer from "@/components/Footer";
import { Suspense } from "react"; // 1. Import Suspense

const exo = Exo({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-exo",
});

const rampartOne = Rampart_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rampart",
});

export const metadata = {
  title: "UI Vault - Free Components",
  description: "Copy and paste beautiful HTML/CSS components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${exo.variable} ${rampartOne.variable} font-exo antialiased bg-gray-50 flex flex-col min-h-screen`}>
        {/* 2. Wrap Navbar in Suspense to fix the Vercel Build Error */}
        <Suspense fallback={<div className="h-16 w-full bg-white border-b border-slate-200" />}>
          <Navbar />
        </Suspense>

        {/* 3. Use flex-grow so Footer stays at the bottom on short pages */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer/>
      </body>
    </html>
  );
}