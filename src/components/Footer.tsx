import Link from "next/link";
import { Github, Twitter, Layers, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-exo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 font-black text-2xl tracking-tighter"
            >
              <Layers fill="currentColor" size={28} />
              <span>UI EXPRESS</span>
            </Link>

            <p className="text-slate-500 max-w-sm leading-relaxed">
              A growing collection of production-ready React, Tailwind and Framer Motion UI
              components. Copy, customize, and ship faster with clean code, smooth animations,
              and developer-first structure.
            </p>

            <div className="flex gap-4 pt-2">
              <Link
                href="https://github.com/firefish46/ui-express"
                target="_blank"
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://instagram.com/firefish_46"
                target="_blank"
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="mailto:mehedi7hasan10134@gmail.com"
                target="_blank"
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Library Section */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">
              Library
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/?category=Buttons" className="hover:text-blue-600 transition-colors">Buttons</Link></li>
              <li><Link href="/?category=Cards" className="hover:text-blue-600 transition-colors">Cards</Link></li>
              <li><Link href="/?category=Loaders" className="hover:text-blue-600 transition-colors">Loaders</Link></li>
              <li><Link href="/?category=Forms" className="hover:text-blue-600 transition-colors">Forms</Link></li>
              <li><Link href="/?category=Navigation" className="hover:text-blue-600 transition-colors">Navigation</Link></li>
              <li><Link href="/?category=Modals" className="hover:text-blue-600 transition-colors">Modals</Link></li>
            </ul>
          </div>

          {/* Platform Section */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/submit" className="hover:text-blue-600 transition-colors">Submit Component</Link></li>
              <li><Link href="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="/changelog" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
              <li><Link href="/license" className="hover:text-blue-600 transition-colors">MIT License</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 UI Express — Built by Mehedi for frontend developers.
          </p>

          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-tighter">
            <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
