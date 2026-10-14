export interface StorySample {
  id: string;
  title: string;
  language: 'en' | 'es';
  mode: 'bedtime' | 'daylight';
  targetAge: string;
  recommendedVoice: string;
  recommendedPitch: number;
  recommendedSpeed: number;
  synopsis: string;
  text: string;
}

export const PRELOADED_STORIES: StorySample[] = [
  // Sweet Daylight Stories
  {
    id: 'sunbeam-garden-en',
    title: 'The Sunbeam That Woke the Garden',
    language: 'en',
    mode: 'daylight',
    targetAge: 'Ages 3-7 (Daylight Story Hour)',
    recommendedVoice: 'Kore',
    recommendedPitch: 2,
    recommendedSpeed: 1.02,
    synopsis: 'A cheerful golden sunbeam plays tag with morning dew and helps a sleepy sunflower open its petals.',
    text: `Early in the morning, before the school bell rang, a tiny golden sunbeam named Sunny slid down from the sky on a bright yellow rainbow slide.

"Wake up, sleepy garden!" Sunny laughed, gently tapping a droplet of dew on a velvety rose leaf.

The dewdrop gave a joyful wiggle and sparkled like a diamond. Next, Sunny danced over to Barnaby the sunflower, who was still wearing his soft green nightcap.

"Just five more minutes," murmured Barnaby with a leafy yawn.

Sunny tickled Barnaby's petals with warm golden light. One by one, the bright yellow petals stretched toward the sky. The little honeybees cheered, the robins burst into their cheerful morning song, and the entire garden blossomed with laughter and sweet sunny morning smiles!`,
  },
  {
    id: 'meadow-picnic-en',
    title: 'The Great Meadow Picnic',
    language: 'en',
    mode: 'daylight',
    targetAge: 'Ages 4-8 (Daylight Adventure)',
    recommendedVoice: 'Puck',
    recommendedPitch: 2,
    recommendedSpeed: 1.04,
    synopsis: 'Pip the rabbit and Oliver the mouse organize a sunny picnic with wild strawberries and daisy hats.',
    text: `The sun was shining like a fresh lemon drop over Buttercup Meadow.

"Today is the finest picnic day in the history of the world!" declared Pip the rabbit, waving his checkered red napkin.

Oliver the field mouse rolled a giant ripe blackberry three times his size down the grassy hill. "Wait for me! I brought the sweetest fruit in the valley!"

Together, they set out a feast of clover honey biscuits, crunchy apple slices, and sweet berry lemonade. A family of ducklings waddled by and joined in, wearing funny daisy flower hats.

They laughed, told silly riddles, and did joyful somersaults in the warm clover until their tummies were full and happy. What a glorious sunny day!`,
  },
  {
    id: 'barnaby-bear-en',
    title: 'Barnaby Bear and the Whispering Acorn',
    language: 'en',
    mode: 'daylight',
    targetAge: 'Ages 4-8 (Whimsical Fable)',
    recommendedVoice: 'Puck',
    recommendedPitch: 2,
    recommendedSpeed: 1.02,
    synopsis: 'A cheerful bear finds an acorn that tells miniature jokes to woodland creatures in the sunshine.',
    text: `Barnaby was not a roaring bear. He was a muffin-eating, scarf-wearing bear who lived inside a hollow oak tree by the babbling brook.

One crisp sunny morning, Barnaby was looking for crunchy leaves when he heard the tiniest sneeze.

"Achoo!" went the moss near his furry toes.

Barnaby bent down, his nose wiggling. Sitting in a cup of golden moss was a shiny little acorn wearing a knitted cap.

"Pardon me," said the acorn in a cheerful squeak. "I am Oliver. And I know the most wonderful secret in the entire Whispering Wood."

"What is it, Oliver?" asked Barnaby, sitting down with a soft thump.

"If you hug the tallest pine tree and listen very carefully," Oliver giggled, "you will hear the pinecones practicing their autumn choir."

Barnaby smiled from ear to furry ear. He carefully placed Oliver in his pocket and skipped down the cobblestone trail to find the singing trees.`,
  },

  // Bedtime Stories (English)
  {
    id: 'little-cloud-en',
    title: 'The Little Cloud Who Wanted to Glow',
    language: 'en',
    mode: 'bedtime',
    targetAge: 'Ages 3-6 (Bedtime Story)',
    recommendedVoice: 'Kore',
    recommendedPitch: 2,
    recommendedSpeed: 0.90,
    synopsis: 'A tiny pink cloud drifts across the sunset sky wondering how stars shine, and discovers its own gentle silver lining.',
    text: `High above the sleepy sleepy hills, there floated a very little cloud named Nori.

While the big thunderclouds grumbled and practiced their stormy drums, Nori liked to drift quietly beside the warm lavender sunset. 

"Little stars," Nori whispered softly as the twilight arrived, "how do you twinkle so brightly without any batteries at all?"

An old grandmother star with silver eyelashes smiled down through the dusk. "We do not try to be loud, little Nori. When the world grows quiet, we simply let our peaceful hearts shine."

Nori took a deep, slow breath of cool night air. Gently, slowly, Nori tucked under a silvery crescent moon. And right as the sleepy crickets began their lullaby, Nori began to glow—a soft, honey-gold glow that whispered: sweet dreams, little world. Sleep tight.`,
  },
  {
    id: 'willow-tree-en',
    title: 'The Great Willow of Starlight Valley',
    language: 'en',
    mode: 'bedtime',
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

  // Sweet Daylight Stories (Spanish)
  {
    id: 'rayito-sol-es',
    title: 'El Rayito de Sol que Despertó el Jardín',
    language: 'es',
    mode: 'daylight',
    targetAge: '3 a 7 años (Hora del Cuento)',
    recommendedVoice: 'Kore',
    recommendedPitch: 2,
    recommendedSpeed: 1.02,
    synopsis: 'Un rayito dorado baja por un tobogán de luz para jugar con las flores y las mariposas.',
    text: `Muy temprano en la mañana, un travieso rayito de sol llamado Chispa se deslizó por un arcoíris brillante hasta el jardín de doña Rosa.

—¡Arriba, dormilones! —reía Chispa, haciendo cosquillas a una mariquita roja que dormía sobre una hoja de menta.

La mariquita parpadeó, sacudió sus alitas y dio tres saltos de alegría. Después, Chispa fue a despertar al viejo girasol, que aún roncaba despacito con la cabeza gacha.

—¡Vamos, a bailar con el sol! —le canturreó Chispa.

El girasol abrió sus grandes pétalos dorados y miró al cielo azul. Las abejitas comenzaron su danza zumbona, los pájaros cantaron a coro, ¡y todo el jardín se llenó de risas, juegos y dulce luz de sol!`,
  },
  {
    id: 'erizo-otono-es',
    title: 'El Erizo y el Viento de Otoño',
    language: 'es',
    mode: 'daylight',
    targetAge: '4 a 8 años (Fábula del Bosque)',
    recommendedVoice: 'Puck',
    recommendedPitch: 2,
    recommendedSpeed: 1.04,
    synopsis: 'Pipo el erizo busca la hoja más suave del bosque para preparar su camita de invierno.',
    text: `Pipo era un pequeño erizo con una bufanda amarilla que le tejía su abuela cada otoño.

El viento soplaba alegre entre las copas de los castaños, haciendo girar las hojas doradas como si bailaran un vals en el aire.

—¡Hoy es el gran día! —dijo Pipo, dando saltitos con sus cuatro patitas cortas—. Hoy encontraré la hoja perfecta para mi camita de jugar.

Caminó por el sendero alfombrado de musgo. Encontró una hoja de roble crujiente. De pronto, un suave remolino dejó caer sobre su nariz una hoja aterciopelada de arce color miel que olía a canela.

Pipo la abrazó contento.
—¡Es la mejor hoja del mundo! —exclamó con alegría. Y rodando como una pelotita feliz, fue a mostrársela a sus amigos del bosque.`,
  },

  // Bedtime Stories (Spanish)
  {
    id: 'nubecita-brillar-es',
    title: 'La Nubecita que Quería Brillar',
    language: 'es',
    mode: 'bedtime',
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
    id: 'abuelo-sauce-es',
    title: 'El Secreto del Abuelo Sauce',
    language: 'es',
    mode: 'bedtime',
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
