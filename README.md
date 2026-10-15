# Cadence — Children's Story Audio Studio 📖✨

> An agentic text-to-speech studio and audio director for children's stories, fairy tales, and bedtime fables, powered by Google Gemini TTS and Web Audio API.

---

## 🌟 Overview

**Cadence** is a specialized audio production suite designed specifically for parents, authors, educators, and creators of children's audiobooks. Unlike generic text-to-speech tools, Cadence is tuned specifically for the emotional pacing, soothing cadence, and melodic warmth needed for young listeners.

It features dual storytelling atmospheres (**Sweet Daylight** vs. **Bedtime Lullaby**), pre-curated natural voices, agentic script analysis with director suggestions, batch story generation with instant cancellation controls, bulk voice management, and exportable MP3 audio files.

---

## ✨ Key Features

### 🎙️ Children's Story Voice Ensemble
Curated natural voice profiles with gentle timbre, higher pitch registers, and friendly delivery:
- **Kore**: Warm, loving bedtime storyteller & sweet daylight companion (maternal, comforting).
- **Aoede**: Melodic, lyrical fairy-tale reader with an enchanting, luminous tone.
- **Puck**: Playful, lively, friendly storybook character full of curiosity.
- **Zephyr**: Soft, whispery, calm bedtime breeze for deep relaxation and toddlers.
- **Achernar**: Resonant, distinguished, cozy grandfatherly tale-teller.
- **Fenrir**: Rich, expressive woodland creature and fable narrator.
- **Charon**: Deep, gentle giant, thoughtful and reassuring guide.

### ☀️ Dual Reading Atmospheres
Toggle instantly between two distinct acoustic styles:
- **Sweet Daylight Mode**: Cheerful, sunny, natural flowing pace with upbeat pitch and lively articulation for daytime story hour.
- **Bedtime Mode**: Slow, warm, soothing lullaby cadence with dimmed bedtime dark mode, relaxed pauses, and calming tones.
- Voice samples in the **Audition Suite** automatically adapt their demonstration phrases to the selected atmosphere.

### 🤖 Agentic Story Director (Powered by Gemini)
- Analyzes any story script in **English** or **Spanish**.
- Evaluates emotional rhythm, target age suitability (e.g. *Toddlers 2–4*, *Early Readers 5–7*), and mood arc.
- Automatically suggests optimal vocal timbre, recommended pitch offset (+0 to +4 semitones), and reading speed (0.85x to 1.1x).
- Provides director notes highlighting key sentences that need gentle emphasis or breathing room.

### 📚 Batch Story Management & Queue Controls
- **Batch Import**: Paste multiple stories at once (separated by titles, numbers, or custom delimiters) with automatic language detection.
- **Generate All Pending**: Batch process your entire story queue in one click.
- **Instant Process Cancellation**: A dedicated **Stop / Detener** button and live status banner let you cleanly halt batch generation at any point via `AbortController` without losing finished audio.
- **Bulk Voice Selection**: Change the narrator voice for all stories at once from the collection toolbar, while still keeping individual dropdowns to customize any specific story.

### 🎛️ Real-Time Audio Engine & MP3 Export
- **Precision Web Audio Player**: Real-time speed adjustment, pitch modification, interactive scrubbing, and elapsed/remaining timers.
- **Waveform & Progress Tracking**: Visual playback feedback synced directly with Web Audio nodes.
- **Lossless MP3 Export**: Converts raw audio buffers into standard `.mp3` files in the browser using `@breezystack/lamejs` for offline listening on any device or storybox.

### 🔍 Focus Reader Mode
- Distraction-free, full-screen reading experience with large, kid-friendly typography and floating playback controls.

