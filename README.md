# THE SPIRAL GALLERY — 螺旋の回廊

A digital horror manga art exhibition website inspired by Japanese horror aesthetics, pairing luxury museum typography with unsettling kinetic ink interactions.

---

## Adding New Artworks

All exhibition plates are cataloged in `src/data/exhibitionData.ts`.

1. Place your monochrome ink plate image inside `src/assets/images/` (or `public/artworks/`).
2. Add a new object to `COLLECTION_ARTWORKS` in `src/data/exhibitionData.ts`:
   ```ts
   {
     id: 'plate-09',
     plateNumber: '09',
     accessionNumber: 'ACC. 2025.03.11',
     title: 'The Attic Spiral',
     japaneseTitle: '屋根裏の渦',
     category: 'SPIRALS', // 'SPIRALS' | 'BODY HORROR' | 'INSECTS' | 'CURSES' | 'UNKNOWN'
     medium: 'Sumi ink on archival washi',
     year: '2025',
     subject: 'Unknown',
     dimensions: '60.0 × 45.0 cm',
     provenance: 'Studio Archive',
     image: '/src/assets/images/your_plate.jpg',
     aspect: 'portrait',
     curatorialNote: 'Curatorial description shown in the Museum Accession Lightbox.',
     whisper: 'it watches from above...',
     alternateMotif: 'eyes', // 'eyes' | 'spiral' | 'fracture' | 'grin' | 'centipede'
     featured: false, // Set to true to include in the pinned horizontal gallery
   }
   ```

---

## Customizing the Horror Tone & Intensity

- **Color Palette (`src/index.css`)**: Update CSS custom properties (`--void-black`, `--sickly-cream`, `--dried-blood`, `--rotting-green`, `--sickly-yellow`) to shift between stark monochrome ink and warmer aged-paper tones.
- **Subliminal Flashes & Whispers (`src/components/AmbientEffects.tsx`)**: Adjust `WHISPER_LINES` or the 22-second interval roll in `AmbientEffects.tsx` to increase or soften rare apparition frequency.
- **Audio Soundscape (`src/utils/horrorAudio.ts`)**: All subterranean drones, whispers, and ink ticks are synthesized procedurally via the Web Audio API (no external audio files needed) and stay muted until explicit user opt-in.
- **Easter Egg Vault**: Entering the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) unlocks `FORBIDDEN_ARTWORK` inside `AmbientEffects.tsx`.

---

## Performance Tips

- **Compositor-Only Motion**: Animations animate `transform` and `opacity` rather than layout geometry (`width`/`height`/`top`/`left`) to maintain 60fps scrolling.
- **GSAP + Lenis Sync**: `App.tsx` binds Lenis smooth scrolling directly to `gsap.ticker` and `ScrollTrigger.update`, and tears down all triggers on unmount or when Reduced Motion is toggled.
- **Canvas & SVG Spirals**: All decorative spirals, tracking eyes, and dust particles use lightweight vector paths and a single 36-particle hero canvas.

---

## Accessibility Notes

- **Viewer Discretion Gate (`src/components/PreloaderGate.tsx`)**: Visitors are presented with an explicit flashing/unsettling-imagery warning at entry and can choose **"Enter (Reduced Motion)"** before any animation plays.
- **`prefers-reduced-motion` Compliance**: Automatically detected on initial load and togglable at any time from the Hero utility bar or Corridor overlay. Enabling Reduced Motion disables subliminal frame flashes, stops grain flicker, switches Lenis off for native scrolling, and pauses CSS loops.
- **Keyboard & Screen Reader Support**: Includes a skip-to-content link, `aria-modal` lightboxes with `Escape` key dismissal, `role="tablist"` filters, and visible `focus-visible` rings.
