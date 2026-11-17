import React, { useEffect, useState } from 'react';
import { horrorAudio } from '../utils/horrorAudio';
import { generateSpiralPath } from './HorrorMotifs';

interface PreloaderGateProps {
  onEnter: (options: { reducedMotion: boolean; audio: boolean }) => void;
}

const ERRATIC_COUNTS = [100, 94, 87, 92, 71, 41, 63, 28, 19, 7, 13, 3, 0];

/**
 * PreloaderGate
 * ---------------------------------------------------------------------------
 * 1. Accessibility & Viewer Discretion screen at initial load.
 * 2. "The Descent" sequence: SVG spiral drawing itself -> accelerating rotation ->
 *    chaotic countdown (100 -> 0 out of order) -> glass-fracture reveal.
 */
export const PreloaderGate: React.FC<PreloaderGateProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<'warning' | 'descending' | 'cracking'>('warning');
  const [countIndex, setCountIndex] = useState(0);
  const [flashGlitch, setFlashGlitch] = useState(false);
  const [wantAudio, setWantAudio] = useState(false);
  const [chosenReduced, setChosenReduced] = useState(false);

  const spiralD = React.useMemo(() => generateSpiralPath(120, 120, 5.5, 108, 220), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setChosenReduced(prefersReduced);
    }
  }, []);

  const startDescent = (useReduced: boolean) => {
    setChosenReduced(useReduced);
    if (wantAudio) {
      horrorAudio.setEnabled(true);
      horrorAudio.playInkTick();
    }

    if (useReduced) {
      onEnter({ reducedMotion: true, audio: wantAudio });
      return;
    }

    setStage('descending');
  };

  useEffect(() => {
    if (stage !== 'descending') return;

    const countTimer = setInterval(() => {
      setCountIndex((prev) => {
        if (prev >= ERRATIC_COUNTS.length - 1) {
          clearInterval(countTimer);
          setStage('cracking');
          setTimeout(() => {
            onEnter({ reducedMotion: chosenReduced, audio: wantAudio });
          }, 700);
          return prev;
        }
        if (Math.random() < 0.25) {
          setFlashGlitch(true);
          setTimeout(() => setFlashGlitch(false), 70);
        }
        return prev + 1;
      });
    }, 230);

    return () => clearInterval(countTimer);
  }, [stage, chosenReduced, wantAudio, onEnter]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Exhibition viewer discretion warning and entrance"
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black px-6 text-[#F0EDE5] transition-opacity duration-700 ${
        stage === 'cracking' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle glitch flash frame during descent */}
      {flashGlitch && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center bg-[#F0EDE5]/15"
        >
          <svg viewBox="0 0 200 200" className="h-72 w-72 opacity-80">
            <circle cx="70" cy="85" r="14" fill="#F0EDE5" />
            <circle cx="70" cy="85" r="4" fill="#000" />
            <circle cx="130" cy="85" r="14" fill="#F0EDE5" />
            <circle cx="130" cy="85" r="4" fill="#000" />
            <path d="M62,145 Q100,175 138,145" stroke="#F0EDE5" strokeWidth="4" fill="none" />
          </svg>
        </div>
      )}

      {/* Glass fracture overlay on final reveal */}
      {stage === 'cracking' && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          className="pointer-events-none fixed inset-0 z-20 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M500,500 L120,40 M500,500 L890,90 M500,500 L960,540 M500,500 L780,960 M500,500 L210,940 M500,500 L30,480 M500,500 L480,0"
            stroke="#F0EDE5"
            strokeWidth="2.5"
            opacity="0.85"
          />
        </svg>
      )}

      {stage === 'warning' ? (
        <div className="max-w-xl border border-[#C4A77D]/30 bg-[#0A0908] p-8 md:p-12">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <span className="font-jp text-sm tracking-[0.25em] text-[#C4A77D]">
              螺旋の回廊 · 閲覧注意
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C4A77D]">
              Viewer Discretion Advised
            </span>
          </div>

          <h1 className="mt-6 font-serif-display text-3xl font-medium tracking-tight text-[#F0EDE5] md:text-4xl">
            The Spiral Gallery
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#E8E0D0]/85">
            This exhibition contains flashing imagery, optical distortion, and unsettling
            horror manga artwork. Once you enter, certain plates may continue watching.
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => setWantAudio((v) => !v)}
              aria-pressed={wantAudio}
              className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest text-[#E8E0D0] transition-colors hover:border-[#C4A77D]"
            >
              {wantAudio ? 'Soundscape: Enabled' : 'Soundscape: Muted'}
            </button>
            <span className="text-xs text-[#C4A77D]/80">
              Subterranean hum & whispers
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => startDescent(false)}
              className="bg-[#6B0F0F] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:bg-[#9E1B1B]"
            >
              Enter the Spiral
            </button>
            <button
              type="button"
              onClick={() => startDescent(true)}
              className="border border-white/25 px-5 py-3 text-xs uppercase tracking-[0.16em] text-[#E8E0D0] transition-colors hover:border-[#F0EDE5] hover:text-white"
            >
              Enter (Reduced Motion)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible">
              <path
                d={spiralD}
                fill="none"
                stroke="#F0EDE5"
                strokeWidth="2.4"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 2200,
                  strokeDashoffset: Math.max(0, 2200 - countIndex * 210),
                  transformOrigin: '120px 120px',
                  transform: `rotate(${countIndex * 48}deg) scale(${1 + countIndex * 0.018})`,
                  transition: 'transform 220ms linear, stroke-dashoffset 220ms linear',
                }}
              />
            </svg>
          </div>

          <p className="animate-horror-flicker mt-6 text-xs uppercase tracking-[0.35em] text-[#E8E0D0]">
            ENTERING THE SPIRAL...
          </p>

          <p className="mt-3 font-serif-display text-5xl tabular-nums text-[#6B0F0F]">
            {String(ERRATIC_COUNTS[countIndex]).padStart(2, '0')}
          </p>

          <button
            type="button"
            onClick={() => onEnter({ reducedMotion: chosenReduced, audio: wantAudio })}
            className="mt-8 border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#C4A77D] hover:border-[#F0EDE5] hover:text-[#F0EDE5]"
          >
            Skip Descent
          </button>
        </div>
      )}
    </div>
  );
};
