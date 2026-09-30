import React from 'react';
import { Calendar, MapPin, Heart, ChevronDown } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { MonogramSeal } from './MonogramSeal';

interface HeroProps {
  config: WeddingConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  // Format event date nicely in Spanish (e.g. Sábado, 21 de Noviembre de 2026)
  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return 'Sábado, 21 de Noviembre de 2026';
    }
  };

  const formattedDate = formatEventDate(config.eventDate);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Delicate Archival Floral & Arch Border Background Decor */}
      <div className="absolute inset-4 md:inset-8 border border-[#C5A880]/30 pointer-events-none rounded-xl">
        {/* Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#996D29]" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#996D29]" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#996D29]" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#996D29]" />
      </div>

      {/* Decorative Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#EEDDC4]/25 via-[#FDF8F0]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Monogram Seal */}
        <div className="mb-6">
          <MonogramSeal
            initials={`${config.brideInitial} & ${config.groomInitial}`}
            size="lg"
          />
        </div>

        {/* Script Intro Calligraphy */}
        <p className="font-script text-4xl sm:text-5xl md:text-6xl text-[#996D29] mb-3 select-none">
          Nuestra Boda
        </p>

        {/* Couple Names */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#231E1B] leading-tight mb-4">
          <span>{config.brideName}</span>
          <span className="block sm:inline font-script text-3xl sm:text-5xl text-[#B58A46] mx-3 my-1">
            &
          </span>
          <span>{config.groomName}</span>
        </h1>

        {/* Subtle Ornamental Divider */}
        <div className="flex items-center gap-3 my-4 w-48 justify-center">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-[#C5A880] flex-1" />
          <Heart className="w-3.5 h-3.5 text-[#996D29] fill-[#996D29]/20" />
          <div className="h-[1px] bg-gradient-to-l from-transparent to-[#C5A880] flex-1" />
        </div>

        {/* Romantic Invitation Prose */}
        <p className="font-serif italic text-lg sm:text-xl text-[#5C534D] max-w-xl mb-7 leading-relaxed">
          «Hay momentos en la vida que son inolvidables, y compartirlos con las personas que más amamos los hace eternos.»
        </p>

        {/* Event Key Highlights Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-3 px-6 bg-white/70 border border-[#E5DAC8] rounded-lg shadow-xs backdrop-blur-xs mb-8 text-xs md:text-sm text-[#4A4036] tracking-wide">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#996D29]" />
            <span className="font-medium">{capitalizedDate}</span>
          </div>
          <span className="hidden sm:inline text-[#C5A880]">·</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#996D29]" />
            <span>{config.partyVenue.name}</span>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#confirmar"
            className="px-7 py-3.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-sm hover:shadow transition-all duration-200"
          >
            Confirmar Asistencia
          </a>
          <a
            href="#ubicacion"
            className="px-7 py-3.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#4A4036] border border-[#C5A880] text-xs uppercase tracking-widest font-semibold rounded-md transition-all duration-200"
          >
            Ver Ubicación & Horarios
          </a>
        </div>

        {/* Scroll affordance */}
        <a
          href="#cuenta-regresiva"
          aria-label="Ir a cuenta regresiva"
          className="mt-14 text-[#8C7E72] hover:text-[#2C2724] transition-colors animate-bounce p-2"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
