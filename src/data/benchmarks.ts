export interface BenchmarkTest {
  id: string;
  name: string;
  description: string;
  category: 'Cadence' | 'Pitch Lilt' | 'Dialogue' | 'Phonetics';
  testPhraseEn: string;
  testPhraseEs: string;
  testPhraseDaylightEn: string;
  testPhraseDaylightEs: string;
  verificationFocus: string;
  optimalVoiceHint: string;
  optimalVoiceDaylightHint: string;
}

export const BENCHMARK_TESTS: BenchmarkTest[] = [
  {
    id: 'lullaby-cadence',
    name: 'Bedtime Lullaby vs Sunny Morning Cadence',
    category: 'Cadence',
    description: 'Compares gentle sleepy bedtime breathing against brisk, cheerful morning storytelling tempo.',
    testPhraseEn: 'Close your eyes, little starlight. The moon is singing a quiet lullaby, and the night is soft and still.',
    testPhraseEs: 'Cierra tus ojitos, pequeña estrella. La luna canta una suave canción de cuna, y la noche descansa en paz.',
    testPhraseDaylightEn: 'Wake up, little forest! The golden sunshine is tickling the treetops, and the birds are singing their morning song!',
    testPhraseDaylightEs: '¡Despierta, bosque lindo! El sol dorado acaricia las copas de los árboles, ¡y los pajaritos cantan su canción de la mañana!',
    verificationFocus: 'Verifies natural flowing tempo without sluggishness in daylight, and soothing relaxation in bedtime.',
    optimalVoiceHint: 'Bedtime: Kore or Zephyr (0.90x).',
    optimalVoiceDaylightHint: 'Daylight: Kore or Aoede (1.02x).',
  },
  {
    id: 'storybook-wonder',
    name: 'Storybook Wonder & Higher-Pitch Lilt',
    category: 'Pitch Lilt',
    description: 'Evaluates vocal inflection and natural higher-pitch brightness when expressing gentle surprise and wonder.',
    testPhraseEn: 'Look! Can you see the glowing firefly dancing over the enchanted lily pond? It sparkles like magic!',
    testPhraseEs: '¡Mira! ¿Puedes ver a la luciérnaga dorada bailando sobre el estanque encantado? ¡Brilla como pura magia!',
    testPhraseDaylightEn: 'Look up! A rainbow of bright yellow butterflies just floated right over our picnic basket!',
    testPhraseDaylightEs: '¡Mira arriba! ¡Una bandada de mariposas amarillas acaba de volar sobre nuestra cesta de merienda!',
    verificationFocus: 'Tests upward pitch melody without shrillness; checks warmth and sweet natural vitality in higher registers.',
    optimalVoiceHint: 'Bedtime: Aoede or Puck with +2 st.',
    optimalVoiceDaylightHint: 'Daylight: Aoede or Puck with +2 to +3 st.',
  },
  {
    id: 'character-dialogue',
    name: 'Inquisitive Animal Dialogue',
    category: 'Dialogue',
    description: 'Checks clarity and friendly personification during direct speech and quotation transitions.',
    testPhraseEn: '"Wait for me!" squeaked Barnaby the mouse. "I have two warm blueberries tucked safely in my pocket!"',
    testPhraseEs: '—¡Espérame! —chilló Barnaby el ratoncito—. ¡Traigo dos arándanos dulces bien guardados en mi bolsillo!',
    testPhraseDaylightEn: '"Hooray!" cheered Oliver the squirrel. "The strawberries are sweet, ripe, and ready for our sunny feast!"',
    testPhraseDaylightEs: '—¡Viva! —festejó Oliver la ardillita—. ¡Las fresas están dulces, maduras y listas para nuestra fiesta al sol!',
    verificationFocus: 'Ensures quotation marks and dash pauses sound organic and cheerful, distinct from narrator exposition.',
    optimalVoiceHint: 'Bedtime: Puck or Fenrir at 0.95x.',
    optimalVoiceDaylightHint: 'Daylight: Puck or Fenrir at 1.05x.',
  },
  {
    id: 'bilingual-phonetics',
    name: 'Bilingual Consonant & Vowel Articulation',
    category: 'Phonetics',
    description: 'Stress-tests complex consonant clusters, soft Spanish vowels, and tongue-twister syllables.',
    testPhraseEn: 'Seven sleepy silvery snails slowly slid across the soft mossy stone under the sparkling stars.',
    testPhraseEs: 'Tres tiernos tigres pequeños tomaban leche tibia en un tazón de porcelana blanca bajo la luna.',
    testPhraseDaylightEn: 'Six sunny sparrows swiftly soared through the sparkling morning sky, singing sweet summer melodies.',
    testPhraseDaylightEs: 'Seis alegres golondrinas subían y bajaban por el cielo claro, cantando dulces canciones de verano.',
    verificationFocus: 'Examines sibilant clarity (/s/, /sh/, Spanish /r/ and /ll/), ensuring zero digital muffled artifacts.',
    optimalVoiceHint: 'Bedtime: Kore or Achernar.',
    optimalVoiceDaylightHint: 'Daylight: Kore, Aoede, or Achernar.',
  },
];
