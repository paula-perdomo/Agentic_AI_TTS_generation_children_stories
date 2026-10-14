export interface VoiceProfile {
  id: string;
  name: string;
  characterTitle: string;
  pitchRegister: 'High' | 'Medium-High' | 'Soft Medium' | 'Deep Warm';
  genderVibe: 'Gentle Female' | 'Lyrical Female' | 'Playful Youth' | 'Calm Neutral' | 'Cozy Elder' | 'Warm Character';
  timbreDescription: string;
  defaultPitch: number; // Semitones (-6 to +6)
  defaultSpeed: number; // 0.7 to 1.5
  suitability: string;
  avatarIcon: string;
  samplePhraseEn: string;
  samplePhraseEs: string;
  consistencyMetrics: {
    clarity: number;       // %
    stability: number;     // %
    warmth: number;        // %
    overallQuality: number;// %
  };
}

export const VOICES: VoiceProfile[] = [
  {
    id: 'Kore',
    name: 'Kore',
    characterTitle: 'Warm Bedtime Storyteller',
    pitchRegister: 'High',
    genderVibe: 'Gentle Female',
    timbreDescription: 'Soft, affectionate, and maternal with a comforting higher-pitch register and soothing bedtime cadence.',
    defaultPitch: 2,
    defaultSpeed: 0.92,
    suitability: 'Bedtime lullabies, toddler tales, and gentle bedtime comfort (Ages 2-6)',
    avatarIcon: 'Sparkles',
    samplePhraseEn: 'Once upon a quiet star, a tiny silver rabbit blinked into the glowing night.',
    samplePhraseEs: 'Había una vez una estrella silenciosa, donde un conejito de plata parpadeaba en la noche suave.',
    consistencyMetrics: {
      clarity: 98,
      stability: 96,
      warmth: 99,
      overallQuality: 98,
    },
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    characterTitle: 'Fairy-Tale Lyrical Reader',
    pitchRegister: 'High',
    genderVibe: 'Lyrical Female',
    timbreDescription: 'Melodic, luminous, and enchanting with an ethereal, soft higher tone suited for magical kingdoms.',
    defaultPitch: 3,
    defaultSpeed: 0.95,
    suitability: 'Enchanted forests, magical fables, and gentle verse (Ages 4-8)',
    avatarIcon: 'Wand2',
    samplePhraseEn: 'Deep in the mossy hollow, the bluebell flower whispered its sweetest secret to the morning dew.',
    samplePhraseEs: 'En lo profundo del bosque verde, la campanilla azul susurró su dulce secreto al rocío de la mañana.',
    consistencyMetrics: {
      clarity: 97,
      stability: 95,
      warmth: 97,
      overallQuality: 96,
    },
  },
  {
    id: 'Puck',
    name: 'Puck',
    characterTitle: 'Playful Storybook Sprite',
    pitchRegister: 'Medium-High',
    genderVibe: 'Playful Youth',
    timbreDescription: 'Lively, friendly, and cheerful with a crisp higher register that brings inquisitive animals to life.',
    defaultPitch: 2,
    defaultSpeed: 1.0,
    suitability: 'Curious animals, daylight adventures, and riddle journeys (Ages 4-9)',
    avatarIcon: 'Feather',
    samplePhraseEn: 'Pip the squirrel twitched his whiskers, took a giant leap, and discovered the golden acorn!',
    samplePhraseEs: '¡Pip la ardillita movió sus bigotes, dio un salto gigante y descubrió la bellota dorada!',
    consistencyMetrics: {
      clarity: 96,
      stability: 94,
      warmth: 95,
      overallQuality: 95,
    },
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    characterTitle: 'Whisper-Soft Breeze',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Calm Neutral',
    timbreDescription: 'Hushed, delicate, and deeply tranquil. Speaks with a gentle breeze-like breathiness that lulls listeners to sleep.',
    defaultPitch: 1,
    defaultSpeed: 0.88,
    suitability: 'Deep sleep, quiet afternoon naps, and mindful bedtime stories (All ages)',
    avatarIcon: 'Wind',
    samplePhraseEn: 'The moon pulled a velvet blanket of clouds over the hills, whispering: rest now, little one.',
    samplePhraseEs: 'La luna cubrió las colinas con una manta de nubes suaves, susurrando: descansa ahora, pequeño.',
    consistencyMetrics: {
      clarity: 95,
      stability: 97,
      warmth: 98,
      overallQuality: 97,
    },
  },
  {
    id: 'Achernar',
    name: 'Achernar',
    characterTitle: 'Cozy Grandfatherly Tale Teller',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Cozy Elder',
    timbreDescription: 'Warm, distinguished, and kindly. Like a loving grandfather sitting by a gentle fireplace reading classic lore.',
    defaultPitch: 1,
    defaultSpeed: 0.92,
    suitability: 'Classic folktales, wise forest guides, and fireside bedtime stories (Ages 5-10)',
    avatarIcon: 'BookOpen',
    samplePhraseEn: 'Long before the rivers found their names, an old willow tree guarded the dreams of the valley.',
    samplePhraseEs: 'Mucho antes de que los ríos tuvieran nombre, un viejo sauce cuidaba los sueños de todo el valle.',
    consistencyMetrics: {
      clarity: 98,
      stability: 98,
      warmth: 96,
      overallQuality: 97,
    },
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    characterTitle: 'Friendly Woodland Creature',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Warm Character',
    timbreDescription: 'Expressive and grounded with a cozy, friendly character cadence suited for loyal bears and woodland guides.',
    defaultPitch: 1,
    defaultSpeed: 0.94,
    suitability: 'Friendly forest beasts, autumn journeys, and animal companions (Ages 4-9)',
    avatarIcon: 'Compass',
    samplePhraseEn: 'Barnaby the gentle bear packed three dried berries and tied his snug red woolen scarf.',
    samplePhraseEs: 'Barnaby el oso bondadoso guardó tres bayas secas y se acomodó su suave bufanda roja.',
    consistencyMetrics: {
      clarity: 94,
      stability: 95,
      warmth: 94,
      overallQuality: 94,
    },
  },
  {
    id: 'Charon',
    name: 'Charon',
    characterTitle: 'Gentle Giant / Night Watch',
    pitchRegister: 'Deep Warm',
    genderVibe: 'Cozy Elder',
    timbreDescription: 'Deep, serene, and grounding. A patient, protective voice that makes nighttime feel peaceful and secure.',
    defaultPitch: 0,
    defaultSpeed: 0.90,
    suitability: 'Stargazer stories, soothing reassuring reads, and sleepy giants (Ages 5-10)',
    avatarIcon: 'Moon',
    samplePhraseEn: 'The lighthouse beacon turned slowly across the starry bay, tucking every sailing boat into bed.',
    samplePhraseEs: 'El faro giraba despacio sobre la bahía estrellada, arropando a cada velero para la noche.',
    consistencyMetrics: {
      clarity: 96,
      stability: 96,
      warmth: 93,
      overallQuality: 95,
    },
  },
];
