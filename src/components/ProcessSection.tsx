import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STAGES } from '../data/exhibitionData';
import { AlternateHorrorOverlay, ResilientArtworkImage, SpiralGlyph } from './HorrorMotifs';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_ART = '/src/assets/images/manga_botanical_centipede_1794916480804.jpg';

/**
 * ProcessSection — From Mind to Nightmare
 * ---------------------------------------------------------------------------
 * Scroll-driven transformation across 6 stages:
 * IDEA -> OBSESSION -> SKETCH -> INK -> DETAIL -> NIGHTMARE
 * Background shifts smoothly from aged paper (#E8E0D0) -> ochre -> ink gray -> pitch black (#000000)
 */
export const ProcessSection: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const step = Math.min(
            PROCESS_STAGES.length - 1,
            Math.floor(self.progress * PROCESS_STAGES.length)
          );
          setActiveStep(step);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const currentStage = PROCESS_STAGES[activeStep];

  // Background color progression: paper -> yellowed -> gray -> pitch black
  const bgTones = [
    'bg-[#E8E0D0] text-[#1A1815]',
    'bg-[#D2C2A4] text-[#1A1815]',
    'bg-[#8E816B] text-[#11100E]',
    'bg-[#35312B] text-[#F0EDE5]',
    'bg-[#161412] text-[#F0EDE5]',
    'bg-[#000000] text-[#F0EDE5]',
  ];

  const isDarkPhase = activeStep >= 3;

  return (
    <section
      id="process"
      ref={sectionRef}
      className={`relative border-t border-white/10 py-24 transition-colors duration-700 md:py-32 ${bgTones[activeStep]}`}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className={`text-xs uppercase tracking-[0.25em] ${
                isDarkPhase ? 'text-[#C4A77D]' : 'text-[#6B0F0F]'
              }`}
            >
              05. From Mind to Nightmare
            </p>
            <h2 className="mt-2 font-serif-display text-4xl font-medium tracking-tight md:text-5xl">
              Anatomy of a Cursed Plate
            </h2>
          </div>

          <p className="font-jp text-lg tracking-widest opacity-80">
            {currentStage.japaneseLabel} · {currentStage.label}
          </p>
        </div>

        {/* 6 Interactive Step Nodes */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PROCESS_STAGES.map((stage, idx) => {
            const filled = idx <= activeStep;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-3 border p-3.5 text-left transition-all ${
                  idx === activeStep
                    ? 'border-[#6B0F0F] bg-[#6B0F0F] text-[#F0EDE5]'
                    : isDarkPhase
                    ? 'border-white/15 bg-black/40 text-[#E8E0D0] hover:border-[#C4A77D]'
                    : 'border-[#1A1815]/20 bg-white/30 text-[#1A1815] hover:border-[#6B0F0F]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums transition-colors ${
                    filled
                      ? 'border-[#6B0F0F] bg-black text-[#F0EDE5]'
                      : 'border-current opacity-60'
                  }`}
                >
                  0{stage.step}
                </span>
                <span className="truncate text-[11px] font-medium uppercase tracking-[0.15em]">
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Frame */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-[#1A1815]/30 bg-black shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <ResilientArtworkImage
                  src={PROCESS_ART}
                  alt={`Process stage ${currentStage.label}`}
                  className="h-full w-full object-cover transition-all duration-700"
                />

                {/* Visual filter layer evolving from raw sketch lines to nightmare */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-all duration-700"
                  style={{
                    backgroundColor:
                      activeStep === 0
                        ? 'rgba(232,224,208,0.82)'
                        : activeStep === 1
                        ? 'rgba(232,224,208,0.58)'
                        : activeStep === 2
                        ? 'rgba(210,195,165,0.34)'
                        : 'transparent',
                    mixBlendMode: activeStep < 3 ? 'screen' : 'normal',
                  }}
                />

                {/* Construction grid for Sketch stage */}
                {activeStep <= 2 && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 400 300"
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
                  >
                    <line x1="200" y1="0" x2="200" y2="300" stroke="#6B0F0F" strokeDasharray="4 4" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#6B0F0F" strokeDasharray="4 4" />
                    <circle cx="200" cy="150" r="85" stroke="#1A1815" fill="none" strokeWidth="1" />
                  </svg>
                )}

                {/* Nightmare stage alternate disturbing flicker */}
                <AlternateHorrorOverlay
                  motif="centipede"
                  visible={activeStep === 5 && !reducedMotion}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <SpiralGlyph className="h-6 w-6 text-[#9E1B1B]" />
              <span className="text-xs uppercase tracking-[0.22em] opacity-80">
                Stage 0{currentStage.step} / 06 · Ink Saturation {currentStage.inkLevel}%
              </span>
            </div>

            <h3 className="font-serif-display text-3xl font-medium md:text-4xl">
              {currentStage.title}
            </h3>

            <p className="max-w-lg text-sm leading-relaxed opacity-90 md:text-base">
              {currentStage.description}
            </p>

            <div className="pt-2">
              <div className="h-1.5 w-full overflow-hidden bg-black/20">
                <div
                  className="h-full bg-[#6B0F0F] transition-all duration-500"
                  style={{ width: `${currentStage.inkLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
