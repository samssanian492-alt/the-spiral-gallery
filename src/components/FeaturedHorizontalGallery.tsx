import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArtworkItem, COLLECTION_ARTWORKS } from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import {
  AlternateHorrorOverlay,
  generateSpiralPath,
  ResilientArtworkImage,
} from './HorrorMotifs';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedHorizontalGalleryProps {
  reducedMotion: boolean;
  onSelectArtwork: (art: ArtworkItem) => void;
}

const WHISPER_NOTES = [
  "don't look away...",
  "she's watching...",
  'the spiral remembers...',
  'count the doors behind you...',
];

export const FeaturedHorizontalGallery: React.FC<FeaturedHorizontalGalleryProps> = ({
  reducedMotion,
  onSelectArtwork,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeWhisper, setActiveWhisper] = useState(0);

  const featuredWorks = React.useMemo(
    () => COLLECTION_ARTWORKS.filter((a) => a.featured),
    []
  );

  const spiralProgressD = React.useMemo(
    () => generateSpiralPath(50, 50, 4.5, 44, 180),
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || reducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true,
          end: () => `+=${Math.max(900, track.scrollWidth - window.innerWidth)}`,
          onUpdate: (self) => {
            setProgress(self.progress);
            const idx = Math.min(
              WHISPER_NOTES.length - 1,
              Math.floor(self.progress * WHISPER_NOTES.length)
            );
            setActiveWhisper(idx);
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [reducedMotion, featuredWorks.length]);

  return (
    <section
      id="featured"
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/10 bg-[#050504] py-20 lg:py-24"
    >
      {/* Header & Unwinding Spiral Progress */}
      <div className="mx-auto mb-12 flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
            01. Featured Exhibition Plates
          </p>
          <h2 className="mt-2 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-5xl">
            The Gallery of Fear
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <p className="hidden font-serif-display text-base italic text-[#9E1B1B] md:block">
            {WHISPER_NOTES[activeWhisper]}
          </p>
          {/* Spiral that unwinds as user scrolls */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="h-11 w-11 text-[#C4A77D]" aria-hidden="true">
              <path
                d={spiralProgressD}
                fill="none"
                stroke="rgba(240,237,229,0.16)"
                strokeWidth="2.5"
              />
              <path
                d={spiralProgressD}
                fill="none"
                stroke="#9E1B1B"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 780,
                  strokeDashoffset: 780 * (1 - progress),
                }}
              />
            </svg>
            <span className="text-xs tabular-nums text-[#E8E0D0]/75">
              {String(Math.round(progress * 100)).padStart(2, '0')}%
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Track (GSAP pinned on lg+, horizontal scroll strip on mobile/reduced) */}
      <div
        ref={trackRef}
        className={`flex gap-8 px-6 md:gap-12 md:px-10 ${
          reducedMotion
            ? 'overflow-x-auto pb-8'
            : 'overflow-x-auto pb-8 lg:w-max lg:overflow-visible lg:pb-4'
        }`}
      >
        {featuredWorks.map((work) => {
          const isHovered = hoveredId === work.id;
          return (
            <article
              key={work.id}
              onMouseEnter={() => {
                setHoveredId(work.id);
                horrorAudio.playWhisper();
              }}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex w-[84vw] shrink-0 flex-col sm:w-[440px] lg:w-[470px]"
            >
              {/* Huge Gothic Numeral Counter */}
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-serif-display text-5xl font-semibold tabular-nums text-[#C4A77D]/45 transition-colors group-hover:text-[#9E1B1B]">
                  {work.plateNumber}
                </span>
                <span className="font-jp text-sm text-[#C4A77D]/80">{work.japaneseTitle}</span>
              </div>

              {/* Ornate Aged-Gold & Sickly-Cream Frame */}
              <button
                type="button"
                onClick={() => {
                  horrorAudio.playInkTick();
                  onSelectArtwork(work);
                }}
                aria-label={`Inspect ${work.title}`}
                className="aged-paper relative block w-full overflow-hidden border-2 border-[#C4A77D]/55 p-4 text-left shadow-[0_24px_60px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:-translate-y-1"
              >
                {/* Inner recessed frame border */}
                <div className="relative overflow-hidden border border-[#1A1815]/30 bg-black">
                  <ResilientArtworkImage
                    src={work.image}
                    alt={`${work.title} — ${work.medium}`}
                    className={`aspect-[4/5] w-full object-cover transition-transform duration-700 ${
                      isHovered && !reducedMotion ? 'scale-105 contrast-125' : 'scale-100'
                    }`}
                  />
                  {/* Disturbing alternate version flickering over artwork on hover */}
                  <AlternateHorrorOverlay
                    motif={work.alternateMotif}
                    visible={isHovered && !reducedMotion}
                  />
                </div>

                {/* Distressed Serif Title + Blood Drip Underline */}
                <div className="mt-4">
                  <h3 className="font-serif-display text-2xl font-semibold text-[#1A1815]">
                    {work.title}
                  </h3>
                  <svg
                    viewBox="0 0 260 12"
                    className={`mt-1 h-3 w-full transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-35'
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="M0,3 L260,3 M38,3 L38,10 M112,3 L112,7 M194,3 L194,11"
                      stroke="#6B0F0F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Clean Unboxed Metadata */}
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#1A1815]/80">
                    Medium: {work.medium} · Year: {work.year} · Subject: {work.subject}
                  </p>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
