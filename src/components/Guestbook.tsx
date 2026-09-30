import React, { useState } from 'react';
import { MessageSquareHeart, Heart, Music, Sparkles, Send } from 'lucide-react';
import { RSVPGuest } from '../types/wedding';

interface GuestbookProps {
  guests: RSVPGuest[];
}

export const Guestbook: React.FC<GuestbookProps> = ({ guests }) => {
  const [filter, setFilter] = useState<'all' | 'with-song'>('all');

  // Filter guests who left a personal message
  const messagesList = guests.filter(
    (g) => g.personalMessage && g.personalMessage.trim().length > 0
  );

  const displayedMessages = filter === 'with-song'
    ? messagesList.filter((g) => g.songRequest && g.songRequest.trim().length > 0)
    : messagesList;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'short',
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <section id="libro-firmas" className="py-20 md:py-28 px-6 bg-[#FAF7F2] border-t border-[#E6DDCE]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-full bg-white border border-[#E5DAC8] flex items-center justify-center text-[#996D29] mx-auto mb-3 shadow-2xs">
            <MessageSquareHeart className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Libro de Firmas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-3">
            Mensajes & Deseos
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-lg mx-auto leading-relaxed">
            Las palabras y buenos deseos que nuestros seres queridos nos van dejando al confirmar.
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* Filter bar and CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-[#F0EBE1] rounded-lg text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-[#2C2724] shadow-2xs'
                  : 'text-[#6B5E53] hover:text-[#2C2724]'
              }`}
            >
              Todos los Mensajes ({messagesList.length})
            </button>
            <button
              onClick={() => setFilter('with-song')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'with-song'
                  ? 'bg-white text-[#2C2724] shadow-2xs'
                  : 'text-[#6B5E53] hover:text-[#2C2724]'
              }`}
            >
              Con Canción Pedida ({messagesList.filter((g) => g.songRequest).length})
            </button>
          </div>

          <a
            href="#confirmar"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#996D29] hover:text-[#7A541B] transition-colors"
          >
            <span>Dejar mi mensaje</span>
            <span>&darr;</span>
          </a>
        </div>

        {/* Messages Grid */}
        {displayedMessages.length === 0 ? (
          <div className="bg-white border border-[#E5DAC8] p-10 rounded-2xl text-center max-w-md mx-auto shadow-2xs">
            <Heart className="w-8 h-8 text-[#C5A880] mx-auto mb-3 stroke-[1.2]" />
            <p className="font-serif text-lg text-[#2C2724]">Todavía no hay mensajes aquí</p>
            <p className="text-xs text-[#73675E] mt-1 mb-4">
              ¡Sé la primera persona en dejarle una dedicatoria a Luna & Nahuel!
            </p>
            <a
              href="#confirmar"
              className="px-4 py-2 bg-[#2C2724] text-white text-xs font-semibold rounded-md inline-block"
            >
              Escribir Dedicatoria
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMessages.map((guest) => (
              <div
                key={guest.id}
                className="bg-white border border-[#E5DAC8] p-6 rounded-2xl shadow-2xs hover:border-[#C5A880] transition-colors flex flex-col justify-between relative group"
              >
                {/* Quote flourish */}
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-[#8A7C70]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg font-medium text-[#2C2724]">
                        {guest.fullName}
                      </span>
                      {guest.companionNames && (
                        <span className="text-[11px] text-[#996D29]">
                          & {guest.companionNames}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#A89E92] font-mono">
                      {formatDate(guest.createdAt)}
                    </span>
                  </div>

                  <p className="font-serif italic text-sm text-[#433B35] leading-relaxed mb-4">
                    «{guest.personalMessage}»
                  </p>
                </div>

                {/* Footer of card: song request if present */}
                {guest.songRequest && (
                  <div className="pt-3 border-t border-[#F2ECE1] flex items-center gap-2 text-xs text-[#8A7C70]">
                    <Music className="w-3.5 h-3.5 text-[#996D29] shrink-0" />
                    <span className="italic truncate text-[11px] text-[#695D53]">
                      {guest.songRequest}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
