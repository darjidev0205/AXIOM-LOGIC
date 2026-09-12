"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogIn,
  Calendar,
  ArrowRight,
} from "lucide-react";
import AxiomLogo from "@/components/brand/AxiomLogo";

export default function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Platform", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Live Demo", href: "/live-demo" },
    { label: "Research", href: "/research" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)]"
          : "bg-white/85 backdrop-blur-sm border-b border-slate-200/60"
      }`}
    >
      <div className="axiom-container flex items-center justify-between h-20">
        {/* Official Brand Logo */}
        <Link
          href="/"
          className="flex items-center group active:scale-[0.99] transition-transform shrink-0"
          aria-label="AXIOM Logic Home"
        >
          <AxiomLogo
            variant="compact"
            theme="light"
            height={38}
            priority
            className="transition-opacity group-hover:opacity-95 max-w-[160px] sm:max-w-none"
          />
        </Link>

        {/* Desktop Navigation Links — Centered & Proportionately Spaced */}
        <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-8.5 h-full text-[14.5px] px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-7 font-medium tracking-tight transition-colors duration-200 group ${
                  isActive
                    ? "text-[#2563EB] font-semibold"
                    : "text-slate-600 hover:text-[#2563EB]"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full transition-all duration-200 ${
                    isActive
                      ? "opacity-100 shadow-[0_1px_6px_rgba(37,99,235,0.4)]"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Trailing Primary & Secondary Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/sign-in"
            className="text-[13.5px] font-medium text-slate-600 hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Sign In</span>
          </Link>

          <Link
            href="/book"
            className="btn-arrow-slide btn-axiom-primary text-[14px] px-4 sm:px-5 py-2.5 gap-2"
          >
            <Calendar className="w-4 h-4 text-blue-200" />
            <span>Talk to AXIOM</span>
            <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <Link
            href="/book"
            className="btn-axiom-primary text-[12.5px] px-3 py-2 hidden xs:inline-flex items-center"
          >
            Book
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-5 sm:px-6 py-5 space-y-4 shadow-xl max-h-[calc(100dvh-5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-[#2563EB] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-axiom-secondary w-full py-3 px-4 text-[14px] flex items-center justify-center gap-2 rounded-xl"
            >
              <LogIn className="w-4 h-4 text-[#2563EB]" />
              <span>Sign In to AXIOM</span>
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-axiom-primary w-full py-3 px-4 text-[14px] flex items-center justify-center gap-2 rounded-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Architecture Review</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
