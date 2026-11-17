import React, { useState } from 'react';
import {
  EXHIBITION_EVENTS,
  PRESS_MASTHEADS,
  PRESS_QUOTES,
} from '../data/exhibitionData';
import { horrorAudio } from '../utils/horrorAudio';
import { SpiralGlyph } from './HorrorMotifs';

export const ExhibitionsPressSection: React.FC<{ reducedMotion: boolean }> = ({
  reducedMotion,
}) => {
  const [selectedCityId, setSelectedCityId] = useState(EXHIBITION_EVENTS[0].id);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const activeQuote = PRESS_QUOTES[quoteIndex];

  return (
    <>
      {/* SECTION 09: EXHIBITIONS — WHERE TO FIND FEAR */}
      <section
        id="exhibitions"
        className="relative border-t border-white/10 bg-[#050504] py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
                06. Touring Installations
              </p>
              <h2 className="mt-2 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-5xl">
                Where to Find Fear
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#E8E0D0]/70">
              Select a pin or venue to inspect coordinates
            </p>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
            {/* Timeline Cards */}
            <div className="space-y-4 lg:col-span-6">
              {EXHIBITION_EVENTS.map((ev) => {
                const isSelected = ev.id === selectedCityId;
                return (
                  <article
                    key={ev.id}
                    onClick={() => {
                      horrorAudio.playInkTick();
                      setSelectedCityId(ev.id);
                    }}
                    className={`group relative cursor-pointer border p-6 transition-all duration-300 ${
                      isSelected
                        ? 'aged-paper border-[#6B0F0F] shadow-[0_18px_50px_rgba(107,15,15,0.28)]'
                        : 'border-white/15 bg-[#12100E] text-[#F0EDE5] hover:border-[#C4A77D]/50'
                    }`}
                  >
                    {/* Subtle blood splatter SVG behind card on hover */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 120 120"
                      className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 opacity-0 transition-opacity duration-300 group-hover:opacity-25"
                    >
                      <circle cx="65" cy="55" r="24" fill="#6B0F0F" />
                      <circle cx="90" cy="40" r="8" fill="#6B0F0F" />
                      <circle cx="42" cy="82" r="5" fill="#6B0F0F" />
                    </svg>

                    {/* Distressed Rotated SOLD OUT Stamp */}
                    {ev.status === 'SOLD OUT' && (
                      <div
                        aria-label="Sold out"
                        className="pointer-events-none absolute right-6 top-6 -rotate-12 border-2 border-[#6B0F0F] px-3 py-1 font-mono-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#6B0F0F] opacity-85"
                      >
                        SOLD OUT
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Torn-ticket date badge */}
                      <div
                        className={`inline-block px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] ${
                          isSelected
                            ? 'bg-[#1A1815] text-[#E8E0D0]'
                            : 'bg-[#E8E0D0] text-[#1A1815]'
                        }`}
                        style={{
                          clipPath:
                            'polygon(0 0, 96% 0, 100% 35%, 97% 70%, 100% 100%, 3% 100%, 0 65%)',
                        }}
                      >
                        {ev.dateRange}
                      </div>

                      <span
                        className={`text-xs uppercase tracking-[0.18em] ${
                          isSelected ? 'text-[#6B0F0F]' : 'text-[#C4A77D]'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                      {/* Animated needle pin */}
                      <span
                        aria-hidden="true"
                        className="inline-block h-3 w-0.5 bg-[#6B0F0F] transition-transform group-hover:scale-y-125"
                      />
                      <h3 className="font-serif-display text-2xl font-semibold">
                        {ev.city} <span className="font-jp text-base opacity-75">{ev.japaneseCity}</span>
                      </h3>
                    </div>

                    <p className="mt-1 text-xs uppercase tracking-wider opacity-80">{ev.venue}</p>
                    <p className="mt-2 text-xs opacity-70">{ev.note}</p>
                  </article>
                );
              })}
            </div>

            {/* Custom Dark Map with Spiral Pins */}
            <div className="lg:sticky lg:top-24 lg:col-span-6">
              <div className="relative overflow-hidden border border-white/15 bg-[#090807] p-6">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#C4A77D]">
                  <span>Global Nocturnal Circuit</span>
                  <span>05 Pavilions</span>
                </div>

                <div className="relative aspect-[16/10] w-full border border-white/10 bg-black">
                  {/* Minimal cartographic grid & stylized continents */}
                  <svg viewBox="0 0 100 62" className="h-full w-full" aria-label="Exhibition map">
                    <defs>
                      <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke="rgba(240,237,229,0.06)"
                          strokeWidth="0.2"
                        />
                      </pattern>
                    </defs>
                    <rect width="100" height="62" fill="url(#mapGrid)" />
                    {/* Abstract continent silhouettes */}
                    <path
                      d="M12,18 L28,14 L34,26 L26,40 L18,36 Z M42,16 L58,15 L64,28 L55,34 L44,29 Z M68,20 L88,18 L90,34 L76,42 L66,32 Z"
                      fill="#1A1815"
                      stroke="rgba(196,167,125,0.22)"
                      strokeWidth="0.3"
                    />
                  </svg>

                  {/* Spiral location pins */}
                  {EXHIBITION_EVENTS.map((ev) => {
                    const active = ev.id === selectedCityId;
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => {
                          horrorAudio.playInkTick();
                          setSelectedCityId(ev.id);
                        }}
                        style={{ left: `${ev.coordinates.x}%`, top: `${ev.coordinates.y}%` }}
                        aria-label={`Select ${ev.city} exhibition`}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 p-1"
                      >
                        <SpiralGlyph
                          className={`transition-all duration-300 ${
                            active
                              ? `h-8 w-8 text-[#9E1B1B] ${reducedMotion ? '' : 'animate-spiral-slow'}`
                              : 'h-5 w-5 text-[#E8E0D0]/75 hover:text-[#9E1B1B]'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span
                          className={`mt-1 block whitespace-nowrap text-[10px] uppercase tracking-widest ${
                            active ? 'text-[#F0EDE5]' : 'text-[#C4A77D]/70'
                          }`}
                        >
                          {ev.city}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PRESS & TESTIMONIALS — THE WHISPERS */}
      <section id="press" className="overflow-hidden border-t border-white/10 bg-black py-24">
        {/* Infinite Grayscale Marquee */}
        <div className="border-y border-white/10 py-6">
          <div className="animate-marquee flex items-center gap-16">
            {[...PRESS_MASTHEADS, ...PRESS_MASTHEADS].map((pub, idx) => (
              <span
                key={idx}
                className="shrink-0 font-serif-display text-2xl tracking-[0.26em] text-[#E8E0D0]/45 transition-colors hover:text-[#F0EDE5]"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>

        {/* Bleeding Quote Carousel */}
        <div className="mx-auto mt-20 max-w-4xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
            07. Critical Whispers
          </p>

          <div className="relative mt-10">
            <span
              aria-hidden="true"
              className="ink-bleed font-serif-display text-7xl leading-none text-[#6B0F0F]"
            >
              “
            </span>
            <blockquote className="mt-2 font-serif-display text-3xl italic leading-snug text-[#F0EDE5] md:text-5xl">
              {activeQuote.quote}
            </blockquote>

            <div className="mt-8 text-xs uppercase tracking-[0.2em] text-[#C4A77D]">
              <span>{activeQuote.critic}</span>
              <span aria-hidden="true"> · </span>
              <span>{activeQuote.role}</span>
              <span aria-hidden="true"> · </span>
              <span className="text-[#F0EDE5]">{activeQuote.publication}</span>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {PRESS_QUOTES.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    horrorAudio.playInkTick();
                    setQuoteIndex(idx);
                  }}
                  aria-label={`Read quote from ${q.publication}`}
                  className={`px-3 py-1.5 text-xs tabular-nums transition-colors ${
                    idx === quoteIndex
                      ? 'border-b-2 border-[#9E1B1B] text-[#F0EDE5]'
                      : 'text-[#C4A77D]/60 hover:text-[#F0EDE5]'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
