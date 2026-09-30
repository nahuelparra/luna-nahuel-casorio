import React from 'react';
import { Heart, Sparkles, Compass, Gem } from 'lucide-react';

export const LoveStory: React.FC = () => {
  const milestones = [
    {
      year: '2020',
      title: 'El Primer Encuentro',
      description: 'Una tarde de otoño, un café en San Telmo y una charla que parecía haber empezado vidas atrás. Entre anécdotas y risas, supimos que era el inicio de algo extraordinario.',
      icon: Sparkles,
    },
    {
      year: '2023',
      title: 'Nuestro Primer Gran Viaje',
      description: 'Recorriendo los senderos de la Patagonia y bajo un manto de estrellas infinitas en Bariloche, entendimos que el hogar no es un lugar físico, sino estar juntos.',
      icon: Compass,
    },
    {
      year: '2025',
      title: 'El «¡Sí, Quiero!»',
      description: 'Frente al mar y al caer el sol, una pregunta simple y eterna. Lágrimas de emoción, un abrazo interminable y la promesa de caminar de la mano toda la vida.',
      icon: Gem,
    },
  ];

  return (
    <section id="historia" className="py-20 md:py-28 px-6 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Nuestra Historia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-4">
            Cómo llegamos hasta aquí
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-lg mx-auto leading-relaxed">
            Cada paso, cada risa y cada viaje nos trajeron hasta este instante mágico que queremos celebrar con vos.
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* Milestones timeline */}
        <div className="relative">
          {/* Vertical central hairline line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-[#E3D7C5] -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content card */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'}`}>
                    <div className="bg-white/80 border border-[#E5DAC8] p-6 sm:p-7 rounded-xl shadow-2xs hover:border-[#C5A880] transition-colors">
                      <span className="font-serif text-2xl font-light text-[#996D29] tracking-wider block mb-1">
                        {item.year}
                      </span>
                      <h3 className="font-serif text-xl text-[#231E1B] font-medium mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#61554C] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node Badge */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FAF7F2] border-2 border-[#C5A880] items-center justify-center text-[#996D29] shadow-xs z-10">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote banner */}
        <div className="mt-20 p-8 sm:p-10 bg-white border border-[#E2D5C2] rounded-2xl text-center max-w-2xl mx-auto shadow-2xs">
          <Heart className="w-5 h-5 text-[#996D29] mx-auto mb-3 fill-[#996D29]/10" />
          <p className="font-serif italic text-lg sm:text-xl text-[#3A332E] leading-relaxed">
            «El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.»
          </p>
          <span className="text-xs uppercase tracking-widest text-[#8A7C70] block mt-3">
            Antoine de Saint-Exupéry
          </span>
        </div>
      </div>
    </section>
  );
};
