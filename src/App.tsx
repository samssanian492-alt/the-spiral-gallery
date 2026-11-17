/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AmbientEffects } from './components/AmbientEffects';
import { ArtistProfile } from './components/ArtistProfile';
import { CollectionGallery } from './components/CollectionGallery';
import { EndCreditsSection } from './components/EndCreditsSection';
import { ExhibitionsPressSection } from './components/ExhibitionsPressSection';
import { FeaturedHorizontalGallery } from './components/FeaturedHorizontalGallery';
import { HeroSection } from './components/HeroSection';
import { NavigationCorridor } from './components/NavigationCorridor';
import { NewsletterFooter } from './components/NewsletterFooter';
import { PreloaderGate } from './components/PreloaderGate';
import { ProcessSection } from './components/ProcessSection';
import { UzumakiSection } from './components/UzumakiSection';
import { ArtworkItem } from './data/exhibitionData';
import { horrorAudio } from './utils/horrorAudio';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Sync reduced-motion class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [reducedMotion]);

  // Lenis slow, heavy gallery scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    if (!entered || reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger measurements once layout settles
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      clearTimeout(refreshId);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [entered, reducedMotion]);

  const handleEnter = useCallback(
    ({ reducedMotion: prefersCalm, audio }: { reducedMotion: boolean; audio: boolean }) => {
      setReducedMotion(prefersCalm);
      setAudioEnabled(audio);
      horrorAudio.setEnabled(audio);
      setEntered(true);
    },
    []
  );

  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      horrorAudio.setEnabled(next);
      return next;
    });
  }, []);

  const handleToggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(el, { offset: -40 });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  const scrollToTop = useCallback(() => {
    if (lenisRef.current && !reducedMotion) {
      lenisRef.current.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, [reducedMotion]);

  return (
    <div className="relative min-h-screen bg-black text-[#F0EDE5]">
      {/* Entry Discretion Gate & SVG Spiral Preloader */}
      {!entered && <PreloaderGate onEnter={handleEnter} />}

      {/* Ambient Grain, Custom Spiral/Eye Cursor, Whispers, & Konami Forbidden Plate */}
      <AmbientEffects reducedMotion={reducedMotion} entered={entered} />

      {/* Top Bar & Full-Screen Corridor Overlay */}
      <NavigationCorridor
        onNavigate={scrollToSection}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      <main>
        <HeroSection
          reducedMotion={reducedMotion}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          onToggleReducedMotion={handleToggleReducedMotion}
          onEnterGallery={() => scrollToSection('featured')}
        />

        <FeaturedHorizontalGallery
          reducedMotion={reducedMotion}
          onSelectArtwork={setSelectedArtwork}
        />

        <UzumakiSection
          reducedMotion={reducedMotion}
          onSelectArtwork={setSelectedArtwork}
        />

        <CollectionGallery
          reducedMotion={reducedMotion}
          selectedArtwork={selectedArtwork}
          onSelectArtwork={setSelectedArtwork}
        />

        <ArtistProfile reducedMotion={reducedMotion} />

        <ProcessSection reducedMotion={reducedMotion} />

        <ExhibitionsPressSection reducedMotion={reducedMotion} />
      </main>

      <NewsletterFooter reducedMotion={reducedMotion} onScrollTop={scrollToTop} />

      <EndCreditsSection reducedMotion={reducedMotion} />
    </div>
  );
}
