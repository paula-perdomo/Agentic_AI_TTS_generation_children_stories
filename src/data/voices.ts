export interface VoiceProfile {
  id: string;
  name: string;
  characterTitle: string;
  daylightTitle: string;
  pitchRegister: 'High' | 'Medium-High' | 'Soft Medium' | 'Deep Warm';
  genderVibe: 'Gentle Female' | 'Lyrical Female' | 'Playful Youth' | 'Calm Neutral' | 'Cozy Elder' | 'Warm Character';
  timbreDescription: string;
  daylightDescription: string;
  defaultPitch: number; // Bedtime pitch (+2)
  defaultSpeed: number; // Bedtime speed (0.90 - 0.92)
  daylightPitch: number; // Daylight pitch (+2 to +3)
  daylightSpeed: number; // Daylight speed (1.00 - 1.05)
  suitability: string;
  avatarIcon: string;
  samplePhraseEn: string;
  samplePhraseEs: string;
  samplePhraseDaylightEn: string;
  samplePhraseDaylightEs: string;
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
    daylightTitle: 'Sweet Daylight Storyteller',
    pitchRegister: 'High',
    genderVibe: 'Gentle Female',
    timbreDescription: 'Soft, affectionate, and maternal with a comforting higher-pitch register and soothing bedtime cadence.',
    daylightDescription: 'Sweet, bright, and cheerful with a warm higher register, playful curiosity, and breezy morning cadence.',
    defaultPitch: 2,
    defaultSpeed: 0.92,
    daylightPitch: 2,
    daylightSpeed: 1.02,
    suitability: 'Sunny story hour, nursery tales, and sweet everyday adventures (Ages 2-6)',
    avatarIcon: 'Sparkles',
    samplePhraseEn: 'Once upon a quiet star, a tiny silver rabbit blinked into the glowing night.',
    samplePhraseEs: 'Había una vez una estrella silenciosa, donde un conejito de plata parpadeaba en la noche suave.',
    samplePhraseDaylightEn: 'Good morning little sunflower! The bumblebee dusted its yellow boots and buzzed happily into the warm sun.',
    samplePhraseDaylightEs: '¡Buenos días pequeño girasol! La abejita sacudió sus patitas doradas y voló alegremente bajo el sol tibio.',
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
    daylightTitle: 'Luminous Meadow Storyteller',
    pitchRegister: 'High',
    genderVibe: 'Lyrical Female',
    timbreDescription: 'Melodic, luminous, and enchanting with an ethereal, soft higher tone suited for magical kingdoms.',
    daylightDescription: 'Vibrant, lyrical, and sunny with melodious pitch lilts that make gardens and butterflies sparkle.',
    defaultPitch: 3,
    defaultSpeed: 0.95,
    daylightPitch: 3,
    daylightSpeed: 1.04,
    suitability: 'Garden adventures, magical discovery, and joyful poetry (Ages 4-8)',
    avatarIcon: 'Wand2',
    samplePhraseEn: 'Deep in the mossy hollow, the bluebell flower whispered its sweetest secret to the morning dew.',
    samplePhraseEs: 'En lo profundo del bosque verde, la campanilla azul susurró su dulce secreto al rocío de la mañana.',
    samplePhraseDaylightEn: 'The clear river sparkled like thousands of golden diamonds as the dragonflies danced across the morning ripples!',
    samplePhraseDaylightEs: '¡El río claro brillaba como miles de diamantes dorados mientras las libélulas bailaban sobre el agua limpia!',
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
    daylightTitle: 'Sunny Woodland Explorer',
    pitchRegister: 'Medium-High',
    genderVibe: 'Playful Youth',
    timbreDescription: 'Lively, friendly, and cheerful with a crisp higher register that brings inquisitive animals to life.',
    daylightDescription: 'Energetic, cheerful, and bright with an upbeat cadence full of bounce, laughter, and sunny curiosity.',
    defaultPitch: 2,
    defaultSpeed: 1.0,
    daylightPitch: 2,
    daylightSpeed: 1.06,
    suitability: 'Curious animals, playground games, and treasure hunts (Ages 3-9)',
    avatarIcon: 'Feather',
    samplePhraseEn: 'Pip the squirrel twitched his whiskers, took a giant leap, and discovered the golden acorn!',
    samplePhraseEs: '¡Pip la ardillita movió sus bigotes, dio un salto gigante y descubrió la bellota dorada!',
    samplePhraseDaylightEn: 'Look at that! Pip the rabbit did a giant celebratory hop right over the garden fence and laughed out loud!',
    samplePhraseDaylightEs: '¡Miren eso! ¡El conejito Pip dio un salto enorme sobre la cerca del huerto y soltó una carcajada feliz!',
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
    daylightTitle: 'Gentle Warm Morning Breeze',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Calm Neutral',
    timbreDescription: 'Hushed, delicate, and deeply tranquil. Speaks with a gentle breeze-like breathiness that lulls listeners to sleep.',
    daylightDescription: 'Soft, cheerful, and airy like a warm morning breeze fluttering through fresh green leaves.',
    defaultPitch: 1,
    defaultSpeed: 0.88,
    daylightPitch: 1,
    daylightSpeed: 1.00,
    suitability: 'Quiet morning reading, nature walks, and sweet calm stories (All ages)',
    avatarIcon: 'Wind',
    samplePhraseEn: 'The moon pulled a velvet blanket of clouds over the hills, whispering: rest now, little one.',
    samplePhraseEs: 'La luna cubrió las colinas con una manta de nubes suaves, susurrando: descansa ahora, pequeño.',
    samplePhraseDaylightEn: 'The warm morning breeze opened the petals of the wild pink rose and carried sweet vanilla perfume through the woods.',
    samplePhraseDaylightEs: 'La suave brisa de la mañana abrió los pétalos de la rosa silvestre, llevando un aroma dulce por todo el bosque.',
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
    daylightTitle: 'Sunny Grandfather Story Hour',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Cozy Elder',
    timbreDescription: 'Warm, distinguished, and kindly. Like a loving grandfather sitting by a gentle fireplace reading classic lore.',
    daylightDescription: 'Kind, animated, and friendly. Like a grandfather telling exciting sunny stories while sitting on the front porch.',
    defaultPitch: 1,
    defaultSpeed: 0.92,
    daylightPitch: 1,
    daylightSpeed: 1.02,
    suitability: 'Sunny adventures, classic family folklore, and curious animal journeys (Ages 5-10)',
    avatarIcon: 'BookOpen',
    samplePhraseEn: 'Long before the rivers found their names, an old willow tree guarded the dreams of the valley.',
    samplePhraseEs: 'Mucho antes de que los ríos tuvieran nombre, un viejo sauce cuidaba los sueños de todo el valle.',
    samplePhraseDaylightEn: 'All aboard the Sunny Express! The shiny red engine whistled twice, ready to climb the wildflower hills!',
    samplePhraseDaylightEs: '¡Todos a bordo del Expreso del Sol! El tren rojo y brillante silbó dos veces, listo para subir la colina de flores.',
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
    daylightTitle: 'Cheerful Forest Guide',
    pitchRegister: 'Soft Medium',
    genderVibe: 'Warm Character',
    timbreDescription: 'Expressive and grounded with a cozy, friendly character cadence suited for loyal bears and woodland guides.',
    daylightDescription: 'Brimming with sunny enthusiasm, friendly chuckles, and outdoor adventure energy.',
    defaultPitch: 1,
    defaultSpeed: 0.94,
    daylightPitch: 1,
    daylightSpeed: 1.03,
    suitability: 'Forest hikes, sunny picnics, and friendly animal companions (Ages 4-9)',
    avatarIcon: 'Compass',
    samplePhraseEn: 'Barnaby the gentle bear packed three dried berries and tied his snug red woolen scarf.',
    samplePhraseEs: 'Barnaby el oso bondadoso guardó tres bayas secas y se acomodó su suave bufanda roja.',
    samplePhraseDaylightEn: 'Barnaby the bear packed a giant jar of blueberry jam and set off to share pancakes with his woodland pals!',
    samplePhraseDaylightEs: '¡Barnaby el osito guardó un tarro de mermelada y salió corriendo a compartir panqueques con sus amigos!',
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
    daylightTitle: 'Gentle Giant & Clockmaker',
    pitchRegister: 'Deep Warm',
    genderVibe: 'Cozy Elder',
    timbreDescription: 'Deep, serene, and grounding. A patient, protective voice that makes nighttime feel peaceful and secure.',
    daylightDescription: 'Patient, warm, and steady. Like a gentle giant singing cheerful marching tunes while helping little creatures.',
    defaultPitch: 0,
    defaultSpeed: 0.90,
    daylightPitch: 0,
    daylightSpeed: 0.98,
    suitability: 'Curious inventions, steady helpers, and sunny garden building (Ages 5-10)',
    avatarIcon: 'Moon',
    samplePhraseEn: 'The lighthouse beacon turned slowly across the starry bay, tucking every sailing boat into bed.',
    samplePhraseEs: 'El faro giraba despacio sobre la bahía estrellada, arropando a cada velero para la noche.',
    samplePhraseDaylightEn: 'With a great big smile, the gentle giant gently lifted the fallen baby bird back into its cozy sunny nest.',
    samplePhraseDaylightEs: 'Con una gran sonrisa, el gigante bondadoso levantó al pajarito caído y lo colocó de nuevo en su nido soleado.',
    consistencyMetrics: {
      clarity: 96,
      stability: 96,
      warmth: 93,
      overallQuality: 95,
    },
  },
];
