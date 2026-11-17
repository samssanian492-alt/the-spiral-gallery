import React, { useEffect, useRef, useState } from 'react';
import { horrorAudio } from '../utils/horrorAudio';
import { ResilientArtworkImage, SpiralGlyph } from './HorrorMotifs';

interface HeroSectionProps {
  reducedMotion: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onToggleReducedMotion: () => void;
  onEnterGallery: () => void;
}

const HERO_IMAGE = '/src/assets/images/hero_spiral_portrait_1794916480506.jpg';
const KANJI_VARIANTS = [
  ['恐', '怖', 'の', '芸', '術'],
  ['螺', '旋', 'の', '芸', '術'],
  ['恐', '怖', 'の', '深', '淵'],
];

/**
 * HeroSection — First Contact
 * ---------------------------------------------------------------------------
 * Asymmetric museum gallery opening with:
 * - Left vertical kanji that subtly shifts/glitches
 * - Dripping character-by-character title reveal ("螺旋 · Look closer.")
 * - Bilingual flickering subtitle
 * - Full-height breathing horror manga portrait on right with 3-layer mouse parallax
 *   and cursor-tracking pupil accents
 * - Floating dust particles Canvas & scroll-linked rotating spiral indicator
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  reducedMotion,
  audioEnabled,
  onToggleAudio,
  onToggleReducedMotion,
  onEnterGallery,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [jpSubtitle, setJpSubtitle] = useState(false);
  const [kanjiIdx, setKanjiIdx] = useState(0);
  const [scrollAngle, setScrollAngle] = useState(0);

  // 1. Mouse parallax & eye-tracking coordinates
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseNorm({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // 2. Scroll rotation for spiral scroll indicator
  useEffect(() => {
    const onScroll = () => {
      setScrollAngle(window.scrollY * 0.45);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3. Bilingual subtitle flicker & vertical kanji rearrange
  useEffect(() => {
    if (reducedMotion) return;
    const subTimer = setInterval(() => {
      setJpSubtitle((prev) => !prev);
    }, 4600);
    const kanjiTimer = setInterval(() => {
      if (Math.random() < 0.45) {
        setKanjiIdx((prev) => (prev + 1) % KANJI_VARIANTS.length);
      }
    }, 3400);

    return () => {
      clearInterval(subTimer);
      clearInterval(kanjiTimer);
    };
  }, [reducedMotion]);

  // 4. Floating dust particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.08,
      alpha: Math.random() * 0.38 + 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 224, 208, ${p.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  const headlineChars = 'Look closer.'.split('');
  const activeKanji = KANJI_VARIANTS[kanjiIdx];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-stretch overflow-hidden bg-black pt-16"
    >
      {/* Layer 1 Parallax: Ambient dust canvas & giant slow background spiral */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-1/2 z-0 -translate-y-1/2 opacity-[0.06]"
        style={{
          transform: reducedMotion
            ? undefined
            : `translate3d(${mouseNorm.x * -18}px, ${mouseNorm.y * -18}px, 0)`,
          transition: 'transform 220ms ease-out',
        }}
      >
        <SpiralGlyph className="animate-spiral-slow h-[760px] w-[760px] text-[#F0EDE5]" strokeWidth={1.1} />
      </div>

      {/* Subtle floating low-opacity background eyeball */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[38%] top-[22%] z-0 opacity-[0.07]"
          style={{
            transform: `translate3d(${mouseNorm.x * 26}px, ${mouseNorm.y * 22}px, 0)`,
            transition: 'transform 180ms ease-out',
          }}
        >
          <svg viewBox="0 0 80 50" className="h-16 w-24 text-[#E8E0D0]">
            <path d="M5,25 Q40,2 75,25 Q40,48 5,25 Z" stroke="currentColor" fill="none" />
            <circle cx="40" cy="25" r="9" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Heavy dark radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at 65% 45%, transparent 18%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.96) 100%)',
        }}
      />

      {/* Main 1440px Exhibition Grid */}
      <div className="relative z-20 mx-auto grid w-full max-w-[1440px] items-stretch gap-8 px-6 py-12 md:px-10 lg:grid-cols-12 lg:py-0">
        {/* Left Vertical Kanji Rail */}
        <div className="hidden flex-col items-center justify-center border-r border-white/10 pr-6 lg:col-span-1 lg:flex">
          <div
            aria-label="Art of Horror in Japanese"
            className="flex flex-col items-center gap-4 font-jp text-xl tracking-widest text-[#C4A77D]/85"
          >
            {activeKanji.map((char, idx) => (
              <span
                key={idx}
                className="transition-all duration-300"
                style={{
                  transform:
                    !reducedMotion && idx === 2
                      ? `translateY(${mouseNorm.y * 4}px)`
                      : undefined,
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <span className="mt-10 h-24 w-px bg-gradient-to-b from-[#6B0F0F] to-transparent" />
        </div>

        {/* Center-Left Editorial Focal Zone */}
        <div className="flex flex-col justify-center py-8 lg:col-span-6 lg:py-20 lg:pr-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#C4A77D]">
            <span>Retrospective Exhibition</span>
            <span aria-hidden="true">·</span>
            <span>Tokyo &amp; Virtual Pavilion</span>
            <span aria-hidden="true">·</span>
            <span>Admission Open</span>
          </div>

          <h1 className="ink-bleed mt-6 font-serif-display text-[clamp(3rem,6.5vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-[#F0EDE5]">
            <span className="block font-jp text-[0.65em] text-[#9E1B1B]">螺旋</span>
            <span className="mt-2 block text-balance">
              {headlineChars.map((ch, idx) => (
                <span
                  key={idx}
                  className="inline-block"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          animation: `dripAppear 650ms cubic-bezier(0.16, 1, 0.3, 1) ${
                            idx * 42
                          }ms both`,
                        }
                  }
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </h1>

          {/* Bilingual flickering subtitle */}
          <div className="mt-6 min-h-[3.5rem] max-w-xl">
            <p
              className={`text-base leading-relaxed transition-opacity duration-500 md:text-lg ${
                jpSubtitle ? 'font-jp text-[#C4A77D]' : 'text-[#E8E0D0]/90'
              }`}
            >
              {jpSubtitle
                ? 'あなたはもう、それを見ている。狂気と美の回顧展。'
                : 'You have already seen it. A retrospective of Japanese horror manga.'}
            </p>
          </div>

          {/* Primary Action & Museum Utility Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => {
                horrorAudio.playWhisper();
                onEnterGallery();
              }}
              className="group relative overflow-hidden bg-[#6B0F0F] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#F0EDE5] transition-colors hover:bg-[#9E1B1B]"
            >
              Enter the gallery
            </button>
            <a
              href="#collection"
              className="border-b border-[#C4A77D]/40 py-2 text-xs uppercase tracking-[0.2em] text-[#E8E0D0] transition-colors hover:border-[#F0EDE5] hover:text-white"
            >
              View 08 Plates
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.18em] text-[#C4A77D]">
            <button
              type="button"
              onClick={onToggleAudio}
              aria-pressed={audioEnabled}
              className="transition-colors hover:text-[#F0EDE5]"
            >
              {audioEnabled ? 'Soundscape: On' : 'Soundscape: Muted'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onToggleReducedMotion}
              aria-pressed={reducedMotion}
              className="transition-colors hover:text-[#F0EDE5]"
            >
              {reducedMotion ? 'Reduced Motion: On' : 'Reduced Motion: Off'}
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-[#E8E0D0]/60">Scroll slow</span>
          </div>
        </div>

        {/* Right Side: Breathing Junji Ito-inspired Portrait with Live Eye-Tracking */}
        <div className="relative flex items-center justify-center lg:col-span-5 lg:py-10">
          <div
            className="relative w-full max-w-[480px] overflow-hidden border border-[#C4A77D]/25 bg-[#0B0A09] shadow-[0_0_90px_rgba(107,15,15,0.22)] lg:h-[82vh]"
            style={{
              transform: reducedMotion
                ? undefined
                : `translate3d(${mouseNorm.x * 10}px, ${mouseNorm.y * 8}px, 0)`,
              transition: 'transform 200ms ease-out',
            }}
          >
            <div className={`${reducedMotion ? '' : 'animate-breathe'} relative h-full w-full`}>
              <ResilientArtworkImage
                src={HERO_IMAGE}
                alt="Curated portrait plate of an unblinking woman with a spiral iris"
                loading="eager"
                className="h-full w-full object-cover object-center contrast-110"
              />

              {/* Subtle live pupil-tracking shimmer over the portrait gaze */}
              {!reducedMotion && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    transform: `translate3d(${mouseNorm.x * 3.5}px, ${mouseNorm.y * 2.5}px, 0)`,
                    transition: 'transform 90ms linear',
                  }}
                >
                  <div className="absolute left-[38%] top-[36%] h-2.5 w-2.5 rounded-full bg-black/50 ring-1 ring-[#F0EDE5]/20" />
                  <div className="absolute left-[59%] top-[36%] h-2.5 w-2.5 rounded-full bg-[#6B0F0F]/45 ring-1 ring-[#F0EDE5]/20" />
                </div>
              )}
            </div>

            {/* Plate caption scrim */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C4A77D]">
                Plate 01 · ACC. 1998.01.07
              </p>
              <p className="mt-1 font-serif-display text-lg italic text-[#F0EDE5]">
                The Left Iris Recollection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator: Rotating Spiral */}
      <a
        href="#featured"
        onClick={(e) => {
          e.preventDefault();
          onEnterGallery();
        }}
        aria-label="Scroll down to Featured Works"
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C4A77D] hover:text-[#F0EDE5]"
      >
        <div
          style={{
            transform: reducedMotion ? undefined : `rotate(${scrollAngle}deg)`,
          }}
        >
          <SpiralGlyph className="h-7 w-7 text-[#E8E0D0]" strokeWidth={2} />
        </div>
        <span>Descend</span>
      </a>

      <style>{`
        @keyframes dripAppear {
          0% { opacity: 0; transform: translateY(-16px) scaleY(1.18); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }
      `}</style>
    </section>
  );
};
