import React, { useState, useEffect } from 'react';
import { CheckCircle2, Menu, X } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface NavbarProps {
  config: WeddingConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Nuestra Historia', href: '#historia' },
    { label: 'Cuándo & Dónde', href: '#ubicacion' },
    { label: 'Dress Code', href: '#dress-code' },
    { label: 'Regalos', href: '#regalos' },
    { label: 'Libro de Firmas', href: '#libro-firmas' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl md:text-2xl font-serif tracking-wider text-[#2C2724] hover:text-[#996D29] transition-colors whitespace-nowrap"
        >
          {config.brideName.split(' ')[0]} & {config.groomName.split(' ')[0]}
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest text-[#5C534D] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#996D29] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Primary CTA: Confirmar Asistencia */}
          <a
            href="#confirmar"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#2C2724] hover:bg-[#433B37] rounded-md transition-all duration-200 shadow-xs hover:shadow-sm whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            Confirmar Asistencia
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A4036] hover:text-[#2C2724] transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8DFD3] px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-4 text-sm tracking-wider uppercase text-[#4A4036]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#996D29] transition-colors border-b border-[#F0EBE1]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#confirmar"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 text-xs uppercase font-semibold text-white bg-[#2C2724] rounded-md"
            >
              Confirmar Asistencia (RSVP)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
