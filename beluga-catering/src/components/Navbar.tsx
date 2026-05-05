import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Dịch vụ", href: "/#services" },
  { label: "Thực đơn", href: "/menus" },
  { label: "Blog", href: "/blog" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-black tracking-wider text-primary select-none">BELUGA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                scrolled ? "text-foreground hover:text-primary hover:bg-primary/5" : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:0909123456" className={`flex items-center gap-1.5 text-sm font-medium ${scrolled ? "text-foreground" : "text-white/90"}`}>
            <Phone className="w-4 h-4" />
            0909 123 456
          </a>
          <Link href="/contact">
            <span className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
              Đặt tiệc ngay
            </span>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-border shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link href="/contact">
                <span className="mt-2 block text-center bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold">
                  Đặt tiệc ngay
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
