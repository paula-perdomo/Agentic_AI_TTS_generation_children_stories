# Cadence — Children's Storybook Audio Studio

Cadence is a gentle, minimalist text-to-speech studio designed specifically for children's short stories, bedtime tales, and picture books. It pairs whimsical stories in English and Spanish with soft, natural higher-pitch narrator voices, allows precision speed and pitch shaping, and exports clean, high-fidelity MP3 audio without background distractions.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions have been tailored to your children's book focus:

- **Target Domain & Mood**: Focused entirely on **children's literature and bedtime stories** (ages 3–5, 6–8, and 9–12). The interface evokes a warm, illustrated storybook with gentle parchment surfaces, soft honey/amber accents, and cozy bedtime reading modes.
- **Vocal Character & Defaults**: Optimized for **soft, natural, higher-pitch narration** with gentle cadences, soothing inflection, and clear articulation. Default voice recommendations prioritize warm, friendly storybook narrators:
  - **Kore**: Warm, caring bedtime story reader with a gentle, soothing higher pitch.
  - **Aoede**: Melodic, fairy-tale narrator with luminous, soft vocal tones.
  - **Puck**: Playful, animated, and friendly higher-register storybook voice.
  - **Zephyr**: Soft, quiet whisper-soft narrator ideal for sleepy lullaby stories.
  - **Achernar**: Gentle, cozy grandfatherly storyteller (softened and pitched up for warmth).
  - **Charon & Fenrir**: Available for gentle giant or wise woodland creature character reads.
- **Audio Delivery & Pacing**: The Story Director agent applies soft children's storytelling pacing prompts: gentle pauses at punctuation, expressive lilt without harshness, and natural warmth.
- **Audio Output**: 100% pure voice narration (no background music or sound effects).
- **Universal MP3 Export**: Prominent, high-contrast **"Download MP3"** button that bakes speed (0.5x–2.0x) and pitch adjustments into standard MPEG-1 Layer 3 files playable on any device, toniebox, or nursery audio player.
- **Voice Testing & Consistency**: Bilingual children's book test suite (rhymes, bedtime rhythms, playful character dialogue, and pronunciation stress tests in English and Spanish).

---

### 1. Overview & Core Concept

- **What It Does**: Authors and parents can draft, paste, or pick from classic children's tales in English or Spanish, have the **Storybook Director Agent** analyze reading age and rhythm, audition soft higher-pitch voices with live speed/pitch sliders, and download pristine MP3 storybooks in seconds.
- **Target Audience**: Children's book authors, bedtime storytellers, bilingual educators, and parents creating personalized audiobooks for young listeners.
- **Key Value**: Delivers the warm, comforting human touch of a bedtime story reading—free from cold robotic tones, harsh volume spikes, or jarring background noises.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Storybook Manuscript & Bedtime Focus Mode**:
   - Warm, storybook-inspired split view (manuscript reader on the left, voice casting desk on the right).
   - "Bedtime Focus Mode" dims the room to a soothing, distraction-free reading experience with enlarged, high-legibility storybook typography and synchronized word/paragraph illumination.
   - Quick bilingual switcher (`English` / `Español`) with preloaded children's tales (e.g. *The Little Cloud Who Wanted to Glow* / *La Nubecita que Quería Brillar*, *The Forest Clockmaker* / *El Relojero del Bosque*).
2. **Storybook Director Agent**:
   - Analyzes children's vocabulary level (e.g., Early Reader ages 3–5, Picture Book ages 6–8), detects emotional cues (wonder, excitement, sleepy calm), and suggests ideal gentle voice and higher-pitch offsets (+2 to +4 semitones).
3. **Audition Studio & Children's Consistency Benchmarks**:
   - Curated test passages tailored for young ears:
     - *Bedtime Cadence*: Soothing, rhythmic lullaby phrasing.
     - *Character Expressions*: Gentle smiles, soft gasps, and curious animal questions.
     - *Bilingual Articulation*: Spanish trills and soft English vowels.
   - Consistency rating measuring vocal warmth stability, breath softness, and pace regularity.
4. **Synthesis & Clear MP3 Download**:
   - Single-click narration synthesis via `gemini-3.8-flash-lite-tts` with specialized soft children's speech instructions.
   - Prominent, inviting **"Download MP3"** button formatted for universal playback on nursery speakers, tablets, and car rides.

#### Visual Identity & Theme Tokens
- **Aesthetic Direction**: Illustrated children's book editorial; warm paper textures, gentle rounded radii, organic book flourishes, zero synthetic neon or clinical dashboard clutter.
- **Color Palette & Distribution**:
  - *60% Neutral Canvas*: Warm clotted-cream and milk-paper (`#FDFBF7` day reading, `#1E1B18` night bedtime reading).
  - *30% Structural Surfaces*: Soft oatmeal card surfaces (`#F7F3EC` / `#282420`), warm hairline book borders (`rgba(90, 70, 50, 0.12)`), cozy sepia-espresso typography (`#2D241E` / `#EFE9DF`).
  - *10% Focal Accent*: Warm amber honey & soft terracotta (`#C86D3B` / `#E58A54`) for interactive playheads, active sliders, and the primary "Download MP3" button.
