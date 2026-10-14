import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Supported natural-sounding voices for children's stories
export const VALID_VOICES = [
  'Kore',     // Warm, loving, gentle bedtime story voice (higher pitch)
  'Aoede',    // Melodic, lyrical, fairy-tale narrator
  'Puck',     // Playful, lively, friendly storybook character
  'Zephyr',   // Soft, whispery, calm bedtime breeze
  'Achernar', // Resonant, distinguished, grandfatherly tale teller
  'Fenrir',   // Rich, expressive woodland creature voice
  'Charon',   // Deep, gentle giant, thoughtful narrator
] as const;

// 1. Text-to-Speech Endpoint
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, voice = 'Kore', language = 'en', style } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for speech generation.' });
    }

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : 'Kore';

    // Tailor instruction for soft children's book narration with natural, higher pitch
    const isSpanish = language === 'es';
    const langStyle = isSpanish
      ? 'Voz suave, dulce y expresiva de narradora de cuentos infantiles. Tono cálido, amigable, con cadencia rítmica y reconfortante para antes de dormir.'
      : 'Soft, gentle, warm children’s book narrator with a naturally higher pitch, comforting bedtime cadence, and affectionate, clear articulation.';

    const voiceDirective = style ? `${langStyle} ${style}` : langStyle;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: voiceDirective,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice,
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p) => p.inlineData && p.inlineData.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.status(502).json({ error: 'No audio data returned from the speech model.' });
    }

    const audioBase64 = audioPart.inlineData.data;

    res.json({
      audioBase64,
      format: 'audio/wav',
      sampleRate: 24000,
      voice: selectedVoice,
      language,
    });
  } catch (err: any) {
    console.error('TTS Generation Error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate speech. Please try again.',
    });
  }
});

// 2. Agentic Story Director Analysis
app.post('/api/story/analyze', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Story text is required for analysis.' });
    }

    const prompt = `You are a master children's book editor and audio director. Analyze the following short story text for an audiobook narration.
Language: ${language === 'es' ? 'Spanish' : 'English'}
Story:
"""${text.slice(0, 4000)}"""

Analyze the emotional rhythm, bedtime suitability, target age range, and optimal narrator vocal choices.
Return a valid JSON matching this schema.`;

    let parsed: any = null;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Story title or inferred lyrical title' },
              targetAge: { type: Type.STRING, description: 'e.g. Toddlers (2-4), Early Readers (5-7), Storybook (7-9)' },
              tone: { type: Type.STRING, description: 'e.g. Gentle Bedtime Lullaby, Whimsical Adventure, Warm Friendship Tale' },
              moodSummary: { type: Type.STRING, description: 'One sentence describing the emotional arc' },
              pacingSuggestion: { type: Type.STRING, description: 'Director note on pauses, breath, and reading tempo' },
              recommendedVoice: {
                type: Type.STRING,
                description: 'Best matching voice: Kore (warm bedtime), Aoede (fairy tale), Puck (playful), Zephyr (whisper-soft), or Achernar (cozy grandfatherly)',
              },
              recommendedPitchOffset: { type: Type.NUMBER, description: 'Recommended semitone pitch offset from +0 to +4 for children warmth' },
              recommendedSpeed: { type: Type.NUMBER, description: 'Recommended playback speed between 0.85 and 1.1' },
              wordCount: { type: Type.INTEGER, description: 'Total word count' },
              estimatedMinutes: { type: Type.NUMBER, description: 'Estimated spoken duration in minutes' },
              keyHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 key phrases or moments requiring gentle emphasis',
              },
            },
            required: [
              'title',
              'targetAge',
              'tone',
              'moodSummary',
              'pacingSuggestion',
              'recommendedVoice',
              'recommendedPitchOffset',
              'recommendedSpeed',
              'wordCount',
              'estimatedMinutes',
            ],
          },
        },
      });
      parsed = JSON.parse(response.text || '{}');
    } catch (genErr) {
      console.warn('Gemini model high demand, applying intelligent heuristic director analysis:', genErr);
      const words = text.trim().split(/\s+/).length;
      const lower = text.toLowerCase();
      const isBedtime = lower.includes('moon') || lower.includes('luna') || lower.includes('sleep') || lower.includes('dormir') || lower.includes('night') || lower.includes('noche');
      const isAdventure = lower.includes('leap') || lower.includes('jump') || lower.includes('salto') || lower.includes('acorn') || lower.includes('bellota');

      parsed = {
        title: text.split('\n')[0].slice(0, 35).replace(/[#*]/g, '').trim() || (language === 'es' ? 'Cuento Infantil' : 'Children Story'),
        targetAge: words < 120 ? 'Toddlers & Preschool (Ages 2-5)' : 'Early Readers (Ages 5-8)',
        tone: isBedtime
          ? (language === 'es' ? 'Nana Dulce de Buenas Noches' : 'Soothing Bedtime Lullaby')
          : isAdventure
          ? (language === 'es' ? 'Aventura de Amistad y Curiosidad' : 'Whimsical Woodland Adventure')
          : (language === 'es' ? 'Cuento Clásico Tierno' : 'Cozy Picture Book Tale'),
        moodSummary: language === 'es'
          ? 'Una historia entrañable y apacible ideal para relajar a los niños antes de dormir.'
          : 'A comforting, peaceful tale crafted to soothe and spark gentle imagination before bed.',
        pacingSuggestion: language === 'es'
          ? 'Lee a un ritmo pausado (0.90x), haciendo pausas suaves en los puntos suspensivos y bajando el volumen hacia el final.'
          : 'Maintain a measured bedtime cadence (0.92x), letting each gentle sentence breathe before the next.',
        recommendedVoice: isBedtime ? 'Kore' : isAdventure ? 'Puck' : 'Achernar',
        recommendedPitchOffset: 2,
        recommendedSpeed: isBedtime ? 0.90 : 0.95,
        wordCount: words,
        estimatedMinutes: Math.max(0.5, Math.round((words / 125) * 10) / 10),
        keyHighlights: [
          language === 'es' ? 'Pausas suaves al final de cada párrafo' : 'Gentle breath pauses between paragraphs',
          language === 'es' ? 'Tono reconfortante en los diálogos' : 'Warm, affectionate dialogue lilt',
        ],
      };
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Story Analysis Error:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze story.',
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Cadence Audio Studio running on http://localhost:${port}`);
  });
}

startServer();
