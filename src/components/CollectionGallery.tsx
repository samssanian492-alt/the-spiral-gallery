import React, { useEffect, useState } from 'react';
import {
  ArtworkItem,
  COLLECTION_ARTWORKS,
  COLLECTION_CATEGORIES,
  CollectionCategory,
} from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import {
  AlternateHorrorOverlay,
  ResilientArtworkImage,
  SpiralGlyph,
  TrackingEyeSvg,
} from './HorrorMotifs';

interface CollectionGalleryProps {
  reducedMotion: boolean;
  selectedArtwork: ArtworkItem | null;
  onSelectArtwork: (art: ArtworkItem | null) => void;
}

export const CollectionGallery: React.FC<CollectionGalleryProps> = ({
  reducedMotion,
  selectedArtwork,
  onSelectArtwork,
}) => {
  const [activeCategory, setActiveCategory] = useState<CollectionCategory>('ALL');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [closingEye, setClosingEye] = useState(false);

  const filteredWorks = React.useMemo(() => {
    if (activeCategory === 'ALL') return COLLECTION_ARTWORKS;
    return COLLECTION_ARTWORKS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!selectedArtwork) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleCloseLightbox = () => {
    horrorAudio.playInkTick();
    setClosingEye(true);
    setTimeout(() => {
      setZoomed(false);
      setClosingEye(false);
      onSelectArtwork(null);
    }, 210);
  };

  return (
    <section
      id="collection"
      className="relative border-t border-white/10 bg-[#080706] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Intro & Filter Tabs */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
              03. The Permanent Collection
            </p>
            <h2 className="mt-2 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-5xl">
              These are not drawings. These are warnings.
            </h2>
          </div>

          {/* Interactive Filter Bar (Functional buttons with ink-bleed underline, zero pills) */}
          <div
            role="tablist"
            aria-label="Filter exhibition artworks by motif"
            className="flex flex-wrap items-center gap-2 border border-white/10 bg-[#1A1815]/70 p-1.5"
          >
            {COLLECTION_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => {
                    horrorAudio.playInkTick();
                    setActiveCategory(category);
                  }}
                  className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? 'border-b-2 border-[#9E1B1B] bg-[#6B0F0F]/35 text-[#F0EDE5]'
                      : 'text-[#E8E0D0]/70 hover:text-[#F0EDE5]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State (if future filter matches nothing) */}
        {filteredWorks.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif-display text-2xl italic text-[#E8E0D0]">
              This work has been removed. We do not know by whom.
            </p>
          </div>
        ) : (
          /* Deliberately Misaligned Asymmetric Gallery Grid */
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorks.map((item, idx) => {
              const isHovered = hoveredCard === item.id;
              // Intentional subtle vertical misalignment on desktop columns
              const offsetClass =
                idx % 3 === 1 ? 'lg:translate-y-8' : idx % 3 === 2 ? 'lg:-translate-y-4' : '';

              return (
                <article
                  key={item.id}
                  onMouseEnter={() => {
                    setHoveredCard(item.id);
                    horrorAudio.playWhisper();
                  }}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative transition-transform duration-500 ${offsetClass}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      horrorAudio.playInkTick();
                      onSelectArtwork(item);
                    }}
                    className="block w-full border border-white/10 bg-[#1A1815] p-3 text-left transition-all duration-300 hover:border-[#6B0F0F] hover:shadow-[0_24px_65px_rgba(107,15,15,0.28)]"
                    style={{
                      clipPath:
                        'polygon(0% 1%, 99% 0%, 100% 98%, 97% 100%, 2% 99%, 0% 96%)',
                    }}
                  >
                    <div className="relative overflow-hidden bg-black">
                      <ResilientArtworkImage
                        src={item.image}
                        alt={item.title}
                        className={`w-full object-cover transition-all duration-500 ${
                          item.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                        } ${isHovered ? 'scale-[1.03] sepia-[.25] hue-rotate-[-20deg]' : ''}`}
                      />
                      <AlternateHorrorOverlay
                        motif={item.alternateMotif}
                        visible={isHovered && !reducedMotion}
                      />
                    </div>

                    <div className="mt-4 px-1 pb-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif-display text-2xl font-medium text-[#F0EDE5]">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-xs tabular-nums text-[#C4A77D]">
                          {item.plateNumber}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-[#C4A77D]/85">
                        {item.category} · {item.year} · {item.accessionNumber}
                      </p>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Museum Accession Lightbox Modal */}
      {selectedArtwork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-[115] flex items-center justify-center overflow-y-auto bg-black/95 p-4 backdrop-blur-md md:p-8"
        >
          {/* Faint rotating spiral behind lightbox */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-10"
          >
            <SpiralGlyph className="animate-spiral-slow h-[90vmin] w-[90vmin] text-[#F0EDE5]" strokeWidth={1} />
          </div>

          <div className="relative z-10 my-auto w-full max-w-5xl border border-[#C4A77D]/30 bg-[#0D0C0B] p-6 shadow-2xl md:p-10">
            {/* Header bar with Eye-morph Close button */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4A77D]">
                {selectedArtwork.accessionNumber} · Plate {selectedArtwork.plateNumber}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="border border-white/15 px-3.5 py-2 text-[11px] uppercase tracking-widest text-[#E8E0D0] hover:border-[#C4A77D]"
                >
                  {zoomed ? 'Reset Scale' : 'Inspect Ink'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  aria-label="Close artwork detail"
                  className="group flex items-center gap-2 border border-white/20 px-3.5 py-2 text-[11px] uppercase tracking-widest text-[#F0EDE5] hover:border-[#6B0F0F]"
                >
                  <span className="group-hover:hidden">×</span>
                  <span className="hidden group-hover:inline">Blink Shut</span>
                  <TrackingEyeSvg
                    lookX={0}
                    lookY={0}
                    blinking={closingEye}
                    crimson
                    className="h-4 w-7 text-[#F0EDE5]"
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 grid items-start gap-8 lg:grid-cols-12">
              {/* Aged Paper Mounted Plate */}
              <div className="aged-paper relative overflow-hidden border border-[#C4A77D]/45 p-4 lg:col-span-7">
                <div className="overflow-hidden bg-black">
                  <ResilientArtworkImage
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    className={`w-full object-contain transition-transform duration-500 ${
                      zoomed ? 'scale-125 cursor-zoom-out' : 'max-h-[65vh] cursor-zoom-in'
                    }`}
                  />
                </div>
              </div>

              {/* Museum Accession Metadata Grid */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <p className="font-jp text-lg text-[#C4A77D]">
                    {selectedArtwork.japaneseTitle}
                  </p>
                  <h3
                    id="lightbox-title"
                    className="mt-1 font-serif-display text-3xl font-medium text-[#F0EDE5] md:text-4xl"
                  >
                    {selectedArtwork.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#E8E0D0]/90">
                    {selectedArtwork.curatorialNote}
                  </p>

                  <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-xs">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="uppercase tracking-widest text-[#C4A77D]">Medium</dt>
                      <dd className="text-right text-[#F0EDE5]">{selectedArtwork.medium}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="uppercase tracking-widest text-[#C4A77D]">Year</dt>
                      <dd className="tabular-nums text-[#F0EDE5]">{selectedArtwork.year}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="uppercase tracking-widest text-[#C4A77D]">Dimensions</dt>
                      <dd className="tabular-nums text-[#F0EDE5]">{selectedArtwork.dimensions}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="uppercase tracking-widest text-[#C4A77D]">Subject</dt>
                      <dd className="text-right text-[#F0EDE5]">{selectedArtwork.subject}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="uppercase tracking-widest text-[#C4A77D]">Provenance</dt>
                      <dd className="text-right text-[#E8E0D0]/85">{selectedArtwork.provenance}</dd>
                    </div>
                  </dl>
                </div>

                <p className="mt-6 font-serif-display text-lg italic text-[#9E1B1B]">
                  “{selectedArtwork.whisper}”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
