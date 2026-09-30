import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { MonogramSeal } from './MonogramSeal';

interface FooterProps {
  config: WeddingConfig;
  onOpenNovios?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenNovios }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#231E1B] text-[#D8CFBE] py-16 px-6 relative overflow-hidden">
      {/* Decorative top hairline divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Monogram (Secret click trigger for the couple) */}
        <div
          onClick={onOpenNovios}
          className="mb-6 opacity-90 cursor-default select-none"
          title=""
        >
          <MonogramSeal
            initials={`${config.brideInitial} & ${config.groomInitial}`}
            size="sm"
            className="text-[#FAF7F2]"
          />
        </div>

        {/* Couple Names */}
        <p className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light tracking-wide mb-2">
          {config.brideName} & {config.groomName}
        </p>

        {/* Date and Place */}
        <p className="text-xs uppercase tracking-widest text-[#B58A46] font-medium mb-6">
          21 de Noviembre de 2026 · San Telmo, Buenos Aires
        </p>

        <p className="font-serif italic text-sm text-[#A89E92] max-w-md mx-auto mb-8 leading-relaxed">
          «Gracias por formar parte de nuestras vidas y por acompañarnos en el día más feliz.»
        </p>

        {/* Bottom bar */}
        <div className="flex items-center gap-6 text-xs text-[#8A7C70] border-t border-[#3D352F] pt-6 w-full justify-between max-w-md">
          {/* Secret click trigger on the copyright line */}
          <span
            onClick={onOpenNovios}
            className="text-[#8A7C70] select-none cursor-default"
          >
            {config.brideName} & {config.groomName} · 2026
          </span>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[#FAF7F2] transition-colors cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-[#695D53] mt-8 flex items-center justify-center gap-1">
          <span>Celebrando el amor</span>
          <Heart className="w-3 h-3 text-[#B58A46] fill-[#B58A46]" />
        </p>
      </div>
    </footer>
  );
};
