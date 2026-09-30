import React, { useState, useEffect } from 'react';
import { CalendarPlus, Clock } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface CountdownProps {
  config: WeddingConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(config.eventDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.eventDate]);

  // Format date for calendar .ics format: YYYYMMDDTHHmmssZ
  const formatCalendarDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  // Generate Google Calendar link
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Boda de ${config.brideName} & ${config.groomName}`);
    const details = encodeURIComponent(
      `¡Celebramos nuestra boda! Ceremonia en ${config.ceremonyVenue.name} (${config.ceremonyVenue.address}) a las ${config.ceremonyVenue.time} y fiesta en ${config.partyVenue.name} (${config.partyVenue.address}).`
    );
    const location = encodeURIComponent(`${config.partyVenue.name}, ${config.partyVenue.address}, ${config.partyVenue.city}`);

    const startDate = new Date(config.eventDate);
    const endDate = new Date(startDate.getTime() + 10 * 60 * 60 * 1000); // +10 hours celebration

    const startIso = formatCalendarDate(startDate);
    const endIso = formatCalendarDate(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // Download .ics file for Apple Calendar / Outlook
  const downloadIcs = () => {
    const startDate = new Date(config.eventDate);
    const endDate = new Date(startDate.getTime() + 10 * 60 * 60 * 1000);
    const startIso = formatCalendarDate(startDate);
    const endIso = formatCalendarDate(endDate);

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nuestra Boda//Invitacion//ES',
      'BEGIN:VEVENT',
      `UID:boda-${Date.now()}@nuestraboda.com`,
      `DTSTAMP:${formatCalendarDate(new Date())}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:Boda de ${config.brideName} y ${config.groomName}`,
      `DESCRIPTION:Ceremonia en ${config.ceremonyVenue.name} y fiesta en ${config.partyVenue.name}`,
      `LOCATION:${config.partyVenue.name}, ${config.partyVenue.address}, ${config.partyVenue.city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Boda-${config.brideName}-y-${config.groomName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <section id="cuenta-regresiva" className="py-16 md:py-24 px-6 bg-[#F4EFE6]/60 border-y border-[#E6DDCE]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section kicker */}
        <span className="text-xs uppercase tracking-widest text-[#996D29] font-semibold block mb-2">
          Cuenta Regresiva
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2724] font-normal mb-3">
          Cada segundo nos acerca al gran día
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#73675E] max-w-md mx-auto mb-10">
          Esperamos con ilusión compartir este momento inolvidable junto a vos.
        </p>

        {/* Counter Cards */}
        {timeLeft.isPast ? (
          <div className="p-8 bg-white rounded-lg border border-[#E5DAC8] max-w-md mx-auto shadow-xs">
            <p className="font-serif text-2xl text-[#2C2724]">¡El gran día ha llegado!</p>
            <p className="text-sm text-[#73675E] mt-2">Gracias por ser parte de nuestra historia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-10">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="bg-white/90 border border-[#E5DAC8] rounded-xl p-5 shadow-xs flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#C5A880] transition-colors"
              >
                {/* Subtle top gold accent line */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-60" />

                <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#2C2724] tabular-nums tracking-tight">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#8A7C70] font-medium mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Calendar actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F9F6F0] text-[#3E3630] border border-[#D5C7B2] rounded-md transition-colors shadow-2xs font-medium"
          >
            <CalendarPlus className="w-4 h-4 text-[#996D29]" />
            <span>Agregar a Google Calendar</span>
          </a>
          <button
            onClick={downloadIcs}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F9F6F0] text-[#3E3630] border border-[#D5C7B2] rounded-md transition-colors shadow-2xs font-medium"
          >
            <Clock className="w-4 h-4 text-[#996D29]" />
            <span>Descargar Recordatorio (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
