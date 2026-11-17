import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResilientArtworkImage } from './HorrorMotifs';

gsap.registerPlugin(ScrollTrigger);

const ARTIST_IMG = '/src/assets/images/manga_multiplied_gaze_1794916482165.jpg';

const QUOTES = [
  {
    en: 'The horror does not hide in the dark. It hides in the pattern you thought was ordinary.',
    jp: '恐怖は暗闇に潜むのではない。見慣れた日常の模様の中に潜んでいる。',
  },
  {
    en: 'When you draw the same curved line for twelve hours, the paper begins to breathe.',
    jp: '同じ曲線を十二時間描き続けると、紙が呼吸を始める。',
  },
];

export const ArtistProfile: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const sigRef = useRef<SVGPathElement>(null);
  const dripRef = useRef<SVGPathElement>(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [bloodBleed, setBloodBleed] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => {
      setQuoteIdx((q) => (q + 1) % QUOTES.length);
    }, 5200);
    return () => clearInterval(t);
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const sig = sigRef.current;
    const drip = dripRef.current;
    if (!section || !sig || !drip) return;

    if (reducedMotion) {
      setBloodBleed(true);
      return;
    }

    const ctx = gsap.context(() => {
      const length = sig.getTotalLength();
      gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(drip, { scaleY: 0, transformOrigin: 'top center' });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.to(sig, {
            strokeDashoffset: 0,
            duration: 2.1,
            ease: 'power2.inOut',
            onComplete: () => {
              setBloodBleed(true);
              gsap.to(drip, { scaleY: 1, duration: 1.4, ease: 'power1.out' });
            },
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const activeQuote = QUOTES[quoteIdx];

  return (
    <section
      id="artist"
      ref={sectionRef}
      className="halftone-overlay relative overflow-hidden border-t border-white/10 bg-[#040403] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid items-stretch gap-12 lg:grid-cols-12">
          {/* Left: Partially Obscured / Multiplied Portrait */}
          <div className="relative flex flex-col justify-between lg:col-span-5">
            <div className="relative h-full min-h-[460px] overflow-hidden border border-white/10 bg-black">
              <ResilientArtworkImage
                src={ARTIST_IMG}
                alt="Obscured monochrome ink study of the artist surrounded by multiplied silhouettes"
                className="h-full w-full object-cover object-top contrast-125 grayscale"
              />
              {/* Overlapping ghostly face veil */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black via-black/45 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                  transform: 'translate(10px, -6px) scale(1.03)',
                  background:
                    'radial-gradient(circle at 52% 38%, rgba(232,224,208,0.22) 0%, transparent 55%)',
                }}
              />
              <div className="absolute bottom-5 left-5 right-5 border-t border-white/15 pt-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C4A77D]">
                  Archival Study · Studio Kurogane
                </p>
              </div>
            </div>
          </div>

          {/* Center Animated Dripping Ink Divider */}
          <div className="hidden items-center justify-center lg:col-span-1 lg:flex" aria-hidden="true">
            <svg viewBox="0 0 24 460" className="h-full max-h-[520px] w-6">
              <line x1="12" y1="0" x2="12" y2="410" stroke="rgba(240,237,229,0.16)" strokeWidth="1" />
              <path
                d="M12,0 L12,355 Q12,375 8,388 Q12,395 16,388 Q12,375 12,355"
                stroke="#6B0F0F"
                strokeWidth="2.5"
                fill="#6B0F0F"
              />
              <circle cx="12" cy="422" r="3" fill="#6B0F0F" opacity="0.8" />
            </svg>
          </div>

          {/* Right: Crawling Bio Prose, Bilingual Quotes & Bleeding Signature */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
              04. The Mind Behind the Ink
            </p>
            <h2 className="mt-2 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-5xl">
              An Anatomy of Obsession
            </h2>

            <div className="mt-8 max-w-[65ch] space-y-5 text-sm leading-relaxed text-[#E8E0D0]/85 md:text-base">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif-display first-letter:text-5xl first-letter:font-semibold first-letter:text-[#9E1B1B]">
                Trained initially in dental prosthetics before turning exclusively to sumi ink and
                steel G-pen nibs, the exhibition’s unnamed master learned to treat human anatomy as
                mutable clay—quietly stretching smiles, multiplying cheekbones, and curling hair
                into geometry that refuses to rest.
              </p>
              <p>
                Across three decades of nocturnal manuscripts, the recurring grammar has remained
                austere: stark monochrome paper, relentless crosshatching, and the creeping
                certainty that ordinary coastal towns harbor cosmic appetites.
              </p>
            </div>

            {/* Bilingual Flickering Pull Quote */}
            <blockquote className="mt-8 border-y border-white/10 py-6">
              <p className="font-serif-display text-2xl italic leading-snug text-[#F0EDE5]">
                “{activeQuote.en}”
              </p>
              <p className="mt-2 font-jp text-sm text-[#C4A77D]">{activeQuote.jp}</p>
            </blockquote>

            {/* Autograph that draws itself in ink, then turns crimson and drips */}
            <div className="mt-8 flex items-center justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C4A77D]">
                  Signed in Archive
                </p>
                <svg viewBox="0 0 260 80" className="mt-2 h-16 w-56 overflow-visible">
                  <path
                    ref={sigRef}
                    d="M16,52 C32,12 52,18 44,55 C40,66 64,22 78,46 C86,58 106,18 118,44 C128,62 152,20 166,48 C180,68 205,24 238,38"
                    fill="none"
                    stroke={bloodBleed ? '#9E1B1B' : '#F0EDE5'}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    style={{ transition: 'stroke 900ms ease' }}
                  />
                  <path
                    ref={dripRef}
                    d="M118,44 L118,74 M166,48 L166,68 M238,38 L238,62"
                    stroke="#6B0F0F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-jp text-xs tracking-widest text-[#E8E0D0]/60">
                黒鉄工房 · 1994—2025
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
