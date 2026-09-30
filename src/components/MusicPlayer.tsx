import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, ChevronUp, SkipForward } from 'lucide-react';

export type TrackId = 'canon' | 'starwars' | 'simuladores';

// 1. Canon in D (Pachelbel) - EXACT original audio progression & intervals
const originalCanonNotes = [
  // D Major arpeggio
  293.66, 369.99, 440.0, 587.33,
  // A Major arpeggio
  220.0, 329.63, 440.0, 554.37,
  // B Minor arpeggio
  246.94, 369.99, 440.0, 493.88,
  // F# Minor arpeggio
  185.0, 277.18, 369.99, 554.37,
  // G Major arpeggio
  196.0, 293.66, 392.0, 587.33,
  // D Major arpeggio
  220.0, 293.66, 369.99, 440.0,
  // G Major
  196.0, 246.94, 392.0, 493.88,
  // A Major resolution
  220.0, 277.18, 329.63, 440.0,
];

interface MelodyNote {
  freq: number;
  dur: number;
  sustain: number;
}

// 2. Star Wars Main Fanfare (Tonalidad original en Si Bemol Mayor / Bb Major - John Williams)
const starWarsNotes: MelodyNote[] = [
  { freq: 349.23, dur: 180, sustain: 0.35 }, // Fa4 (F4)
  { freq: 349.23, dur: 180, sustain: 0.35 }, // Fa4
  { freq: 349.23, dur: 180, sustain: 0.35 }, // Fa4
  { freq: 466.16, dur: 750, sustain: 1.2 },  // Sib4 (Bb4)
  { freq: 698.46, dur: 750, sustain: 1.2 },  // Fa5 (F5)
  { freq: 622.25, dur: 180, sustain: 0.35 }, // Mib5 (Eb5)
  { freq: 587.33, dur: 180, sustain: 0.35 }, // Re5 (D5)
  { freq: 523.25, dur: 180, sustain: 0.35 }, // Do5 (C5)
  { freq: 932.33, dur: 750, sustain: 1.2 },  // Sib5 (Bb5)
  { freq: 698.46, dur: 550, sustain: 0.9 },  // Fa5 (F5)
  { freq: 622.25, dur: 180, sustain: 0.35 }, // Mib5 (Eb5)
  { freq: 587.33, dur: 180, sustain: 0.35 }, // Re5 (D5)
  { freq: 523.25, dur: 180, sustain: 0.35 }, // Do5 (C5)
  { freq: 932.33, dur: 750, sustain: 1.2 },  // Sib5 (Bb5)
  { freq: 698.46, dur: 550, sustain: 0.9 },  // Fa5 (F5)
  { freq: 622.25, dur: 220, sustain: 0.4 },  // Mib5 (Eb5)
  { freq: 587.33, dur: 220, sustain: 0.4 },  // Re5 (D5)
  { freq: 622.25, dur: 220, sustain: 0.4 },  // Mib5 (Eb5)
  { freq: 523.25, dur: 1100, sustain: 1.4 }, // Do5 (C5)
  { freq: 0, dur: 450, sustain: 0 },         // pausa
];

const EIGHTH = 230; // Duración uniforme de corchea constante (~130 BPM)

