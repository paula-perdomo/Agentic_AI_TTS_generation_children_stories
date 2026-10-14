export interface StorySample {
  id: string;
  title: string;
  language: 'en' | 'es';
  targetAge: string;
  recommendedVoice: string;
  recommendedPitch: number;
  recommendedSpeed: number;
  synopsis: string;
  text: string;
}

export const PRELOADED_STORIES: StorySample[] = [
  {
    id: 'little-cloud-en',
    title: 'The Little Cloud Who Wanted to Glow',
    language: 'en',
    targetAge: 'Ages 3-6 (Bedtime Story)',
    recommendedVoice: 'Kore',
    recommendedPitch: 2,
    recommendedSpeed: 0.92,
    synopsis: 'A tiny pink cloud drifts across the sunset sky wondering how stars shine, and discovers its own gentle silver lining.',
    text: `High above the sleepy sleepy hills, there floated a very little cloud named Nori.

While the big thunderclouds grumbled and practiced their stormy drums, Nori liked to drift quietly beside the warm lavender sunset. 

"Little stars," Nori whispered softly as the twilight arrived, "how do you twinkle so brightly without any batteries at all?"

An old grandmother star with silver eyelashes smiled down through the dusk. "We do not try to be loud, little Nori. When the world grows quiet, we simply let our peaceful hearts shine."

Nori took a deep, slow breath of cool night air. Gently, slowly, Nori tucked under a silvery crescent moon. And right as the sleepy crickets began their lullaby, Nori began to glow—a soft, honey-gold glow that whispered: sweet dreams, little world. Sleep tight.`,
  },
  {
    id: 'barnaby-bear-en',
    title: 'Barnaby Bear and the Whispering Acorn',
    language: 'en',
    targetAge: 'Ages 4-8 (Whimsical Fable)',
    recommendedVoice: 'Puck',
    recommendedPitch: 2,
    recommendedSpeed: 0.96,
    synopsis: 'A small cheerful bear finds an acorn that tells miniature jokes to woodland creatures.',
    text: `Barnaby was not a roaring bear. He was a muffin-eating, scarf-wearing bear who lived inside a hollow oak tree by the babbling brook.

One crisp autumn morning, Barnaby was looking for crunchy leaves when he heard the tiniest sneeze.

"Achoo!" went the moss near his furry toes.

Barnaby bent down, his nose wiggling. Sitting in a cup of golden moss was a shiny little acorn wearing a knitted cap.

"Pardon me," said the acorn in a cheerful squeak. "I am Oliver. And I know the most wonderful secret in the entire Whispering Wood."

"What is it, Oliver?" asked Barnaby, sitting down with a soft thump.

"If you hug the tallest pine tree and listen very carefully," Oliver giggled, "you will hear the pinecones practicing their autumn choir."

Barnaby smiled from ear to furry ear. He carefully placed Oliver in his pocket and skipped down the cobblestone trail to find the singing trees.`,
  },
  {
    id: 'willow-tree-en',
    title: 'The Great Willow of Starlight Valley',
    language: 'en',
    targetAge: 'Ages 5-9 (Classic Folklore)',
    recommendedVoice: 'Achernar',
    recommendedPitch: 1,
    recommendedSpeed: 0.92,
    synopsis: 'A comforting, grandfatherly tale about the oldest tree in the valley watching over sleepy forest animals.',
    text: `Before the winding river ever found its way to the great ocean, there stood an ancient willow tree in the heart of the valley.

Her leaves were as green as emeralds by day, and by night, they caught the silver starlight and held it close. Every evening, the forest creatures gathered beneath her sweeping branches.

The hedgehog curled into a warm ball among the roots. The field mice tucked their paws beneath their chins. And the barn owl settled quietly upon the highest bough.

"Tell us of tomorrow, Grandmother Willow," the tiny dormouse whispered.

The great tree rustled with a sound like warm tea poured into a ceramic cup. "Tomorrow holds warm sunlight, sweet blackberries, and the laughter of friends. But tonight," she murmured softly, "tonight is for resting. Close your eyes, dear valley. I will watch over you until dawn."`,
  },
  {
    id: 'nubecita-brillar-es',
    title: 'La Nubecita que Quería Brillar',
    language: 'es',
    targetAge: '3 a 6 años (Cuento para Dormir)',
    recommendedVoice: 'Kore',
    recommendedPitch: 2,
    recommendedSpeed: 0.90,
    synopsis: 'Una pequeña nube rosada busca la manera de iluminar la noche y descubre el secreto de los dulces sueños.',
    text: `Muy alto, sobre las colinas dormidas, flotaba una nube muy pequeña llamada Nori.

Mientras las grandes nubes de tormenta practicaban sus tambores lejanos, a Nori le gustaba deslizarse en silencio junto al atardecer de color lavanda.

—Estrellitas mías —susurró Nori con voz suave cuando llegó el crepúsculo—, ¿cómo hacen para titilar con tanta paz en la noche?

Una estrella anciana con pestañas de plata le sonrió desde el cielo oscuro.
—No hacemos ruido, pequeña Nori. Cuando el mundo se queda en silencio, simplemente dejamos que nuestro corazón tranquilo brille.

Nori respiró hondo, despacito, sintiendo el aire fresco. Se acomodó suavemente bajo la luna de plata. Y justo cuando los grillos comenzaron su canción de cuna, Nori comenzó a emitir una luz dorada y cálida que decía: dulces sueños, mundo entero. Que descanses en paz.`,
  },
  {
    id: 'erizo-otono-es',
    title: 'El Erizo y el Viento de Otoño',
    language: 'es',
    targetAge: '4 a 8 años (Fábula del Bosque)',
    recommendedVoice: 'Puck',
    recommendedPitch: 2,
    recommendedSpeed: 0.95,
    synopsis: 'Pipo el erizo busca la hoja más suave del bosque para preparar su camita de invierno.',
    text: `Pipo era un pequeño erizo con una bufanda amarilla que le tejía su abuela cada otoño.

El viento soplaba entre las copas de los castaños, haciendo girar las hojas doradas como si bailaran un vals en el aire.

—Hoy es el gran día —dijo Pipo, dando saltitos con sus cuatro patitas cortas—. Hoy encontraré la hoja perfecta para mi camita de dormir.

Caminó por el sendero alfombrado de musgo. Encontró una hoja de roble, pero era demasiado crujiente. Encontró una hoja de abedul, pero era demasiado pequeña.

De pronto, un suave remolino dejó caer sobre su nariz una hoja aterciopelada de arce color miel. Olía a lluvia limpia y a canela.

Pipo la abrazó con cuidado para no pincharla.
—¡Es perfecta! —exclamó con alegría. Y rodando como una pelotita feliz, volvió a su madriguera a soñar con la primavera.`,
  },
  {
    id: 'abuelo-sauce-es',
    title: 'El Secreto del Abuelo Sauce',
    language: 'es',
    targetAge: '5 a 10 años (Cuento Clásico)',
    recommendedVoice: 'Achernar',
    recommendedPitch: 1,
    recommendedSpeed: 0.92,
    synopsis: 'Un sabio árbol anciano arrulla a los animales del bosque antes de la primera nevada.',
    text: `Mucho antes de que los senderos del bosque tuvieran nombre, un viejo sauce sabio custodiaba el arroyo de agua clara.

Sus ramas caían como cortinas de terciopelo, protegiendo del viento a los conejos, a los pájaros carpinteros y a las ardillas de cola esponjosa.

—Abuelo Sauce —preguntó la pequeña lechuza desde su huequito de madera—, ¿por qué la noche es tan larga en invierno?

El viejo sauce meció sus hojas con un murmullo apacible, como un suspiro cálido frente a una chimenea.
—Para que la tierra tenga tiempo de soñar, pequeña mía. Las flores duermen bajo la nieve, las semillas reposan, y los corazones descansan.

Y con el murmullo del agua que corría despacito, el sauce cobijó a todo el bosque bajo el manto brillante de las estrellas.`,
  },
];
