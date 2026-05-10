import type { ModuleContent } from './prototype';

type LearnSection = ModuleContent['learnSections'][number];
type FigureNote = ModuleContent['figureNotes'][number];
type LabPart = ModuleContent['lab']['parts'][number];
type Flashcard = ModuleContent['flashcards'][number];
type QuizItem = ModuleContent['quiz'][number];

const c3 = '/course-assets/chapter-03/filtrage-spatial-1';
const c4 = '/course-assets/chapter-04/filtrage-spatial-passehaut';
const c4Lab = '/course-assets/chapter-04/labo-04';
const c5 = '/course-assets/chapter-05/fourier-domaine-frequenciel';
const c5Lab = '/course-assets/chapter-05/labo-05';
const c6 = '/course-assets/chapter-06/morphology';
const c6Lab = '/course-assets/chapter-06/labo-06';
const c7 = '/course-assets/chapter-07/transformation-de-hough';
const c7Lab = '/course-assets/chapter-07/labo-07';

function section(eyebrow: string, title: string, body: string[], checkpoint: string): LearnSection {
  return { eyebrow, title, body, checkpoint };
}

function fig(base: string, file: string, page: string, title: string, observe: string, teaches: string): FigureNote {
  return { file, assetPath: `${base}/${file}`, page, title, observe, teaches };
}

function part(id: string, title: string, goal: string, sourceNote: string): LabPart {
  return { id, title, goal, sourceNote };
}

function card(id: string, question: string, answer: string): Flashcard {
  return { id, question, answer };
}

function quiz(id: string, question: string, options: string[], answerIndex: number, feedback: string): QuizItem {
  return { id, question, options, answerIndex, feedback };
}

