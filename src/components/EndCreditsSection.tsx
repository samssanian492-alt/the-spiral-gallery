import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { horrorAudio } from '../utils/horrorAudio';
import { generateSpiralPath } from './HorrorMotifs';

gsap.registerPlugin(ScrollTrigger);

interface EndCreditsSectionProps {
  reducedMotion: boolean;
}

const PHASE1_WHISPERS = [
  { text: 'thank you', top: '22%', left: '16%', start: 0.04, end: 0.11 },
  { text: 'for visiting', top: '34%', left: '72%', start: 0.08, end: 0.15 },
  { text: 'for seeing', top: '68%', left: '20%', start: 0.12, end: 0.18 },
  { text: 'the spiral remembers you', top: '74%', left: '62%', start: 0.15, end: 0.21 },
];

const CORNER_KANJI = [
  { char: '螺旋', top: '14%', left: '10%', start: 0.46, end: 0.53 },
  { char: '恐怖', top: '16%', right: '10%', start: 0.48, end: 0.54 },
  { char: '夢', bottom: '18%', left: '14%', start: 0.5, end: 0.55 },
];

const CLOSING_LINES = [
  'A tribute to the master of horror.',
  'The spiral continues.',
  'Thank you for entering.',
];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function rangeProgress(p: number, start: number, end: number): number {
  if (end <= start) return p >= end ? 1 : 0;
  return clamp01((p - start) / (end - start));
}