// 3. Los Simuladores · Cité Tango (Astor Piazzolla) - 32 corcheas continuas exactas (4 compases de 4/4)
const simuladoresNotes: MelodyNote[] = [
  // Compás 1: E F F F# F# F F E (8 corcheas)
  { freq: 329.63, dur: EIGHTH, sustain: 0.26 }, // E
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 329.63, dur: EIGHTH, sustain: 0.26 }, // E

  // Compás 2: pausa E F F# G F# F E (1 silencio de corchea + 7 corcheas = 8 corcheas)
  { freq: 0, dur: EIGHTH, sustain: 0 },         // Silencio de corchea ("pausa")
  { freq: 329.63, dur: EIGHTH, sustain: 0.26 }, // E
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 392.00, dur: EIGHTH, sustain: 0.26 }, // G
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 329.63, dur: EIGHTH, sustain: 0.26 }, // E

  // Compás 3: E F F F# F# G G G# (8 corcheas)
  { freq: 329.63, dur: EIGHTH, sustain: 0.26 }, // E
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 392.00, dur: EIGHTH, sustain: 0.26 }, // G
  { freq: 392.00, dur: EIGHTH, sustain: 0.26 }, // G
  { freq: 415.30, dur: EIGHTH, sustain: 0.26 }, // G#

  // Compás 4: G# G G F# F# F F E (8 corcheas)
  { freq: 415.30, dur: EIGHTH, sustain: 0.26 }, // G#
  { freq: 392.00, dur: EIGHTH, sustain: 0.26 }, // G
  { freq: 392.00, dur: EIGHTH, sustain: 0.26 }, // G
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 369.99, dur: EIGHTH, sustain: 0.26 }, // F#
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 349.23, dur: EIGHTH, sustain: 0.26 }, // F
  { freq: 329.63, dur: EIGHTH, sustain: 0.30 }, // E
];