- **Typography Pairing**:
  - *Story Headlines*: `Fraunces` (warm, softly rounded editorial serif).
  - *Body Prose & Story Reader*: `Plus Jakarta Sans` / `Outfit` (approachable, friendly, highly legible geometric letterforms).
  - *Metrics & Durations*: Tabular numbers (`tabular-nums font-mono text-xs`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Soft Higher-Pitch Narration Presets by Default**
  - *Chosen Approach*: Voice configurations include soft children's book speech prompts (`"Soft, gentle, warm children's book narrator with a friendly higher-register tone and soothing cadence"`) and pitch adjustments default to slightly higher registers (+1.5 to +3 semitones) favored in early childhood development.
  - *Why*: Research in child language acquisition shows young listeners respond best to slightly higher, rhythmic, warm "parentese" tones.
- **Decision 2: Universal MP3 Format & Standalone Device Readiness**
  - *Chosen Approach*: Pure JavaScript MP3 encoding (`lamejs`) that embeds user-tuned pitch and speed modifications into standard MPEG-1 Layer 3 audio frames (44.1kHz/24kHz, 128kbps, clean ID3 title metadata).
  - *Why*: Parents frequently transfer bedtime audio files to nursery audio players (e.g. Yoto, Toniebox, MP3 USB players) that reject uncompressed WAV files.
- **Decision 3: Dedicated Children's Consistency Testing Suite**
  - *Chosen Approach*: Provide 4 bilingual storybook benchmark categories (Lullaby Cadence, Storybook Wonder, Playful Animal Dialogue, Rhyme & Pronunciation) with consistency scoring across all 7 voices.
  - *Why*: Guarantees that the chosen voice remains gentle and soothing across every chapter.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Cadence Studio Frontend                         │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Storybook Workshop    │  │ Children's Voice Audition & Benchmarks│  │
│  │ • Children's Editor   │  │ • 7 Narrator Profiles (Kore, Aoede,   │  │
│  │ • Bilingual Switcher  │  │   Puck, Zephyr, Achernar, etc.)       │  │
│  │ • Bedtime Focus Mode  │  │ • Soft Higher-Pitch Defaults          │  │
│  │ • Target Age Metrics  │  │ • Storybook Cadence Consistency Tests │  │
│  └───────────┬───────────┘  └───────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  Children's Audio Engine & Player                │  │
│  │ • Real-time Web Audio Pitch & Speed Transformation Engine        │  │
│  │ • OfflineAudioContext Pitch & Speed Rendering Pipeline           │  │
│  │ • Universal MPEG-1 Layer 3 MP3 Encoder (`lamejs`)                │  │
│  │ • Prominent 'Download MP3' Export Controller                     │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ REST / JSON
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express / Vite Server Layer                       │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │   POST /api/tts/generate      │  │    POST /api/story/analyze    │  │
│  │ • Gemini 3.8 Flash Lite TTS   │  │ • Gemini 3.8 Flash Analysis   │  │
│  │ • Soft Children's Voice Direct│  │ • Reading Age & Tone Analysis │  │
│  │ • Returns WAV Base64 & Timing │  │ • Pacing & Breath Guidance    │  │
│  └───────────────┬───────────────┘  └───────────────┬───────────────┘  │
└──────────────────┼──────────────────────────────────┼──────────────────┘
                   ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Google GenAI SDK (Server)                        │
│                 models: gemini-3.8-flash-lite-tts & 3.8-flash          │
└────────────────────────────────────────────────────────────────────────┘
```

#### API Endpoints & Contract
1. `POST /api/tts/generate`:
   - Payload: `{ text: string, voice: string, language: 'en' | 'es', style?: string, targetAudience?: 'children', speed?: number, pitch?: number }`
   - Response: `{ audioBase64: string, format: "audio/wav", sampleRate: 24000, durationSec: number }`
2. `POST /api/story/analyze`:
   - Payload: `{ text: string, language: 'en' | 'es', isChildrenStory?: boolean }`
   - Response: `{ tone: string, targetAge: string, pacingSuggestion: string, recommendedVoice: string, recommendedPitch: number, wordCount: number, estMinutes: number }`

---

### Implementation Phases (Upon Approval)
1. **Server & Gemini TTS Integration**: Setup `/api/tts/generate` with soft children's book prompts and `/api/story/analyze` using `@google/genai`.
2. **Audio Processing & MP3 Pipeline**: Implement pure-JS `lamejs` MP3 encoding with Web Audio speed/pitch offline rendering for clean universal downloads.
3. **Storybook Editorial UI & Bedtime Focus**: Build the warm illustrated manuscript view, bedtime focus mode, and children's voice selector featuring Achernar, Kore, Aoede, and Puck.
4. **Voice Audition & Consistency Suite**: Implement the benchmark testing interface with bilingual children's story test suites and consistency scoring.
5. **Verification & Polish**: Test English and Spanish story audio generation, speed/pitch adjustment, standard MP3 download, and layout integrity across devices.
