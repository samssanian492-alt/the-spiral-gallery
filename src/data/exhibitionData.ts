/**
 * Exhibition Catalogue & Curatorial Data
 * ---------------------------------------------------------------------------
 * To add a new artwork to the exhibition:
 * 1. Place the ink artwork asset inside `public/` or `src/assets/images/`.
 * 2. Append a new `ArtworkItem` entry to `COLLECTION_ARTWORKS` below.
 * 3. Assign one of the existing `CollectionCategory` values so it appears in filter tabs.
 */

export type CollectionCategory =
  | 'ALL'
  | 'SPIRALS'
  | 'BODY HORROR'
  | 'INSECTS'
  | 'CURSES'
  | 'UNKNOWN';

export interface ArtworkItem {
  id: string;
  plateNumber: string;
  accessionNumber: string;
  title: string;
  japaneseTitle: string;
  category: Exclude<CollectionCategory, 'ALL'>;
  medium: string;
  year: string;
  subject: string;
  dimensions: string;
  provenance: string;
  image: string;
  aspect: 'portrait' | 'landscape';
  curatorialNote: string;
  whisper: string;
  /** Controls the secondary disturbing overlay drawn on hover / alternate reveal */
  alternateMotif: 'eyes' | 'spiral' | 'fracture' | 'grin' | 'centipede';
  featured?: boolean;
}

export interface ProcessStage {
  step: number;
  label: string;
  japaneseLabel: string;
  title: string;
  description: string;
  inkLevel: number;
}

export interface ExhibitionEvent {
  id: string;
  city: string;
  japaneseCity: string;
  venue: string;
  dateRange: string;
  status: 'OPEN' | 'SOLD OUT' | 'FINAL DAYS';
  coordinates: { x: number; y: number }; // Percentage coordinates on our dark world map SVG
  note: string;
}

export interface PressQuote {
  id: string;
  publication: string;
  quote: string;
  critic: string;
  role: string;
}

export const COLLECTION_CATEGORIES: CollectionCategory[] = [
  'ALL',
  'SPIRALS',
  'BODY HORROR',
  'INSECTS',
  'CURSES',
  'UNKNOWN',
];

