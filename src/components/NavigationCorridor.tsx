import React, { useState } from 'react';
import { COLLECTION_ARTWORKS } from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import { ResilientArtworkImage, SpiralGlyph, TrackingEyeSvg } from './HorrorMotifs';

interface NavigationCorridorProps {
  onNavigate: (sectionId: string) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

const CORRIDOR_ITEMS = [
  { id: 'featured', index: '01', label: 'Gallery of Fear', jp: '恐怖の回廊', previewIdx: 0 },
  { id: 'uzumaki', index: '02', label: 'The Spiral', jp: '渦巻く狂気', previewIdx: 4 },
  { id: 'collection', index: '03', label: 'The Collection', jp: '呪われた標本', previewIdx: 2 },
  { id: 'artist', index: '04', label: 'The Mind', jp: '作者の深淵', previewIdx: 3 },
  { id: 'process', index: '05', label: 'From Mind to Nightmare', jp: '悪夢の工程', previewIdx: 1 },
  { id: 'exhibitions', index: '06', label: 'Exhibitions', jp: '巡回展', previewIdx: 4 },
  { id: 'newsletter', index: '07', label: 'Join the Cult', jp: '螺旋への誘い', previewIdx: 0 },
];

const CrawlingWord: React.FC<{ text: string }> = ({ text }) => (
  <span className="hover-crawl inline-flex">
    {text.split('').map((ch, idx) => (
      <span
        key={idx}
        style={{ animationDelay: `${(idx % 5) * 90}ms` }}
        className="inline-block"
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))}
  </span>
);

export const NavigationCorridor: React.FC<NavigationCorridorProps> = ({
  onNavigate,
  audioEnabled,
  onToggleAudio,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredPreview, setHoveredPreview] = useState(0);
  const [eyeClosing, setEyeClosing] = useState(false);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    horrorAudio.playInkTick();
    if (drawerOpen) {
      setEyeClosing(true);
      setTimeout(() => {
        setDrawerOpen(false);
        setEyeClosing(false);
        onNavigate(targetId);
      }, 220);
    } else {
      onNavigate(targetId);
    }
  };