export const advancedModules: ModuleContent[] = [
  {
    id: 'frequences-spatiales',
    chapter: 3,
    number: 1,
    chapterTitle: 'Filtrage spatial',
    title: 'Fréquences spatiales et contenu spectral',
    shortTitle: 'Fréquences',
    status: 'ready',
    focus: 'Fréquence spatiale, hautes/basses fréquences, passe-bas/passe-haut',
    source: { file: 'filtrageSpatial_1.md', page: '1-10' },
    modeIntros: {
      learn: 'Comprendre pourquoi une image peut être décrite comme un assemblage de variations lentes et rapides.',
      lab: 'Faire varier une fréquence spatiale et observer ce qui passe dans un filtre passe-bas ou passe-haut.',
      review: 'Savoir relier période, fréquence spatiale, basses fréquences et hautes fréquences.',
    },
    learnSections: [
      section('Définition', 'La fréquence spatiale mesure une variation par unité de pixel', [
        'Le cours définit la fréquence en vision numérique comme le taux de variation d’une intensité par unité de pixel.',
        'Une période de 6 pixels signifie que l’intensité se répète tous les 6 pixels, donc la fréquence vaut 1/6 par unité de pixel.',
        'Cette définition déplace l’idée de fréquence du temps vers l’espace de l’image.',
      ], 'Fréquence spatiale = répétitions / unité de longueur = 1 / période en pixels.'),
      section('Lecture d’image', 'Basses fréquences et hautes fréquences décrivent des variations différentes', [
        'Le support dit que les images peuvent être décrites comme un assemblage de hautes et basses fréquences.',
        'Les basses fréquences correspondent à des variations lentes des intensités.',
        'Les hautes fréquences correspondent à des variations rapides, par exemple dans les contours, textures ou détails.',
      ], 'Basse fréquence = variation lente ; haute fréquence = variation rapide.'),
      section('Filtrage', 'Un passe-bas lisse, un passe-haut met en évidence les transitions', [
        'Le chapitre présente les filtres passe-bas comme des filtres qui gardent les basses fréquences et atténuent les hautes.',
        'Il associe le passe-bas au lissage, au floutage et à la réduction du bruit.',
        'Il associe le passe-haut à la détection de contours, car les contours sont liés à de fortes variations d’intensité.',
      ], 'Passe-bas = lissage ; passe-haut = contours et hautes fréquences.'),
    ],
    figureNotes: [
      fig(c3, 'filtrageSpatial_1_p2_fig4.jpeg', '2', 'Période en pixels', 'La figure illustre une répétition spatiale dans l’image.', 'La fréquence spatiale se lit comme une répétition par unité de longueur.'),
      fig(c3, 'filtrageSpatial_1_p3_fig2.jpeg', '3', 'Basses et hautes fréquences', 'Le support oppose zones lentes et zones rapides.', 'Une même image mélange plusieurs contenus fréquentiels.'),
      fig(c3, 'filtrageSpatial_1_p9_fig2.jpeg', '9', 'Passe-bas', 'Le passe-bas garde les fréquences basses.', 'Un filtre passe-bas produit du lissage ou du floutage.'),
      fig(c3, 'filtrageSpatial_1_p9_fig9.jpeg', '9', 'Passe-haut', 'Le passe-haut garde les hautes fréquences.', 'Les contours apparaissent comme des variations rapides.'),
    ],
    lab: {
      kind: 'spatial-lowpass',
      title: 'Voir une fréquence spatiale passer ou disparaître',
      intro: 'Ajuste la période des motifs, puis compare l’effet d’un filtre passe-bas et passe-haut.',
      sourceNote: 'Fondé sur filtrageSpatial_1.md pages 1-10.',
      parts: [
        part('frequency', 'Période', 'Changer la période en pixels et lire la fréquence correspondante.', 'Fondé sur la définition de fréquence spatiale pages 1-2.'),
        part('low-high', 'Passe-bas / passe-haut', 'Comparer ce qui reste quand on garde les variations lentes ou rapides.', 'Fondé sur les exemples de filtrage pages 4-10.'),
        part('spectral', 'Contenu spectral', 'Relier une image à une superposition de composantes fréquentielles.', 'Fondé sur l’analyse de Fourier pages 6-8.'),
      ],
    },
    flashcards: [
      card('freq-def', 'Définition de la fréquence spatiale ?', 'Le taux de variation d’une intensité par unité de pixel.'),
      card('freq-period', 'Si la période vaut 6 pixels, quelle fréquence indique le cours ?', '1/6 par unité de pixel.'),
      card('freq-low', 'Que désignent les basses fréquences ?', 'Des variations lentes du niveau de gris.'),
      card('freq-high', 'Que désignent les hautes fréquences ?', 'Des variations rapides, souvent liées aux contours, textures ou détails.'),
    ],
    quiz: [
      quiz('freq-q1', 'Une période de 6 pixels signifie que…', ['l’intensité se répète tous les 6 pixels', 'l’image a 6 canaux', 'k vaut 6 bits'], 0, 'Le support donne exactement cet exemple.'),
      quiz('freq-q2', 'Un filtre passe-bas sert typiquement à…', ['lisser ou flouter', 'détecter uniquement les droites de Hough', 'augmenter la résolution MxN'], 0, 'Le cours associe passe-bas à lissage/floutage.'),
      quiz('freq-q3', 'Les hautes fréquences correspondent surtout à…', ['des variations rapides', 'des zones parfaitement constantes', 'la taille mémoire'], 0, 'Le support les relie aux variations fortes sur peu de pixels.'),
    ],
    pitfalls: [
      'Confondre fréquence temporelle en Hertz et fréquence spatiale par pixel.',
      'Croire qu’un passe-bas accentue les contours alors qu’il atténue les hautes fréquences.',
      'Oublier que le domaine spatial reste le plan (x,y) de l’image.',
    ],
    examSummary: 'La fréquence spatiale est le taux de variation d’intensité par unité de pixel. Les basses fréquences varient lentement, les hautes fréquences rapidement. Un passe-bas garde les basses fréquences et lisse ; un passe-haut garde les hautes fréquences et met en évidence les contours.',
  },
  {
    id: 'convolution-correlation-kernel',
    chapter: 3,
    number: 2,
    chapterTitle: 'Filtrage spatial',
    title: 'Convolution, corrélation et kernel',
    shortTitle: 'Convolution',
    status: 'ready',
    focus: 'Voisinage nxn, kernel, somme des produits, padding',
    source: { file: 'filtrageSpatial_1.md', page: '11-14, labo 3' },
    modeIntros: {
      learn: 'Comprendre comment un pixel est transformé à partir de son voisinage.',
      lab: 'Déplacer un kernel sur une petite matrice et voir la somme pondérée évoluer.',
      review: 'Retenir le rôle du kernel, du voisinage impair et du padding.',
    },
    learnSections: [
      section('Domaine spatial', 'Le filtrage spatial utilise un voisinage nxn', [
        'Le cours reprend la forme g(x,y)=T[f(x,y)], puis précise que dans le filtrage spatial l’opérateur T est défini dans un voisinage nxn.',
        'Le voisinage est de dimension impaire pour avoir un centre.',
        'Aux bords de l’image, le support indique qu’il faut compléter l’image, par exemple par padding.',
      ], 'Filtrage spatial = transformation définie dans un voisinage autour du pixel.'),
      section('Kernel', 'Le kernel impose la forme du filtre', [
        'Chaque pixel est transformé par une opération dépendant du voisinage, implémentée à l’aide d’un kernel ω(x,y).',
        'Le résultat illustré dans le cours est une somme de produits entre valeurs du voisinage et valeurs du kernel.',
        'Changer les coefficients du kernel change l’effet du filtre.',
      ], 'Un kernel est la petite matrice de poids appliquée au voisinage.'),
      section('Labo 3', 'La fonction de corrélation doit retourner une nouvelle image', [
        'Le labo 3 demande d’implémenter xcorr(img, kernel).',
        'Le kernel doit être carré et de taille impaire.',
        'La fonction doit retourner une nouvelle image sans modifier l’image source.',
      ], 'L’exigence labo : kernel carré impair, sortie nouvelle image.'),
    ],
    figureNotes: [
      fig(c3, 'filtrageSpatial_1_p11_fig7.jpeg', '11', 'Voisinage nxn', 'Le support montre que T utilise le voisinage du point.', 'Le filtrage spatial n’est pas ponctuel : il dépend des pixels voisins.'),
      fig(c3, 'filtrageSpatial_1_p12_fig2.jpeg', '12', 'Convolution/corrélation', 'Le kernel se combine avec l’image par somme de produits.', 'Les coefficients du kernel pondèrent le voisinage.'),
      fig(c3, 'filtrageSpatial_1_p13_fig1.jpeg', '13', 'Zéro padding', 'L’exemple montre comment traiter les bords.', 'Les bords demandent une convention de padding.'),
      fig(c3, 'filtrageSpatial_1_p14_fig5.jpeg', '14', 'Kernel moyenne', 'Un kernel moyenneur lisse les différences.', 'Les kernels de moyenne servent aux filtres passe-bas.'),
    ],
    lab: {
      kind: 'spatial-kernel',
      title: 'Appliquer un kernel sur un voisinage',
      intro: 'Déplace le centre du kernel, change les poids et observe la somme des produits.',
      sourceNote: 'Fondé sur filtrageSpatial_1.md pages 11-14 et labo_03.md exercice 2.1.',
      parts: [
        part('kernel', 'Kernel', 'Changer les coefficients et voir l’effet sur la somme pondérée.', 'Fondé sur le mécanisme convolution/corrélation page 12.'),
        part('padding', 'Bords', 'Observer pourquoi les bords exigent une convention de padding.', 'Fondé sur l’exemple avec zéro padding page 13.'),
        part('correlation', 'Corrélation', 'Relier la manipulation à xcorr(img, kernel) du labo.', 'Fondé sur labo_03.md exercice 2.1.'),
      ],
    },
    flashcards: [
      card('kernel-role', 'Rôle d’un kernel ?', 'Pondérer le voisinage pour transformer le pixel central.'),
      card('neighborhood', 'Pourquoi un voisinage impair ?', 'Pour disposer d’un centre autour du pixel traité.'),
      card('padding', 'Pourquoi du padding ?', 'Pour compléter l’image lorsque le voisinage dépasse les bords.'),
      card('xcorr', 'Exigence principale de xcorr dans le labo 3 ?', 'Retourner une nouvelle image sans modifier l’image source.'),
    ],
    quiz: [
      quiz('kernel-q1', 'Dans le filtrage spatial, T est défini…', ['dans un voisinage nxn', 'sur un seul bit', 'dans l’accumulateur de Hough'], 0, 'Le cours oppose ce cas aux transformations 1x1.'),
      quiz('kernel-q2', 'Le kernel du labo 3 doit être…', ['carré et impair', 'forcément RGB', 'toujours 2x2'], 0, 'Le labo impose une forme carrée de côtés impairs.'),
      quiz('kernel-q3', 'La convolution/corrélation calcule ici…', ['une somme de produits', 'un score de quiz', 'un canal couleur'], 0, 'Le support illustre explicitement la somme des produits.'),
    ],
    pitfalls: [
      'Confondre transformation ponctuelle 1x1 et filtrage spatial nxn.',
      'Oublier le traitement des bords.',
      'Modifier l’image source dans le labo au lieu de produire une nouvelle image.',
    ],
    examSummary: 'Le filtrage spatial transforme chaque pixel à partir d’un voisinage nxn, généralement impair. Le kernel ω(x,y) pondère ce voisinage et le résultat se calcule par somme de produits. Aux bords, il faut une convention comme le padding. Le labo 3 implémente cette idée avec xcorr(img, kernel).',
  },
  {
    id: 'lissage-passe-bas',
    chapter: 3,
    number: 3,
    chapterTitle: 'Filtrage spatial',
    title: 'Filtres passe-bas : moyenne, gaussien et médian',
    shortTitle: 'Passe-bas',
    status: 'ready',
    focus: 'Lissage, floutage, bruit, moyenne, gaussien, médian',
    source: { file: 'filtrageSpatial_1.md', page: '15-18, labo 3' },
    modeIntros: {
      learn: 'Comprendre comment les filtres passe-bas réduisent les détails et le bruit.',
      lab: 'Comparer moyenne, gaussien et médian sur une grille bruitée.',
      review: 'Savoir expliquer l’effet de la taille du kernel et la différence médian/moyenne.',
    },
    learnSections: [
      section('Objectif', 'Le passe-bas élimine des détails plus petits que le kernel', [
        'Le cours indique que l’objectif est d’éliminer les détails de l’image.',
        'Il précise que les détails sont des variations de pixels sur une petite zone par rapport à la taille du kernel.',
        'La taille du kernel détermine donc le degré de lissage.',
      ], 'Plus le kernel est grand, plus le lissage augmente.'),
      section('Moyenne et gaussien', 'Le filtre moyenneur étale les valeurs, le gaussien pondère selon une forme isotrope', [
        'Les exemples box et gaussien sont présentés comme filtres de lissage.',
        'Le gaussien est décrit comme isotrope, séparable, et contrôlé par le paramètre σ.',
        'Le support indique qu’après 3σ le poids de la gaussienne est négligeable.',
      ], 'Gaussien : zone d’influence déterminée par σ.'),
      section('Médian', 'Le médian remplace par la valeur médiane du voisinage', [
        'Le cours définit le filtre médian comme le remplacement d’un pixel par la valeur médiane du voisinage.',
        'Il précise que le médian supprime le bruit lorsque les valeurs bruitées sont minoritaires.',
        'Le labo 3 demande de comparer image source, image bruitée, moyenneur et médian.',
      ], 'Médian : très utile pour le bruit poivre et sel si le bruit reste minoritaire.'),
    ],
    figureNotes: [
      fig(c3, 'filtrageSpatial_1_p15_fig6.jpeg', '15', 'Box, gaussien, médiane', 'Le support regroupe les familles de lissage.', 'Plusieurs filtres peuvent servir de passe-bas.'),
      fig(c3, 'filtrageSpatial_1_p16_fig14.jpeg', '16', 'Taille du kernel', 'La taille change le degré de floutage.', 'La taille du voisinage est un paramètre pédagogique central.'),
      fig(c3, 'filtrageSpatial_1_p17_fig5.jpeg', '17', 'Filtre gaussien', 'Les coefficients suivent une distribution gaussienne.', 'σ contrôle la zone d’influence.'),
      fig(c3, 'filtrageSpatial_1_p18_fig4.jpeg', '18', 'Bruit poivre et sel', 'Le support compare moyenne et médian sur bruit impulsionnel.', 'Le médian est adapté lorsque les impulsions sont minoritaires.'),
    ],
    lab: {
      kind: 'spatial-lowpass',
      title: 'Comparer moyenne, gaussien et médian',
      intro: 'Ajoute du bruit impulsionnel, change la taille du voisinage et observe le lissage.',
      sourceNote: 'Fondé sur filtrageSpatial_1.md pages 15-18 et labo_03.md exercices 2.2-2.4.',
      parts: [
        part('box', 'Moyenne', 'Voir comment un moyenneur lisse mais étale le bruit.', 'Fondé sur les exemples box pages 15-16.'),
        part('gaussian', 'Gaussien', 'Modifier σ et lire la zone d’influence.', 'Fondé sur la section Gaussien page 17.'),
        part('median', 'Médian', 'Comparer le médian au moyenneur sur bruit poivre et sel.', 'Fondé sur la section Médian page 18 et labo 3.'),
      ],
    },
    flashcards: [
      card('lowpass-goal', 'Objectif du passe-bas dans ce chapitre ?', 'Éliminer des détails et produire lissage/floutage.'),
      card('kernel-size', 'Que détermine la taille du kernel ?', 'Le degré de lissage.'),
      card('gaussian-sigma', 'Que contrôle σ dans le gaussien ?', 'La zone d’influence du filtre.'),
      card('median-def', 'Définition du filtre médian ?', 'Remplacer un pixel par la valeur médiane des valeurs du voisinage.'),
    ],
    quiz: [
      quiz('lowpass-q1', 'Un kernel plus grand produit généralement…', ['plus de floutage', 'moins de voisinage', 'un espace de Hough'], 0, 'Le cours indique que la taille du kernel détermine le degré de floutage.'),
      quiz('lowpass-q2', 'Le médian est particulièrement utile lorsque…', ['le bruit est minoritaire dans le voisinage', 'on veut détecter des cercles', 'on calcule rho'], 0, 'Le support le dit pour le bruit poivre et sel.'),
      quiz('lowpass-q3', 'Après environ 3σ pour une gaussienne…', ['le poids est négligeable', 'le pixel devient RGB', 'la DFT disparaît'], 0, 'Le cours donne cette règle pour la zone d’influence.'),
    ],
    pitfalls: [
      'Penser que tout lissage conserve les contours.',
      'Utiliser une taille de kernel sans vérifier son effet sur les détails.',
      'Confondre moyenneur et médian face au bruit impulsionnel.',
    ],
    examSummary: 'Les filtres passe-bas lissent l’image, réduisent le bruit et éliminent les détails plus petits que le kernel. La taille du kernel contrôle le floutage. Le gaussien est contrôlé par σ ; le médian remplace par la médiane du voisinage et traite bien le bruit poivre et sel minoritaire.',
  },
  {
    id: 'bilateral-preservation-contours',
    chapter: 3,
    number: 4,
    chapterTitle: 'Filtrage spatial',
    title: 'Filtrage bilatéral et préservation des contours',
    shortTitle: 'Bilatéral',
    status: 'ready',
    focus: 'Pondération spatiale, pondération intensité, contours préservés',
    source: { file: 'filtrageSpatial_1.md', page: '19-20' },
    modeIntros: {
      learn: 'Comprendre pourquoi un lissage peut préserver les contours au lieu de les effacer.',
      lab: 'Faire varier les pondérations spatiale et intensité d’un filtre bilatéral simulé.',
      review: 'Retenir la logique Gauss(spatial) × Gauss(intensité).',
    },
    learnSections: [
      section('Principe', 'Le bilatéral pondère à la fois la distance spatiale et l’écart d’intensité', [
        'Le cours donne la forme g(x,y) proportionnelle à Gauss(spatial) × Gauss(intensité).',
        'La pondération spatiale laisse un pixel être influencé par le voisinage.',
        'La pondération d’intensité rend l’influence plus forte pour les voisins dont l’intensité est proche.',
      ], 'Bilatéral = voisinage proche spatialement et proche en intensité.'),
      section('Contours', 'Les voisins d’intensité différente influencent moins le pixel', [
        'Le support explique que les contours ne sont plus lissés lorsque les intensités diffèrent fortement.',
        'La méthode reste un passe-bas, mais elle évite de traverser aussi facilement les discontinuités.',
        'C’est la différence clé avec un lissage uniquement spatial.',
      ], 'Préserver un contour revient à éviter de moyenner des intensités trop différentes.'),
      section('Paramètres', 'σ spatial et σ intensité changent des aspects différents', [
        'Le paramètre σ spatial détermine la taille de la fenêtre et le degré de floutage.',
        'Les exemples du support varient σ intensité, jusqu’au cas où σ intensité tend vers l’infini.',
        'Quand la pondération d’intensité devient très large, le filtre se rapproche d’un lissage plus classique.',
      ], 'σ spatial règle la fenêtre ; σ intensité règle la tolérance aux différences de valeur.'),
    ],
    figureNotes: [
      fig(c3, 'filtrageSpatial_1_p19_fig2.jpeg', '19', 'Image originale', 'Le support part d’une image avant lissage bilatéral.', 'Le but est de lisser sans perdre les frontières fortes.'),
      fig(c3, 'filtrageSpatial_1_p19_fig8.jpeg', '19', 'Forme bilatérale', 'La formule combine poids spatial et poids d’intensité.', 'Deux proximités sont prises en compte simultanément.'),
      fig(c3, 'filtrageSpatial_1_p20_fig4.jpeg', '20', 'σ intensité faible', 'Le lissage respecte davantage les écarts d’intensité.', 'Les contours sont mieux préservés lorsque la tolérance est stricte.'),
      fig(c3, 'filtrageSpatial_1_p20_fig8.jpeg', '20', 'σ intensité infini', 'Le support montre le cas limite.', 'Quand l’intensité ne discrimine plus, le comportement se rapproche d’un lissage spatial.'),
    ],
    lab: {
      kind: 'spatial-lowpass',
      title: 'Tester un lissage qui respecte les contours',
      intro: 'Ajuste σ spatial et σ intensité pour voir quand le lissage traverse ou respecte une frontière.',
      sourceNote: 'Fondé sur filtrageSpatial_1.md pages 19-20.',
      parts: [
        part('spatial-weight', 'Poids spatial', 'Augmenter la fenêtre de voisinage et voir le floutage.', 'Fondé sur la pondération spatiale page 19.'),
        part('intensity-weight', 'Poids intensité', 'Réduire ou élargir la tolérance aux différences d’intensité.', 'Fondé sur la pondération intensité page 19.'),
        part('edges', 'Contours', 'Observer pourquoi les contours restent plus nets.', 'Fondé sur les exemples pages 19-20.'),
      ],
    },
    flashcards: [
      card('bilateral-form', 'Forme donnée pour le bilatéral ?', 'Gauss(spatial) × Gauss(intensité).'),
      card('bilateral-spatial', 'Rôle de la pondération spatiale ?', 'Laisser un pixel être influencé par son voisinage.'),
      card('bilateral-intensity', 'Rôle de la pondération intensité ?', 'Donner plus d’influence aux voisins d’intensité proche.'),
      card('bilateral-edge', 'Pourquoi les contours sont-ils préservés ?', 'Les voisins d’intensité très différente influencent moins le pixel.'),
    ],
    quiz: [
      quiz('bilateral-q1', 'Le filtrage bilatéral combine…', ['poids spatial et poids d’intensité', 'RGB et Hough', 'M et N seulement'], 0, 'Le cours donne la forme Gauss(spatial) × Gauss(intensité).'),
      quiz('bilateral-q2', 'σ spatial règle surtout…', ['la taille de la fenêtre et le floutage', 'le nombre de bits k', 'l’angle theta'], 0, 'Le support relie σ spatial à la fenêtre et au degré de floutage.'),
      quiz('bilateral-q3', 'La pondération d’intensité sert à…', ['moins lisser à travers les contours', 'ajouter du bruit', 'quantifier RGB'], 0, 'Les voisins d’intensité proche influencent davantage.'),
    ],
    pitfalls: [
      'Croire que tout passe-bas détruit forcément les contours.',
      'Confondre σ spatial et σ intensité.',
      'Oublier que le bilatéral reste un filtre de lissage.',
    ],
    examSummary: 'Le filtre bilatéral lisse avec deux pondérations : distance spatiale et proximité d’intensité. Les voisins proches spatialement et proches en intensité comptent davantage. Cela permet de réduire du bruit tout en préservant mieux les contours qu’un lissage purement spatial.',
  },
  {
    id: 'passe-haut-transitions',
    chapter: 4,
    number: 1,
    chapterTitle: 'Filtrage spatial passe-haut',
    title: 'Transitions d’intensité et dérivées',
    shortTitle: 'Transitions',
    status: 'ready',
    focus: 'Passe-haut, dérivée première, dérivée seconde, passage par zéro',
    source: { file: 'filtrageSpatial_passehaut.md', page: '1-4' },
    modeIntros: {
      learn: 'Comprendre pourquoi les contours apparaissent comme des transitions d’intensité.',
      lab: 'Modifier une rampe d’intensité et observer les dérivées première et seconde.',
      review: 'Retenir les étapes lissage, renforcement, seuillage et le rôle du passage par zéro.',
    },
    learnSections: [
      section('But', 'Un passe-haut met en évidence les zones de variations importantes', [
        'Le cours définit le but du filtre passe-haut : mettre en évidence les zones de variations importantes, donc les hautes fréquences.',
        'L’idée proposée est de calculer la dérivée de l’image pour accentuer les discontinuités.',
        'Les étapes clés données sont lissage, renforcement par dérivation, puis seuillage.',
      ], 'Passe-haut : lissage, dérivation, seuillage.'),
      section('Dérivée première', 'La dérivée première repère les zones où la variation est forte', [
        'Sur une rampe, le cours indique qu’on recherche des zones où la dérivée est non nulle, idéalement grande en valeur absolue.',
        'Les contours peuvent être épais, car la dérivée est non nulle dans toute la zone de transition.',
        'En discret, le support donne f’(x)=f(x+1)-f(x).',
      ], 'La dérivée première détecte les variations, mais localise parfois large.'),
      section('Dérivée seconde', 'Le passage par zéro de la dérivée seconde localise finement le contour', [
        'Le cours explique que sur une rampe, la dérivée seconde produit un passage par zéro.',
        'Identifier ce passage par zéro permet une localisation fine du contour.',
        'La version discrète donnée est f’’(x)=f(x+1)+f(x-1)-2f(x).',
      ], 'Passage par zéro = indice fort de localisation du contour avec la dérivée seconde.'),
    ],
    figureNotes: [
      fig(c4, 'filtrageSpatial_passehaut_p1_fig2.jpeg', '1', 'Passe-haut', 'Le but est de révéler des variations importantes.', 'Les contours sont liés aux hautes fréquences.'),
      fig(c4, 'filtrageSpatial_passehaut_p1_fig9.jpeg', '1', 'Étapes clés', 'Le cours liste lissage, renforcement, seuillage.', 'La détection robuste de contours est une chaîne, pas un seul clic.'),
      fig(c4, 'filtrageSpatial_passehaut_p3_fig2.jpeg', '3', 'Rampe et dérivées', 'La rampe est analysée par dérivées première et seconde.', 'La dérivée seconde donne un passage par zéro.'),
      fig(c4, 'filtrageSpatial_passehaut_p4_fig8.jpeg', '4', 'Discrétisation', 'Le support montre les dérivées discrètes.', 'Les formules continues deviennent des différences entre pixels.'),
    ],
    lab: {
      kind: 'spatial-highpass',
      title: 'Lire une transition avec ses dérivées',
      intro: 'Change la largeur d’une rampe et observe la dérivée première, la dérivée seconde et le seuil.',
      sourceNote: 'Fondé sur filtrageSpatial_passehaut.md pages 1-4.',
      parts: [
        part('transition', 'Transition', 'Modifier la largeur de rampe et voir l’épaisseur du contour.', 'Fondé sur transitions d’intensité pages 2-3.'),
        part('derivative', 'Dérivées', 'Comparer dérivée première et seconde.', 'Fondé sur les formules discrètes page 4.'),
        part('smoothing', 'Lissage', 'Observer le compromis bruit/localisation.', 'Fondé sur les étapes clés page 1.'),
      ],
    },
    flashcards: [
      card('highpass-goal', 'But du passe-haut ?', 'Mettre en évidence les zones de variations importantes.'),
      card('highpass-steps', 'Étapes clés données par le cours ?', 'Lissage, renforcement par dérivation, seuillage.'),
      card('first-derivative', 'Formule discrète de la dérivée première ?', 'f’(x)=f(x+1)-f(x).'),
      card('second-derivative', 'Formule discrète de la dérivée seconde ?', 'f’’(x)=f(x+1)+f(x-1)-2f(x).'),
    ],
    quiz: [
      quiz('transition-q1', 'Le passe-haut vise surtout…', ['les fortes variations d’intensité', 'les basses fréquences seules', 'les canaux RGB'], 0, 'Le cours parle de zones de variations importantes.'),
      quiz('transition-q2', 'La dérivée seconde sert notamment à repérer…', ['un passage par zéro', 'un code hexadécimal', 'une ROI'], 0, 'Le passage par zéro localise finement le contour.'),
      quiz('transition-q3', 'Pourquoi lisser avant dérivation ?', ['pour réduire les faux positifs dus au bruit', 'pour augmenter k', 'pour changer le nom de l’image'], 0, 'Le support avertit que ces filtres détectent aussi le bruit.'),
    ],
    pitfalls: [
      'Oublier que les dérivées amplifient aussi le bruit.',
      'Confondre dérivée première et seconde.',
      'Faire un seuillage sans comprendre ce qui est renforcé.',
    ],
    examSummary: 'Le passe-haut met en évidence les variations importantes. La dérivée première repère les zones où la variation est non nulle ; la dérivée seconde permet une localisation fine via passages par zéro. Les étapes clés sont lissage, dérivation, seuillage.',
  },
  {
    id: 'gradient-sobel-bruit',
    chapter: 4,
    number: 2,
    chapterTitle: 'Filtrage spatial passe-haut',
    title: 'Gradient, Sobel et sensibilité au bruit',
    shortTitle: 'Sobel',
    status: 'ready',
    focus: 'Gradient, norme, Prewitt/Sobel, lissage avant contours',
    source: { file: 'filtrageSpatial_passehaut.md', page: '5-8, labo 4' },
    modeIntros: {
      learn: 'Comprendre le gradient comme direction et intensité de la plus grande pente.',
      lab: 'Comparer Sobel x, Sobel y, combinaison et effet du bruit.',
      review: 'Retenir la norme du gradient, les masques et le compromis lissage/localisation.',
    },
    learnSections: [
      section('Gradient', 'Le gradient est un vecteur, sa norme représente son intensité', [
        'Le cours définit le gradient comme un vecteur composé des dérivées partielles selon x et y.',
        'Il indique la direction de la plus grande pente en un point.',
        'La norme du gradient représente l’intensité de cette plus grande pente.',
      ], 'Gradient = direction de plus grande pente ; norme = intensité de cette pente.'),
      section('Masques', 'Prewitt et Sobel approximent les dérivées avec des masques 3x3', [
        'Le support donne des masques de Prewitt et Sobel dans les directions x et y.',
        'Il précise qu’en pratique les masques combinent fréquemment lissage et dérivation.',
        'Dans le labo 4, il faut implémenter Sobel vertical, horizontal puis combiné.',
      ], 'Sobel combine orientation x/y et approximation de dérivée.'),
      section('Bruit', 'Les filtres de dérivée sont sensibles au bruit', [
        'Le cours montre la sensibilité du gradient au bruit.',
        'Il résume le compromis : fort lissage donne plus de robustesse au bruit mais des contours épais.',
        'Faible lissage donne meilleure localisation, mais plus de sensibilité au bruit.',
      ], 'Compromis : robustesse au bruit contre localisation fine.'),
    ],
    figureNotes: [
      fig(c4, 'filtrageSpatial_passehaut_p5_fig6.jpeg', '5', 'Gradient', 'Le support relie gradient, direction et norme.', 'Le contour peut se lire comme une pente forte.'),
      fig(c4, 'filtrageSpatial_passehaut_p7_fig8.jpeg', '7', 'Exemple Sobel', 'L’exemple montre des valeurs hors scope après Sobel.', 'Les sorties de dérivées doivent souvent être normalisées ou seuillées.'),
      fig(c4, 'filtrageSpatial_passehaut_p8_fig7.jpeg', '8', 'Sobel x/y/combiné', 'Le support compare directions et combinaison.', 'Les orientations donnent des réponses différentes.'),
      fig(c4Lab, 'labo_04_p2_fig5.jpeg', 'labo 4.5', 'Sobel en labo', 'Le labo demande Sobel vertical, horizontal et combiné.', 'La manipulation prépare directement l’implémentation.'),
    ],
    lab: {
      kind: 'spatial-highpass',
      title: 'Comparer Sobel x, y et combiné',
      intro: 'Change l’orientation et le lissage pour voir quels contours apparaissent.',
      sourceNote: 'Fondé sur filtrageSpatial_passehaut.md pages 5-8 et labo_04.md exercice 2.5.',
      parts: [
        part('gradient', 'Gradient', 'Observer direction et norme de la pente.', 'Fondé sur la définition du gradient page 5.'),
        part('sobel', 'Sobel', 'Comparer horizontal, vertical et combiné.', 'Fondé sur les masques et le labo 4.5.'),
        part('noise', 'Bruit', 'Voir pourquoi un lissage peut être nécessaire avant le gradient.', 'Fondé sur la sensibilité au bruit page 8.'),
      ],
    },
    flashcards: [
      card('gradient-vector', 'Le gradient est-il scalaire ou vectoriel ?', 'Vectoriel ; sa norme représente l’intensité.'),
      card('gradient-direction', 'Que donne la direction du gradient ?', 'La direction de la plus grande pente.'),
      card('sobel-lab', 'Que demande le labo 4 pour Sobel ?', 'Détection verticale, horizontale, puis combinaison des deux.'),
      card('noise-tradeoff', 'Compromis du lissage avant contours ?', 'Fort lissage = robuste mais contours épais ; faible lissage = bonne localisation mais bruit.'),
    ],
    quiz: [
      quiz('sobel-q1', 'La norme du gradient représente…', ['l’intensité de la plus grande pente', 'la taille du fichier', 'rho'], 0, 'Le cours le dit explicitement.'),
      quiz('sobel-q2', 'Les masques Sobel servent à approximer…', ['des dérivées', 'une synthèse RGB', 'une ouverture morphologique'], 0, 'Ils sont donnés dans la section Gradient - Masques de convolution.'),
      quiz('sobel-q3', 'Après Sobel, les valeurs peuvent sortir de…', ['la plage 0-255', 'la liste des modules', 'la période de Nyquist'], 0, 'Le support signale des valeurs hors scope 0-255.'),
    ],
    pitfalls: [
      'Lire Sobel combiné comme une simple image finale sans gérer la normalisation.',
      'Oublier la sensibilité au bruit.',
      'Confondre orientation du masque et orientation du contour détecté.',
    ],
    examSummary: 'Le gradient est un vecteur dont la norme mesure l’intensité de la plus grande pente. Prewitt et Sobel approximent les dérivées en x et y avec des masques. Le gradient est sensible au bruit : le lissage améliore la robustesse mais épaissit les contours.',
  },
  {
    id: 'laplacien-log-highboost',
    chapter: 4,
    number: 3,
    chapterTitle: 'Filtrage spatial passe-haut',
    title: 'Laplacien, LoG et highboost',
    shortTitle: 'Laplacien',
    status: 'ready',
    focus: 'Laplacien, valeurs négatives, sharpening, LoG',
    source: { file: 'filtrageSpatial_passehaut.md', page: '9-15, labo 4' },
    modeIntros: {
      learn: 'Comprendre le Laplacien comme dérivée seconde isotropique et son usage pour renforcer les contours.',
      lab: 'Comparer Laplacien 90°, 45°, scaling des valeurs négatives et highboost.',
      review: 'Retenir les masques, le traitement des valeurs négatives et la logique LoG.',
    },
    learnSections: [
      section('Laplacien', 'Le Laplacien mesure l’écart entre un point et son entourage', [
        'Le cours présente le Laplacien comme la généralisation de la dérivée seconde.',
        'Il donne la formule discrète combinant f(x+1,y), f(x-1,y), f(x,y+1), f(x,y-1) et -4f(x,y).',
        'Il explique physiquement que le Laplacien mesure la différence entre la valeur au point et la moyenne autour.',
      ], 'Laplacien proche de zéro dans les zones à variation faible, fort aux discontinuités.'),
      section('Valeurs', 'Les valeurs négatives doivent être traitées avant affichage', [
        'Le support montre que si les valeurs négatives sont envoyées à zéro, l’image du Laplacien peut devenir sombre.',
        'Il propose aussi de décaler puis scaler entre 0 et 255.',
        'Cette étape explique pourquoi un filtre de dérivée n’est pas directement une image 8 bits prête à afficher.',
      ], 'Après Laplacien, normalisation ou scaling est une vraie étape.'),
      section('LoG et highboost', 'Lissage et Laplacien peuvent être combinés', [
        'Le chapitre indique que les masques de dérivée sont sensibles au bruit et à la texture.',
        'Pour LoG, on lisse par Gaussien puis on applique le Laplacien, ou on pré-calcule Laplacien sur Gaussien.',
        'Le highboost soustrait un blur à l’image pour construire un masque, puis ajoute ce masque à l’image.',
      ], 'LoG = lissage + Laplacien ; highboost = image + k(image - blur).'),
    ],
    figureNotes: [
      fig(c4, 'filtrageSpatial_passehaut_p10_fig3.jpeg', '10', 'Laplacien', 'Le Laplacien fait ressortir les discontinuités.', 'Un contour devient visible comme écart local.'),
      fig(c4, 'filtrageSpatial_passehaut_p11_fig9.jpeg', '11', 'Scaling du Laplacien', 'Le support montre l’effet du scaling entre 0 et 255.', 'Les valeurs négatives ne doivent pas être ignorées sans réflexion.'),
      fig(c4, 'filtrageSpatial_passehaut_p14_fig8.jpeg', '14', 'LoG kernel', 'Le LoG combine Gaussien et Laplacien.', 'Une unique convolution peut pré-calculer le comportement.'),
      fig(c4Lab, 'labo_04_p1_fig8.jpeg', 'labo 4.3', 'Sharpening', 'Le labo demande de renforcer les contours en sommant filtre et image.', 'L’image sharpening reprend l’idée d’ajouter un masque de contours.'),
    ],
    lab: {
      kind: 'spatial-highpass',
      title: 'Tester Laplacien, scaling et highboost',
      intro: 'Change le masque, le scaling et le gain pour observer les contours et le sharpening.',
      sourceNote: 'Fondé sur filtrageSpatial_passehaut.md pages 9-15 et labo_04.md exercices 2.2-2.4.',
      parts: [
        part('laplacian', 'Laplacien', 'Comparer isotropie 90° et 45° dans une grille.', 'Fondé sur les masques de Laplacien page 9 et labo 4.2.'),
        part('negative-values', 'Valeurs négatives', 'Comparer clipping et scaling entre 0 et 255.', 'Fondé sur traitement des valeurs négatives page 11.'),
        part('log', 'LoG / highboost', 'Voir l’effet de lissage puis renforcement.', 'Fondé sur LoG pages 14-15 et highboost page 12.'),
      ],
    },
    flashcards: [
      card('laplacian-meaning', 'Que mesure physiquement le Laplacien selon le cours ?', 'La différence entre la valeur en un point et la moyenne autour.'),
      card('laplacian-mask', 'Masque Laplacien 90° classique ?', 'Centre -4 et voisins haut/bas/gauche/droite à +1.'),
      card('negative-scale', 'Pourquoi scaler le Laplacien ?', 'Parce que les valeurs peuvent être négatives ou hors 0-255.'),
      card('log-def', 'Que signifie LoG ?', 'Laplacien lissé par une gaussienne.'),
    ],
    quiz: [
      quiz('lap-q1', 'Le Laplacien est lié à…', ['la dérivée seconde', 'la synthèse additive RGB', 'la médiane seulement'], 0, 'Le cours le présente comme généralisation de la dérivée seconde.'),
      quiz('lap-q2', 'Le highboost utilise…', ['un masque image moins blur', 'un accumulateur rho-theta', 'un bit plane'], 0, 'Le support donne g_mask(x,y)=f(x,y)-fbar(x,y).'),
      quiz('lap-q3', 'LoG est utile notamment car…', ['il combine lissage et Laplacien', 'il supprime toute phase', 'il remplace Hough'], 0, 'Le cours présente l’association Gaussien puis Laplacien.'),
    ],
    pitfalls: [
      'Afficher directement les valeurs Laplacien sans traitement.',
      'Oublier que les dérivées sont sensibles au bruit.',
      'Confondre Laplacien et gradient : le Laplacien n’est pas un vecteur de direction.',
    ],
    examSummary: 'Le Laplacien est une dérivée seconde isotropique qui mesure l’écart entre un point et son entourage. Ses valeurs peuvent être négatives et doivent être traitées pour l’affichage. LoG combine lissage gaussien et Laplacien ; highboost ajoute à l’image un masque issu de image - blur.',
  },
  {
    id: 'canny-contours',
    chapter: 4,
    number: 4,
    chapterTitle: 'Filtrage spatial passe-haut',
    title: 'Détection de contours par Canny',
    shortTitle: 'Canny',
    status: 'ready',
    focus: 'Gaussien, gradients, non maxima suppression, double seuil',
    source: { file: 'filtrageSpatial_passehaut.md', page: '15-18, labo 4' },
    modeIntros: {
      learn: 'Comprendre Canny comme une chaîne complète de détection de contours.',
      lab: 'Piloter lissage, suppression des non maxima et double seuil sur une image synthétique.',
      review: 'Savoir restituer les étapes Canny et leur rôle.',
    },
    learnSections: [
      section('Chaîne', 'Canny commence par lisser puis calculer les gradients', [
        'Le cours donne comme première étape un lissage par filtre gaussien.',
        'Il calcule ensuite les gradients sur toute l’image, avec magnitudes et directions.',
        'Cette étape réduit la sensibilité au bruit avant de chercher les contours.',
      ], 'Canny commence par Gaussien puis gradients.'),
      section('Amincissement', 'La non maxima suppression garde les maxima locaux', [
        'Le support décrit la non maxima suppression : pour un pixel avec gradient non nul, on cherche dans la direction du gradient les pixels qui sont des maxima locaux.',
        'Si la norme du gradient au point central est supérieure aux voisins dans cette direction, il peut être déclaré contour.',
        'Cette étape rend les contours mieux localisés et plus fins.',
      ], 'Non maxima suppression = garder les maxima locaux dans la direction du gradient.'),
      section('Double seuil', 'Le double seuillage distingue contours forts, faibles et rejetés', [
        'Le cours définit deux seuils S1 et S2.',
        'Au-dessus de S1, le contour est fort ; sous S2, le pixel est rejeté.',
        'Entre les deux, le contour faible est retenu s’il est connecté à un contour fort dans le voisinage 8.',
      ], 'Hystérésis : un contour faible est gardé s’il est connecté à un contour fort.'),
    ],
    figureNotes: [
      fig(c4, 'filtrageSpatial_passehaut_p16_fig5.jpeg', '16', 'Non maxima suppression', 'La figure montre la comparaison dans la direction du gradient.', 'Canny amincit les contours après calcul des gradients.'),
      fig(c4, 'filtrageSpatial_passehaut_p17_fig6.jpeg', '17', 'Canny', 'Le résultat montre des contours amincis et seuillés.', 'Canny localise mieux que le gradient brut.'),
      fig(c4, 'filtrageSpatial_passehaut_p18_fig8.jpeg', '18', 'Suppression des non maxima', 'Le schéma sépare l’étape d’amincissement.', 'La chaîne Canny est séquentielle.'),
      fig(c4Lab, 'labo_04_p2_fig9.jpeg', 'labo 4.6', 'Contours dessinés', 'Le labo demande de dessiner les contours détectés en bleu.', 'La sortie utile peut être une annotation sur l’image d’origine.'),
    ],
    lab: {
      kind: 'spatial-highpass',
      title: 'Construire une chaîne Canny',
      intro: 'Ajuste lissage, seuil faible et seuil fort pour comprendre pourquoi Canny garde certains contours.',
      sourceNote: 'Fondé sur filtrageSpatial_passehaut.md pages 16-18 et labo_04.md exercice 2.6.',
      parts: [
        part('smooth-gradient', 'Lissage + gradient', 'Voir comment le lissage prépare le gradient.', 'Fondé sur les étapes Canny page 16.'),
        part('nms', 'Non maxima', 'Amincir les contours en gardant les maxima locaux.', 'Fondé sur non maxima suppression page 16.'),
        part('hysteresis', 'Double seuil', 'Distinguer contour fort, faible et rejeté.', 'Fondé sur le seuillage double page 16.'),
      ],
    },
    flashcards: [
      card('canny-step1', 'Première étape de Canny ?', 'Lissage par filtre gaussien.'),
      card('canny-grad', 'Après le lissage, que calcule Canny ?', 'Les gradients, magnitudes et directions.'),
      card('canny-nms', 'Rôle de la non maxima suppression ?', 'Garder les maxima locaux dans la direction du gradient.'),
      card('canny-thresholds', 'Rôle des deux seuils S1 et S2 ?', 'Séparer contours forts, faibles connectés et pixels rejetés.'),
    ],
    quiz: [
      quiz('canny-q1', 'Un contour faible est retenu si…', ['il est connecté à un contour fort', 'il est rouge', 'il a k=8'], 0, 'Le cours parle de connexion dans les 8 voisins à un contour fort.'),
      quiz('canny-q2', 'La non maxima suppression sert à…', ['amincir/localiser les contours', 'augmenter la taille mémoire', 'faire une FFT'], 0, 'Elle sélectionne des maxima locaux dans la direction du gradient.'),
      quiz('canny-q3', 'Canny utilise la direction du gradient pour…', ['chercher les maxima locaux', 'choisir un canal RGB', 'calculer une ROI'], 0, 'La comparaison se fait dans cette direction.'),
    ],
    pitfalls: [
      'Réduire Canny à un simple seuil.',
      'Oublier l’étape de non maxima suppression.',
      'Confondre contour faible rejeté et contour faible connecté à un fort.',
    ],
    examSummary: 'Canny est une chaîne : lissage gaussien, calcul des gradients, non maxima suppression, puis double seuillage. Les contours faibles sont gardés seulement s’ils sont connectés à des contours forts. Le résultat est plus fin et mieux localisé qu’un gradient brut.',
  },
  {
    id: 'fourier-bases-frequences',
    chapter: 5,
    number: 1,
    chapterTitle: 'Domaine fréquentiel',
    title: 'Bases de Fourier et fréquences dans l’image',
    shortTitle: 'Bases Fourier',
    status: 'ready',
    focus: 'Sinusoïdes, amplitude, phase, coefficients fréquentiels',
    source: { file: 'Fourier_domaine_frequenciel.md', page: '1-15' },
    modeIntros: {
      learn: 'Comprendre une image comme combinaison de sinusoïdes et de coefficients de fréquence.',
      lab: 'Composer une image avec quelques fréquences et observer son spectre simulé.',
      review: 'Retenir amplitude, phase, domaine spatial et domaine fréquentiel.',
    },
    learnSections: [
      section('Superposition', 'Une image peut être décomposée en somme d’images sinusoïdales', [
        'Le cours répète l’idée qu’une image peut être décrite comme un assemblage de hautes et basses fréquences.',
        'Il indique qu’on peut décomposer une image en somme d’images sinusoïdales.',
        'Les coefficients a(u,v) et b(u,v) donnent la contribution de chaque fréquence dans l’image.',
      ], 'Fourier donne les contributions des fréquences présentes.'),
      section('Amplitude et phase', 'Le domaine fréquentiel encode amplitude et phase', [
        'Le support explique que les amplitudes et les phases sont données par la théorie de Fourier.',
        'Il précise qu’on peut décrire complètement f(x) à travers amplitude et phase.',
        'La transformée de Fourier est en général complexe et contient ces deux informations.',
      ], 'Amplitude + phase = information fréquentielle complète.'),
      section('Formes', 'Les contours abrupts demandent beaucoup de fréquences', [
        'Le cours illustre la fonction box : des contours abrupts nécessitent une superposition de beaucoup de fréquences.',
        'Il montre aussi que la transformée d’une gaussienne est une gaussienne.',
        'Cela relie directement formes spatiales et contenu spectral.',
      ], 'Plus une transition est abrupte, plus le contenu fréquentiel s’élargit.'),
    ],
    figureNotes: [
      fig(c5, 'Fourier_domaine_frequenciel_p5_fig2.jpeg', '5', 'Image comme somme de sinusoïdes', 'La figure montre une superposition de composantes.', 'Une image peut être analysée par fréquences.'),
      fig(c5, 'Fourier_domaine_frequenciel_p9_fig7.jpeg', '9', 'Spatial/fréquentiel sans perte', 'Le support compare domaine spatial et fréquentiel.', 'Le passage de domaine ne doit pas perdre d’information si la transformation est complète.'),
      fig(c5, 'Fourier_domaine_frequenciel_p14_fig2.jpeg', '14', 'Fonction box', 'Les contours abrupts mobilisent beaucoup de fréquences.', 'Les discontinuités ont un spectre large.'),
      fig(c5, 'Fourier_domaine_frequenciel_p15_fig7.jpeg', '15', 'Gaussienne', 'La transformée d’une gaussienne est une gaussienne.', 'Le gaussien est central pour filtrer dans les deux domaines.'),
    ],
    lab: {
      kind: 'fourier',
      title: 'Composer spatial et fréquentiel',
      intro: 'Ajoute des sinusoïdes horizontales/verticales et observe les pics du spectre.',
      sourceNote: 'Fondé sur Fourier_domaine_frequenciel.md pages 1-15.',
      parts: [
        part('sinusoids', 'Sinusoïdes', 'Composer plusieurs fréquences spatiales.', 'Fondé sur la superposition d’images sinusoïdales pages 5-7.'),
        part('amplitude-phase', 'Amplitude / phase', 'Voir amplitude et phase comme informations complémentaires.', 'Fondé sur amplitude et phase pages 7-13.'),
        part('spatial-frequency', 'Spatial ↔ fréquentiel', 'Relier une forme abrupte à un spectre plus large.', 'Fondé sur les exemples box et delta pages 14-15.'),
      ],
    },
    flashcards: [
      card('fourier-coeff', 'Que donnent les coefficients a(u,v), b(u,v) ?', 'La contribution d’une fréquence dans l’image.'),
      card('fourier-domain', 'Que décrit le domaine fréquentiel ?', 'Amplitude et phase des composantes de fréquence.'),
      card('box-freq', 'Pourquoi une box abrupte demande beaucoup de fréquences ?', 'Ses contours abrupts nécessitent une superposition large de fréquences.'),
      card('gaussian-ft', 'Transformée de Fourier d’une gaussienne ?', 'Une gaussienne.'),
    ],
    quiz: [
      quiz('fourier-base-q1', 'Une image peut être vue comme…', ['une somme d’images sinusoïdales', 'un seul pixel', 'un accumulateur Hough uniquement'], 0, 'Le cours donne explicitement cette idée.'),
      quiz('fourier-base-q2', 'La transformée de Fourier contient généralement…', ['amplitude et phase', 'seulement M', 'seulement la couleur rouge'], 0, 'Le support indique qu’elle est complexe et contient ces informations.'),
      quiz('fourier-base-q3', 'Des contours abrupts impliquent…', ['beaucoup de fréquences', 'aucune haute fréquence', 'un seul bit'], 0, 'Le cours le montre avec la fonction box.'),
    ],
    pitfalls: [
      'Parler du spectre sans distinguer amplitude et phase.',
      'Croire que les hautes fréquences sont seulement du bruit.',
      'Oublier que les coefficients indiquent des contributions de fréquences.',
    ],
    examSummary: 'Fourier représente un signal ou une image comme combinaison de sinusoïdes. Les coefficients décrivent la contribution de chaque fréquence ; amplitude et phase portent l’information fréquentielle. Les transitions abruptes nécessitent beaucoup de fréquences, tandis que la gaussienne reste gaussienne par transformée de Fourier.',
  },
  {
    id: 'dft-fft-spectre',
    chapter: 5,
    number: 2,
    chapterTitle: 'Domaine fréquentiel',
    title: 'DFT, FFT et spectre d’amplitudes',
    shortTitle: 'DFT & spectre',
    status: 'ready',
    focus: 'DFT discrète, FFT, spectre 2D, phase',
    source: { file: 'Fourier_domaine_frequenciel.md', page: '19-23, labo 5' },
    modeIntros: {
      learn: 'Comprendre comment la transformée discrète passe d’une image échantillonnée au spectre.',
      lab: 'Simuler la résolution de la DFT et l’affichage du spectre d’amplitudes.',
      review: 'Retenir les formules discrètes, la FFT et le spectre 2D.',
    },
    learnSections: [
      section('Discrétisation', 'La DFT transforme une somme discrète de M échantillons', [
        'Le chapitre explique que l’intégrale devient une somme et que la variable spatiale devient discrète.',
        'Les fréquences possibles deviennent des multiples k de la fréquence fondamentale.',
        'La formule donnée est une somme sur x de s(x)e^{-i2πxk/M}.',
      ], 'DFT = transformée de Fourier adaptée à des échantillons discrets.'),
      section('FFT', 'La FFT calcule efficacement la DFT pour de grands M', [
        'Le support précise qu’on peut écrire la DFT comme un changement de base.',
        'Il ajoute que lorsque M est grand, la FFT exploite les symétries du problème.',
        'Il rappelle notamment la périodicité de la DFT de période M.',
      ], 'FFT = algorithme efficace pour calculer la DFT.'),
      section('2D et labo', 'Pour une image MxN, la DFT s’applique en deux dimensions', [
        'Le cours donne la transformée de Fourier discrète en 2D et son inverse.',
        'Le labo 5 demande get_fft(img), get_fft_spectrum(fft) et get_img(fft).',
        'Il demande ensuite d’afficher le spectre d’amplitudes et de revenir dans le domaine spatial.',
      ], 'Labo 5 : FFT, spectre d’amplitudes, iFFT.'),
    ],
    figureNotes: [
      fig(c5, 'Fourier_domaine_frequenciel_p19_fig5.jpeg', '19', 'DFT', 'La variable spatiale devient discrète.', 'La transformation devient une somme sur les échantillons.'),
      fig(c5, 'Fourier_domaine_frequenciel_p22_fig1.jpeg', '22', 'Spectre d’image', 'Le support affiche des spectres d’amplitudes.', 'Le spectre rend visibles les contributions de fréquence.'),
      fig(c5, 'Fourier_domaine_frequenciel_p23_fig1.jpeg', '23', 'Exemples de spectres', 'Plusieurs images ont des signatures fréquentielles différentes.', 'Le spectre sert à observer le contenu fréquentiel.'),
      fig(c5Lab, 'labo_05_p1_fig1.jpeg', 'labo 5.1', 'FFT et iFFT', 'Le labo montre image, spectre, retour image.', 'La chaîne FFT → spectre → iFFT doit préserver l’image si on ne filtre pas.'),
    ],
    lab: {
      kind: 'fourier',
      title: 'Observer une FFT et son spectre',
      intro: 'Ajuste la résolution et le type de motif pour voir comment le spectre se structure.',
      sourceNote: 'Fondé sur Fourier_domaine_frequenciel.md pages 19-23 et labo_05.md section 1.',
      parts: [
        part('dft', 'DFT', 'Passer d’échantillons à des fréquences discrètes.', 'Fondé sur la DFT page 19.'),
        part('fft', 'FFT', 'Relier efficacité et périodicité de la DFT.', 'Fondé sur les remarques DFT page 20.'),
        part('spectrum', 'Spectre', 'Lire les pics d’amplitude d’une image 2D.', 'Fondé sur spectre d’image pages 22-23 et labo 5.'),
      ],
    },
    flashcards: [
      card('dft-sum', 'Dans la DFT, que devient l’intégrale ?', 'Une somme.'),
      card('dft-frequency', 'Quelles fréquences possibles en DFT ?', 'Des k multiples liés à la taille d’échantillonnage.'),
      card('fft-role', 'Rôle de la FFT ?', 'Calculer efficacement la DFT pour de grands signaux/images.'),
      card('lab5-functions', 'Trois fonctions demandées au labo 5 ?', 'get_fft, get_fft_spectrum, get_img.'),
    ],
    quiz: [
      quiz('dft-q1', 'La DFT travaille sur…', ['des échantillons discrets', 'des formes arbitraires Hough', 'des cônes rétiniens'], 0, 'Le cours transforme x continu en x discret.'),
      quiz('dft-q2', 'La FFT est surtout…', ['un calcul efficace de la DFT', 'un filtre médian', 'une morphologie binaire'], 0, 'Le support l’associe à l’efficacité quand M est grand.'),
      quiz('dft-q3', 'Le labo 5 demande de revenir à l’image avec…', ['iFFT/get_img', 'Sobel uniquement', 'dilatation seulement'], 0, 'get_img retourne une image depuis sa FFT.'),
    ],
    pitfalls: [
      'Confondre DFT comme concept et FFT comme algorithme efficace.',
      'Afficher un spectre sans comprendre qu’il vient d’amplitudes.',
      'Oublier que la phase fait aussi partie de l’information.',
    ],
    examSummary: 'La DFT remplace l’intégrale de Fourier par une somme sur échantillons discrets. En 2D, elle s’applique aux images MxN. La FFT calcule cette transformée efficacement. Le labo 5 demande FFT, affichage du spectre d’amplitudes et retour par transformée inverse.',
  },
  {
    id: 'filtrage-frequentiel',
    chapter: 5,
    number: 3,
    chapterTitle: 'Domaine fréquentiel',
    title: 'Filtrage dans le domaine fréquentiel',
    shortTitle: 'Filtrage freq.',
    status: 'ready',
    focus: 'Fonction de transfert H(p,q), passe-bas, passe-haut, retour spatial',
    source: { file: 'Fourier_domaine_frequenciel.md', page: '16-18, 24-31, labo 5' },
    modeIntros: {
      learn: 'Comprendre pourquoi filtrer en fréquentiel revient à multiplier par une fonction de transfert.',
      lab: 'Dessiner un filtre passe-bas ou passe-haut dans le spectre puis observer l’image reconstruite.',
      review: 'Retenir g(x,y)=Real[IDFT(H(p,q) S(p,q))].',
    },
    learnSections: [
      section('Convolution', 'La convolution dans le domaine spatial devient un produit en fréquentiel', [
        'Le chapitre rappelle la convolution puis donne le théorème de convolution.',
        'Il montre que la transformée de Fourier de la convolution est le produit des transformées.',
        'Pour filtrer : appliquer FT, multiplier en fréquentiel, puis appliquer IFT.',
      ], 'Spatial : convolution ; fréquentiel : multiplication.'),
      section('Fonction de transfert', 'Le filtre fréquentiel est une fonction H(p,q)', [
        'Le cours donne g(x,y)=Real[IDFT(H(p,q) S(p,q))].',
        'H(p,q) est la fonction de transfert, c’est-à-dire la forme du filtre dans le domaine fréquentiel.',
        'Comme en spatial, plusieurs formes de filtres sont possibles.',
      ], 'H(p,q) choisit quelles fréquences passent.'),
      section('Passe-bas / passe-haut', 'Les filtres fréquentiels sélectionnent des zones du spectre', [
        'Le support illustre des filtres passe-bas et passe-haut dans le domaine fréquentiel.',
        'Le passe-bas garde les basses fréquences et produit du lissage.',
        'Le passe-haut garde les hautes fréquences et met en évidence contours ou détails.',
      ], 'Filtrer le spectre revient à choisir quelles fréquences conserver.'),
    ],
    figureNotes: [
      fig(c5, 'Fourier_domaine_frequenciel_p18_fig2.jpeg', '18', 'Convolution et gaussien', 'Le support lie convolution et filtrage gaussien.', 'Le domaine fréquentiel transforme la convolution en multiplication.'),
      fig(c5, 'Fourier_domaine_frequenciel_p24_fig1.jpeg', '24', 'Filtrage gaussien fréquentiel', 'Les étapes fondamentales de filtrage sont données.', 'La fonction de transfert H(p,q) agit sur le spectre.'),
      fig(c5, 'Fourier_domaine_frequenciel_p25_fig1.jpeg', '25', 'Passe-bas', 'Le filtre conserve le centre fréquentiel.', 'Les basses fréquences correspondent au contenu lisse.'),
      fig(c5, 'Fourier_domaine_frequenciel_p26_fig1.jpeg', '26', 'Passe-haut', 'Le filtre conserve les fréquences hautes.', 'Les contours sont révélés par sélection fréquentielle.'),
    ],
    lab: {
      kind: 'fourier',
      title: 'Dessiner un filtre H(p,q)',
      intro: 'Change le rayon de coupure et alterne passe-bas/passe-haut pour reconstruire l’image filtrée.',
      sourceNote: 'Fondé sur Fourier_domaine_frequenciel.md pages 16-18 et 24-31, et labo_05.md section 3.',
      parts: [
        part('transfer', 'H(p,q)', 'Voir le filtre comme fonction de transfert.', 'Fondé sur la formule de filtrage page 24.'),
        part('lowpass', 'Passe-bas', 'Conserver les basses fréquences et lisser.', 'Fondé sur passe-bas page 25.'),
        part('highpass', 'Passe-haut', 'Conserver les hautes fréquences et révéler les contours.', 'Fondé sur passe-haut page 26.'),
      ],
    },
    flashcards: [
      card('conv-theorem', 'Que devient une convolution en fréquentiel ?', 'Un produit.'),
      card('transfer-h', 'Que représente H(p,q) ?', 'La fonction de transfert du filtre.'),
      card('freq-filter-steps', 'Étapes pour filtrer en fréquentiel ?', 'FT, multiplication par H, IFT.'),
      card('freq-return', 'Formule clé donnée pour le retour spatial ?', 'g(x,y)=Real[IDFT(H(p,q) S(p,q))].'),
    ],
    quiz: [
      quiz('filter-freq-q1', 'Dans le domaine fréquentiel, le filtrage se fait par…', ['multiplication', 'dilatation', 'seuillage RGB uniquement'], 0, 'Le théorème de convolution donne un produit.'),
      quiz('filter-freq-q2', 'Un passe-bas fréquentiel produit typiquement…', ['du lissage', 'un accumulateur de lignes', 'une érosion'], 0, 'Il garde les basses fréquences.'),
      quiz('filter-freq-q3', 'H(p,q) désigne…', ['la fonction de transfert', 'la hauteur M', 'un bit de poids fort'], 0, 'Le cours nomme le filtre fonction de transfert.'),
    ],
    pitfalls: [
      'Oublier le retour par transformée inverse.',
      'Confondre filtre spatial et filtre fréquentiel sans relier convolution/multiplication.',
      'Croire que passe-haut améliore toujours l’image sans tenir compte du bruit.',
    ],
    examSummary: 'Le filtrage fréquentiel applique une transformée de Fourier, multiplie le spectre par une fonction de transfert H(p,q), puis revient au domaine spatial par IDFT. Un passe-bas lisse en gardant les basses fréquences ; un passe-haut révèle les hautes fréquences.',
  },
  {
    id: 'aliasing-nyquist',
    chapter: 5,
    number: 4,
    chapterTitle: 'Domaine fréquentiel',
    title: 'Échantillonnage, aliasing et Nyquist-Shannon',
    shortTitle: 'Aliasing',
    status: 'ready',
    focus: 'Sous-échantillonnage, fausse identité, fréquence > 2 Fmax',
    source: { file: 'Fourier_domaine_frequenciel.md', page: '32-33' },
    modeIntros: {
      learn: 'Comprendre pourquoi deux signaux différents peuvent devenir identiques après digitalisation.',
      lab: 'Changer la fréquence d’échantillonnage et voir apparaître une fausse identité.',
      review: 'Retenir le critère de Nyquist-Shannon et le danger du sous-échantillonnage.',
    },
    learnSections: [
      section('Aliasing', 'Des signaux différents peuvent avoir la même version digitalisée', [
        'Le chapitre présente l’aliasing comme une fausse identité.',
        'Les signaux sont différents mais leurs versions digitalisées peuvent devenir identiques.',
        'Le problème vient d’un échantillonnage insuffisant par rapport aux fréquences présentes.',
      ], 'Aliasing = deux signaux différents deviennent indistinguables après échantillonnage.'),
      section('Sampling', 'Il faut échantillonner assez vite pour ne pas perdre d’information', [
        'Le support pose la question : à quelle fréquence doit-on sampler le signal afin de ne pas perdre d’information ?',
        'Il compare échantillonnage adéquat et sous-échantillonnage.',
        'Cette question est équivalente à dire que la transformée de Fourier ne change plus.',
      ], 'La fréquence d’échantillonnage doit être liée au contenu fréquentiel maximal.'),
      section('Nyquist-Shannon', 'La fréquence d’échantillonnage doit être supérieure au double de la fréquence maximale', [
        'Le cours énonce le théorème de Nyquist-Shannon.',
        'La représentation discrète exige des échantillons régulièrement espacés à une fréquence d’échantillonnage supérieure au double de la fréquence maximale présente.',
        'Il précise aussi que l’échantillonnage exactement à la fréquence de Nyquist peut être problématique.',
      ], 'Critère du support : fréquence d’échantillonnage > 2 × fréquence maximale.'),
    ],
    figureNotes: [
      fig(c5, 'Fourier_domaine_frequenciel_p32_fig2.jpeg', '32', 'Aliasing', 'Des signaux différents donnent la même version digitalisée.', 'Le sous-échantillonnage peut cacher la vraie fréquence.'),
      fig(c5, 'Fourier_domaine_frequenciel_p33_fig3.jpeg', '33', 'Échantillonnage adéquat', 'Les échantillons suivent suffisamment le signal.', 'Échantillonner assez vite préserve l’information.'),
      fig(c5, 'Fourier_domaine_frequenciel_p33_fig5.jpeg', '33', 'Sous-échantillonnage', 'Le signal est mal représenté.', 'Le spectre peut être replié ou mal interprété.'),
      fig(c5, 'Fourier_domaine_frequenciel_p33_fig8.jpeg', '33', 'Fréquence de Nyquist', 'Le support signale que le cas exact peut être problématique.', 'La condition stricte supérieure au double évite l’ambiguïté.'),
    ],
    lab: {
      kind: 'fourier',
      title: 'Faire apparaître l’aliasing',
      intro: 'Augmente la fréquence du signal ou réduit l’échantillonnage pour voir deux motifs devenir confondus.',
      sourceNote: 'Fondé sur Fourier_domaine_frequenciel.md pages 32-33.',
      parts: [
        part('sampling', 'Sampling', 'Changer le nombre d’échantillons par période.', 'Fondé sur la question d’échantillonnage page 33.'),
        part('aliasing', 'Aliasing', 'Voir une fausse identité apparaître.', 'Fondé sur aliasing page 32.'),
        part('nyquist', 'Nyquist', 'Comparer la fréquence d’échantillonnage à 2 Fmax.', 'Fondé sur Nyquist-Shannon page 33.'),
      ],
    },
    flashcards: [
      card('aliasing-def', 'Qu’est-ce que l’aliasing dans ce support ?', 'Une fausse identité : des signaux différents ont la même version digitalisée.'),
      card('nyquist-rule', 'Condition Nyquist-Shannon donnée ?', 'Échantillonner à une fréquence supérieure au double de la fréquence maximale.'),
      card('sampling-risk', 'Risque du sous-échantillonnage ?', 'Perdre l’information ou représenter une fausse fréquence.'),
      card('nyquist-exact', 'Que dit le cours sur le cas exactement à Nyquist ?', 'Il peut être problématique.'),
    ],
    quiz: [
      quiz('alias-q1', 'L’aliasing peut rendre deux signaux…', ['indistinguables après digitalisation', 'plus colorés', 'plus morphologiques'], 0, 'Le cours parle de fausse identité.'),
      quiz('alias-q2', 'Nyquist-Shannon demande une fréquence d’échantillonnage…', ['supérieure au double de Fmax', 'égale à k bits', 'inférieure à rho'], 0, 'Le support énonce cette condition.'),
      quiz('alias-q3', 'Le sous-échantillonnage entraîne…', ['une perte ou ambiguïté d’information', 'une ouverture morphologique', 'une synthèse additive'], 0, 'Les exemples du support comparent sampling adéquat et sous-échantillonnage.'),
    ],
    pitfalls: [
      'Écrire “au moins deux fois” sans noter que le support insiste sur supérieur au double.',
      'Penser qu’une image échantillonnée est toujours fidèle au signal original.',
      'Oublier que l’aliasing se comprend dans le domaine fréquentiel.',
    ],
    examSummary: 'L’aliasing est une fausse identité : des signaux différents peuvent donner la même version digitalisée. Pour éviter la perte d’information, le théorème de Nyquist-Shannon exige un échantillonnage régulier à une fréquence supérieure au double de la fréquence maximale présente.',
  },
  {
    id: 'morphologie-elements-structurants',
    chapter: 6,
    number: 1,
    chapterTitle: 'Morphologie',
    title: 'Morphologie mathématique et élément structurant',
    shortTitle: 'Élément struct.',
    status: 'ready',
    focus: 'Formes, ensembles, élément structurant, translation',
    source: { file: 'morphology.md', page: '1-2' },
    modeIntros: {
      learn: 'Comprendre la morphologie comme étude des formes avec un élément structurant.',
      lab: 'Déplacer un élément structurant sur une grille binaire.',
      review: 'Retenir le rôle de sonde et la translation de l’élément structurant.',
    },
    learnSections: [
      section('Définition', 'La morphologie mathématique étudie les formes avec des outils mathématiques', [
        'Le cours rappelle l’origine du terme morphologie : étude des formes.',
        'Il indique qu’elle permet d’extraire des composants d’une image et de décrire la forme d’une région.',
        'Les applications citées incluent filtrage, segmentation, contour et squelette.',
      ], 'Morphologie = outils mathématiques pour étudier les formes.'),
      section('Sonde', 'L’élément structurant sert de sonde', [
        'L’idée de base donnée par le support est d’étudier un ensemble à l’aide d’un autre ensemble appelé élément structurant.',
        'Cet élément est promené sur l’image à traiter.',
        'À chaque position, on étudie la relation entre les deux ensembles.',
      ], 'Élément structurant = sonde déplacée sur l’image.'),
      section('Translation', 'Les opérations morphologiques déplacent l’élément structurant', [
        'Le cours introduit la translation (B)z pour déplacer l’élément structurant.',
        'Il compare ce déplacement à la manière d’une convolution.',
        'Le choix de l’élément structurant dépend de la tâche à accomplir.',
      ], 'On choisit l’élément structurant selon l’objectif.'),
    ],
    figureNotes: [
      fig(c6, 'morphology_p1_fig5.jpeg', '1', 'Élément structurant', 'La figure montre l’élément structurant et son origine.', 'L’origine est le point de référence déplacé sur l’image.'),
      fig(c6, 'morphology_p2_fig4.jpeg', '2', 'Translation', 'Le support illustre le déplacement de B.', 'Les opérations analysent la relation entre deux ensembles.'),
      fig(c6Lab, 'labo_06_p1_fig7.jpeg', 'labo 6', 'Image source labo', 'Le labo applique les opérations morphologiques binaires.', 'Le contenu théorique se manipule sur des images binaires.'),
    ],
    lab: {
      kind: 'morphology',
      title: 'Promener une sonde sur une forme',
      intro: 'Change la forme de l’élément structurant et déplace son origine sur une image binaire.',
      sourceNote: 'Fondé sur morphology.md pages 1-2 et labo_06.md.',
      parts: [
        part('structuring', 'Élément structurant', 'Changer la forme de la sonde.', 'Fondé sur morphology.md page 1.'),
        part('translation', 'Translation', 'Déplacer Bz sur une forme binaire.', 'Fondé sur la translation page 2.'),
        part('task-choice', 'Choix de tâche', 'Relier la forme de B à l’effet recherché.', 'Fondé sur le choix selon la tâche page 2.'),
      ],
    },
    flashcards: [
      card('morph-def', 'Que signifie morphologie ?', 'Étude des formes.'),
      card('se-role', 'Rôle de l’élément structurant ?', 'Servir de sonde déplacée sur l’image.'),
      card('se-origin', 'Pourquoi l’origine de B compte ?', 'Elle sert de point de référence lors du déplacement.'),
      card('se-choice', 'Comment choisir B ?', 'En fonction de la tâche à accomplir.'),
    ],
    quiz: [
      quiz('morph-q1', 'La morphologie permet notamment…', ['filtrage, segmentation, contour, squelette', 'uniquement RGB', 'uniquement FFT'], 0, 'Le cours liste ces applications.'),
      quiz('morph-q2', 'L’élément structurant est…', ['une sonde', 'un canal bleu', 'un angle theta seulement'], 0, 'Le support emploie cette idée de sonde.'),
      quiz('morph-q3', 'Les opérations morphologiques déplacent B par…', ['translation', 'gamma encoding', 'histogramme cumulatif'], 0, 'Le cours introduit (B)z.'),
    ],
    pitfalls: [
      'Oublier que l’élément structurant a une origine.',
      'Choisir une forme de B sans lien avec la tâche.',
      'Confondre morphologie binaire et filtre de convolution linéaire.',
    ],
    examSummary: 'La morphologie mathématique étudie les formes. Elle analyse un ensemble avec un élément structurant qui sert de sonde et se déplace par translation. Le choix de cet élément dépend de la tâche : filtrer, segmenter, détecter des contours ou décrire une forme.',
  },
  {
    id: 'erosion-dilatation',
    chapter: 6,
    number: 2,
    chapterTitle: 'Morphologie',
    title: 'Érosion et dilatation',
    shortTitle: 'Érosion/dilatation',
    status: 'ready',
    focus: 'Amincir, épaissir, contenir B, intersection avec A',
    source: { file: 'morphology.md', page: '3-6, labo 6' },
    modeIntros: {
      learn: 'Comprendre les deux opérations fondamentales de morphologie binaire.',
      lab: 'Comparer érosion et dilatation avec plusieurs éléments structurants et itérations.',
      review: 'Retenir les critères “entièrement contenu” et “au moins un pixel contenu”.',
    },
    learnSections: [
      section('Érosion', 'L’érosion garde les positions où B est entièrement contenu dans A', [
        'Le cours définit l’érosion comme la recherche des points z où l’élément structurant peut être placé entièrement dans A.',
        'Elle permet d’amincir un objet.',
        'Elle peut supprimer les détails plus petits que l’élément structurant et séparer des objets au niveau d’étranglements.',
      ], 'Érosion = B entièrement contenu dans A.'),
      section('Dilatation', 'La dilatation garde les positions où B touche au moins un pixel de A', [
        'Le cours définit la dilatation comme la recherche des points z où B a au moins un pixel contenu dans A.',
        'Elle permet d’épaissir un objet.',
        'Elle peut connecter des objets proches et combler des trous étroits.',
      ], 'Dilatation = B intersecte A au moins en un pixel.'),
      section('Labo', 'OpenCV applique erode et dilate sur images binaires', [
        'Le labo 6 demande d’utiliser erode, dilate, morphologyEx et getStructuringElement.',
        'Il faut choisir taille, forme de l’élément structurant et nombre d’itérations.',
        'Ces paramètres changent directement les résultats obtenus.',
      ], 'Labo 6 : forme, taille, itérations sont des décisions expérimentales.'),
    ],
    figureNotes: [
      fig(c6, 'morphology_p3_fig2.jpeg', '3', 'Érosion', 'B doit être entièrement contenu dans A.', 'L’érosion amincit et supprime les détails trop petits.'),
      fig(c6, 'morphology_p3_fig9.jpeg', '3', 'Éléments structurants', 'Le support montre plusieurs formes possibles.', 'La forme de B influence le résultat.'),
      fig(c6, 'morphology_p5_fig2.jpeg', '5', 'Dilatation', 'B doit toucher au moins un pixel de A.', 'La dilatation épaissit et connecte.'),
      fig(c6, 'morphology_p6_fig4.jpeg', '6', 'Dilatation exemple', 'Le support illustre l’effet de formes différentes.', 'Les résultats dépendent de l’élément structurant.'),
    ],
    lab: {
      kind: 'morphology',
      title: 'Amincir ou épaissir une forme',
      intro: 'Choisis érosion ou dilatation, puis change la forme et les itérations de l’élément structurant.',
      sourceNote: 'Fondé sur morphology.md pages 3-6 et labo_06.md exercice 2.2.',
      parts: [
        part('erosion', 'Érosion', 'Retenir seulement les positions où B rentre dans A.', 'Fondé sur la définition d’érosion page 3.'),
        part('dilation', 'Dilatation', 'Ajouter les positions où B touche A.', 'Fondé sur la définition de dilatation page 5.'),
        part('iterations', 'Itérations', 'Appliquer plusieurs fois pour voir l’effet cumulatif.', 'Fondé sur les remarques “on peut éroder/dilater plusieurs fois”.'),
      ],
    },
    flashcards: [
      card('erosion-def', 'Critère de l’érosion ?', 'B doit être entièrement contenu dans A.'),
      card('erosion-effect', 'Effet principal de l’érosion ?', 'Amincir/rétrécir les objets et supprimer petits détails.'),
      card('dilation-def', 'Critère de la dilatation ?', 'B doit avoir au moins un pixel contenu dans A.'),
      card('dilation-effect', 'Effet principal de la dilatation ?', 'Épaissir/élargir les objets et connecter des objets proches.'),
    ],
    quiz: [
      quiz('erode-q1', 'L’érosion garde les positions où…', ['B est entièrement contenu dans A', 'B ne touche jamais A', 'theta vaut 90°'], 0, 'C’est la définition donnée dans le cours.'),
      quiz('dilate-q2', 'La dilatation peut…', ['combler des trous étroits', 'calculer une FFT', 'décomposer RGB'], 0, 'Le cours cite les trous étroits et connexions proches.'),
      quiz('morph-lab-q3', 'Dans le labo 6, il faut choisir…', ['forme, taille et itérations', 'seulement la couleur rouge', 'seulement la phase'], 0, 'Le labo demande ces paramètres.'),
    ],
    pitfalls: [
      'Inverser les critères de l’érosion et de la dilatation.',
      'Croire que forme et taille de B sont secondaires.',
      'Oublier que plusieurs itérations amplifient l’effet.',
    ],
    examSummary: 'L’érosion garde les positions où l’élément structurant est entièrement contenu dans l’objet ; elle amincit et supprime de petits détails. La dilatation garde les positions où l’élément structurant touche l’objet ; elle épaissit, connecte et comble des trous étroits.',
  },
  {
    id: 'ouverture-fermeture',
    chapter: 6,
    number: 3,
    chapterTitle: 'Morphologie',
    title: 'Ouverture, fermeture et dualité',
    shortTitle: 'Ouverture/fermeture',
    status: 'ready',
    focus: 'Érosion puis dilatation, dilatation puis érosion, trous, bruit',
    source: { file: 'morphology.md', page: '8-13, labo 6' },
    modeIntros: {
      learn: 'Comprendre les combinaisons érosion/dilatation et leurs usages.',
      lab: 'Comparer ouverture, fermeture et leurs enchaînements sur une forme bruitée.',
      review: 'Retenir les ordres d’opération et les effets attendus.',
    },
    learnSections: [
      section('Non-inverses', 'Érosion et dilatation ne sont pas des inverses simples', [
        'Le cours pose explicitement la question et répond non.',
        'L’érosion peut créer du vide qui ne pourra plus être rempli.',
        'La dilatation peut combler des trous qui ne pourront plus être recréés par érosion.',
      ], 'Érosion puis dilatation n’annule pas simplement l’érosion.'),
      section('Ouverture', 'L’ouverture est une érosion suivie d’une dilatation', [
        'Le support définit l’ouverture comme érosion puis dilatation.',
        'Il indique que l’ouverture est un sous-ensemble de A.',
        'Ses usages incluent lisser les contours, enlever petits objets ou bruit, séparer certains objets.',
      ], 'Ouverture = érosion puis dilatation.'),
      section('Fermeture', 'La fermeture est une dilatation suivie d’une érosion', [
        'Le support définit la fermeture comme dilatation puis érosion.',
        'Il indique que A est contenu dans la fermeture.',
        'Ses usages incluent boucher trous et gaps étroits et épaissir des connecteurs étroits.',
      ], 'Fermeture = dilatation puis érosion.'),
    ],
    figureNotes: [
      fig(c6, 'morphology_p9_fig2.jpeg', '9', 'Combinaisons', 'Le support teste des combinaisons sur une forme.', 'L’ordre des opérations change le résultat.'),
      fig(c6, 'morphology_p10_fig2.jpeg', '10', 'Ouverture', 'La figure définit érosion puis dilatation.', 'L’ouverture retire certains éléments et lisse.'),
      fig(c6, 'morphology_p11_fig2.jpeg', '11', 'Fermeture', 'La figure définit dilatation puis érosion.', 'La fermeture bouche des trous/gaps étroits.'),
      fig(c6, 'morphology_p13_fig2.jpeg', '13', 'Empreinte digitale', 'Le support compare ouverture, fermeture et image source.', 'Les opérations se combinent selon la tâche.'),
    ],
    lab: {
      kind: 'morphology',
      title: 'Nettoyer une image binaire',
      intro: 'Applique ouverture, fermeture, puis leurs enchaînements pour voir ce qui disparaît ou se connecte.',
      sourceNote: 'Fondé sur morphology.md pages 8-13 et labo_06.md exercice 2.2.',
      parts: [
        part('opening', 'Ouverture', 'Érosion puis dilatation pour enlever petits objets.', 'Fondé sur la définition et usages page 10.'),
        part('closing', 'Fermeture', 'Dilatation puis érosion pour boucher trous/gaps.', 'Fondé sur la définition et usages page 11.'),
        part('duality', 'Dualité', 'Relier ouverture et fermeture par complémentation.', 'Fondé sur la dualité ouverture/fermeture pages 8-11.'),
      ],
    },
    flashcards: [
      card('opening-def', 'Définition de l’ouverture ?', 'Érosion suivie d’une dilatation.'),
      card('opening-use', 'Usage typique de l’ouverture ?', 'Enlever petits objets/bruit ou séparer certains objets.'),
      card('closing-def', 'Définition de la fermeture ?', 'Dilatation suivie d’une érosion.'),
      card('closing-use', 'Usage typique de la fermeture ?', 'Boucher les trous et gaps étroits.'),
    ],
    quiz: [
      quiz('open-close-q1', 'L’ouverture est…', ['érosion puis dilatation', 'dilatation puis érosion', 'FFT puis iFFT'], 0, 'Le support la définit ainsi.'),
      quiz('open-close-q2', 'La fermeture est souvent utilisée pour…', ['boucher trous et gaps étroits', 'calculer gamma', 'choisir rho'], 0, 'Le cours liste ces usages.'),
      quiz('open-close-q3', 'Le cours dit qu’érosion et dilatation sont…', ['duales mais pas inverses simples', 'toujours identiques', 'hors morphologie'], 0, 'Il répond non à la question des opérations inverses, puis parle de dualité.'),
    ],
    pitfalls: [
      'Inverser l’ordre ouverture/fermeture.',
      'Croire que fermeture et ouverture sont interchangeables.',
      'Oublier que l’opération dépend de la forme de l’élément structurant.',
    ],
    examSummary: 'L’ouverture est érosion puis dilatation : elle retire de petits objets, bruit ou séparations fines. La fermeture est dilatation puis érosion : elle bouche trous et gaps étroits. Érosion et dilatation sont duales mais pas de simples inverses.',
  },
  {
    id: 'gradient-morphologique-contours',
    chapter: 6,
    number: 4,
    chapterTitle: 'Morphologie',
    title: 'Gradient morphologique et contours',
    shortTitle: 'Gradient morpho.',
    status: 'ready',
    focus: 'Gradient interne, externe, somme, contours morphologiques',
    source: { file: 'morphology.md', page: '7, 13, labo 6' },
    modeIntros: {
      learn: 'Comprendre comment les contours peuvent être extraits par différence morphologique.',
      lab: 'Comparer contours internes et externes obtenus depuis érosion/dilatation.',
      review: 'Retenir les définitions de gradient interne, externe et morphologique.',
    },
    learnSections: [
      section('Contours', 'Le gradient morphologique identifie les pixels sur le contour', [
        'Le cours introduit les gradients morphologiques pour identifier les pixels sur le contour d’un objet.',
        'Il distingue le gradient externe et le gradient interne.',
        'Le gradient morphologique combine ces informations.',
      ], 'La morphologie peut produire des contours sans dérivée linéaire.'),
      section('Interne / externe', 'Interne et externe regardent deux côtés du contour', [
        'Le gradient externe correspond aux pixels du background ajoutés lors de la dilatation.',
        'Le gradient interne correspond aux pixels de l’objet retirés par l’érosion.',
        'La somme des gradients interne et externe donne une lecture complète autour du contour.',
      ], 'Externe = ajouté par dilatation ; interne = retiré par érosion.'),
      section('Labo', 'Le labo demande contours extérieurs et intérieurs après nettoyage', [
        'Le labo 6 demande des contours extérieurs et intérieurs appliqués à “fermeture puis ouverture”.',
        'Cela signifie qu’on nettoie d’abord l’image binaire avant d’extraire les contours.',
        'La qualité dépend donc de toute la chaîne morphologique précédente.',
      ], 'Contours morphologiques utiles après nettoyage binaire.'),
    ],
    figureNotes: [
      fig(c6, 'morphology_p7_fig5.jpeg', '7', 'Gradient morphologique', 'Le support distingue gradient interne et externe.', 'Les contours peuvent être vus comme ajouts/retraits morphologiques.'),
      fig(c6, 'morphology_p7_fig7.jpeg', '7', 'Gradient interne', 'La figure montre un contour par érosion.', 'Les pixels retirés décrivent le bord intérieur.'),
      fig(c6, 'morphology_p7_fig11.jpeg', '7', 'Somme des gradients', 'La somme combine interne et externe.', 'Le contour complet peut être obtenu par combinaison.'),
      fig(c6, 'morphology_p13_fig4.jpeg', '13', 'Empreinte nettoyée', 'Le support illustre les effets sur empreinte.', 'Les opérations doivent être choisies selon la structure à conserver.'),
    ],
    lab: {
      kind: 'morphology',
      title: 'Extraire des contours morphologiques',
      intro: 'Nettoie la forme puis compare contour interne, externe et gradient complet.',
      sourceNote: 'Fondé sur morphology.md page 7 et labo_06.md exercice 2.2.',
      parts: [
        part('internal', 'Interne', 'Afficher les pixels retirés par érosion.', 'Fondé sur gradient interne page 7.'),
        part('external', 'Externe', 'Afficher les pixels ajoutés par dilatation.', 'Fondé sur gradient externe page 7.'),
        part('fingerprint', 'Nettoyage', 'Appliquer les contours après ouverture/fermeture.', 'Fondé sur labo_06.md et exemple empreinte page 13.'),
      ],
    },
    flashcards: [
      card('grad-external', 'Gradient externe ?', 'Pixels du background ajoutés lors de la dilatation.'),
      card('grad-internal', 'Gradient interne ?', 'Pixels de l’objet retirés par l’érosion.'),
      card('grad-sum', 'Gradient morphologique complet ?', 'Combinaison/somme des gradients interne et externe.'),
      card('contour-clean', 'Pourquoi nettoyer avant contours ?', 'Pour extraire des contours sur une forme binaire plus stable.'),
    ],
    quiz: [
      quiz('grad-morph-q1', 'Le gradient externe correspond à…', ['des pixels ajoutés par dilatation', 'des pixels de phase', 'un spectre FFT'], 0, 'C’est la définition du support.'),
      quiz('grad-morph-q2', 'Le gradient interne correspond à…', ['des pixels retirés par érosion', 'des canaux RGB', 'des votes Hough'], 0, 'C’est la définition du support.'),
      quiz('grad-morph-q3', 'Dans le labo 6, les contours sont appliqués après…', ['fermeture puis ouverture', 'gamma puis log', 'Hough puis FFT'], 0, 'Le labo cite explicitement cette chaîne.'),
    ],
    pitfalls: [
      'Confondre gradient morphologique et gradient différentiel Sobel.',
      'Inverser interne et externe.',
      'Extraire les contours avant nettoyage alors que le labo demande une chaîne nettoyée.',
    ],
    examSummary: 'Le gradient morphologique extrait les contours à partir d’érosion et dilatation. Le gradient externe correspond aux pixels ajoutés par dilatation ; l’interne aux pixels retirés par érosion. Leur combinaison donne un contour complet, souvent après nettoyage morphologique.',
  },
  {
    id: 'hough-principe-formes',
    chapter: 7,
    number: 1,
    chapterTitle: 'Transformation de Hough',
    title: 'Principe de Hough : détecter des formes',
    shortTitle: 'Principe Hough',
    status: 'ready',
    focus: 'Formes analytiques, lignes, cercles, contours, robustesse',
    source: { file: 'transformation_de_hough.md', page: '1-4' },
    modeIntros: {
      learn: 'Comprendre Hough comme extraction de formes définies par peu de paramètres.',
      lab: 'Activer des points de contour et voir quelles formes deviennent détectables.',
      review: 'Retenir les usages, les étapes et pourquoi les contours sont l’entrée de Hough.',
    },
    learnSections: [
      section('Présentation', 'Hough extrait des formes définies analytiquement', [
        'Le cours présente la transformation de Hough comme une technique d’extraction de formes.',
        'Dans sa forme de base, elle permet la détection de lignes.',
        'Dans une forme étendue, elle peut détecter cercles, ellipses ou segments.',
      ], 'Hough détecte des formes paramétrables, surtout des lignes dans la version de base.'),
      section('Difficultés', 'Hough est utile avec contours incomplets, bruit et données étrangères', [
        'L’exemple des roues mentionne données étrangères, données incomplètes et bruit dans les contours.',
        'L’intérêt est de retrouver une forme malgré ces perturbations.',
        'Le chapitre pose donc Hough comme méthode robuste de vote sur des paramètres communs.',
      ], 'Le vote permet de tolérer bruit et contours incomplets.'),
      section('Étapes', 'La détection de formes s’appuie sur les contours', [
        'Le support donne une première étape de détection de contours : grayscale, lissage, contours, seuillage.',
        'Ensuite, l’algorithme de Hough identifie ce qu’il y a de commun aux pixels qui forment le contour.',
        'Le labo 7 reprend exactement cette chaîne : prétraitement, Hough, lignes détectées.',
      ], 'Hough travaille sur des points de contour, pas sur une image brute non préparée.'),
    ],
    figureNotes: [
      fig(c7, 'transformation_de_hough_p2_fig2.jpeg', '2', 'Roues et cercles', 'Le support montre un cas de détection de cercles.', 'Hough peut s’étendre au-delà des lignes.'),
      fig(c7, 'transformation_de_hough_p3_fig2.jpeg', '3', 'Détection de lignes', 'Le chapitre introduit la détection de droites.', 'La version de base cible les lignes.'),
      fig(c7, 'transformation_de_hough_p4_fig1.jpeg', '4', 'Étapes', 'La chaîne commence par des contours.', 'Le prétraitement conditionne la qualité de Hough.'),
      fig(c7Lab, 'labo_07_p0_fig2.jpeg', 'labo 7', 'Objectif labo', 'Le labo demande de détecter des lignes.', 'Le prototype prépare la structure demandée.'),
    ],
    lab: {
      kind: 'hough',
      title: 'Passer des contours aux formes',
      intro: 'Ajoute du bruit ou masque des points et observe comment le vote peut encore faire émerger une ligne.',
      sourceNote: 'Fondé sur transformation_de_hough.md pages 1-4 et labo_07.md section 1.',
      parts: [
        part('forms', 'Formes', 'Choisir ligne ou cercle comme famille paramétrable.', 'Fondé sur la présentation de Hough page 1.'),
        part('edges', 'Contours', 'Voir pourquoi le prétraitement fournit les points utiles.', 'Fondé sur les étapes page 4.'),
        part('robustness', 'Robustesse', 'Tester bruit et données manquantes.', 'Fondé sur l’exemple des roues page 2.'),
      ],
    },
    flashcards: [
      card('hough-basic', 'Forme de base détectée par Hough ?', 'Les lignes.'),
      card('hough-extended', 'Formes possibles en version étendue ?', 'Cercles, ellipses, segments.'),
      card('hough-input', 'Sur quoi s’appuie la détection ?', 'Sur les contours, après prétraitement.'),
      card('hough-robust', 'Pourquoi Hough est utile avec du bruit ?', 'Le vote peut faire émerger des paramètres communs malgré des points parasites.'),
    ],
    quiz: [
      quiz('hough-principle-q1', 'La transformation de Hough sert à…', ['extraire des formes', 'faire du gamma encoding', 'calculer une médiane'], 0, 'C’est la présentation du chapitre.'),
      quiz('hough-principle-q2', 'Dans sa forme de base, Hough détecte…', ['des lignes', 'des canaux RGB', 'des bits de poids faible'], 0, 'Le support le dit explicitement.'),
      quiz('hough-principle-q3', 'Avant Hough, le cours liste…', ['grayscale, lissage, contours, seuillage', 'uniquement ouverture', 'uniquement FFT'], 0, 'Ces étapes sont données page 4.'),
    ],
    pitfalls: [
      'Appliquer Hough sans prétraitement de contours.',
      'Croire que Hough détecte seulement des formes parfaites et complètes.',
      'Confondre forme de base lignes et extensions cercles/ellipses.',
    ],
    examSummary: 'La transformation de Hough extrait des formes analytiques à peu de paramètres. La forme de base détecte des lignes, les extensions peuvent viser cercles ou ellipses. Elle s’appuie sur des points de contour issus d’un prétraitement et tolère bruit ou données incomplètes grâce au vote.',
  },
  {
    id: 'hough-parametres-polaires',
    chapter: 7,
    number: 2,
    chapterTitle: 'Transformation de Hough',
    title: 'Espace des paramètres et coordonnées polaires',
    shortTitle: 'Paramètres',
    status: 'ready',
    focus: 'm,c non bornés, theta/rho bornés, équation normale',
    source: { file: 'transformation_de_hough.md', page: '5-11' },
    modeIntros: {
      learn: 'Comprendre pourquoi Hough transforme des points image en courbes dans un espace de paramètres.',
      lab: 'Déplacer un point (x,y) et observer la courbe rho(theta).',
      review: 'Retenir l’équation rho = x cos(theta) + y sin(theta).',
    },
    learnSections: [
      section('Paramètres', 'Les points alignés partagent les mêmes paramètres de droite', [
        'Le cours pose le problème : identifier les points sur un contour de type droite.',
        'La solution indiquée est que les points alignés partagent les mêmes paramètres de droite.',
        'Un contour émerge lorsque beaucoup de points partagent les mêmes paramètres.',
      ], 'Ligne détectée = beaucoup de points votent pour les mêmes paramètres.'),
      section('m,c', 'L’espace (m,c) explique l’idée mais pose des limites', [
        'Le support commence avec la forme y = mx + c.',
        'Pour chaque point (x,y), on peut construire les droites qui passent par ce point.',
        'Mais m et c ne sont pas bornés, ce qui rend la discrétisation moins pratique.',
      ], 'L’idée du vote existe en (m,c), mais la borne des paramètres est un problème.'),
      section('Polaire', 'Les coordonnées polaires bornent les paramètres', [
        'Le cours indique qu’il est plus pratique d’utiliser les coordonnées polaires.',
        'θ et ρ sont bornés : θ par un intervalle angulaire, ρ par la taille de l’image.',
        'L’équation normale donnée est x cos(θ) + y sin(θ) = ρ.',
      ], 'Équation Hough ligne : ρ = x cos(θ) + y sin(θ).'),
    ],
    figureNotes: [
      fig(c7, 'transformation_de_hough_p5_fig2.jpeg', '5', 'Points sur une droite', 'Les points de contour partagent des paramètres.', 'La détection cherche ce qui est commun aux pixels alignés.'),
      fig(c7, 'transformation_de_hough_p6_fig2.jpeg', '6', 'Espace (m,c)', 'Le point image devient une relation dans l’espace des paramètres.', 'Hough déplace le problème dans un autre espace.'),
      fig(c7, 'transformation_de_hough_p8_fig2.jpeg', '8', 'Paramètres polaires', 'Le support introduit θ et ρ.', 'Les paramètres polaires se discrétisent mieux.'),
      fig(c7, 'transformation_de_hough_p9_fig2.jpeg', '9', 'Équation normale', 'La droite satisfait x cosθ + y sinθ = ρ.', 'Chaque point produit une courbe de votes en θ,ρ.'),
    ],
    lab: {
      kind: 'hough',
      title: 'Transformer un point en votes rho-theta',
      intro: 'Déplace un point image et ajuste theta pour voir rho évoluer dans l’espace de Hough.',
      sourceNote: 'Fondé sur transformation_de_hough.md pages 5-11.',
      parts: [
        part('mc', 'm,c', 'Voir pourquoi chaque point génère plusieurs droites possibles.', 'Fondé sur l’espace des paramètres pages 5-7.'),
        part('polar', 'Polaire', 'Comparer m,c à theta/rho bornés.', 'Fondé sur coordonnées polaires page 8.'),
        part('equation', 'Équation', 'Calculer rho = x cos(theta) + y sin(theta).', 'Fondé sur l’équation normale page 9 et exemple page 11.'),
      ],
    },
    flashcards: [
      card('hough-common', 'Qu’ont en commun les points alignés ?', 'Ils appartiennent à une droite avec les mêmes paramètres.'),
      card('hough-mc-problem', 'Pourquoi éviter m,c en pratique ?', 'Ils ne sont pas bornés.'),
      card('hough-polar-why', 'Pourquoi utiliser theta/rho ?', 'Ils sont bornés par l’angle et la taille de l’image.'),
      card('hough-equation', 'Équation polaire normale de la droite ?', 'x cos(theta) + y sin(theta) = rho.'),
    ],
    quiz: [
      quiz('hough-param-q1', 'Les paramètres m,c sont moins pratiques car…', ['ils ne sont pas bornés', 'ils sont RGB', 'ils valent toujours zéro'], 0, 'Le support le dit pour justifier les coordonnées polaires.'),
      quiz('hough-param-q2', 'L’équation normale est…', ['x cos(theta) + y sin(theta) = rho', 'b = M x N x k', 'g = log(f)'], 0, 'C’est la formule du chapitre.'),
      quiz('hough-param-q3', 'Un point image produit en Hough…', ['plusieurs paramètres possibles', 'un seul canal bleu', 'un histogramme normalisé'], 0, 'On calcule toutes les droites passant par le point.'),
    ],
    pitfalls: [
      'Oublier pourquoi le passage en polaire est utile.',
      'Confondre le point image (x,y) avec le point dans l’espace (rho,theta).',
      'Écrire une équation de droite sans préciser le paramétrage utilisé.',
    ],
    examSummary: 'Hough cherche des paramètres communs aux points alignés. L’espace (m,c) explique le principe mais m et c ne sont pas bornés. Les coordonnées polaires utilisent l’équation x cos(theta)+y sin(theta)=rho, avec theta et rho plus faciles à discrétiser.',
  },
  {
    id: 'hough-accumulateur-votes',
    chapter: 7,
    number: 3,
    chapterTitle: 'Transformation de Hough',
    title: 'Accumulateur de Hough et votes',
    shortTitle: 'Accumulateur',
    status: 'ready',
    focus: 'Votes, matrice accumulateur, résolution theta, maxima locaux',
    source: { file: 'transformation_de_hough.md', page: '12-18' },
    modeIntros: {
      learn: 'Comprendre comment les points de contour votent dans une matrice accumulateur.',
      lab: 'Ajouter des points alignés et voir les intersections monter dans l’accumulateur.',
      review: 'Retenir votes, maxima locaux, seuil et résolution angulaire.',
    },
    learnSections: [
      section('Votes', 'Chaque point incrémente les paramètres des droites qui passent par lui', [
        'Le cours explique que pour chaque point, on calcule toutes les droites qui passent par ce point.',
        'On incrémente une matrice appelée accumulateur à la position (ρ,θ).',
        'Quand plusieurs points alignés partagent les mêmes paramètres, une valeur élevée apparaît.',
      ], 'Accumulateur = matrice de votes sur (rho,theta).'),
      section('Maxima', 'Les droites présentes correspondent aux maximums locaux', [
        'Le support indique que plus une valeur est élevée dans l’accumulateur, plus son équation de droite revient souvent.',
        'Les droites présentes dans l’image correspondent aux maximums locaux de l’accumulateur.',
        'Les valeurs supérieures à 1 correspondent à des intersections dans l’espace des paramètres.',
      ], 'Maximum local = candidat ligne.'),
      section('Résolution', 'La précision dépend de la résolution choisie pour theta', [
        'Le cours remarque que la précision de la détection est directement liée à la résolution choisie pour faire varier θ.',
        'Un angle_step plus fin produit plus de cases et de calculs.',
        'Un pas plus gros peut manquer ou déplacer des pics.',
      ], 'La résolution de theta est un compromis précision/calcul.'),
    ],
    figureNotes: [
      fig(c7, 'transformation_de_hough_p12_fig1.jpeg', '12', 'Paramètres partagés', 'Les points alignés partagent les mêmes paramètres.', 'Le vote commun fait monter une case.'),
      fig(c7, 'transformation_de_hough_p13_fig4.jpeg', '13', 'Accumulateur', 'La matrice compte les occurrences de (rho,theta).', 'C’est le cœur algorithmique de Hough.'),
      fig(c7, 'transformation_de_hough_p16_fig3.jpeg', '16', 'Sinusoïdes', 'Chaque point engendre une sinusoïde dans l’espace de Hough.', 'Les intersections révèlent les droites similaires.'),
      fig(c7, 'transformation_de_hough_p18_fig3.jpeg', '18', 'Seuil sur maxima', 'Le support montre l’effet d’un seuil sur les maxima locaux.', 'Un seuil filtre les lignes détectées.'),
    ],
    lab: {
      kind: 'hough',
      title: 'Faire voter les points de contour',
      intro: 'Ajoute des points, change le pas angulaire et le seuil pour voir les maxima locaux.',
      sourceNote: 'Fondé sur transformation_de_hough.md pages 12-18.',
      parts: [
        part('votes', 'Votes', 'Incrémenter les cases (rho,theta) pour chaque point.', 'Fondé sur l’accumulateur page 13.'),
        part('resolution', 'Résolution', 'Changer angle_step et observer précision/calcul.', 'Fondé sur la remarque de résolution page 12.'),
        part('peaks', 'Maxima', 'Seuiler les maxima locaux pour garder des lignes.', 'Fondé sur interprétation de l’accumulateur pages 13-18.'),
      ],
    },
    flashcards: [
      card('acc-role', 'Rôle de l’accumulateur ?', 'Compter les votes pour les paramètres (rho,theta).'),
      card('acc-high', 'Que signifie une valeur élevée ?', 'L’équation de droite revient souvent dans l’image.'),
      card('acc-peaks', 'À quoi correspondent les maximums locaux ?', 'Aux droites présentes dans l’image.'),
      card('acc-resolution', 'De quoi dépend la précision ?', 'De la résolution choisie pour faire varier theta.'),
    ],
    quiz: [
      quiz('acc-q1', 'L’accumulateur est indexé par…', ['rho et theta', 'R, G, B', 'M et N uniquement'], 0, 'Le chapitre parle de position (rho,theta).'),
      quiz('acc-q2', 'Les droites présentes correspondent…', ['aux maximums locaux', 'aux pixels les plus sombres seulement', 'aux valeurs gamma'], 0, 'C’est l’interprétation donnée.'),
      quiz('acc-q3', 'Un angle_step plus fin change…', ['la résolution de détection et le coût', 'le nombre de canaux', 'la taille de l’élément structurant'], 0, 'La précision dépend de la résolution de theta.'),
    ],
    pitfalls: [
      'Croire qu’un seul point suffit à valider une ligne robuste.',
      'Oublier le seuil sur les maxima.',
      'Ne pas relier résolution angulaire et précision.',
    ],
    examSummary: 'Chaque point de contour vote pour les paramètres des droites possibles. L’accumulateur compte ces votes dans l’espace (rho,theta). Les maximums locaux indiquent des lignes candidates ; leur précision dépend de la résolution choisie pour theta et du seuil appliqué.',
  },
  {
    id: 'hough-labo-lignes',
    chapter: 7,
    number: 4,
    chapterTitle: 'Transformation de Hough',
    title: 'Labo Hough : implémenter la détection de lignes',
    shortTitle: 'Labo Hough',
    status: 'ready',
    focus: 'pretraitement, hough_space, hough_lines, draw_lines, subplot',
    source: { file: 'labo_07.md', page: '1-4' },
    modeIntros: {
      learn: 'Traduire le cours Hough en architecture de programme pour le labo.',
      lab: 'Assembler prétraitement, accumulateur, extraction de lignes et dessin final.',
      review: 'Retenir les fonctions demandées et les quatre vues de sortie.',
    },
    learnSections: [
      section('Objectif', 'Le labo demande de détecter les lignes dans une image avec Hough', [
        'Le labo 7 demande d’implémenter soi-même les étapes nécessaires à la transformée de Hough.',
        'Il faut lire une image, la prétraiter, appliquer la transformée et mettre en évidence les droites détectées.',
        'Le résultat final doit afficher l’image originale, le prétraitement, l’accumulateur et l’image avec lignes détectées.',
      ], 'Sortie labo : quatre vues dans une seule fenêtre.'),
      section('Prétraitement', 'Le prétraitement reprend les laboratoires précédents', [
        'Le labo liste conversion en niveaux de gris, filtre moyenneur, détection de contours avec Sobel ou Laplace.',
        'Il ajoute le nettoyage de l’image binaire avec les opérateurs morphologiques.',
        'Cette partie peut utiliser les fonctions réalisées dans les labos précédents et OpenCV.',
      ], 'Le labo 7 assemble les acquis des chapitres précédents.'),
      section('Fonctions', 'hough_space, hough_lines et draw_lines sont les fonctions clés', [
        'hough_space(img, angle_step=1) retourne l’accumulateur.',
        'hough_lines(acc) retourne une liste d’équations de droites.',
        'draw_lines(img, lines) dessine ces droites sur une image.',
      ], 'Pipeline labo : contour_img → accumulator → lines → img_with_lines.'),
    ],
    figureNotes: [
      fig(c7Lab, 'labo_07_p3_fig1.jpeg', 'labo 7', 'Image de test', 'Le labo fournit des images de test.', 'Le rendu doit être vérifié visuellement.'),
      fig(c7Lab, 'labo_07_p3_fig2.jpeg', 'labo 7', 'Exemple de rendu', 'Le support montre des lignes détectées.', 'L’objectif final est une image annotée.'),
      fig(c7Lab, 'labo_07_p4_fig0.jpeg', 'labo 7', 'Accumulateur/rendu', 'Le labo demande un subplot avec les étapes.', 'La qualité se juge sur plusieurs vues, pas seulement la sortie finale.'),
      fig(c7Lab, 'labo_07_p4_fig1.jpeg', 'labo 7', 'Lignes détectées', 'Le rendu met en évidence les droites.', 'draw_lines transforme des paramètres en annotation visible.'),
    ],
    lab: {
      kind: 'hough',
      title: 'Assembler le pipeline du labo 7',
      intro: 'Simule les quatre sorties attendues : original, prétraitement, accumulateur, lignes dessinées.',
      sourceNote: 'Fondé sur labo_07.md sections 1-2.',
      parts: [
        part('preprocess', 'Prétraitement', 'Préparer une image binaire de contours.', 'Fondé sur les étapes de prétraitement du labo 7.'),
        part('accumulator', 'hough_space', 'Construire l’accumulateur avec angle_step.', 'Fondé sur hough_space(img, angle_step).'),
        part('draw-lines', 'Lignes finales', 'Extraire les lignes et les dessiner sur l’image.', 'Fondé sur hough_lines et draw_lines du labo.'),
      ],
    },
    flashcards: [
      card('lab7-run', 'Nom attendu de l’application ?', 'hough.py.'),
      card('lab7-output', 'Quatre vues de sortie demandées ?', 'Original, prétraitement, accumulateur, image originale avec lignes détectées.'),
      card('lab7-hough-space', 'Rôle de hough_space ?', 'Calculer et retourner l’accumulateur.'),
      card('lab7-draw', 'Rôle de draw_lines ?', 'Dessiner un ensemble de droites sur une image.'),
    ],
    quiz: [
      quiz('lab7-q1', 'hough.py doit prendre…', ['le chemin de l’image à traiter', 'un gamma uniquement', 'un fichier audio'], 0, 'Le labo donne python3 hough.py path/to/my/image/lena.png.'),
      quiz('lab7-q2', 'hough_lines(acc) retourne…', ['une liste d’équations de droites', 'un kernel gaussien', 'une image RGB brute'], 0, 'C’est la signature demandée.'),
      quiz('lab7-q3', 'Le prétraitement peut inclure…', ['Sobel ou Laplace et morphologie', 'uniquement le flashcard', 'seulement Nyquist'], 0, 'Le labo liste ces opérations.'),
    ],
    pitfalls: [
      'Ne pas afficher l’accumulateur alors qu’il est explicitement demandé.',
      'Sauter le prétraitement et envoyer une image brute à Hough.',
      'Confondre hough_space et hough_lines.',
    ],
    examSummary: 'Le labo 7 demande un programme hough.py qui lit une image, prétraite les contours, calcule l’accumulateur avec hough_space, extrait les droites avec hough_lines, puis les dessine avec draw_lines. La sortie attendue montre original, prétraitement, accumulateur et image annotée.',
  },
];
