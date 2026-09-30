import React, { useState, useMemo } from 'react';
import {
  Check,
  Send,
  Users,
  Utensils,
  Music,
  Heart,
  Share2,
  Sparkles,
  Search,
  UserCheck,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { RSVPGuest, InvitedGuest, WeddingConfig } from '../types/wedding';

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .trim();

interface RSVPFormProps {
  config: WeddingConfig;
  invitedGuests: InvitedGuest[];
  onAddRSVP: (guest: RSVPGuest) => void;
  existingRSVPs?: RSVPGuest[];
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  config,
  invitedGuests,
  onAddRSVP,
  existingRSVPs = [],
}) => {
  // Step 1: Name search / selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<InvitedGuest | null>(null);
  const [isCustomGuest, setIsCustomGuest] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Step 2: Form fields
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  // If allowedSeats is 2, user can choose 2 (with companion) or 1 (attending solo)
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [companionName, setCompanionName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dietaryRequirement, setDietaryRequirement] = useState<RSVPGuest['dietaryRequirement']>('none');
  const [dietaryDetails, setDietaryDetails] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedGuest, setSubmittedGuest] = useState<RSVPGuest | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Autocomplete suggestions based on searchTerm (accent & punctuation insensitive)
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim() || selectedGuest) return [];
    const term = normalizeText(searchTerm);
    return invitedGuests
      .filter((g) => normalizeText(g.fullName).includes(term))
      .slice(0, 8);
  }, [searchTerm, invitedGuests, selectedGuest]);

  // Handle selecting an invited guest from suggestions or manual search
  const handleSelectGuest = (guest: InvitedGuest) => {
    setSelectedGuest(guest);
    setIsCustomGuest(false);
    setSearchTerm(guest.fullName);
    setHasSearched(true);
    // If allowedSeats === 2, default to 2 and prefill suggested companion if any
    if (guest.allowedSeats === 2) {
      setSelectedSeats(2);
      setCompanionName(guest.suggestedCompanion || '');
    } else {
      setSelectedSeats(1);
      setCompanionName('');
    }
    setValidationError(null);

    // Check if this guest already submitted an RSVP
    const existing = existingRSVPs.find(
      (r) => normalizeText(r.fullName) === normalizeText(guest.fullName)
    );
    if (existing) {
      setPhone(existing.phone || '');
      setEmail(existing.email || '');
      setDietaryRequirement(existing.dietaryRequirement);
      setDietaryDetails(existing.dietaryDetails || '');
      setSongRequest(existing.songRequest || '');
    }
  };

  // Handle continuing when typing a name not in list
  const handleContinueWithCustomName = () => {
    if (!searchTerm.trim()) {
      setValidationError('Por favor ingresá tu nombre y apellido.');
      return;
    }
    // Check if matches an existing guest in master list (accent insensitive)
    const exactMatch = invitedGuests.find(
      (g) => normalizeText(g.fullName) === normalizeText(searchTerm)
    );
    if (exactMatch) {
      handleSelectGuest(exactMatch);
      return;
    }

    // Otherwise create custom guest with default 1 seat
    setSelectedGuest({
      id: `custom-${Date.now()}`,
      fullName: searchTerm.trim(),
      allowedSeats: 1,
    });
    setIsCustomGuest(true);
    setSelectedSeats(1);
    setCompanionName('');
    setHasSearched(true);
    setValidationError(null);
  };

  // Reset to change name
  const handleResetNameSelection = () => {
    setSelectedGuest(null);
    setIsCustomGuest(false);
    setHasSearched(false);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedGuest) {
      setValidationError('Por favor ingresá tu nombre para buscar tu invitación.');
      return;
    }

    if (attending === 'yes' && selectedSeats === 2 && !companionName.trim()) {
      setValidationError('Por favor ingresá el nombre y apellido de tu acompañante.');
      return;
    }

    setIsSubmitting(true);

    const newGuest: RSVPGuest = {
      id: `rsvp-${Date.now()}`,
      fullName: selectedGuest.fullName,
      attending,
      guestsCount: attending === 'yes' ? selectedSeats : 0,
      companionNames: attending === 'yes' && selectedSeats === 2 ? companionName.trim() : undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      dietaryRequirement: attending === 'yes' ? dietaryRequirement : 'none',
      dietaryDetails: dietaryRequirement === 'other' || dietaryRequirement === 'celiac' ? dietaryDetails.trim() : undefined,
      songRequest: songRequest.trim() || undefined,
      personalMessage: personalMessage.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onAddRSVP(newGuest);
      setSubmittedGuest(newGuest);
      setIsSubmitting(false);
    }, 600);
  };

  const handleResetForm = () => {
    setSubmittedGuest(null);
    setSelectedGuest(null);
    setIsCustomGuest(false);
    setSearchTerm('');
    setHasSearched(false);
    setAttending('yes');
    setSelectedSeats(1);
    setCompanionName('');
    setPhone('');
    setEmail('');
    setDietaryRequirement('none');
    setDietaryDetails('');
    setSongRequest('');
    setPersonalMessage('');
    setValidationError(null);
  };

  // Direct WhatsApp confirmation message to Luna & Nahuel
  const sendWhatsAppConfirmation = () => {
    if (!submittedGuest) return;

    let text = `¡Hola Luna y Nahuel! Soy *${submittedGuest.fullName}*.\n\n`;

    if (submittedGuest.attending === 'yes') {
      text += `✨ *¡Confirmo con mucha alegría que voy a su casamiento!*\n`;
      text += `👥 Lugares: ${submittedGuest.guestsCount} persona${submittedGuest.guestsCount > 1 ? 's' : ''}\n`;
      if (submittedGuest.companionNames) {
        text += `👫 Acompañante: ${submittedGuest.companionNames}\n`;
      }
      if (submittedGuest.dietaryRequirement !== 'none') {
        text += `🍽 Menú especial: ${submittedGuest.dietaryRequirement}${
          submittedGuest.dietaryDetails ? ` (${submittedGuest.dietaryDetails})` : ''
        }\n`;
      }
      if (submittedGuest.songRequest) {
        text += `🎵 Tema para la fiesta: "${submittedGuest.songRequest}"\n`;
      }
    } else {
      text += `💌 Quería avisarles que lamentablemente no voy a poder asistir al casamiento, pero les mando todo mi cariño y el mayor de los éxitos.\n`;
    }

    if (submittedGuest.personalMessage) {
      text += `\n💬 *Mensaje:* "${submittedGuest.personalMessage}"\n`;
    }

    text += `\n¡Nos vemos el 21 de Noviembre en San Telmo! 🥂`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <section id="confirmar" className="py-20 md:py-28 px-6 bg-[#FAF7F2] relative">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
            R.S.V.P.
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231E1B] font-light mb-3">
            Confirmación de Asistencia
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-md mx-auto leading-relaxed">
            Ingresá tu nombre para consultar tu invitación y confirmar tu asistencia antes del <strong>31 de Octubre de 2026</strong>.
          </p>
          <div className="w-16 h-px bg-[#C5A880] mx-auto mt-6" />
        </div>

        {/* State A: Success Confirmation View */}
        {submittedGuest ? (
          <div className="bg-white border border-[#D8C7B0] p-8 sm:p-10 rounded-2xl shadow-sm text-center relative overflow-hidden">
            {/* Top gold stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#B58A46] to-[#D4AF37]" />

            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#C5A880] flex items-center justify-center text-[#996D29] mx-auto mb-5 shadow-xs">
              {submittedGuest.attending === 'yes' ? (
                <Check className="w-8 h-8 stroke-[2.5]" />
              ) : (
                <Heart className="w-7 h-7 text-[#996D29] fill-[#996D29]/20" />
              )}
            </div>

            <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-1">
              {submittedGuest.attending === 'yes' ? '¡Confirmación Exitosa!' : 'Respuesta Registrada'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#231E1B] font-normal mb-3">
              ¡Muchas gracias, {submittedGuest.fullName}!
            </h3>

            <p className="text-xs sm:text-sm text-[#61554C] max-w-md mx-auto leading-relaxed mb-6">
              {submittedGuest.attending === 'yes'
                ? `Hemos registrado tu lugar (${submittedGuest.guestsCount} persona${
                    submittedGuest.guestsCount > 1 ? 's' : ''
                  }) para celebrar juntos el 21 de Noviembre de 2026 en San Telmo. ¡Será una fiesta inolvidable!`
                : 'Lamentamos mucho que no puedas acompañarnos físicamente, pero sabemos que tu cariño estará presente. ¡Gracias por avisarnos!'}
            </p>

            {/* Summary Details Badge */}
            {submittedGuest.attending === 'yes' && (
              <div className="bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-4 mb-6 text-left max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8A7C70]">Lugares confirmados:</span>
                  <span className="font-semibold text-[#2C2724]">{submittedGuest.guestsCount} persona(s)</span>
                </div>
                {submittedGuest.companionNames && (
                  <div className="flex justify-between">
                    <span className="text-[#8A7C70]">Acompañante:</span>
                    <span className="font-medium text-[#2C2724]">{submittedGuest.companionNames}</span>
                  </div>
                )}
                {submittedGuest.dietaryRequirement !== 'none' && (
                  <div className="flex justify-between">
                    <span className="text-[#8A7C70]">Menú preferido:</span>
                    <span className="font-medium capitalize text-[#2C2724]">
                      {submittedGuest.dietaryRequirement}
                    </span>
                  </div>
                )}
                {submittedGuest.songRequest && (
                  <div className="flex justify-between">
                    <span className="text-[#8A7C70]">Tema sugerido:</span>
                    <span className="font-medium italic text-[#2C2724]">«{submittedGuest.songRequest}»</span>
                  </div>
                )}
              </div>
            )}

            {/* Guestbook confirmation note */}
            {submittedGuest.personalMessage && (
              <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-[#7A5B28] flex items-center justify-center gap-1.5 max-w-md mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#996D29] shrink-0" />
                <span>
                  ¡Tu mensaje ya está publicado en el{' '}
                  <a href="#libro-firmas" className="underline font-semibold hover:text-[#996D29]">
                    Libro de Firmas
                  </a>!
                </span>
              </div>
            )}

            {/* Actions: Send WhatsApp to Couple + Reset */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={sendWhatsAppConfirmation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA59] text-white text-xs uppercase tracking-wider font-semibold rounded-md shadow-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enviar por WhatsApp a los Novios</span>
              </button>

              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F2ECE1] text-[#4A4036] border border-[#D5C7B2] text-xs uppercase tracking-wider font-medium rounded-md transition-colors"
              >
                <span>Cargar otra respuesta</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Active RSVP Form with Personalized Quota Lookup */
          <div className="bg-white border border-[#E5DAC8] p-7 sm:p-10 rounded-2xl shadow-xs relative">
            {/* Top subtle highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-70" />

            {/* PHASE 1: Guest Name Identification */}
            {!selectedGuest ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="searchName" className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-2">
                    Ingresá tu Nombre y Apellido
                  </label>
                  <p className="text-xs text-[#8A7C70] mb-3">
                    Escribí tu nombre y apellido para consultar tu invitación:
                  </p>

                  <div className="relative">
                    <input
                      id="searchName"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleContinueWithCustomName();
                        }
                      }}
                      placeholder="Escribí tu nombre o apellido..."
                      className="w-full pl-10 pr-24 py-3 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] placeholder-[#A39587] transition-all"
                    />
                    <Search className="w-4 h-4 text-[#8A7C70] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <button
                      type="button"
                      onClick={handleContinueWithCustomName}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Continuar
                    </button>
                  </div>

                  {/* Autocomplete suggestion matches */}
                  {filteredSuggestions.length > 0 && (
                    <div className="mt-3 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl overflow-hidden shadow-xs divide-y divide-[#EFE7DC]">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A7C70] px-3.5 py-1.5 block bg-[#F5EFE5]">
                        Invitados encontrados en el padrón:
                      </span>
                      {filteredSuggestions.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleSelectGuest(g)}
                          className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-white transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5 text-[#996D29]" />
                            <span className="font-medium text-[#2C2724] group-hover:text-[#996D29]">
                              {g.fullName}
                            </span>
                            {g.groupCategory && (
                              <span className="text-[10px] text-[#8A7C70] px-1.5 py-0.5 rounded bg-stone-100">
                                {g.groupCategory}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#8A7C70]">
                            {g.allowedSeats === 2 ? '2 lugares' : '1 lugar'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {validationError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            ) : (
              /* PHASE 2: Quota revealed & Confirmation details */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identified Guest Header & Allowance Badge */}
                <div className="p-4 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-lg text-[#2C2724] font-medium">
                          {selectedGuest.fullName}
                        </span>
                        {selectedGuest.allowedSeats === 2 ? (
                          <span className="px-2.5 py-0.5 bg-[#996D29]/10 text-[#996D29] border border-[#996D29]/20 text-[11px] font-semibold rounded-full">
                            Invitación para 2 personas
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-[#695D53]/10 text-[#5C534D] border border-[#695D53]/20 text-[11px] font-semibold rounded-full">
                            Invitación Individual (1 persona)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#6B5E53]">
                        {selectedGuest.allowedSeats === 2
                          ? '✨ Tenés 2 lugares reservados a tu nombre (para vos y 1 acompañante).'
                          : isCustomGuest
                          ? '✨ Tu invitación está registrada para 1 persona.'
                          : '✨ Tu invitación es personal e individual (1 lugar reservado a tu nombre).'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetNameSelection}
                      className="text-[11px] text-[#8A7C70] hover:text-[#2C2724] underline flex items-center gap-1 shrink-0 pt-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Cambiar</span>
                    </button>
                  </div>
                </div>

                {validationError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Attendance radio choice */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-3">
                    ¿Vas a poder asistir?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        attending === 'yes'
                          ? 'border-[#996D29] bg-[#FAF7F2] text-[#2C2724] ring-1 ring-[#996D29]/40 shadow-xs'
                          : 'border-[#E0D5C3] bg-white text-[#70645B] hover:border-[#C5A880]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={attending === 'yes'}
                        onChange={() => setAttending('yes')}
                        className="sr-only"
                      />
                      <span className="text-base">🥂</span>
                      <span className="text-xs font-semibold">¡Sí, ahí estaré!</span>
                    </label>

                    <label
                      className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        attending === 'no'
                          ? 'border-[#8A7C70] bg-[#FAF7F2] text-[#2C2724] ring-1 ring-[#8A7C70]/40 shadow-xs'
                          : 'border-[#E0D5C3] bg-white text-[#70645B] hover:border-[#C5A880]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={attending === 'no'}
                        onChange={() => setAttending('no')}
                        className="sr-only"
                      />
                      <span className="text-base">💌</span>
                      <span className="text-xs font-medium">No puedo asistir</span>
                    </label>
                  </div>
                </div>

                {/* Conditional attendance fields */}
                {attending === 'yes' && (
                  <div className="space-y-5 pt-2 border-t border-[#F0EBE1]">
                    {/* If allowedSeats is 2, allow selecting 2 or 1 seat */}
                    {selectedGuest.allowedSeats === 2 ? (
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-2">
                          ¿Venís con acompañante?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <label
                            className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                              selectedSeats === 2
                                ? 'border-[#996D29] bg-[#FAF7F2] text-[#2C2724] font-semibold shadow-2xs'
                                : 'border-[#D5C7B2] bg-white text-[#63574E]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedSeats"
                              value={2}
                              checked={selectedSeats === 2}
                              onChange={() => setSelectedSeats(2)}
                              className="sr-only"
                            />
                            <Users className="w-4 h-4 text-[#996D29]" />
                            <span>Sí, voy con 1 acompañante (2 lugares)</span>
                          </label>

                          <label
                            className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                              selectedSeats === 1
                                ? 'border-[#996D29] bg-[#FAF7F2] text-[#2C2724] font-semibold shadow-2xs'
                                : 'border-[#D5C7B2] bg-white text-[#63574E]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedSeats"
                              value={1}
                              checked={selectedSeats === 1}
                              onChange={() => setSelectedSeats(1)}
                              className="sr-only"
                            />
                            <UserCheck className="w-4 h-4 text-[#8A7C70]" />
                            <span>Asisto solo/a (1 lugar)</span>
                          </label>
                        </div>

                        {selectedSeats === 2 && (
                          <div>
                            <label
                              htmlFor="companionName"
                              className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-1.5"
                            >
                              Nombre y Apellido de tu Acompañante *
                            </label>
                            <input
                              id="companionName"
                              type="text"
                              value={companionName}
                              onChange={(e) => setCompanionName(e.target.value)}
                              placeholder="Nombre y apellido completo"
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] placeholder-[#A39587] transition-all"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* When allowedSeats === 1, strictly 1 seat: NO selection is shown */
                      <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-lg text-xs text-[#5C534D] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#996D29] shrink-0" />
                        <span>
                          Tu pase es <strong>individual (1 persona)</strong> reservado a tu nombre.
                        </span>
                      </div>
                    )}

                    {/* Dietary requirements */}
                    <div>
                      <label
                        htmlFor="dietaryRequirement"
                        className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-1.5"
                      >
                        Menú Especial / Restricción Alimentaria
                      </label>
                      <div className="relative">
                        <select
                          id="dietaryRequirement"
                          value={dietaryRequirement}
                          onChange={(e) =>
                            setDietaryRequirement(e.target.value as RSVPGuest['dietaryRequirement'])
                          }
                          className="w-full px-4 py-2.5 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] transition-all appearance-none cursor-pointer"
                        >
                          <option value="none">Menú Tradicional (Sin restricciones)</option>
                          <option value="celiac">Celíaco / Sin T.A.C.C.</option>
                          <option value="vegetarian">Vegetariano</option>
                          <option value="vegan">Vegano</option>
                          <option value="hypertensive">Hipertenso / Sin Sal</option>
                          <option value="other">Alergia o requerimiento específico</option>
                        </select>
                        <Utensils className="w-4 h-4 text-[#8A7C70] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {(dietaryRequirement === 'other' || dietaryRequirement === 'celiac') && (
                      <div>
                        <label
                          htmlFor="dietaryDetails"
                          className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-1.5"
                        >
                          Detalles de la Alergia / Menú Especial
                        </label>
                        <input
                          id="dietaryDetails"
                          type="text"
                          value={dietaryDetails}
                          onChange={(e) => setDietaryDetails(e.target.value)}
                          placeholder="Ej. Alergia a los frutos secos, celiaquía estricta..."
                          className="w-full px-4 py-2.5 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] placeholder-[#A39587] transition-all"
                        />
                      </div>
                    )}

                    {/* Song request */}
                    <div>
                      <label
                        htmlFor="songRequest"
                        className="text-xs uppercase tracking-wider text-[#63574E] font-semibold block mb-1.5"
                      >
                        Canción que no puede faltar en la fiesta (DJ)
                      </label>
                      <div className="relative">
                        <input
                          id="songRequest"
                          type="text"
                          value={songRequest}
                          onChange={(e) => setSongRequest(e.target.value)}
                          placeholder="Ej. Canción y Artista favorito para bailar"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] placeholder-[#A39587] transition-all"
                        />
                        <Music className="w-4 h-4 text-[#8A7C70] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Dedication message (Publishes to Guestbook) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="personalMessage"
                      className="text-xs uppercase tracking-wider text-[#63574E] font-semibold"
                    >
                      Mensaje o Dedicatoria para los Novios
                    </label>
                    <span className="text-[11px] text-[#996D29]">Se publica en el Libro de Firmas</span>
                  </div>
                  <textarea
                    id="personalMessage"
                    rows={3}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder={`Dejales unas palabras de cariño a ${config.brideName} y ${config.groomName}...`}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D5C7B2] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 text-sm text-[#2C2724] placeholder-[#A39587] transition-all resize-none"
                  />
                  <p className="text-[11px] text-[#8A7C70] mt-1">
                    Tu dedicatoria se mostrará en el Libro de Firmas de la página para compartir la emoción.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Registrando confirmación...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{attending === 'yes' ? 'Confirmar Asistencia' : 'Enviar Respuesta'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
