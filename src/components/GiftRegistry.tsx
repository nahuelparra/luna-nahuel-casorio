import React, { useState } from 'react';
import { Gift, Copy, Check, Plane, Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface GiftRegistryProps {
  config: WeddingConfig;
}

export const GiftRegistry: React.FC<GiftRegistryProps> = ({ config }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="regalos" className="py-20 md:py-28 px-6 bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-full bg-[#F4EFE6] border border-[#E2D5C3] flex items-center justify-center text-[#996D29] mx-auto mb-4">
            <Gift className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            Luna de Miel
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-4">
            Regalo & Colaboración
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#5A5048] max-w-xl mx-auto leading-relaxed mb-4">
            «Tu compañía en nuestro casamiento es sin dudas nuestro mayor y más valioso regalo.»
          </p>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-lg mx-auto leading-relaxed">
            {config.bankDetails.message}
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* Bank Account Details Card */}
        <div className="bg-white border border-[#E5DAC8] p-8 sm:p-10 rounded-2xl shadow-xs max-w-xl mx-auto text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[#996D29]">
            <Plane className="w-24 h-24" />
          </div>

          <div className="space-y-5">
            {/* Alias */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE8DC]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-semibold block">
                  Alias Bancario
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#231E1B] tracking-wide select-all">
                  {config.bankDetails.alias}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(config.bankDetails.alias, 'alias')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F2ECE1] text-[#3E3630] border border-[#D5C7B2] rounded-md text-xs font-medium transition-colors shrink-0 shadow-2xs"
              >
                {copiedKey === 'alias' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#996D29]" />
                    <span>Copiar Alias</span>
                  </>
                )}
              </button>
            </div>

            {/* CBU */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE8DC]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-semibold block">
                  CBU
                </span>
                <span className="font-mono text-sm sm:text-base font-semibold text-[#231E1B] tracking-wide select-all break-all">
                  {config.bankDetails.cbu}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(config.bankDetails.cbu, 'cbu')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F2ECE1] text-[#3E3630] border border-[#D5C7B2] rounded-md text-xs font-medium transition-colors shrink-0 shadow-2xs"
              >
                {copiedKey === 'cbu' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#996D29]" />
                    <span>Copiar CBU</span>
                  </>
                )}
              </button>
            </div>

            {/* Account Info Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-[#6B5E53]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A7C70] block">Entidad Bancaria</span>
                <span className="font-medium text-[#2C2724]">{config.bankDetails.bank}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A7C70] block">Titulares</span>
                <span className="font-medium text-[#2C2724]">{config.bankDetails.holder}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0EAE0] text-center">
            <p className="text-xs text-[#8A7C70] flex items-center justify-center gap-1.5">
              <span>¡Muchas gracias por ayudarnos a cumplir este sueño!</span>
              <Heart className="w-3.5 h-3.5 text-[#996D29] fill-[#996D29]" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