export const COLLECTION_ARTWORKS: ArtworkItem[] = [
  {
    id: 'plate-01',
    plateNumber: '01',
    accessionNumber: 'ACC. 1998.01.07',
    title: 'The Left Iris Recollection',
    japaneseTitle: '左眼の記憶',
    category: 'SPIRALS',
    medium: 'Sumi ink & G-pen on archival washi',
    year: '1998',
    subject: 'Unknown',
    dimensions: '72.8 × 51.5 cm',
    provenance: 'Acquired from private Kyoto estate, 2019',
    image: '/src/assets/images/hero_spiral_portrait_1794916480506.jpg',
    aspect: 'portrait',
    curatorialNote:
      'Witnesses reported the ink inside the left pupil continued contracting for three days after the paper dried.',
    whisper: "don't look away...",
    alternateMotif: 'eyes',
    featured: true,
  },
  {
    id: 'plate-02',
    plateNumber: '02',
    accessionNumber: 'ACC. 2001.04.19',
    title: 'Hallway of Concentric Grain',
    japaneseTitle: '木目の回廊',
    category: 'CURSES',
    medium: 'Ink & screentone on aged Kent board',
    year: '2001',
    subject: 'Vacant Residence, Kurouzu',
    dimensions: '59.4 × 84.1 cm',
    provenance: 'Recovered from demolished timber house, Shizuoka',
    image: '/src/assets/images/manga_corridor_plate_1794916480753.jpg',
    aspect: 'landscape',
    curatorialNote:
      'Every wooden plank in the corridor curves inward toward the standing figure. Measurements of the room remain inconsistent.',
    whisper: 'it is waiting at the end of the hall...',
    alternateMotif: 'spiral',
    featured: true,
  },
  {
    id: 'plate-03',
    plateNumber: '03',
    accessionNumber: 'ACC. 1996.09.12',
    title: 'Camellia & Chitin Study IV',
    japaneseTitle: '椿と百足の標本',
    category: 'INSECTS',
    medium: 'Fine nib ink & stippling on yellowed paper',
    year: '1996',
    subject: 'Botanical Specimen #44',
    dimensions: '64.0 × 48.0 cm',
    provenance: 'Mori Underground Archive loan, Tokyo',
    image: '/src/assets/images/manga_botanical_centipede_1794916480804.jpg',
    aspect: 'portrait',
    curatorialNote:
      'Under magnification, the fern fronds and segmented legs share identical anatomical joints.',
    whisper: 'something moved beneath the collar...',
    alternateMotif: 'centipede',
    featured: true,
  },
  {
    id: 'plate-04',
    plateNumber: '04',
    accessionNumber: 'ACC. 2004.11.03',
    title: 'The Multiplied Gaze',
    japaneseTitle: '増殖する視線',
    category: 'BODY HORROR',
    medium: 'Brush ink & halftone film on cotton rag',
    year: '2004',
    subject: 'Multiple / Unverified',
    dimensions: '76.0 × 54.0 cm',
    provenance: 'Anonymous donor, Ginza Private Viewing',
    image: '/src/assets/images/manga_multiplied_gaze_1794916482165.jpg',
    aspect: 'portrait',
    curatorialNote:
      'Fourteen silhouettes emerge from a single kimono sleeve. Each claims to be the original sitter.',
    whisper: "she's watching...",
    alternateMotif: 'grin',
    featured: true,
  },
  {
    id: 'plate-05',
    plateNumber: '05',
    accessionNumber: 'ACC. 1999.02.28',
    title: 'Beacon of the Black Tide',
    japaneseTitle: '黒潮の灯台',
    category: 'UNKNOWN',
    medium: 'Sumi ink on distressed rag paper',
    year: '1999',
    subject: 'Coastal Observation Post',
    dimensions: '62.0 × 88.0 cm',
    provenance: 'Permanent Collection, The Spiral Gallery',
    image: '/src/assets/images/manga_coastal_lighthouse_1794916482670.jpg',
    aspect: 'landscape',
    curatorialNote:
      'Instead of light, the lantern projects coiled shadows across the breakers. Seven faces are visible in the foam.',
    whisper: 'the spiral...',
    alternateMotif: 'fracture',
    featured: true,
  },
  {
    id: 'plate-06',
    plateNumber: '06',
    accessionNumber: 'ACC. 2007.08.14',
    title: 'Unblinking Study in Porcelain',
    japaneseTitle: '白磁の凝視',
    category: 'BODY HORROR',
    medium: 'Ink wash & drypoint on ivory stock',
    year: '2007',
    subject: 'Patient 09',
    dimensions: '50.0 × 38.0 cm',
    provenance: 'Kyoto Nocturnal Symposium, 2014',
    image: '/src/assets/images/hero_spiral_portrait_1794916480506.jpg',
    aspect: 'portrait',
    curatorialNote:
      'Curators recommend viewing this plate for no longer than forty seconds without blinking.',
    whisper: 'do not blink...',
    alternateMotif: 'fracture',
  },
  {
    id: 'plate-07',
    plateNumber: '07',
    accessionNumber: 'ACC. 2003.05.21',
    title: 'Nocturne for Seven Thresholds',
    japaneseTitle: '七つの敷居の夜想曲',
    category: 'CURSES',
    medium: 'Carbon ink & razor scrape on parchment',
    year: '2003',
    subject: 'Corridor Blueprint',
    dimensions: '45.0 × 62.0 cm',
    provenance: 'Private Collection, London',
    image: '/src/assets/images/manga_corridor_plate_1794916480753.jpg',
    aspect: 'landscape',
    curatorialNote:
      'A doorway drawn onto an interior wall that did not exist on the architect’s survey.',
    whisper: 'someone knocked from the inside...',
    alternateMotif: 'eyes',
  },
  {
    id: 'plate-08',
    plateNumber: '08',
    accessionNumber: 'ACC. 2011.10.31',
    title: 'Vortex Over Cape Misaki',
    japaneseTitle: '岬の渦潮',
    category: 'SPIRALS',
    medium: 'Ink on aged mulberry paper',
    year: '2011',
    subject: 'Atmospheric Anomaly',
    dimensions: '55.0 × 74.0 cm',
    provenance: 'Acquired directly from the studio',
    image: '/src/assets/images/manga_coastal_lighthouse_1794916482670.jpg',
    aspect: 'landscape',
    curatorialNote:
      'Sound recordings taken during installation contain low rhythmic breathing matching the tide.',
    whisper: 'listen to the waves...',
    alternateMotif: 'spiral',
  },
];

