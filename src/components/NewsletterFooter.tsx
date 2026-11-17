import React, { useEffect, useState } from 'react';
import { horrorAudio } from '../utils/horrorAudio';
import { SpiralGlyph, TrackingEyeSvg } from './HorrorMotifs';

export const NewsletterFooter: React.FC<{
  reducedMotion: boolean;
  onScrollTop: () => void;
}> = ({ reducedMotion, onScrollTop }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cornerLook, setCornerLook] = useState({ x: 0, y: 0 });
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setCornerLook({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Enter a valid transmission address.');
      return;
    }
    setErrorMsg('');
    horrorAudio.playWhisper();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <>
      {/* SECTION 11: NEWSLETTER — JOIN THE CULT */}
      <section
        id="newsletter"
        className="relative border-t border-white/10 bg-[#080706] py-24 md:py-32"
      >
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C4A77D]">
            08. Transmissions from the Spiral
          </p>
          <h2 className="mt-3 font-serif-display text-4xl font-medium tracking-tight text-[#F0EDE5] md:text-5xl">
            Join Those Who Cannot Look Away
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#E8E0D0]/80">
            Receive transmissions about new works, nocturnal viewings, and things you cannot unsee.
          </p>

          {submitted ? (
            <div className="mt-10 flex flex-col items-center border border-[#6B0F0F] bg-black/75 p-8">
              <SpiralGlyph
                className={`h-12 w-12 text-[#9E1B1B] ${
                  reducedMotion ? '' : 'animate-spiral-slow'
                }`}
              />
              <p className="mt-4 font-serif-display text-2xl italic text-[#F0EDE5]">
                You are now part of the spiral.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 text-xs uppercase tracking-[0.2em] text-[#C4A77D] underline underline-offset-4 hover:text-[#F0EDE5]"
              >
                Register another witness
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="spiral-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="spiral-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="witness@domain.jp"
                  className="w-full border border-white/20 bg-black px-5 py-3.5 text-sm text-[#F0EDE5] placeholder-[#C4A77D]/45 transition-all duration-300 focus:border-[#9E1B1B] focus:shadow-[0_0_25px_rgba(107,15,15,0.55)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#6B0F0F] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:bg-[#9E1B1B]"
                >
                  Enter List
                </button>
              </div>
              {errorMsg && (
                <p role="alert" className="mt-3 text-left text-xs text-[#9E1B1B]">
                  {errorMsg}
                </p>
              )}
              <p className="mt-4 text-xs italic text-[#C4A77D]/70">
                We will not contact you often. But you will think about us.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 12: FOOTER — THE END (OR IS IT) */}
      <footer className="relative border-t border-white/10 bg-black py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <SpiralGlyph className="h-8 w-8 text-[#F0EDE5]" />
                <span className="font-serif-display text-xl tracking-[0.14em] text-[#F0EDE5]">
                  THE SPIRAL GALLERY
                </span>
              </div>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#E8E0D0]/70">
                We are all spiraling. Some just know it. Permanent nocturnal exhibition curated in
                Tokyo and distributed across select sanctuaries.
              </p>
            </div>

            <div className="space-y-2 text-xs md:col-span-3">
              <p className="uppercase tracking-[0.2em] text-[#C4A77D]">Corridors</p>
              <ul className="space-y-2 pt-2 text-[#E8E0D0]/80">
                <li>
                  <a href="#featured" className="hover:text-[#F0EDE5]">
                    Gallery of Fear
                  </a>
                </li>
                <li>
                  <a href="#uzumaki" className="hover:text-[#F0EDE5]">
                    The Spiral
                  </a>
                </li>
                <li>
                  <a href="#collection" className="hover:text-[#F0EDE5]">
                    Collection Catalogue
                  </a>
                </li>
                <li>
                  <a href="#exhibitions" className="hover:text-[#F0EDE5]">
                    Touring Dates
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-xs md:col-span-2">
              <p className="uppercase tracking-[0.2em] text-[#C4A77D]">Sightings</p>
              <ul className="space-y-2.5 pt-1 text-[#E8E0D0]/80">
                {['Archive Journal', 'Press Kit', 'Curator Desk'].map((label) => (
                  <li key={label}>
                    <a
                      href="#newsletter"
                      onMouseEnter={() => setHoveredSocial(label)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      className="inline-flex items-center gap-2 hover:text-[#F0EDE5]"
                    >
                      <TrackingEyeSvg
                        lookX={0}
                        lookY={0}
                        blinking={hoveredSocial === label}
                        className="h-3.5 w-6 text-[#C4A77D]"
                      />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start justify-between md:col-span-2 md:items-end">
              <button
                type="button"
                onClick={() => {
                  horrorAudio.playInkTick();
                  onScrollTop();
                }}
                aria-label="Ascend back to top"
                className="group flex items-center gap-2 border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:border-[#6B0F0F]"
              >
                <SpiralGlyph className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
                <span>Ascend</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#C4A77D]/70">
            <p>© 2025 THE SPIRAL GALLERY. All nightmares reserved.</p>
            <div className="flex items-center gap-4">
              <p>Made by SAMS SANIAN AHAMOD</p>
              {/* Tiny corner Easter-egg eye following cursor */}
              <div title="It sees you" className="opacity-70 hover:opacity-100">
                <TrackingEyeSvg
                  lookX={cornerLook.x}
                  lookY={cornerLook.y}
                  crimson
                  className="h-5 w-8 text-[#E8E0D0]"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
