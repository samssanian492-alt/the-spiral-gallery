import React from 'react';
import type { ArtworkItem } from '../data/exhibitionData';

/**
 * Reusable Spiral SVG path generator (Archimedean spiral)
 */
export function generateSpiralPath(
  cx = 100,
  cy = 100,
  turns = 4.5,
  maxRadius = 90,
  points = 180
): string {
  const coords: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * turns * Math.PI * 2;
    const r = t * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    coords.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return coords.join(' ');
}

export const SpiralGlyph: React.FC<{
  className?: string;
  strokeWidth?: number;
  turns?: number;
}> = ({ className = 'w-8 h-8', strokeWidth = 2.2, turns = 4 }) => {
  const d = React.useMemo(() => generateSpiralPath(50, 50, turns, 44, 140), [turns]);
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Anatomical watching eye SVG that tracks a normalized (-1..1) offset
 */
export const TrackingEyeSvg: React.FC<{
  lookX: number;
  lookY: number;
  className?: string;
  crimson?: boolean;
  blinking?: boolean;
}> = ({ lookX, lookY, className = 'w-24 h-16', crimson = false, blinking = false }) => {
  const clampedX = Math.max(-1, Math.min(1, lookX)) * 11;
  const clampedY = Math.max(-1, Math.min(1, lookY)) * 6;
  const spiralD = React.useMemo(() => generateSpiralPath(60, 35, 3, 10, 70), []);

  return (
    <svg viewBox="0 0 120 70" fill="none" className={className} aria-hidden="true">
      {/* Outer lid silhouette */}
      <path
        d="M6,35 C28,8 92,8 114,35 C92,62 28,62 6,35 Z"
        fill="#E8E0D0"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      {/* Fine manga eye veins */}
      <path d="M16,33 L27,31 M19,39 L29,38" stroke="#6B0F0F" strokeWidth="0.9" opacity="0.7" />
      <path d="M104,34 L92,32 M100,40 L90,39" stroke="#6B0F0F" strokeWidth="0.9" opacity="0.7" />
      {/* Moving iris & spiral pupil */}
      <g
        style={{
          transform: `translate(${clampedX}px, ${clampedY}px) scaleY(${blinking ? 0.08 : 1})`,
          transformOrigin: '60px 35px',
          transition: 'transform 120ms ease-out',
        }}
      >
        <circle
          cx="60"
          cy="35"
          r="15"
          fill={crimson ? '#6B0F0F' : '#1A1815'}
          stroke="#000000"
          strokeWidth="1.5"
        />
        <path d={spiralD} stroke="#F0EDE5" strokeWidth="1.2" opacity="0.85" />
        <circle cx="60" cy="35" r="5" fill="#000000" />
        <circle cx="55" cy="30" r="2.2" fill="#F0EDE5" />
      </g>
      {/* Upper eyelid crease */}
      <path
        d="M12,26 C35,4 85,4 108,26"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.6"
      />
    </svg>
  );
};

/**
 * Disturbing secondary overlay revealed on hover / flicker of exhibition plates
 * Creates the uncanny "second version (eyes open / spiral / grin / fracture)"
 * without requiring separate raster downloads.
 */
export const AlternateHorrorOverlay: React.FC<{
  motif: ArtworkItem['alternateMotif'];
  visible: boolean;
}> = ({ motif, visible }) => {
  const spiralD = React.useMemo(() => generateSpiralPath(150, 150, 5.5, 135, 180), []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Subtle crimson blood wash */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(107,15,15,0.28) 0%, rgba(0,0,0,0.68) 100%)',
        }}
      />

      {motif === 'eyes' && (
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full opacity-90">
          {[
            { x: 85, y: 110, s: 0.72, r: -8 },
            { x: 215, y: 105, s: 0.75, r: 6 },
            { x: 150, y: 185, s: 0.58, r: 0 },
            { x: 75, y: 225, s: 0.42, r: -14 },
            { x: 228, y: 215, s: 0.45, r: 12 },
          ].map((eye, idx) => (
            <g
              key={idx}
              transform={`translate(${eye.x}, ${eye.y}) rotate(${eye.r}) scale(${eye.s})`}
            >
              <path
                d="M-45,0 C-22,-22 22,-22 45,0 C22,22 -22,22 -45,0 Z"
                fill="#F0EDE5"
                stroke="#000"
                strokeWidth="3"
              />
              <circle cx="0" cy="0" r="14" fill="#000" />
              <circle cx="0" cy="0" r="5" fill="#6B0F0F" />
              <circle cx="-4" cy="-4" r="2.2" fill="#F0EDE5" />
            </g>
          ))}
        </svg>
      )}

      {motif === 'spiral' && (
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full opacity-80">
          <path d={spiralD} stroke="#6B0F0F" strokeWidth="2.8" fill="none" />
          <path
            d={spiralD}
            stroke="#F0EDE5"
            strokeWidth="1"
            fill="none"
            transform="rotate(14 150 150)"
            opacity="0.55"
          />
        </svg>
      )}

      {motif === 'grin' && (
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full opacity-90">
          <path
            d="M65,195 Q150,265 235,195 Q150,225 65,195 Z"
            fill="#000"
            stroke="#F0EDE5"
            strokeWidth="2"
          />
          {Array.from({ length: 11 }).map((_, idx) => {
            const x = 82 + idx * 13.5;
            return (
              <line
                key={idx}
                x1={x}
                y1="198"
                x2={x}
                y2="226"
                stroke="#E8E0D0"
                strokeWidth="1.6"
              />
            );
          })}
          <circle cx="105" cy="112" r="16" fill="#F0EDE5" stroke="#000" strokeWidth="3" />
          <circle cx="105" cy="112" r="5" fill="#000" />
          <circle cx="195" cy="112" r="16" fill="#F0EDE5" stroke="#000" strokeWidth="3" />
          <circle cx="195" cy="112" r="5" fill="#000" />
        </svg>
      )}

      {motif === 'fracture' && (
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full opacity-85">
          <path
            d="M150,15 L142,88 L165,134 L138,195 L154,285 M142,88 L68,125 M165,134 L240,164 M138,195 L82,245"
            stroke="#F0EDE5"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M152,15 L144,88 L167,134 L140,195 L156,285"
            stroke="#6B0F0F"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
        </svg>
      )}

      {motif === 'centipede' && (
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full opacity-80">
          {Array.from({ length: 16 }).map((_, i) => {
            const y = 30 + i * 16;
            const x = 150 + Math.sin(i * 0.65) * 42;
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <ellipse cx="0" cy="0" rx="11" ry="6" fill="#000" stroke="#F0EDE5" strokeWidth="1" />
                <path d="M-11,0 L-24,-6 M11,0 L24,-6" stroke="#F0EDE5" strokeWidth="1.2" />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

/**
 * Fallback frame adhering to Zero-Broken-Image Policy
 */
export const ResilientArtworkImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className = '', loading = 'lazy' }) => {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#1A1815] p-6 text-center text-[#E8E0D0] ${className}`}
      >
        <SpiralGlyph className="mb-3 h-12 w-12 text-[#6B0F0F]" />
        <p className="font-serif-display text-lg italic">{alt}</p>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-[#C4A77D]">
          Plate temporarily sealed
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-all duration-700 ${
        loaded ? 'blur-0 opacity-100' : 'scale-[1.02] opacity-80 blur-sm'
      }`}
    />
  );
};
