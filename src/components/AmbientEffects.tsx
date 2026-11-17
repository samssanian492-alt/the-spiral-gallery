import React, { useEffect, useRef, useState } from 'react';
import { FORBIDDEN_ARTWORK } from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import { generateSpiralPath, ResilientArtworkImage } from './HorrorMotifs';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const WHISPER_LINES = [
  'look closer...',
  'do not turn around...',
  'she is still inside the frame...',
  'the spiral remembers...',
  'count the eyes again...',
  'is there someone behind you?',
];

/**
 * AmbientEffects
 * ---------------------------------------------------------------------------
 * Handles all gallery-wide subtle dread micro-interactions:
 * - Custom rotating spiral cursor that morphs into a watching eye on interactive targets
 * - Rare brief cursor spiral split
 * - Click ink-splash ripples anywhere on the canvas
 * - Dynamic animated SVG favicon
 * - Tab title shift when blurred / unfocused
 * - Rare corner whisper text & 30s idle whisper
 * - Rare 1-frame subliminal horror silhouette flash (disabled when reducedMotion is true)
 * - Konami code listener (↑↑↓↓←→←→BA) revealing the Forbidden Ninth Plate
 */
export const AmbientEffects: React.FC<{
  reducedMotion: boolean;
  entered: boolean;
}> = ({ reducedMotion, entered }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorMode, setCursorMode] = useState<'spiral' | 'eye' | 'split'>('spiral');
  const [inCredits, setInCredits] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [subliminalFlash, setSubliminalFlash] = useState(false);
  const [forbiddenOpen, setForbiddenOpen] = useState(false);

  const spiralPath = React.useMemo(() => generateSpiralPath(20, 20, 3.2, 16, 90), []);

  // 1. Custom Cursor tracking & interactive element eye-morph
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    let mouseX = -100;
    let mouseY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement | null;
      const isCredits = Boolean(target?.closest('[data-credits-stage="true"]'));
      setInCredits(isCredits);
      const isInteractive = Boolean(
        target?.closest('a, button, input, [role="button"], [data-interactive="true"]')
      );
      setCursorMode((prev) => {
        if (prev === 'split') return prev;
        return isInteractive ? 'eye' : 'spiral';
      });
    };

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Click ink-splash ripples
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (reducedMotion) return;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [reducedMotion]);

  // 3. Dynamic rotating spiral favicon
  useEffect(() => {
    if (reducedMotion) return;
    let angle = 0;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const interval = setInterval(() => {
      angle = (angle + 24) % 360;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#000"/><g transform="rotate(${angle} 20 20)"><path d="${spiralPath}" fill="none" stroke="#F0EDE5" stroke-width="2.4" stroke-linecap="round"/></g></svg>`;
      link!.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }, 450);

    return () => clearInterval(interval);
  }, [reducedMotion, spiralPath]);

  // 4. Tab title eerie shift when user switches tab or occasionally idles
  useEffect(() => {
    const originalTitle = 'THE SPIRAL GALLERY — 螺旋の回廊 | Horror Manga Exhibition';
    const onVisibility = () => {
      if (document.hidden) {
        document.title = 'is there someone behind you?';
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.title = originalTitle;
    };
  }, []);

  // 5. Idle 30s whisper + rare corner whispers + rare cursor split + rare 1-frame subliminal flash
  useEffect(() => {
    if (!entered) return;

    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setWhisper('you have been staring at the spiral for too long...');
        setTimeout(() => setWhisper(null), 2600);
      }, 30000);
    };

    resetIdle();
    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('scroll', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle);

    // Rare ambient events every 22 seconds
    const ambientInterval = setInterval(() => {
      if (reducedMotion) return;
      const roll = Math.random();
      if (roll < 0.35) {
        const line = WHISPER_LINES[Math.floor(Math.random() * WHISPER_LINES.length)];
        setWhisper(line);
        setTimeout(() => setWhisper(null), 2100);
      } else if (roll < 0.55) {
        setCursorMode('split');
        setTimeout(() => setCursorMode('spiral'), 1300);
      } else if (roll < 0.72) {
        setSubliminalFlash(true);
        setTimeout(() => setSubliminalFlash(false), 75); // ~1-2 frames max
      }
    }, 22000);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(ambientInterval);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('scroll', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, [entered, reducedMotion]);

  // 6. Konami code listener -> Forbidden Gallery plate
  useEffect(() => {
    const seq = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let idx = 0;

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[idx]) {
        idx += 1;
        if (idx === seq.length) {
          idx = 0;
          horrorAudio.playWhisper();
          setForbiddenOpen(true);
        }
      } else {
        idx = key === seq[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Film Grain & VHS Scanlines Overlay */}
      <div aria-hidden="true" className="film-grain fixed inset-0 z-40" />
      <div aria-hidden="true" className="vhs-scanlines fixed inset-0 z-40 opacity-30" />

      {/* Subliminal 1-frame horror face silhouette flash (disabled in reducedMotion) */}
      {subliminalFlash && !reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#E8E0D0]/15 mix-blend-difference"
        >
          <svg viewBox="0 0 200 260" className="h-[70vh] w-auto opacity-75">
            <ellipse cx="100" cy="125" rx="68" ry="102" fill="#000" />
            <circle cx="72" cy="108" r="16" fill="#F0EDE5" />
            <circle cx="72" cy="108" r="4" fill="#000" />
            <circle cx="128" cy="108" r="16" fill="#F0EDE5" />
            <circle cx="128" cy="108" r="4" fill="#000" />
            <ellipse cx="100" cy="182" rx="22" ry="34" fill="#F0EDE5" />
          </svg>
        </div>
      )}

      {/* Click ink-splash ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          aria-hidden="true"
          style={{ left: r.x, top: r.y }}
          className="animate-ink-ripple pointer-events-none fixed z-50 h-14 w-14 rounded-full border border-[#6B0F0F] bg-[#6B0F0F]/25"
        />
      ))}

      {/* Whisper corner apparition */}
      {whisper && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-6 left-6 z-50 border border-[#6B0F0F]/50 bg-black/90 px-4 py-2 font-serif-display text-sm italic tracking-wide text-[#E8E0D0] shadow-2xl"
        >
          {whisper}
        </div>
      )}

      {/* Custom Spiral-to-Eye Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="custom-spiral-cursor pointer-events-none fixed left-0 top-0 z-[95] -ml-5 -mt-5 mix-blend-difference"
      >
        {cursorMode === 'eye' ? (
          <svg viewBox="0 0 40 40" className="h-10 w-10 text-[#F0EDE5]">
            <path
              d="M4,20 C12,9 28,9 36,20 C28,31 12,31 4,20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="20" cy="20" r="5.5" fill="#9E1B1B" />
            <circle cx="20" cy="20" r="2.2" fill="#000" />
          </svg>
        ) : cursorMode === 'split' ? (
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 40 40" className="h-7 w-7 animate-spin text-[#F0EDE5]">
              <path d={spiralPath} fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 40 40" className="h-7 w-7 animate-spin text-[#6B0F0F]">
              <path d={spiralPath} fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        ) : (
          <svg
            viewBox="0 0 40 40"
            className={`h-9 w-9 text-[#F0EDE5] ${
              reducedMotion
                ? ''
                : inCredits
                ? 'animate-[spiralSpinSlow_1.4s_linear_infinite]'
                : 'animate-[spiralSpinSlow_4s_linear_infinite]'
            }`}
          >
            <path
              d={spiralPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Forbidden Gallery Plate Modal (Konami Code: ↑↑↓↓←→←→BA) */}
      {forbiddenOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forbidden-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md"
        >
          <div className="relative max-w-3xl border border-[#6B0F0F] bg-[#1A1815] p-6 md:p-10">
            <div className="flex items-start justify-between gap-4 border-b border-[#6B0F0F]/40 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
                  Restricted Vault · {FORBIDDEN_ARTWORK.accessionNumber}
                </p>
                <h2
                  id="forbidden-title"
                  className="mt-1 font-serif-display text-3xl text-[#F0EDE5]"
                >
                  {FORBIDDEN_ARTWORK.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setForbiddenOpen(false)}
                className="border border-[#C4A77D]/40 px-4 py-2 text-xs uppercase tracking-widest text-[#F0EDE5] transition-colors hover:bg-[#6B0F0F]"
              >
                Seal Vault
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="aged-paper relative overflow-hidden p-3">
                <ResilientArtworkImage
                  src={FORBIDDEN_ARTWORK.image}
                  alt={FORBIDDEN_ARTWORK.title}
                  className="aspect-[3/4] w-full object-cover contrast-125 grayscale"
                />
                <div className="pointer-events-none absolute inset-0 bg-[#6B0F0F]/25 mix-blend-multiply" />
              </div>
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="font-jp text-lg text-[#C4A77D]">{FORBIDDEN_ARTWORK.japaneseTitle}</p>
                  <p className="text-sm leading-relaxed text-[#E8E0D0]">
                    {FORBIDDEN_ARTWORK.curatorialNote}
                  </p>
                  <p className="border-t border-white/10 pt-4 text-xs text-[#C4A77D]">
                    {FORBIDDEN_ARTWORK.medium} · {FORBIDDEN_ARTWORK.provenance}
                  </p>
                </div>
                <p className="mt-6 font-serif-display text-base italic text-[#9E1B1B]">
                  “{FORBIDDEN_ARTWORK.whisper}”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