const TRACK_OPTIONS: { id: TrackId; name: string; tag: string; icon: string }[] = [
  {
    id: 'canon',
    name: 'Canon en Re',
    tag: 'Nupcial Romántico (Predeterminado)',
    icon: '🎻',
  },
  {
    id: 'starwars',
    name: 'Star Wars Fanfare',
    tag: 'Original en Si♭ Mayor (Heroico)',
    icon: '⚔️',
  },
  {
    id: 'simuladores',
    name: 'Los Simuladores',
    tag: 'Cité Tango (Piazzolla)',
    icon: '🕵️‍♂️',
  },
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<TrackId>(() => {
    const saved = localStorage.getItem('wedding_music_track') as TrackId | null;
    if (saved === 'starwars' || saved === 'simuladores') return saved;
    return 'canon';
  });
  const [showMenu, setShowMenu] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentTrackIdRef = useRef<TrackId>('canon');
  const canonIndexRef = useRef<number>(0);
  const starWarsIndexRef = useRef<number>(0);
  const simuladoresIndexRef = useRef<number>(0);

  isPlayingRef.current = isPlaying;
  currentTrackIdRef.current = currentTrackId;

  // Exact original audio note synthesis (warm single triangle oscillator with natural acoustic tail)
  const playOriginalNote = (
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    attack: number = 0.05
  ) => {
    if (freq <= 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.08, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const stopMusicLoop = () => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startMusicLoop = (trackToPlay?: TrackId) => {
    stopMusicLoop();
    isPlayingRef.current = true;

    const targetTrack = trackToPlay || currentTrackIdRef.current;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (targetTrack === 'canon') {
      canonIndexRef.current = 0;
      const loopCanon = () => {
        if (!isPlayingRef.current) return;
        if (!ctx || ctx.state === 'closed') return;
        const freq = originalCanonNotes[canonIndexRef.current % originalCanonNotes.length];
        // Exactly 1.4s duration with 420ms note intervals (the beloved original first version)
        playOriginalNote(ctx, freq, ctx.currentTime, 1.4);
        canonIndexRef.current++;
        timerRef.current = window.setTimeout(loopCanon, 420);
      };
      loopCanon();
    } else if (targetTrack === 'starwars') {
      starWarsIndexRef.current = 0;
      const loopStarWars = () => {
        if (!isPlayingRef.current) return;
        if (!ctx || ctx.state === 'closed') return;
        const item = starWarsNotes[starWarsIndexRef.current % starWarsNotes.length];
        if (item.freq > 0) {
          playOriginalNote(ctx, item.freq, ctx.currentTime, item.sustain);
        }
        starWarsIndexRef.current++;
        timerRef.current = window.setTimeout(loopStarWars, item.dur);
      };
      loopStarWars();
    } else {
      // Los Simuladores (Cité Tango)
      simuladoresIndexRef.current = 0;
      const loopSimuladores = () => {
        if (!isPlayingRef.current) return;
        if (!ctx || ctx.state === 'closed') return;
        const item = simuladoresNotes[simuladoresIndexRef.current % simuladoresNotes.length];
        if (item.freq > 0) {
          playOriginalNote(ctx, item.freq, ctx.currentTime, item.sustain, 0.02);
        }
        simuladoresIndexRef.current++;
        timerRef.current = window.setTimeout(loopSimuladores, item.dur);
      };
      loopSimuladores();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusicLoop();
      setIsPlaying(false);
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      startMusicLoop();
    }
  };

  const handleSelectTrack = (trackId: TrackId) => {
    setCurrentTrackId(trackId);
    localStorage.setItem('wedding_music_track', trackId);
    setShowMenu(false);

    if (isPlaying) {
      startMusicLoop(trackId);
    }
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const order: TrackId[] = ['canon', 'starwars', 'simuladores'];
    const currentIndex = order.indexOf(currentTrackId);
    const nextTrack = order[(currentIndex + 1) % order.length];
    handleSelectTrack(nextTrack);
  };

  useEffect(() => {
    return () => {
      stopMusicLoop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const currentTrackMeta = TRACK_OPTIONS.find((t) => t.id === currentTrackId) || TRACK_OPTIONS[0];

  return (
    <aside aria-label="Reproductor de música ambiental" className="fixed bottom-5 right-5 z-40 select-none">
      {/* Popover track selector */}
      {showMenu && (
        <div className="absolute bottom-full right-0 mb-3 bg-[#231E1B] text-[#FAF7F2] border border-[#52463C] rounded-2xl p-3 shadow-2xl w-64 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3D352F] text-[11px] text-[#A89E92] uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
              Elegir Melodía
            </span>
            <button
              onClick={() => setShowMenu(false)}
              className="text-[#8A7C70] hover:text-[#FAF7F2] p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5">
            {TRACK_OPTIONS.map((t) => {
              const isSelected = t.id === currentTrackId;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D352F] text-[#FAF7F2] font-semibold border border-[#C5A880]/60'
                      : 'hover:bg-[#2C2724] text-[#D8CFBE]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{t.icon}</span>
                    <div>
                      <div className="text-xs leading-tight">{t.name}</div>
                      <div className="text-[10px] text-[#8A7C70]">{t.tag}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main floating pill */}
      <div
        className={`flex items-center gap-1 p-1.5 rounded-full shadow-xl border transition-all duration-300 ${
          isPlaying
            ? 'bg-[#231E1B] text-[#FAF7F2] border-[#C5A880] ring-2 ring-[#C5A880]/30'
            : 'bg-white/95 text-[#4A4036] border-[#D5C7B2] hover:bg-[#FAF7F2]'
        }`}
      >
        {/* Play / Pause toggle */}
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full cursor-pointer hover:opacity-85 transition-opacity"
          title={isPlaying ? 'Pausar melodía' : 'Reproducir música'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-[#D4AF37] animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-[#D4AF37] animate-[pulse_0.6s_ease-in-out_infinite_0.2s]" />
                <span className="w-0.5 h-full bg-[#D4AF37] animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
              </div>
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-medium tracking-wide flex items-center gap-1.5">
                <span>{currentTrackMeta.icon}</span>
                <span className="hidden sm:inline max-w-[130px] truncate">{currentTrackMeta.name}</span>
              </span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-[#996D29]/15 flex items-center justify-center text-[#996D29]">
                <Music className="w-3 h-3 text-[#996D29]" />
              </div>
              <span className="text-[11px] font-medium tracking-wide text-[#4A4036] flex items-center gap-1">
                <span>Reproducir música</span>
              </span>
            </>
          )}
        </button>

        {/* Quick Switch button between tracks */}
        <button
          onClick={handleNextTrack}
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${
            isPlaying ? 'text-[#C5A880]' : 'text-[#8A7C70]'
          }`}
          title="Siguiente melodía"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Open menu chevron */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${
            isPlaying ? 'text-[#C5A880]' : 'text-[#8A7C70]'
          }`}
          title="Ver melodías"
        >
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};