function hexMix(from: [number, number, number], to: [number, number, number], t: number): string {
  const u = clamp01(t);
  const r = Math.round(from[0] + (to[0] - from[0]) * u);
  const g = Math.round(from[1] + (to[1] - from[1]) * u);
  const b = Math.round(from[2] + (to[2] - from[2]) * u);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * EndCreditsSection
 * ---------------------------------------------------------------------------
 * 200vh+ scrubbed cinematic title-card sequence crediting:
 * - CREATED BY: SAMS SANIAN AHAMOD
 * - INSPIRED BY: THE HONORABLE AUTHOR — JUNJI ITO
 */
export const EndCreditsSection: React.FC<EndCreditsSectionProps> = ({ reducedMotion }) => {
  const outerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bellPlayedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [spiralAngle, setSpiralAngle] = useState(0);
  const [edgeBlink, setEdgeBlink] = useState(false);
  const [subliminalFace, setSubliminalFace] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const giantSpiralD = useMemo(() => generateSpiralPath(300, 300, 6.5, 280, 360), []);
  const phase1SpiralD = useMemo(() => generateSpiralPath(140, 140, 4.2, 124, 200), []);
  const irisSpiralD = useMemo(() => generateSpiralPath(60, 35, 3, 10, 70), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // GSAP ScrollTrigger scrubbed timeline over 220vh outer track
  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage || reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        scrub: 1.05,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Distant bell tone once as Junji Ito's name completes (~0.77)
          if (p >= 0.77 && p < 0.85 && !bellPlayedRef.current) {
            bellPlayedRef.current = true;
            horrorAudio.playDistantBell();
          } else if (p < 0.65) {
            bellPlayedRef.current = false;
          }

          // Dynamic drone swell in Phase 3, fade to silence at Phase 5 end
          if (p > 0.44 && p < 0.56) {
            horrorAudio.setDroneIntensity(0.055);
          } else if (p >= 0.89) {
            horrorAudio.setDroneIntensity(0.0001);
          } else {
            horrorAudio.setDroneIntensity(0.032);
          }
        },
      });
    }, outer);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Continuous ambient background spiral rotation (accelerates in Phase 3 & Phase 5)
  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let speed = 6; // deg/sec slow haunting idle
      if (progress >= 0.45 && progress <= 0.56) {
        speed = 32;
      } else if (progress > 0.56 && progress < 0.85) {
        speed = 2; // stops / stills during Junji Ito reveal
      } else if (progress >= 0.85 && progress < 0.945) {
        speed = 35 + (progress - 0.85) * 900; // spins faster and faster
      }
      setSpiralAngle((a) => (a + speed * dt) % 360);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress, reducedMotion]);

  // Rare 1-frame edge eye blink in Phase 3 & subliminal face flash (desktop + motion enabled only)
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    if (progress > 0.505 && progress < 0.52) {
      setEdgeBlink(true);
      const t = setTimeout(() => setEdgeBlink(false), 95);
      return () => clearTimeout(t);
    }
    if ((progress > 0.31 && progress < 0.322) || (progress > 0.69 && progress < 0.702)) {
      setSubliminalFace(true);
      const t = setTimeout(() => setSubliminalFace(false), 65);
      return () => clearTimeout(t);
    }
  }, [progress, reducedMotion, isMobile]);

  // Faint upward drifting ash / ink dust particles canvas
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

    const ash = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.45 + 0.15),
      vx: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.08,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of ash) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 237, 229, ${p.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  // Static dignified fallback when Reduced Motion is active
  if (reducedMotion) {
    return (
      <section
        id="credits"
        data-credits-stage="true"
        aria-label="Closing credits"
        className="relative border-t border-white/10 bg-black px-6 py-28 text-center text-[#F0EDE5]"
      >
        <div className="mx-auto max-w-4xl space-y-14">
          <div>
            <p className="font-mono-body text-xs uppercase tracking-[0.3em] text-[#F0EDE5]/80">
              CREATED BY
            </p>
            <h2 className="mt-4 font-serif-display text-[clamp(2.5rem,6vw,5.5rem)] font-normal tracking-[0.12em] text-[#F0EDE5]">
              SAMS SANIAN AHAMOD
            </h2>
            <div className="mx-auto mt-5 h-px w-44 bg-[#F0EDE5]/40" />
          </div>

          <div>
            <p className="font-jp text-sm text-[#C9A961]/80">敬愛する</p>
            <p className="mt-2 font-mono-body text-xs uppercase tracking-[0.28em] text-[#C9A961]">
              INSPIRED BY <span className="italic text-[#E8E0D0]/70">THE HONORABLE AUTHOR</span>
            </p>
            <p className="mt-4 font-jp text-xs text-[#C9A961]/70">漫画家</p>
            <h3 className="mt-1 font-serif-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[0.14em] text-[#F0EDE5]">
              JUNJI ITO
            </h3>
            <div className="mx-auto mt-4 h-px w-40 bg-[#F0EDE5]/40" />
            <div className="mx-auto mt-1 h-px w-28 bg-[#6B0F0F]" />
          </div>

          <div className="space-y-1 font-mono-body text-xs italic text-[#F0EDE5]/60">
            {CLOSING_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="pt-8 font-mono-body text-[11px] tracking-[0.2em] text-[#F0EDE5]/50">
            <p>© 2025 — THE SPIRAL GALLERY</p>
            <p className="mt-1">All nightmares reserved.</p>
          </div>
        </div>
      </section>
    );
  }

  // Computed animation states across the 5 scrubbed phases
  // Phase 1: 0.00 -> 0.20
  const p1PointOpacity = rangeProgress(progress, 0.0, 0.05) * (1 - rangeProgress(progress, 0.18, 0.22));
  const p1SpiralDraw = rangeProgress(progress, 0.02, 0.18);
  const p1SpiralFade = 1 - rangeProgress(progress, 0.19, 0.25);

  // Phase 2: 0.20 -> 0.45 (First Name)
  const firstBlockFadeIn = rangeProgress(progress, 0.2, 0.24);
  const firstBlockFadeOut = 1 - rangeProgress(progress, 0.52, 0.58);
  const firstBlockOpacity = firstBlockFadeIn * firstBlockFadeOut;

  const line1Width = rangeProgress(progress, 0.2, 0.26);
  const linePulseT = rangeProgress(progress, 0.4, 0.44);
  const linePulseScale = 1 + Math.sin(linePulseT * Math.PI) * 0.05;
  const sakuraT = rangeProgress(progress, 0.41, 0.48);

  const createdByChars = 'CREATED BY'.split('');
  const creatorNameChars = 'SAMS SANIAN AHAMOD'.split('');
  const nameSettleT = rangeProgress(progress, 0.26, 0.42);
  const dynamicTracking = `${(0.05 + nameSettleT * 0.1).toFixed(3)}em`;

  // Phase 4: 0.55 -> 0.85 (Second Name: Junji Ito)
  const secondBlockIn = rangeProgress(progress, 0.56, 0.61);
  const secondBlockOut = 1 - rangeProgress(progress, 0.85, 0.89);
  const secondBlockOpacity = secondBlockIn * secondBlockOut;

  const kanjiDraw = rangeProgress(progress, 0.56, 0.63);
  const inspiredWords = ['INSPIRED', 'BY', 'THE', 'HONORABLE', 'AUTHOR'];
  const blotExpand = rangeProgress(progress, 0.61, 0.66);
  const blotCollapse = 1 - rangeProgress(progress, 0.68, 0.74);
  const junjiChars = 'JUNJI ITO'.split('');
  const junjiColorT = rangeProgress(progress, 0.69, 0.81);
  const junjiColor = hexMix([107, 15, 15], [240, 237, 229], junjiColorT);

  // Spiral eye above Junji Ito (opens 0.78 -> blinks 0.815 -> closes 0.84)
  const topEyeOpen = rangeProgress(progress, 0.78, 0.8);
  const topEyeClose = 1 - rangeProgress(progress, 0.82, 0.845);
  const topEyeScaleY = clamp01(topEyeOpen * topEyeClose);

  const bottomInkLine = rangeProgress(progress, 0.76, 0.82);
  const bottomWoundLine = rangeProgress(progress, 0.79, 0.84);

  // Phase 5: 0.85 -> 1.00 (Closing)
  const closingLinesIn = rangeProgress(progress, 0.85, 0.88);
  const closingLinesOut = 1 - rangeProgress(progress, 0.935, 0.955);
  const closingTextOpacity = closingLinesIn * closingLinesOut;

  // Giant spiral collapse at 0.90 -> 0.945
  const collapseT = rangeProgress(progress, 0.9, 0.945);
  const bgSpiralScale = Math.max(0.02, 1 - collapseT * 0.98);
  const bgSpiralOpacity =
    progress < 0.945 ? (progress >= 0.45 && progress <= 0.55 ? 0.085 : 0.05) : 0;

  // Final central point -> blinking eye -> pure black -> copyright
  const endEyeAppear = rangeProgress(progress, 0.94, 0.952) * (1 - rangeProgress(progress, 0.962, 0.972));
  const endEyeShut = 1 - rangeProgress(progress, 0.956, 0.965);
  const copyrightOpacity = rangeProgress(progress, 0.968, 0.995);

  return (
    <section
      id="credits"
      ref={outerRef}
      data-credits-stage="true"
      aria-label="Closing film credits"
      className="relative min-h-[240vh] w-full border-t border-white/10 bg-black"
    >
      {/* Pinned 100vh Cinema Stage */}
      <div
        ref={stageRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black px-6 text-[#F0EDE5]"
      >
        {/* Intensified 15% Film Grain Overlay */}
        <div
          aria-hidden="true"
          className="film-grain pointer-events-none absolute inset-0 z-30"
          style={{
            opacity: progress >= 0.45 && progress <= 0.56 ? 0.19 : 0.15,
          }}
        />

        {/* Upward Drifting Ash / Ink Particles */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-75"
        />

        {/* Radial Vignette so center text glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              'radial-gradient(circle at center, rgba(240,237,229,0.03) 0%, rgba(0,0,0,0.68) 55%, rgba(0,0,0,0.98) 100%)',
          }}
        />

        {/* Giant 5%-opacity Ambient Background Spiral */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            opacity: bgSpiralOpacity,
            transform: `scale(${bgSpiralScale}) rotate(${spiralAngle}deg)`,
          }}
        >
          <svg viewBox="0 0 600 600" className="h-[110vmin] w-[110vmin]">
            <path d={giantSpiralD} fill="none" stroke="#F0EDE5" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Subliminal 1-frame face inside spiral (desktop only) */}
        {subliminalFace && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center opacity-40"
          >
            <svg viewBox="0 0 200 260" className="h-72 w-auto">
              <ellipse cx="100" cy="130" rx="64" ry="96" fill="none" stroke="#F0EDE5" strokeWidth="1.5" />
              <circle cx="75" cy="112" r="10" fill="#F0EDE5" />
              <circle cx="125" cy="112" r="10" fill="#F0EDE5" />
              <path d="M76,174 Q100,196 124,174" stroke="#6B0F0F" strokeWidth="3" fill="none" />
            </svg>
          </div>
        )}

        {/* Phase 3: 1-frame edge eye blink */}
        {edgeBlink && (
          <div aria-hidden="true" className="pointer-events-none absolute right-6 top-1/2 z-40 -translate-y-1/2">
            <svg viewBox="0 0 120 70" className="h-14 w-24 text-[#F0EDE5]">
              <path d="M8,35 Q60,6 112,35 Q60,64 8,35 Z" fill="#F0EDE5" />
              <circle cx="60" cy="35" r="12" fill="#6B0F0F" />
              <circle cx="60" cy="35" r="4" fill="#000" />
            </svg>
          </div>
        )}

        {/* PHASE 1 — THE DARKNESS: Pinpoint light -> thin drawing spiral + corner whispers */}
        {progress < 0.26 && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div
              className="h-2 w-2 rounded-full bg-[#F0EDE5] shadow-[0_0_24px_8px_rgba(240,237,229,0.7)]"
              style={{ opacity: p1PointOpacity }}
            />
            <svg
              viewBox="0 0 280 280"
              className="absolute h-64 w-64"
              style={{ opacity: p1SpiralFade }}
            >
              <path
                d={phase1SpiralD}
                fill="none"
                stroke="#F0EDE5"
                strokeWidth="1.25"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 1850,
                  strokeDashoffset: 1850 * (1 - p1SpiralDraw),
                }}
              />
            </svg>

            {PHASE1_WHISPERS.map((w) => {
              const op =
                rangeProgress(progress, w.start, w.start + 0.025) *
                (1 - rangeProgress(progress, w.end - 0.025, w.end));
              return (
                <p
                  key={w.text}
                  style={{ top: w.top, left: w.left, opacity: op * 0.7 }}
                  className="absolute font-serif-display text-sm italic tracking-[0.18em] text-[#E8E0D0]"
                >
                  {w.text}
                </p>
              );
            })}
          </div>
        )}

        {/* PHASE 2 & 3 — THE FIRST NAME: CREATED BY SAMS SANIAN AHAMOD */}
        {firstBlockOpacity > 0.01 && (
          <div
            style={{ opacity: firstBlockOpacity }}
            className="relative z-20 flex w-full max-w-5xl flex-col items-center text-center"
          >
            {/* CREATED BY letter-by-letter from blur(20px) */}
            <p className="font-mono-body text-xs uppercase tracking-[0.3em] text-[#F0EDE5] md:text-sm">
              {createdByChars.map((ch, idx) => {
                const start = 0.21 + idx * 0.008;
                const t = rangeProgress(progress, start, start + 0.045);
                return (
                  <span
                    key={idx}
                    style={{
                      opacity: t,
                      filter: `blur(${(1 - t) * 20}px)`,
                      transform: `translateY(${(1 - t) * 20}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {ch === ' ' ? '\u00A0\u00A0' : ch}
                  </span>
                );
              })}
            </p>

            {/* Center-outward hairline divider */}
            <div
              className="my-6 h-px w-56 bg-[#F0EDE5]/65 md:w-80"
              style={{
                transform: `scaleX(${line1Width * linePulseScale})`,
              }}
            />

            {/* SAMS SANIAN AHAMOD: ink blot -> sharp serif + subtle ink drips */}
            <h2
              className="font-serif-display text-[clamp(2.25rem,6vw,6.25rem)] leading-[1.05] text-[#F0EDE5]"
              style={{
                letterSpacing: dynamicTracking,
                fontWeight: nameSettleT > 0.75 ? 400 : 300,
                textShadow: '0 0 30px rgba(240, 237, 229, 0.14)',
              }}
            >
              {creatorNameChars.map((ch, idx) => {
                const start = 0.25 + idx * 0.0075;
                const t = rangeProgress(progress, start, start + 0.045);
                const dripOpacity = rangeProgress(progress, start + 0.02, start + 0.04) * (1 - rangeProgress(progress, start + 0.06, start + 0.1));
                return (
                  <span key={idx} className="relative inline-block">
                    <span
                      style={{
                        opacity: t,
                        transform: `scale(${0.3 + t * 0.7})`,
                        filter: `blur(${(1 - t) * 24}px)`,
                        display: 'inline-block',
                      }}
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                    {/* Subtle SVG ink-drip path beneath revealing letter */}
                    {ch !== ' ' && dripOpacity > 0.02 && (
                      <svg
                        viewBox="0 0 10 24"
                        aria-hidden="true"
                        style={{ opacity: dripOpacity }}
                        className="pointer-events-none absolute left-1/2 top-full h-5 w-2.5 -translate-x-1/2"
                      >
                        <path d="M5,0 L5,18 Q5,23 3,23 Q7,23 5,18" stroke="#6B0F0F" strokeWidth="1.5" fill="#6B0F0F" />
                      </svg>
                    )}
                  </span>
                );
              })}
            </h2>

            {/* Single falling sakura petal */}
            {sakuraT > 0 && sakuraT < 1 && (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{
                  opacity: Math.sin(sakuraT * Math.PI) * 0.85,
                  transform: `translate(${Math.sin(sakuraT * 5) * 26}px, ${sakuraT * 110}px) rotate(${
                    sakuraT * 190
                  }deg)`,
                }}
                className="pointer-events-none mt-4 h-5 w-5"
              >
                <path
                  d="M12,2 C18,6 20,14 12,22 C4,14 6,6 12,2 Z"
                  fill="#E8E0D0"
                  stroke="#6B0F0F"
                  strokeWidth="0.9"
                />
              </svg>
            )}
          </div>
        )}

        {/* PHASE 3: Corner Kanji apparitions */}
        {progress >= 0.45 && progress <= 0.56 && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
            {CORNER_KANJI.map((k) => {
              const op =
                rangeProgress(progress, k.start, k.start + 0.018) *
                (1 - rangeProgress(progress, k.end - 0.018, k.end));
              return (
                <span
                  key={k.char}
                  style={{
                    top: k.top,
                    left: k.left,
                    right: k.right,
                    bottom: k.bottom,
                    opacity: op * 0.6,
                  }}
                  className="absolute font-jp text-2xl tracking-widest text-[#C9A961]"
                >
                  {k.char}
                </span>
              );
            })}
          </div>
        )}

        {/* PHASE 4 — THE SECOND NAME: INSPIRED BY THE HONORABLE AUTHOR — JUNJI ITO */}
        {secondBlockOpacity > 0.01 && (
          <div
            style={{ opacity: secondBlockOpacity }}
            className="relative z-20 flex w-full max-w-5xl flex-col items-center text-center"
          >
            {/* Brush-stroke SVG Kanji: 敬愛する */}
            <svg viewBox="0 0 180 34" className="mb-3 h-8 w-44 overflow-visible" aria-hidden="true">
              <text
                x="90"
                y="24"
                textAnchor="middle"
                className="font-jp text-lg"
                fill="none"
                stroke="#C9A961"
                strokeWidth="0.8"
                style={{
                  strokeDasharray: 260,
                  strokeDashoffset: 260 * (1 - kanjiDraw),
                }}
              >
                敬愛する
              </text>
              <text
                x="90"
                y="24"
                textAnchor="middle"
                className="font-jp text-lg"
                fill="#C9A961"
                style={{ opacity: clamp01((kanjiDraw - 0.5) * 2) * 0.75 }}
              >
                敬愛する
              </text>
            </svg>

            {/* Word-by-word clip-path reveal: INSPIRED BY THE HONORABLE AUTHOR */}
            <p className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 font-mono-body text-xs uppercase tracking-[0.26em] text-[#C9A961] md:text-sm">
              {inspiredWords.map((word, idx) => {
                const start = 0.585 + idx * 0.014;
                const t = rangeProgress(progress, start, start + 0.035);
                const inset = (1 - t) * 50;
                const isItalic = idx >= 2;
                return (
                  <span
                    key={word}
                    style={{
                      clipPath: `inset(0% ${inset}% 0% ${inset}%)`,
                      opacity: t,
                    }}
                    className={isItalic ? 'italic text-[#E8E0D0]/75' : ''}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Single Spiral Eye above Junji Ito's name */}
            <div className="mt-6 h-12 flex items-center justify-center">
              {topEyeScaleY > 0.02 && (
                <svg
                  viewBox="0 0 120 70"
                  aria-hidden="true"
                  style={{ transform: `scaleY(${topEyeScaleY})` }}
                  className="h-11 w-20 text-[#F0EDE5]"
                >
                  <path
                    d="M6,35 C28,8 92,8 114,35 C92,62 28,62 6,35 Z"
                    fill="#E8E0D0"
                    stroke="#F0EDE5"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="35" r="14" fill="#6B0F0F" />
                  <path d={irisSpiralD} fill="none" stroke="#F0EDE5" strokeWidth="1.2" />
                  <circle cx="60" cy="35" r="4.5" fill="#000" />
                </svg>
              )}
            </div>

            {/* Tiny Kanji accent above Junji Ito */}
            <p
              className="font-jp text-xs tracking-[0.35em] text-[#C9A961]/70"
              style={{ opacity: rangeProgress(progress, 0.67, 0.72) }}
            >
              漫画家
            </p>

            {/* Massive Ink Blot morphing into JUNJI ITO */}
            <div className="relative mt-2 flex items-center justify-center">
              {/* Shuddering SVG Ink Blot */}
              {blotCollapse > 0.01 && (
                <svg
                  viewBox="0 0 260 120"
                  aria-hidden="true"
                  style={{
                    opacity: blotExpand * blotCollapse * 0.9,
                    transform: `scale(${0.4 + blotExpand * 0.9}) translate(${
                      Math.sin(progress * 180) * 3
                    }px, ${Math.cos(progress * 140) * 2}px)`,
                  }}
                  className="pointer-events-none absolute h-32 w-72"
                >
                  <path
                    d="M45,62 Q65,18 125,28 Q188,14 218,56 Q236,92 178,96 Q126,112 72,94 Q24,90 45,62 Z"
                    fill="#6B0F0F"
                  />
                </svg>
              )}

              <h3
                className="relative font-serif-display text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-[0.14em]"
                style={{
                  color: junjiColor,
                  textShadow: `0 0 36px rgba(107, 15, 15, ${0.45 * (1 - junjiColorT) + 0.15})`,
                }}
              >
                {junjiChars.map((ch, idx) => {
                  const start = 0.665 + idx * 0.012;
                  const t = rangeProgress(progress, start, start + 0.045);
                  const drip = rangeProgress(progress, start + 0.015, start + 0.04) * (1 - rangeProgress(progress, start + 0.07, start + 0.12));
                  return (
                    <span key={idx} className="relative inline-block">
                      <span
                        style={{
                          opacity: t,
                          transform: `scale(${1.65 - t * 0.65}) translateY(${(1 - t) * -10}px)`,
                          filter: `blur(${(1 - t) * 14}px)`,
                          display: 'inline-block',
                        }}
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                      {ch !== ' ' && drip > 0.02 && (
                        <svg
                          viewBox="0 0 10 26"
                          aria-hidden="true"
                          style={{ opacity: drip }}
                          className="pointer-events-none absolute left-1/2 top-full h-6 w-2.5 -translate-x-1/2"
                        >
                          <path d="M5,0 L5,20 Q5,25 3,25 Q7,25 5,20" fill="#6B0F0F" />
                        </svg>
                      )}
                    </span>
                  );
                })}
              </h3>
            </div>

            {/* Horizontal ink line + crimson wound line underneath */}
            <div
              className="mt-6 h-px w-60 bg-[#F0EDE5]/75 md:w-80"
              style={{ transform: `scaleX(${bottomInkLine})` }}
            />
            <div
              className="mt-1.5 h-[2px] w-40 bg-[#6B0F0F] md:w-52"
              style={{ transform: `scaleX(${bottomWoundLine})` }}
            />
          </div>
        )}

        {/* PHASE 5 — THE CLOSING: Dual glow + 3 typewriter lines -> point/eye -> copyright */}
        {closingTextOpacity > 0.01 && (
          <div
            style={{ opacity: closingTextOpacity }}
            className="relative z-20 flex max-w-2xl flex-col items-center text-center"
          >
            <div
              className="mb-10 flex flex-wrap items-center justify-center gap-4 font-serif-display text-xl tracking-[0.16em] text-[#F0EDE5]/85 md:text-2xl"
              style={{
                textShadow: `0 0 ${14 + Math.sin(progress * 60) * 8}px rgba(240, 237, 229, 0.35)`,
              }}
            >
              <span>SAMS SANIAN AHAMOD</span>
              <span className="text-[#6B0F0F]">·</span>
              <span>JUNJI ITO</span>
            </div>

            <div className="space-y-3 font-mono-body text-xs italic tracking-[0.12em] text-[#F0EDE5]/60 md:text-sm">
              {CLOSING_LINES.map((line, lIdx) => {
                const start = 0.855 + lIdx * 0.022;
                const lineT = rangeProgress(progress, start, start + 0.024);
                const visibleChars = Math.floor(line.length * lineT);
                return (
                  <p key={line} className="min-h-[1.25rem]">
                    {line.slice(0, visibleChars)}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsing point of light -> single blinking eye -> shut */}
        {endEyeAppear > 0.01 && (
          <div
            aria-hidden="true"
            style={{ opacity: endEyeAppear }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 120 70"
              style={{ transform: `scaleY(${Math.max(0.06, endEyeShut)})` }}
              className="h-14 w-24 text-[#F0EDE5]"
            >
              <path
                d="M8,35 C30,10 90,10 112,35 C90,60 30,60 8,35 Z"
                fill="#E8E0D0"
                stroke="#F0EDE5"
                strokeWidth="2"
              />
              <circle cx="60" cy="35" r="12" fill="#000" />
              <circle cx="60" cy="35" r="4" fill="#6B0F0F" />
            </svg>
          </div>
        )}

        {/* Final Copyright at bottom center */}
        {copyrightOpacity > 0.01 && (
          <div
            style={{ opacity: copyrightOpacity }}
            className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center font-mono-body text-[11px] tracking-[0.2em] text-[#F0EDE5]/65"
          >
            <p>© 2025 — THE SPIRAL GALLERY</p>
            <p className="mt-1 text-[#F0EDE5]/45">All nightmares reserved.</p>
          </div>
        )}
      </div>
    </section>
  );
};
