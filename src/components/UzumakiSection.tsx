import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArtworkItem, COLLECTION_ARTWORKS } from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import { generateSpiralPath, ResilientArtworkImage, TrackingEyeSvg } from './HorrorMotifs';

gsap.registerPlugin(ScrollTrigger);

interface UzumakiSectionProps {
  reducedMotion: boolean;
  onSelectArtwork: (art: ArtworkItem) => void;
}

export const UzumakiSection: React.FC<UzumakiSectionProps> = ({
  reducedMotion,
  onSelectArtwork,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const spiralBgRef = useRef<SVGSVGElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  const giantSpiralD = React.useMemo(() => generateSpiralPath(300, 300, 7, 285, 360), []);
  const orbitalWorks = React.useMemo(() => COLLECTION_ARTWORKS.slice(0, 5), []);

  // Cursor-following central eye
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / 360));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / 260));
      setLook({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ScrollTrigger: spiral tightens and rotates inward as user scrolls deeper
  useEffect(() => {
    const section = sectionRef.current;
    const spiralSvg = spiralBgRef.current;
    const ring = ringRef.current;
    if (!section || !spiralSvg || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spiralSvg,
        { scale: 1.25, rotate: 0 },
        {
          scale: 0.72,
          rotate: 180,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      if (ring) {
        gsap.fromTo(
          ring,
          { rotate: -18 },
          {
            rotate: 22,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Orbital spiral layout positions around the central watching eye
  const spiralCoords = [
    { x: 50, y: 12 },
    { x: 84, y: 34 },
    { x: 74, y: 78 },
    { x: 26, y: 80 },
    { x: 16, y: 38 },
  ];

  return (
    <section
      id="uzumaki"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-black py-24 md:py-32"
    >
      {/* Massive Scroll-Tightening Background SVG Spiral */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
      >
        <svg ref={spiralBgRef} viewBox="0 0 600 600" className="h-[115vmin] w-[115vmin]">
          <path d={giantSpiralD} fill="none" stroke="#E8E0D0" strokeWidth="1.3" />
          <path
            d={giantSpiralD}
            fill="none"
            stroke="#6B0F0F"
            strokeWidth="1.1"
            transform="rotate(18 300 300)"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-jp text-xs uppercase tracking-[0.28em] text-[#C4A77D]">
            02. 渦巻 · The Spiral Obsession
          </p>
          <h2 className="mt-3 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-6xl">
            Everything Curves Inward
          </h2>
        </div>

        {/* Desktop Orbital Spiral Arrangement */}
        <div className="relative mx-auto mt-16 hidden h-[680px] max-w-5xl lg:block">
          <div ref={ringRef} className="relative h-full w-full">
            {orbitalWorks.map((work, idx) => {
              const pos = spiralCoords[idx];
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => {
                    horrorAudio.playWhisper();
                    onSelectArtwork(work);
                  }}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 text-left transition-transform duration-300 hover:z-30 hover:scale-105"
                >
                  <div className="w-48 border border-[#C4A77D]/45 bg-[#1A1815] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                    <ResilientArtworkImage
                      src={work.image}
                      alt={work.title}
                      className="aspect-[4/3] w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                    />
                    <div className="mt-2 flex items-baseline justify-between gap-2 px-1">
                      <span className="truncate font-serif-display text-sm text-[#F0EDE5]">
                        {work.title}
                      </span>
                      <span className="text-[10px] tabular-nums text-[#C4A77D]">
                        {work.plateNumber}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center of Spiral: Staring Cursor-Following Eye + Quote */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <div className="rounded-full border border-[#6B0F0F]/40 bg-black/90 p-5 shadow-[0_0_70px_rgba(107,15,15,0.4)]">
              <TrackingEyeSvg
                lookX={look.x}
                lookY={look.y}
                crimson
                className="h-20 w-32 text-[#F0EDE5]"
              />
            </div>
            <blockquote className="mt-5 font-serif-display text-xl italic leading-snug text-[#E8E0D0]">
              “The spiral is everywhere. Once you see it, you cannot unsee it.”
            </blockquote>
          </div>
        </div>

        {/* Tablet/Mobile Spiral Stack Fallback */}
        <div className="mt-12 space-y-8 lg:hidden">
          <div className="flex flex-col items-center text-center">
            <div className="border border-[#6B0F0F]/40 bg-black p-4">
              <TrackingEyeSvg
                lookX={look.x}
                lookY={look.y}
                crimson
                className="h-16 w-28 text-[#F0EDE5]"
              />
            </div>
            <blockquote className="mt-4 max-w-md font-serif-display text-xl italic text-[#E8E0D0]">
              “The spiral is everywhere. Once you see it, you cannot unsee it.”
            </blockquote>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {orbitalWorks.map((work) => (
              <button
                key={work.id}
                type="button"
                onClick={() => onSelectArtwork(work)}
                className="border border-[#C4A77D]/35 bg-[#1A1815] p-3 text-left"
              >
                <ResilientArtworkImage
                  src={work.image}
                  alt={work.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <p className="mt-2 font-serif-display text-lg text-[#F0EDE5]">{work.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
