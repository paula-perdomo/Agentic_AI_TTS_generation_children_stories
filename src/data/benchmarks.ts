export interface BenchmarkTest {
  id: string;
  name: string;
  description: string;
  category: 'Cadence' | 'Pitch Lilt' | 'Dialogue' | 'Phonetics';
  testPhraseEn: string;
  testPhraseEs: string;
  verificationFocus: string;
  optimalVoiceHint: string;
}

export const BENCHMARK_TESTS: BenchmarkTest[] = [
  {
    id: 'lullaby-cadence',
    name: 'Bedtime Lullaby & Gentle Breath Cadence',
    category: 'Cadence',
    description: 'Tests rhythmic pacing, soft punctuation pauses, and soothing breath cadence for bedtime listening.',
    testPhraseEn: 'Close your eyes, little starlight. The moon is singing a quiet lullaby, and the night is soft and still.',
    testPhraseEs: 'Cierra tus ojitos, pequeña estrella. La luna canta una suave canción de cuna, y la noche descansa en paz.',
    verificationFocus: 'Verifies gentle fading volume at sentence ends, absence of harsh plosive bursts, and fluid cadence.',
    optimalVoiceHint: 'Recommended: Kore or Zephyr at 0.90x speed with +2 semitones.',
  },
  {
    id: 'storybook-wonder',
    name: 'Storybook Wonder & Higher-Pitch Lilt',
    category: 'Pitch Lilt',
    description: 'Evaluates vocal inflection and natural higher-pitch brightness when expressing gentle surprise and wonder.',
    testPhraseEn: 'Look! Can you see the glowing firefly dancing over the enchanted lily pond? It sparkles like magic!',
    testPhraseEs: '¡Mira! ¿Puedes ver a la luciérnaga dorada bailando sobre el estanque encantado? ¡Brilla como pura magia!',
    verificationFocus: 'Tests upward pitch melody without shrillness or synthetic distortion; checks warmth retention in higher registers.',
    optimalVoiceHint: 'Recommended: Aoede or Puck with +2 to +3 semitones.',
  },
  {
    id: 'character-dialogue',
    name: 'Inquisitive Animal Dialogue',
    category: 'Dialogue',
    description: 'Checks clarity and friendly personification during direct speech and quotation transitions.',
    testPhraseEn: '"Wait for me!" squeaked Barnaby the mouse. "I have two warm blueberries tucked safely in my pocket!"',
    testPhraseEs: '—¡Espérame! —chilló Barnaby el ratoncito—. ¡Traigo dos arándanos dulces bien guardados en mi bolsillo!',
    verificationFocus: 'Ensures quotation marks and dash pauses sound organic, distinct from narrator exposition.',
    optimalVoiceHint: 'Recommended: Puck or Fenrir at 1.0x speed.',
  },
  {
    id: 'bilingual-phonetics',
    name: 'Bilingual Consonant & Vowel Articulation',
    category: 'Phonetics',
    description: 'Stress-tests complex consonant clusters, soft Spanish vowels, and tongue-twister syllables.',
    testPhraseEn: 'Seven sleepy silvery snails slowly slid across the soft mossy stone under the sparkling stars.',
    testPhraseEs: 'Tres tiernos tigres pequeños tomaban leche tibia en un tazón de porcelana blanca bajo la luna.',
    verificationFocus: 'Examines sibilant clarity (/s/, /sh/, Spanish /r/ and /ll/), ensuring zero digital muffled artifacts.',
    optimalVoiceHint: 'Recommended: Kore, Aoede, or Achernar.',
  },
];
