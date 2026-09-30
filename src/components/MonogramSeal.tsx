import React from 'react';

interface MonogramSealProps {
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MonogramSeal: React.FC<MonogramSealProps> = ({
  initials = 'S & M',
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  const fontSize = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dimensions} ${className}`}>
      {/* Outer Delicate Ring */}
      <svg
        className="absolute inset-0 w-full h-full text-[#C5A880]/60 animate-[spin_40s_linear_infinite]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="47" strokeWidth="0.75" strokeDasharray="1.5 2.5" />
        <circle cx="50" cy="50" r="43" strokeWidth="0.5" />
      </svg>

      {/* Botanical Laurel Flourish SVG */}
      <svg
        className="absolute inset-0 w-full h-full text-[#B58A46]/70"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        {/* Left Laurel Leaves */}
        <path d="M 28 50 C 26 44 23 40 18 38 C 22 41 24 45 25 49 Z" opacity="0.85" />
        <path d="M 27 38 C 27 32 23 27 18 25 C 21 28 23 33 24 38 Z" opacity="0.85" />
        <path d="M 33 28 C 34 22 30 17 25 15 C 27 19 28 24 30 29 Z" opacity="0.85" />
        <path d="M 43 20 C 45 15 42 10 37 8 C 38 12 39 17 41 21 Z" opacity="0.85" />

        {/* Right Laurel Leaves */}
        <path d="M 72 50 C 74 44 77 40 82 38 C 78 41 76 45 75 49 Z" opacity="0.85" />
        <path d="M 73 38 C 73 32 77 27 82 25 C 79 28 77 33 76 38 Z" opacity="0.85" />
        <path d="M 67 28 C 66 22 70 17 75 15 C 73 19 72 24 70 29 Z" opacity="0.85" />
        <path d="M 57 20 C 55 15 58 10 63 8 C 62 12 61 17 59 21 Z" opacity="0.85" />

        {/* Bottom Ribbon / Tie Arc */}
        <circle cx="50" cy="78" r="1.5" />
        <path d="M 46 78 Q 50 82 54 78" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </svg>

      {/* Monogram Inner Disc */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <span
          className={`font-serif tracking-widest text-[#694F25] font-light ${fontSize}`}
          style={{ letterSpacing: '0.22em' }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
};
