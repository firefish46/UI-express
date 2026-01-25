import "./globals.css";
import Navbar from "@/components/Navbar";
import { Exo, Rampart_One } from "next/font/google"; // 

// 1. Configure the fonts
const exo = Exo({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-exo", // This creates a CSS variable you can use anywhere
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
      {/* 2. Add the font variables to the body class */}
      <body className={`${exo.variable} ${rampartOne.variable} font-exo antialiased bg-gray-50`}>
  <Navbar />
  {children}
</body>
    </html>
  );
}