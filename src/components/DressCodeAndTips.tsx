import React from 'react';
import { Sparkles, Shirt, Footprints, Wind } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface DressCodeAndTipsProps {
  config: WeddingConfig;
}

export const DressCodeAndTips: React.FC<DressCodeAndTipsProps> = ({ config }) => {
  const tips = [
    {
      icon: Shirt,
      title: 'Código de Vestimenta',
      description: 'Elegante / Traje y Vestido Largo o Midi Sofisticado.',
      detail: 'El color blanco, marfil y beige claro están reservados con mucho cariño para la novia.',
    },
    {
      icon: Footprints,
      title: 'Calzado & Jardines',
      description: 'La recepción y fotos serán sobre césped natural.',
      detail: 'Recomendamos calzado cómodo, taco ancho o plataformas para caminar tranquilas en el parque.',
    },
    {
      icon: Wind,
      title: 'Clima & Noche',
      description: 'En el campo la temperatura desciende al caer el sol.',
      detail: 'Aconsejamos traer una pashmina, blazer o abrigo ligero para disfrutar el exterior a la noche.',
    },
  ];

  return (
    <section id="dress-code" className="py-20 md:py-28 px-6 bg-[#F4EFE6]/50 border-t border-[#E6DDCE]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Recomendaciones
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-3">
            Dress Code & Detalles
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-lg mx-auto">
            Queremos que te sientas cómodo/a y radiante para celebrar juntos toda la noche.
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* 3 Practical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="bg-white border border-[#E5DAC8] p-7 rounded-xl shadow-2xs hover:border-[#C5A880] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E2D5C3] flex items-center justify-center text-[#996D29] mb-5">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#231E1B] font-medium mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#4A4036] mb-2 leading-relaxed">
                    {tip.description}
                  </p>
                  <p className="text-xs text-[#70645B] leading-relaxed">
                    {tip.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Palette inspiration bar */}
        <div className="bg-white border border-[#E5DAC8] p-6 sm:p-8 rounded-2xl shadow-xs text-center">
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Paleta de Colores Inspiracional
          </span>
          <p className="text-xs sm:text-sm text-[#5C534D] mb-6">
            Si buscás inspiración, estos son algunos de los tonos sugeridos para acompañar la armonía visual de la boda:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              { name: 'Azul Noche', color: '#1E293B' },
              { name: 'Verde Sabio', color: '#566E58' },
              { name: 'Rosa Empolvado', color: '#B89B96' },
              { name: 'Dorado Champán', color: '#C8A97E' },
              { name: 'Terracota Suave', color: '#9E5B4B' },
            ].map((swatch) => (
              <div key={swatch.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: swatch.color }}
                />
                <span className="text-[11px] text-[#7A6D63] font-medium">{swatch.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