export const FORBIDDEN_ARTWORK: ArtworkItem = {
  id: 'plate-forbidden',
  plateNumber: '00',
  accessionNumber: 'ACC. 0000.00.00',
  title: 'The Uncatalogued Ninth Face',
  japaneseTitle: '第九の顔（禁室）',
  category: 'UNKNOWN',
  medium: 'Unidentified pigment on human-warmed vellum',
  year: '????',
  subject: 'Redacted by Gallery Committee',
  dimensions: 'Unstable',
  provenance: 'Found sealed inside the vault beneath Room IV',
  image: '/src/assets/images/manga_multiplied_gaze_1794916482165.jpg',
  aspect: 'portrait',
  curatorialNote:
    'You entered the sequence. This plate was removed from public display after visitors insisted the background faces resembled their own reflections.',
  whisper: 'you should not have opened this...',
  alternateMotif: 'grin',
};

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: 1,
    label: 'IDEA',
    japaneseLabel: '着想',
    title: 'The Everyday Fracture',
    description:
      'It begins with a mundane observation — a snail shell in rain, a warped wooden floorboard, an overly polite smile.',
    inkLevel: 12,
  },
  {
    step: 2,
    label: 'OBSESSION',
    japaneseLabel: '執着',
    title: 'Repetition Until Meaning Breaks',
    description:
      'A single curve repeated four hundred times ceases to be ornament. It becomes hunger.',
    inkLevel: 28,
  },
  {
    step: 3,
    label: 'SKETCH',
    japaneseLabel: '下絵',
    title: 'Anatomical Wrongness',
    description:
      'Lead lines establish normal human symmetry — then elongate the neck by three millimeters, widen the sclera, tilt the jaw.',
    inkLevel: 46,
  },
  {
    step: 4,
    label: 'INK',
    japaneseLabel: 'ペン入れ',
    title: 'Black Sumi Over Bone White',
    description:
      'G-pen nibs carve unforgiving contrast. Mistakes are not erased; they are crosshatched into shadow.',
    inkLevel: 68,
  },
  {
    step: 5,
    label: 'DETAIL',
    japaneseLabel: '細密描写',
    title: 'The Madness of Hatching',
    description:
      'Thousands of microscopic pen strokes trap the viewer’s eye inside hair strands, timber grain, and storm clouds.',
    inkLevel: 86,
  },
  {
    step: 6,
    label: 'NIGHTMARE',
    japaneseLabel: '悪夢',
    title: 'It Looks Back',
    description:
      'The final stroke is never the artist’s. It is the moment you realize the figure on the paper has noticed you.',
    inkLevel: 100,
  },
];

export const EXHIBITION_EVENTS: ExhibitionEvent[] = [
  {
    id: 'ex-tokyo',
    city: 'Tokyo',
    japaneseCity: '東京・六本木',
    venue: 'Mori Underground Annex, Hall B',
    dateRange: 'Nov 14 — Feb 02',
    status: 'OPEN',
    coordinates: { x: 82, y: 39 },
    note: '42 original ink plates · Subterranean soundscape',
  },
  {
    id: 'ex-kyoto',
    city: 'Kyoto',
    japaneseCity: '京都・東山',
    venue: 'Kurogane Machiya Sanctuary',
    dateRange: 'Oct 01 — Nov 10',
    status: 'SOLD OUT',
    coordinates: { x: 78, y: 42 },
    note: 'Candlelit wooden corridor installation',
  },
  {
    id: 'ex-london',
    city: 'London',
    japaneseCity: 'ロンドン',
    venue: 'Barbican Vaults, Gallery 09',
    dateRange: 'Mar 12 — May 18',
    status: 'FINAL DAYS',
    coordinates: { x: 47, y: 27 },
    note: 'European premiere of the Unblinking Studies',
  },
  {
    id: 'ex-nyc',
    city: 'New York',
    japaneseCity: 'ニューヨーク',
    venue: 'Chelsea Concrete Rotunda',
    dateRange: 'Jun 04 — Aug 22',
    status: 'SOLD OUT',
    coordinates: { x: 26, y: 35 },
    note: 'Midnight viewing hours only',
  },
  {
    id: 'ex-paris',
    city: 'Paris',
    japaneseCity: 'パリ',
    venue: 'Palais des Ombres, Marais',
    dateRange: 'Sep 19 — Nov 30',
    status: 'OPEN',
    coordinates: { x: 49, y: 31 },
    note: 'Includes restored 1996 sketchbook folios',
  },
];

export const PRESS_MASTHEADS = [
  'VOGUE JAPAN',
  'VICE',
  'TOKYO WEEKENDER',
  'THE GUARDIAN',
  'ARTFORUM',
  'FRIEZE',
  'BIJUTSU TECHO',
];

export const PRESS_QUOTES: PressQuote[] = [
  {
    id: 'q1',
    publication: 'The Guardian',
    quote: 'I couldn’t sleep for a week.',
    critic: 'Helena Vance',
    role: 'Chief Visual Arts Critic',
  },
  {
    id: 'q2',
    publication: 'Vice',
    quote: 'Beautiful, unbearable, unforgettable.',
    critic: 'Kenji Takahashi',
    role: 'Tokyo Culture Desk',
  },
  {
    id: 'q3',
    publication: 'Artforum',
    quote: 'The most unsettling art exhibition of the decade.',
    critic: 'Margot Delacroix',
    role: 'Senior Contributing Editor',
  },
  {
    id: 'q4',
    publication: 'Vogue Japan',
    quote: 'Every ink line coils beneath your skin until you carry the gallery home.',
    critic: 'Sora Mizuno',
    role: 'Arts & Literature Editor',
  },
];
