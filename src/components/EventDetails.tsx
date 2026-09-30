import React, { useState } from 'react';
import { Church, Wine, MapPin, Clock, ExternalLink, Copy, Check, Navigation, Map as MapIcon } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface EventDetailsProps {
  config: WeddingConfig;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ config }) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeMapTab, setActiveMapTab] = useState<'ceremony' | 'party' | 'route'>('ceremony');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(key);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  // Google Maps embed URLs for each location in San Telmo
  const mapEmbedUrls = {
    ceremony: 'https://maps.google.com/maps?q=Parroquia+San+Pedro+Telmo,+Humberto+1+340,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed',
    party: 'https://maps.google.com/maps?q=Janos+San+Telmo,+Peru+338,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed',
    route: 'https://maps.google.com/maps?q=San+Telmo,+Humberto+1+340+to+Peru+338,+Buenos+Aires&t=&z=15&ie=UTF8&iwloc=&output=embed',
  };

  return (
    <section id="ubicacion" className="py-20 md:py-28 px-6 bg-[#F4EFE6]/50 border-t border-[#E6DDCE]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Ubicación & Horarios
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-3">
            Dónde & Cuándo
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-lg mx-auto">
            Los dos lugares donde celebraremos este día tan especial en el corazón de San Telmo.
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* 2 Distinguished Location Cards (No 'pasos' labels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 1. Ceremonia */}
          <div className="bg-white border border-[#E5DAC8] rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between hover:border-[#C5A880] transition-colors relative overflow-hidden group">
            {/* Top decorative foil banner */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37]/40 via-[#B58A46] to-[#D4AF37]/40" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E0D5C3] flex items-center justify-center text-[#996D29]">
                  <Church className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1 bg-[#FAF7F2] text-[#996D29] border border-[#E5DAC8] rounded-full">
                  20:00 hs Puntual
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#231E1B] font-normal mb-3">
                Ceremonia Religiosa
              </h3>
              {config.ceremonyVenue.description && (
                <p className="text-xs sm:text-sm text-[#70645B] mb-6 leading-relaxed">
                  {config.ceremonyVenue.description}
                </p>
              )}

              {/* Specs */}
              <div className="space-y-3.5 border-t border-[#F0EBE1] pt-6 mb-8 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#996D29] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2724] block">Horario de Inicio</span>
                    <span className="text-[#6B5E53]">{config.ceremonyVenue.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#996D29] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2724] block">{config.ceremonyVenue.name}</span>
                    <span className="text-[#6B5E53]">{config.ceremonyVenue.address}</span>
                    <span className="text-[#8C7E72] block text-[11px]">{config.ceremonyVenue.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#F0EBE1]">
              <button
                onClick={() => {
                  setActiveMapTab('ceremony');
                  const mapElement = document.getElementById('mapa-interactivo');
                  if (mapElement) mapElement.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#3E3630] border border-[#D5C7B2] text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#996D29]" />
                <span>Ver en el Mapa</span>
              </button>

              <a
                href={config.ceremonyVenue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-wider font-medium rounded-md transition-colors"
                title="Abrir en app de Google Maps"
              >
                <span>GPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${config.ceremonyVenue.name}, ${config.ceremonyVenue.address}, ${config.ceremonyVenue.city}`,
                    'ceremony'
                  )
                }
                title="Copiar dirección"
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D5C7B2] rounded-md text-[#4A4036] transition-colors"
              >
                {copiedAddress === 'ceremony' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Fiesta */}
          <div className="bg-white border border-[#E5DAC8] rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between hover:border-[#C5A880] transition-colors relative overflow-hidden group">
            {/* Top decorative foil banner */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37]/40 via-[#B58A46] to-[#D4AF37]/40" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E0D5C3] flex items-center justify-center text-[#996D29]">
                  <Wine className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1 bg-[#FAF7F2] text-[#996D29] border border-[#E5DAC8] rounded-full">
                  21:30 hs
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#231E1B] font-normal mb-3">
                La Fiesta
              </h3>
              {config.partyVenue.description && (
                <p className="text-xs sm:text-sm text-[#70645B] mb-6 leading-relaxed">
                  {config.partyVenue.description}
                </p>
              )}

              {/* Specs */}
              <div className="space-y-3.5 border-t border-[#F0EBE1] pt-6 mb-8 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#996D29] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2724] block">Recepción & Fiesta</span>
                    <span className="text-[#6B5E53]">{config.partyVenue.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#996D29] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2724] block">{config.partyVenue.name}</span>
                    <span className="text-[#6B5E53]">{config.partyVenue.address}</span>
                    <span className="text-[#8C7E72] block text-[11px]">{config.partyVenue.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#F0EBE1]">
              <button
                onClick={() => {
                  setActiveMapTab('party');
                  const mapElement = document.getElementById('mapa-interactivo');
                  if (mapElement) mapElement.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#3E3630] border border-[#D5C7B2] text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#996D29]" />
                <span>Ver en el Mapa</span>
              </button>

              <a
                href={config.partyVenue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-wider font-medium rounded-md transition-colors"
                title="Abrir en app de Google Maps"
              >
                <span>GPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${config.partyVenue.name}, ${config.partyVenue.address}, ${config.partyVenue.city}`,
                    'party'
                  )
                }
                title="Copiar dirección"
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D5C7B2] rounded-md text-[#4A4036] transition-colors"
              >
                {copiedAddress === 'party' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Google Map Section */}
        <div id="mapa-interactivo" className="bg-white border border-[#E5DAC8] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-1">
                Mapa Interactivo de San Telmo
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#231E1B] font-normal">
                Explorá los lugares del casamiento
              </h3>
            </div>

            {/* Segmented Map Switcher */}
            <div className="flex items-center p-1 bg-[#F4EFE6] rounded-xl border border-[#E5DAC8] text-xs">
              <button
                onClick={() => setActiveMapTab('ceremony')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeMapTab === 'ceremony'
                    ? 'bg-white text-[#2C2724] shadow-xs'
                    : 'text-[#6B5E53] hover:text-[#2C2724]'
                }`}
              >
                Iglesia (20:00 hs)
              </button>
              <button
                onClick={() => setActiveMapTab('party')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeMapTab === 'party'
                    ? 'bg-white text-[#2C2724] shadow-xs'
                    : 'text-[#6B5E53] hover:text-[#2C2724]'
                }`}
              >
                Salón (21:30 hs)
              </button>
              <button
                onClick={() => setActiveMapTab('route')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeMapTab === 'route'
                    ? 'bg-white text-[#2C2724] shadow-xs'
                    : 'text-[#6B5E53] hover:text-[#2C2724]'
                }`}
              >
                Recorrido San Telmo
              </button>
            </div>
          </div>

          {/* Map Frame */}
          <div className="relative w-full h-[360px] sm:h-[440px] rounded-xl overflow-hidden border border-[#E2D6C4] bg-[#F5F2EB] shadow-inner">
            <iframe
              title="Mapa de la Boda de Luna y Nahuel"
              src={mapEmbedUrls[activeMapTab]}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Quick directions link */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5E53]">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#996D29]" />
              <span>
                {activeMapTab === 'ceremony'
                  ? 'Mostrando Parroquia San Pedro Telmo (Humberto 1° 340)'
                  : activeMapTab === 'party'
                  ? 'Mostrando Salón Jano\'s San Telmo (Perú 338)'
                  : 'Mostrando ambos lugares en San Telmo'}
              </span>
            </div>

            <a
              href={
                activeMapTab === 'party'
                  ? config.partyVenue.mapsUrl
                  : config.ceremonyVenue.mapsUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#996D29] hover:text-[#7A541B] font-semibold underline underline-offset-2"
            >
              <span>Abrir indicaciones en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