  const handleCloseOverlay = () => {
    horrorAudio.playInkTick();
    setEyeClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setEyeClosing(false);
    }, 220);
  };

  const previewArtwork = COLLECTION_ARTWORKS[hoveredPreview] ?? COLLECTION_ARTWORKS[0];

  return (
    <>
      {/* Skip-to-content accessibility link (horror-styled) */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:border focus:border-[#6B0F0F] focus:bg-black focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest focus:text-[#F0EDE5]"
      >
        Skip into the gallery
      </a>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-3.5 md:px-10">
          {/* Zone 1: Single-line Brand Wordmark + Spiral-to-Eye Mark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap font-serif-display text-lg font-medium tracking-[0.14em] text-[#F0EDE5] transition-colors hover:text-[#E8E0D0]"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              {logoHovered ? (
                <TrackingEyeSvg lookX={0} lookY={0} className="h-5 w-7 text-[#F0EDE5]" crimson />
              ) : (
                <SpiralGlyph className="animate-spiral-slow h-6 w-6 text-[#E8E0D0]" />
              )}
            </span>
            <span>THE SPIRAL GALLERY</span>
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary exhibition navigation"
            className="hidden items-center gap-7 text-xs uppercase tracking-[0.18em] text-[#E8E0D0]/80 md:flex"
          >
            <a
              href="#featured"
              onClick={(e) => handleNavClick(e, 'featured')}
              className="shrink-0 whitespace-nowrap border-b border-transparent py-1 transition-colors hover:border-[#6B0F0F] hover:text-[#F0EDE5]"
            >
              <CrawlingWord text="Featured" />
            </a>
            <a
              href="#uzumaki"
              onClick={(e) => handleNavClick(e, 'uzumaki')}
              className="shrink-0 whitespace-nowrap border-b border-transparent py-1 transition-colors hover:border-[#6B0F0F] hover:text-[#F0EDE5]"
            >
              <CrawlingWord text="Uzumaki" />
            </a>
            <a
              href="#collection"
              onClick={(e) => handleNavClick(e, 'collection')}
              className="shrink-0 whitespace-nowrap border-b border-transparent py-1 transition-colors hover:border-[#6B0F0F] hover:text-[#F0EDE5]"
            >
              <CrawlingWord text="Collection" />
            </a>
            <a
              href="#exhibitions"
              onClick={(e) => handleNavClick(e, 'exhibitions')}
              className="shrink-0 whitespace-nowrap border-b border-transparent py-1 transition-colors hover:border-[#6B0F0F] hover:text-[#F0EDE5]"
            >
              <CrawlingWord text="Exhibitions" />
            </a>
          </nav>

          {/* Zone 3: Single Primary Action (Corridor Overlay Trigger) */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => {
                horrorAudio.playWhisper();
                setDrawerOpen(true);
              }}
              aria-expanded={drawerOpen}
              aria-label="Open corridor navigation menu"
              className="shrink-0 whitespace-nowrap border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:border-[#6B0F0F] hover:bg-[#6B0F0F]"
            >
              Corridor
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Corridor Navigation Overlay */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Corridor Navigation"
          className="fixed inset-0 z-[110] flex flex-col justify-between overflow-y-auto bg-black p-6 md:p-12"
        >
          {/* Faint background rotating spiral */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-10"
          >
            <SpiralGlyph className="animate-spiral-slow h-[110vmin] w-[110vmin] text-[#F0EDE5]" strokeWidth={1} />
          </div>

          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
            <span className="font-jp text-sm tracking-[0.25em] text-[#C4A77D]">
              螺旋の回廊 · THE CORRIDOR
            </span>
            {/* Close button styled as a blinking anatomical eye */}
            <button
              type="button"
              onClick={handleCloseOverlay}
              aria-label="Close corridor menu"
              className="group flex items-center gap-3 border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:border-[#6B0F0F]"
            >
              <span>Close</span>
              <TrackingEyeSvg
                lookX={0}
                lookY={0}
                blinking={eyeClosing}
                crimson
                className="h-5 w-9 text-[#F0EDE5] transition-transform group-hover:scale-110"
              />
            </button>
          </div>

          <div className="relative z-10 my-8 grid items-center gap-10 lg:grid-cols-12">
            <nav className="space-y-2 lg:col-span-7" aria-label="Full corridor sections">
              {CORRIDOR_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onMouseEnter={() => {
                    setHoveredPreview(item.previewIdx);
                    horrorAudio.playInkTick();
                  }}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="group flex items-baseline gap-5 border-b border-white/10 py-3 transition-colors hover:border-[#6B0F0F]"
                >
                  <span className="text-xs tabular-nums text-[#C4A77D]">{item.index}.</span>
                  <span className="ink-bleed font-serif-display text-3xl text-[#F0EDE5] transition-transform duration-200 group-hover:translate-x-2 group-hover:text-[#9E1B1B] md:text-5xl">
                    {item.label}
                  </span>
                  <span className="ml-auto hidden font-jp text-sm text-[#C4A77D]/70 sm:inline">
                    {item.jp}
                  </span>
                </a>
              ))}
            </nav>

            {/* Disturbing preview thumbnail revealed on hover */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="aged-paper relative mx-auto max-w-sm border border-[#C4A77D]/40 p-4 shadow-2xl">
                <div className="relative overflow-hidden bg-black">
                  <ResilientArtworkImage
                    src={previewArtwork.image}
                    alt={previewArtwork.title}
                    className="aspect-[3/4] w-full object-cover contrast-125 grayscale"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[#6B0F0F]/15 mix-blend-multiply" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#1A1815]/20 pt-2">
                  <p className="font-serif-display text-lg font-semibold text-[#1A1815]">
                    {previewArtwork.title}
                  </p>
                  <span className="text-[11px] uppercase tracking-widest text-[#6B0F0F]">
                    {previewArtwork.year}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay accessibility & soundscape controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-[#C4A77D]">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onToggleAudio}
                className="border border-white/20 px-4 py-2 uppercase tracking-widest text-[#F0EDE5] hover:border-[#6B0F0F]"
              >
                {audioEnabled ? 'Audio: Active' : 'Audio: Muted'}
              </button>
              <button
                type="button"
                onClick={onToggleReducedMotion}
                className="border border-white/20 px-4 py-2 uppercase tracking-widest text-[#F0EDE5] hover:border-[#6B0F0F]"
              >
                {reducedMotion ? 'Motion: Calm' : 'Motion: Full'}
              </button>
            </div>
            <p className="italic">Look closer. You have already seen it.</p>
          </div>
        </div>
      )}
    </>
  );
};