### 🌐 Bilingual (English & Spanish)
- Seamless one-click toggle between English and Spanish for interface text, sample stories, voice auditions, and Gemini director prompts.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom storybook themes (Warm Cream daylight & Deep Indigo bedtime)
- **Audio Processing**: Web Audio API (`AudioContext`, `AudioBufferSourceNode`) and `@breezystack/lamejs` for client-side MP3 encoding
- **Icons & Motion**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **Backend & Proxy**: [Express](https://expressjs.com/) with `tsx`
- **AI Models**:
  - `gemini-3.8-flash-lite-tts`: Real-time high-fidelity speech synthesis with custom voice directives and speech metadata.
  - `gemini-3.8-flash`: Structured story analysis, age-range detection, and director recommendations.
- **SDK**: `@google/genai` (official Google GenAI SDK)

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** v18 or higher (Node 20+ recommended)
- **npm**, **pnpm**, or **bun**
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd cadence-audio-studio
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Open `.env` and set your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

> **Note**: In Google AI Studio Build, the `GEMINI_API_KEY` is securely injected into the runtime automatically.

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```text
├── server.ts                   # Express server: Gemini TTS and story analysis endpoints + Vite middleware
├── index.html                  # HTML entry point with storybook fonts & metadata
├── vite.config.ts              # Vite configuration
├── package.json                # Project dependencies and npm scripts
├── src/
│   ├── main.tsx                # React application entry point
│   ├── App.tsx                 # Main application state, audio playback coordinator & batch queue
│   ├── index.css               # Global styles and Tailwind imports
│   ├── components/
│   │   ├── Header.tsx          # Navigation, atmosphere toggle, and MP3 download trigger
│   │   ├── StoryEditor.tsx     # Text editor, director analysis card, and single-story generator
│   │   ├── StoryCollection.tsx # Stories list, bulk voice selector, batch generation & stop button
│   │   ├── AuditionSuite.tsx   # Voice audition samples, quality metrics, and test phrases
│   │   ├── AudioPlayerBar.tsx  # Sticky audio bar with scrubber, speed controls, and volume
│   │   ├── BatchImportModal.tsx# Multi-story parser and bulk import dialogue
│   │   ├── FocusReaderModal.tsx# Immersive reader modal for bedtime storytelling
│   │   └── VoiceSelector.tsx   # Voice card picker with character tags and timbre descriptions
│   ├── data/
│   │   ├── voices.ts           # Voice profiles, daytime/nighttime sample texts & metrics
│   │   ├── stories.ts          # Default sample stories (English & Spanish, daylight & bedtime)
│   │   └── benchmarks.ts       # Audio benchmark test scripts (tongue twisters, soothing lullabies)
│   └── utils/
│       └── audioProcessor.ts   # Web Audio buffer decoding, WAV synthesis, and MP3 conversion
```

---

## 📡 API Endpoints

### `POST /api/tts/generate`
Generates natural children's voice audio using `gemini-3.8-flash-lite-tts`.
- **Request Body**:
  ```json
  {
    "text": "Once upon a time in a whispering forest...",
    "voice": "Kore",
    "language": "en",
    "mode": "bedtime",
    "style": "Optional custom vocal styling directive"
  }
  ```
- **Response**:
  ```json
  {
    "audioBase64": "<base64_encoded_pcm_or_wav>",
    "format": "audio/wav",
    "sampleRate": 24000,
    "voice": "Kore",
    "language": "en"
  }
  ```

### `POST /api/story/analyze`
Directorial analysis of the story using `gemini-3.8-flash` returning structured guidance.
- **Request Body**:
  ```json
  {
    "text": "Story body text...",
    "language": "en"
  }
  ```
- **Response**: Returns recommended voice, speed, pitch offset, target age group, pacing tips, and mood summary.

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Runs the full-stack server and Vite development bundler on port 3000 |
| `npm run build` | Compiles the client frontend into the `dist/` directory |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run start` | Launches the production Express server |
| `npm run clean` | Cleans previous build artifacts |

---

## 💡 Frequently Asked Questions

#### Q: Can I run voice models like Achernar completely offline on my computer without using API tokens?
**A:** The Google Gemini voices (Kore, Aoede, Puck, Zephyr, Achernar, Fenrir, Charon) are hosted cloud neural models accessed through the Gemini TTS API. If you need 100% offline local generation without consuming API quota, you can run open-weights local TTS engines (such as [Piper TTS](https://github.com/rhasspy/piper), [Kokoro TTS](https://github.com/hexgrad/kokoro), or [ChatTTS](https://github.com/2noise/ChatTTS)) locally and point an API proxy to them.

#### Q: How do I change the API key?
**A:** When running locally, set `GEMINI_API_KEY="your_key"` in your `.env` file. In Google AI Studio, configure the key in the **Secrets** panel.

---

## 📄 License
MIT License. Created with Google AI Studio.
