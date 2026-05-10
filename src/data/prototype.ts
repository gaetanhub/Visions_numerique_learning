import { advancedModules } from './advancedChapters';

export type LearningMode = 'learn' | 'lab' | 'review';

export type ModuleStatus = 'ready';

export type LabKind =
  | 'vision'
  | 'sources'
  | 'pipeline'
  | 'pixels'
  | 'color'
  | 'roi'
  | 'intensity-map'
  | 'intensity-invert'
  | 'intensity-gamma'
  | 'histogram'
  | 'histogram-equalization'
  | 'spatial-lowpass'
  | 'spatial-kernel'
  | 'spatial-highpass'
  | 'fourier'
  | 'morphology'
  | 'hough';

export type Source = {
  file: string;
  page: string;
};

export type ChapterModule = {
  id: string;
  chapter: number;
  number: number;
  chapterTitle: string;
  title: string;
  shortTitle: string;
  status: ModuleStatus;
  focus: string;
  source: Source;
};

export type LearnSection = {
  eyebrow: string;
  title: string;
  body: string[];
  checkpoint: string;
};

export type FigureNote = {
  file: string;
  assetPath?: string;
  page: string;
  title: string;
  observe: string;
  teaches: string;
};

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type QuizItem = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  feedback: string;
};

export type LabPart = {
  id: string;
  title: string;
  goal: string;
  sourceNote: string;
};

export type LabDefinition = {
  kind: LabKind;
  title: string;
  intro: string;
  sourceNote: string;
  parts: LabPart[];
};

export type ModuleContent = ChapterModule & {
  modeIntros: Record<LearningMode, string>;
  learnSections: LearnSection[];
  figureNotes: FigureNote[];
  lab: LabDefinition;
  flashcards: Flashcard[];
  quiz: QuizItem[];
  pitfalls: string[];
  examSummary: string;
};

export const moduleContent: ModuleContent[] = [
  {
    id: 'vision-humaine',
    chapter: 1,
    number: 1,
    chapterTitle: 'Introduction',
    title: 'Vision humaine et subjectivité',
    shortTitle: 'Vision humaine',
    status: 'ready',
    focus: 'Rétine, radiance/luminance/brightness, illusions',
    source: { file: 'introduction.md', page: '5-8' },
    modeIntros: {
      learn: 'Comprendre pourquoi la vision numérique part de la perception humaine, tout en s’en distinguant.',
      lab: 'Manipuler un contraste contextuel pour sentir la différence entre mesure physique et perception.',
      review: 'Savoir expliquer les rôles des bâtonnets, cônes et grandeurs radiance/luminance/brightness.',
    },
    learnSections: [
      {
        eyebrow: 'Capteur humain',
        title: 'La rétine transforme la lumière en information nerveuse',
        body: [
          'Le cours présente la vision humaine comme le sens le plus développé et place la rétine au centre du dispositif.',
          'Les bâtonnets détectent surtout la luminosité. Les cônes sont sensibles à différentes longueurs d’onde interprétées comme vert, bleu et rouge par le cerveau.',
          'Cette organisation inspire la vision numérique : on cherche aussi à capter un signal puis à le traiter.',
        ],
        checkpoint: 'À retenir : bâtonnets = luminosité ; cônes = couleurs interprétées par le cerveau.',
      },
      {
        eyebrow: 'Grandeurs',
        title: 'Radiance, luminance et brightness ne disent pas la même chose',
        body: [
          'Le cours distingue la radiance, quantité d’énergie émise visible et non visible, de la luminance, quantité d’énergie perçue et mesurable.',
          'Brightness désigne une perception subjective : ce n’est pas une grandeur mesurable de la même manière.',
          'Cette distinction est importante en vision numérique : une mesure robuste ne doit pas être confondue avec une impression visuelle.',
        ],
        checkpoint: 'Si une grandeur dépend de l’observateur, le terme du cours est brightness.',
      },
      {
        eyebrow: 'Subjectivité',
        title: 'Le cerveau complète et interprète les images',
        body: [
          'Les illusions optiques du support montrent que le cerveau produit du contenu et complète ce qu’il voit.',
          'La vision humaine est donc utile, mais elle n’est pas une lecture neutre des intensités.',
          'La vision numérique s’inspire de l’œil et du cerveau, mais elle peut construire des détecteurs adaptés à des tâches spécifiques.',
        ],
        checkpoint: 'Voir ne veut pas dire mesurer exactement.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p5_fig1.jpeg',
        page: '5',
        title: 'La vision humaine',
        observe: 'Le cours situe l’œil comme dispositif de capture.',
        teaches: 'La vision numérique peut être expliquée par analogie avec capteur + traitement.',
      },
      {
        file: 'introduction_p5_fig6.jpeg',
        page: '5',
        title: 'Rôle du cerveau',
        observe: 'Le cerveau intervient dans la production et l’interprétation de la perception.',
        teaches: 'La perception n’est pas seulement une mesure optique.',
      },
      {
        file: 'introduction_p6_fig2.jpeg',
        page: '6',
        title: 'Chromatique et monochromatique',
        observe: 'Le visible est replacé dans une notion de longueurs d’onde.',
        teaches: 'Couleur et intensité doivent être séparées conceptuellement.',
      },
      {
        file: 'introduction_p7_fig2.jpeg',
        page: '7',
        title: 'Illusion optique',
        observe: 'Deux zones peuvent être perçues différemment selon le contexte.',
        teaches: 'La brightness est subjective, contrairement à une mesure directe.',
      },
    ],
    lab: {
      kind: 'vision',
      title: 'Mesure constante, perception variable',
      intro: 'Le cours oppose luminance mesurable et brightness subjective. Ici, la cible garde la même intensité pendant que le contexte change.',
      sourceNote: 'Fondé sur les sections radiance/luminance/brightness et illusions optiques, pages 6-7.',
      parts: [
        {
          id: 'measure',
          title: 'Mesure constante',
          goal: 'Comparer une intensité mesurée fixe avec une perception variable.',
          sourceNote: 'Fondé sur radiance/luminance/brightness et illusions optiques, pages 6-7.',
        },
        {
          id: 'context',
          title: 'Contexte perceptif',
          goal: 'Modifier fortement le contexte pour voir l’effet sur la brightness.',
          sourceNote: 'Fondé sur radiance/luminance/brightness et illusions optiques, pages 6-7.',
        },
      ],
    },
    flashcards: [
      { id: 'vision-batonnets', question: 'Rôle principal des bâtonnets ?', answer: 'Détecter la luminosité d’une image.' },
      { id: 'vision-cones', question: 'Rôle principal des cônes ?', answer: 'Être sensibles à différentes longueurs d’onde interprétées comme couleurs.' },
      { id: 'vision-brightness', question: 'Pourquoi brightness est un piège ?', answer: 'Parce que le cours le définit comme une perception subjective, non mesurable directement.' },
      { id: 'vision-luminance', question: 'Luminance ou radiance : laquelle est perçue et mesurable ?', answer: 'La luminance.' },
    ],
    quiz: [
      {
        id: 'vision-q1',
        question: 'Dans le cours, brightness désigne…',
        options: ['Une quantité subjective', 'Une matrice M x N', 'Un détecteur infrarouge'],
        answerIndex: 0,
        feedback: 'Brightness est explicitement présenté comme une perception subjective.',
      },
      {
        id: 'vision-q2',
        question: 'Les bâtonnets détectent principalement…',
        options: ['La luminosité', 'Les coordonnées x,y', 'La compression'],
        answerIndex: 0,
        feedback: 'Le support indique que les bâtonnets détectent la luminosité d’une image.',
      },
      {
        id: 'vision-q3',
        question: 'Pourquoi les illusions sont-elles pédagogiquement importantes ici ?',
        options: ['Elles montrent que le cerveau complète/interprète', 'Elles remplacent les capteurs', 'Elles définissent b = M x N x k'],
        answerIndex: 0,
        feedback: 'Le cours dit que le cerveau complète les images en produisant du contenu.',
      },
    ],
    pitfalls: [
      'Confondre brightness avec luminance.',
      'Croire que la vision humaine mesure toujours exactement les intensités.',
      'Oublier que la vision numérique peut utiliser des détecteurs adaptés à des tâches spécifiques.',
    ],
    examSummary: 'La vision humaine combine capture par l’œil et interprétation par le cerveau. Bâtonnets et cônes jouent des rôles différents ; radiance, luminance et brightness doivent être distinguées. Les illusions rappellent que la perception est subjective.',
  },
  {
    id: 'intensite-principes',
    chapter: 2,
    number: 1,
    chapterTitle: 'Transformations d’intensité',
    title: 'Principe des transformations d’intensité',
    shortTitle: 'Principe',
    status: 'ready',
    focus: 'g(x,y)=T[f(x,y)], voisinage 1x1, familles de transformations, plans de bits',
    source: { file: 'transformationIntensite.md', page: '1-2, 9-10' },
    modeIntros: {
      learn: 'Comprendre ce qu’est une transformation ponctuelle d’intensité et pourquoi elle dépend du problème à résoudre.',
      lab: 'Modifier une fonction T et observer comment chaque intensité source est envoyée vers une intensité de sortie.',
      review: 'Savoir distinguer filtrage spatial, transformation d’intensité, seuillage, histogrammes et plans de bits.',
    },
    learnSections: [
      {
        eyebrow: 'Domaine spatial',
        title: 'La transformation générale s’écrit g(x,y)=T[f(x,y)]',
        body: [
          'Le chapitre 2 ouvre sur les opérations dans le domaine spatial et donne la forme générale g(x,y)=T[f(x,y)].',
          'Cette écriture signifie que l’image de sortie g est obtenue en appliquant un opérateur T aux valeurs de l’image source f.',
          'Le cours distingue ensuite deux cas : le filtrage spatial et la transformation d’intensité.',
        ],
        checkpoint: 'La formule du chapitre est g(x,y)=T[f(x,y)].',
      },
      {
        eyebrow: 'Voisinage',
        title: 'Une transformation d’intensité travaille sur un voisinage 1x1',
        body: [
          'Dans le filtrage spatial, T est défini dans un voisinage n x n autour de chaque point.',
          'Dans une transformation d’intensité, le voisinage est 1x1 : la nouvelle valeur ne dépend que du pixel traité.',
          'C’est ce qui rend ces transformations très directes : elles modifient les valeurs, pas la géométrie de l’image.',
        ],
        checkpoint: 'Filtrage spatial = voisinage ; transformation d’intensité = point par point.',
      },
      {
        eyebrow: 'Objectif',
        title: 'Le choix de T dépend de l’usage visé',
        body: [
          'Le cours donne l’objectif : améliorer l’image en vue d’une utilisation spécifique.',
          'Les choix populaires listés sont notamment identité, négatif, seuil, log, lois de puissance, décomposition sur les bits et transformations d’histogramme.',
          'Il n’existe donc pas une transformation universelle : le bon choix dépend du problème.',
        ],
        checkpoint: 'Une transformation est choisie pour un objectif, pas parce qu’elle est “plus jolie”.',
      },
      {
        eyebrow: 'Plans de bits',
        title: 'Une intensité 8 bits peut être décomposée bit par bit',
        body: [
          'Le support introduit la décomposition “bit plane” : une intensité codée sur 8 bits peut être séparée selon la contribution de chaque bit.',
          'L’exemple donné est 194 = 11000010, puis la construction de la contribution du bit le plus fort.',
          'Le labo 2 demande aussi une fonction bitwise() qui retourne une image masquée sur un bit de l’intensité, puis normalisée.',
        ],
        checkpoint: 'Les bits de poids fort portent souvent une structure visuelle plus lisible que les bits faibles.',
      },
    ],
    figureNotes: [
      {
        file: 'transformationIntensite_p1_fig5.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p1_fig5.jpeg',
        page: '1',
        title: 'Transformation ponctuelle',
        observe: 'Le schéma place T entre f(x,y) et g(x,y).',
        teaches: 'La transformation d’intensité agit sur la valeur du pixel traité.',
      },
      {
        file: 'transformationIntensite_p2_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p2_fig2.jpeg',
        page: '2',
        title: 'Familles de transformations',
        observe: 'Le support liste plusieurs choix populaires pour T.',
        teaches: 'Linéaire, seuil, log, gamma, bits et histogrammes sont des familles distinctes.',
      },
      {
        file: 'transformationIntensite_p9_fig4.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p9_fig4.jpeg',
        page: '9',
        title: 'Décomposition en plans de bits',
        observe: 'Les contributions de chacun des bits sont affichées séparément.',
        teaches: 'Une image 8 bits contient plusieurs niveaux de contribution binaire.',
      },
      {
        file: 'labo_02_p6_fig4.jpeg',
        assetPath: '/course-assets/chapter-02/labo-02/labo_02_p6_fig4.jpeg',
        page: 'labo 2.9',
        title: 'Exercice bitwise',
        observe: 'Le labo demande d’appliquer bitwise() pour chaque bit de l’intensité.',
        teaches: 'Le plan de bits n’est pas seulement théorique : il se programme comme une transformation.',
      },
    ],
    lab: {
      kind: 'intensity-map',
      title: 'Dessiner la fonction T point par point',
      intro: 'Choisis une famille de transformation et observe comment une valeur source r devient une valeur de sortie s, sans utiliser les voisins.',
      sourceNote: 'Fondé sur transformationIntensite.md pages 1-2 et 9-10, et sur labo_02.md exercice 2.9.',
      parts: [
        {
          id: 'function-t',
          title: 'Fonction T',
          goal: 'Observer g(x,y)=T[f(x,y)] point par point.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 1-2.',
        },
        {
          id: 'bit-plane',
          title: 'Plan de bits',
          goal: 'Isoler une contribution binaire de l’intensité.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 9-10 et labo_02.md exercice 2.9.',
        },
      ],
    },
    flashcards: [
      { id: 'intensity-formula', question: 'Formule générale donnée par le cours ?', answer: 'g(x,y)=T[f(x,y)].' },
      { id: 'intensity-neighborhood', question: 'Voisinage d’une transformation d’intensité ?', answer: '1x1 : seule la valeur du point traité intervient.' },
      { id: 'spatial-filtering-neighborhood', question: 'Différence avec le filtrage spatial ?', answer: 'Le filtrage spatial définit T dans un voisinage n x n.' },
      { id: 'bit-plane', question: 'Que fait une décomposition en plans de bits ?', answer: 'Elle sépare les contributions des bits d’une intensité codée, par exemple sur 8 bits.' },
    ],
    quiz: [
      {
        id: 'intensity-q1',
        question: 'Dans une transformation d’intensité, le voisinage est…',
        options: ['1x1', 'n x n', 'toujours toute l’image'],
        answerIndex: 0,
        feedback: 'Le cours précise que le voisinage est 1x1 pour ce type de transformation.',
      },
      {
        id: 'intensity-q2',
        question: 'Le choix du type de transformation dépend…',
        options: ['du problème', 'du nom du fichier seulement', 'du nombre de pixels uniquement'],
        answerIndex: 0,
        feedback: 'Le support dit que le choix dépend du problème et de l’utilisation spécifique.',
      },
      {
        id: 'intensity-q3',
        question: '194 = 11000010 sert dans le cours à illustrer…',
        options: ['la décomposition sur les bits', 'la luminance', 'le redimensionnement bilinéaire'],
        answerIndex: 0,
        feedback: 'Cet exemple apparaît dans la section “bit plane”.',
      },
    ],
    pitfalls: [
      'Confondre transformation d’intensité et filtrage spatial.',
      'Croire que T utilise toujours les voisins du pixel.',
      'Oublier les plans de bits alors qu’ils font partie des choix populaires et du labo 2.',
    ],
    examSummary: 'Une transformation d’intensité applique g(x,y)=T[f(x,y)] avec un voisinage 1x1. Elle sert à améliorer une image pour une utilisation spécifique. Le chapitre cite identité, négatif, seuil, log, gamma, plans de bits et transformations d’histogramme.',
  },
  {
    id: 'identite-inversion',
    chapter: 2,
    number: 2,
    chapterTitle: 'Transformations d’intensité',
    title: 'Identité, négatif et seuillage',
    shortTitle: 'Négatif & seuil',
    status: 'ready',
    focus: 'Identité, inversion, couleurs complémentaires, seuillage et segmentation',
    source: { file: 'transformationIntensite.md', page: '3-5' },
    modeIntros: {
      learn: 'Lire les transformations linéaires et par morceaux : identité, négatif et seuil.',
      lab: 'Passer d’une image synthétique à son négatif ou à une image seuillée en changeant le seuil.',
      review: 'Savoir expliquer quand le négatif ou le seuillage renforcent l’information utile.',
    },
    learnSections: [
      {
        eyebrow: 'Linéaire',
        title: 'L’identité ne modifie pas l’intensité, le négatif l’inverse',
        body: [
          'Le cours regroupe identité et inversion dans les transformations linéaires.',
          'L’inversion est présentée comme utile lorsque les parties sombres sont dominantes.',
          'Pour une intensité codée entre 0 et 255, l’idée pratique du négatif est de transformer les faibles valeurs en fortes valeurs, et inversement.',
        ],
        checkpoint: 'Négatif : les zones sombres deviennent claires, les zones claires deviennent sombres.',
      },
      {
        eyebrow: 'Couleur',
        title: 'L’inversion couleur produit des couleurs complémentaires',
        body: [
          'Le support précise que les couleurs sont transformées dans la couleur complémentaire.',
          'Il ajoute que des couleurs complémentaires mélangées s’annulent, et que côte à côte elles contrastent fortement.',
          'Cette remarque explique pourquoi le négatif peut augmenter la lisibilité de certaines structures.',
        ],
        checkpoint: 'En couleur, l’inversion n’est pas seulement une luminosité inversée : elle touche les canaux.',
      },
      {
        eyebrow: 'Par morceaux',
        title: 'Le seuillage renforce le contraste et sert la segmentation',
        body: [
          'La section sur les transformations linéaires par morceaux présente le seuillage.',
          'Le cours indique qu’il permet de renforcer le contraste, c’est-à-dire les différences d’intensités.',
          'Il est aussi décrit comme un outil clé pour la segmentation, mais potentiellement dépendant d’un seuil choisi par l’humain.',
        ],
        checkpoint: 'Le seuillage est puissant, mais le choix du seuil est une décision critique.',
      },
    ],
    figureNotes: [
      {
        file: 'transformationIntensite_p3_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p3_fig2.jpeg',
        page: '3',
        title: 'Identité et inversion',
        observe: 'La courbe du négatif inverse la relation entrée/sortie.',
        teaches: 'L’inversion fait correspondre les faibles intensités à de fortes intensités.',
      },
      {
        file: 'transformationIntensite_p3_fig8.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p3_fig8.jpeg',
        page: '3',
        title: 'Mammographie et négatif',
        observe: 'Le support compare une mammographie et son image en négatif.',
        teaches: 'Le négatif peut rendre certaines structures plus lisibles selon le contexte.',
      },
      {
        file: 'transformationIntensite_p4_fig4.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p4_fig4.jpeg',
        page: '4',
        title: 'Couleurs complémentaires',
        observe: 'La figure illustre la relation entre inversion et complémentarité.',
        teaches: 'L’inversion couleur agit sur les canaux et modifie les contrastes perçus.',
      },
      {
        file: 'transformationIntensite_p5_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p5_fig2.jpeg',
        page: '5',
        title: 'Seuillage',
        observe: 'La courbe par morceaux sépare les intensités selon un seuil.',
        teaches: 'Le seuil transforme l’image en décision binaire ou quasi binaire.',
      },
      {
        file: 'labo_02_p2_fig0.jpeg',
        assetPath: '/course-assets/chapter-02/labo-02/labo_02_p2_fig0.jpeg',
        page: 'labo 2.3',
        title: 'Exercice seuil',
        observe: 'Le labo demande de mettre à 255 les pixels supérieurs au seuil et à 0 les autres.',
        teaches: 'Le seuillage se code comme une décision sur chaque pixel.',
      },
    ],
    lab: {
      kind: 'intensity-invert',
      title: 'Comparer identité, négatif et seuil',
      intro: 'Change de transformation et de seuil : observe comment le même pixel source peut rester identique, être inversé ou basculer en noir/blanc.',
      sourceNote: 'Fondé sur transformationIntensite.md pages 3-5 et sur labo_02.md exercices 2.2 et 2.3.',
      parts: [
        {
          id: 'negative',
          title: 'Négatif',
          goal: 'Comparer identité et inversion.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 3-4 et labo_02.md exercice 2.2.',
        },
        {
          id: 'threshold',
          title: 'Seuil',
          goal: 'Changer un seuil pour segmenter.',
          sourceNote: 'Fondé sur transformationIntensite.md page 5 et labo_02.md exercice 2.3.',
        },
      ],
    },
    flashcards: [
      { id: 'negative-use', question: 'Quand le cours dit-il que l’inversion est souvent utile ?', answer: 'Lorsque les parties sombres sont dominantes.' },
      { id: 'threshold-use', question: 'À quoi sert le seuillage dans le cours ?', answer: 'À renforcer le contraste et comme outil clé pour la segmentation.' },
      { id: 'threshold-human', question: 'Quel est le coût pratique du seuillage ?', answer: 'Il nécessite souvent un input humain : le choix du seuil.' },
      { id: 'complementary', question: 'Que deviennent les couleurs lors d’une inversion ?', answer: 'Elles sont transformées dans la couleur complémentaire.' },
    ],
    quiz: [
      {
        id: 'invert-q1',
        question: 'L’inversion est souvent utile lorsque…',
        options: ['les parties sombres dominent', 'l’image n’a aucun pixel', 'on veut changer M et N'],
        answerIndex: 0,
        feedback: 'C’est l’usage indiqué dans la section “Identité & Inversion”.',
      },
      {
        id: 'invert-q2',
        question: 'Le seuillage est un outil clé pour…',
        options: ['la segmentation', 'l’interpolation bilinéaire', 'la luminance subjective'],
        answerIndex: 0,
        feedback: 'Le cours relie explicitement le seuillage à la segmentation.',
      },
      {
        id: 'invert-q3',
        question: 'Dans le labo, seuil(img, valeur) met un pixel supérieur au seuil à…',
        options: ['255', 'la moyenne des voisins', 'gamma'],
        answerIndex: 0,
        feedback: 'L’énoncé du labo précise 255 si le pixel est supérieur à la valeur, 0 sinon.',
      },
    ],
    pitfalls: [
      'Croire que le négatif améliore toujours toutes les images.',
      'Oublier que le seuil doit être choisi.',
      'Confondre seuillage et normalisation d’histogramme.',
    ],
    examSummary: 'Identité et inversion sont des transformations linéaires. Le négatif inverse les intensités et peut aider quand les zones sombres dominent. Le seuillage est une transformation par morceaux utile pour renforcer le contraste et segmenter, mais il dépend du seuil choisi.',
  },
  {
    id: 'log-gamma',
    chapter: 2,
    number: 3,
    chapterTitle: 'Transformations d’intensité',
    title: 'Transformations log et gamma',
    shortTitle: 'Log & gamma',
    status: 'ready',
    focus: 'Dilatation des faibles intensités, compression des fortes, correction gamma',
    source: { file: 'transformationIntensite.md', page: '6-8' },
    modeIntros: {
      learn: 'Comprendre comment les transformations non linéaires changent la répartition des intensités.',
      lab: 'Ajuster log et gamma pour voir les faibles intensités s’ouvrir ou les fortes intensités se compresser.',
      review: 'Savoir expliquer gamma < 1, gamma > 1, gamma encoding et gamma decoding sans confusion.',
    },
    learnSections: [
      {
        eyebrow: 'Log',
        title: 'Le logarithme dilate les petites valeurs et compresse les grandes',
        body: [
          'Le cours décrit l’échelle logarithmique comme une dilatation des valeurs petites et une compression des valeurs grandes.',
          'Il précise que le range d’intensités faibles est transformé vers une plage plus large.',
          'Conséquence donnée dans le support : les objets de faibles intensités apparaissent plus clairement.',
        ],
        checkpoint: 'Log : ouvrir les faibles intensités, tasser les fortes.',
      },
      {
        eyebrow: 'Puissance',
        title: 'La loi gamma généralise log et exponentielle pour manipuler le contraste',
        body: [
          'Le chapitre présente les lois de puissance comme une généralisation du log et de l’exponentielle pour la manipulation de contraste.',
          'La formule affichée est g(x,y)=(f(x,y))^gamma.',
          'Dans les exemples, gamma inférieur à 1 corrige des images trop sombres ; gamma supérieur à 1 corrige des images trop lumineuses ou délavées.',
        ],
        checkpoint: 'Gamma < 1 éclaircit les faibles valeurs normalisées ; gamma > 1 les assombrit.',
      },
      {
        eyebrow: 'Acquisition',
        title: 'Gamma encoding stocke plus de nuances dans les faibles intensités',
        body: [
          'Le support indique que l’œil humain est plus sensible aux différences dans le domaine de faible intensité.',
          'Pendant l’acquisition et la sauvegarde, une correction gamma peut stocker plus de nuances d’intensités faibles.',
          'Les moniteurs apportent ensuite une correction inverse pour restituer les intensités d’origine.',
        ],
        checkpoint: 'Encoding et decoding sont inverses : ne les mélange pas.',
      },
    ],
    figureNotes: [
      {
        file: 'transformationIntensite_p6_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p6_fig2.jpeg',
        page: '6',
        title: 'Transformation logarithmique',
        observe: 'La courbe est forte au début puis se tasse.',
        teaches: 'Les faibles intensités reçoivent plus de place en sortie.',
      },
      {
        file: 'transformationIntensite_p7_fig3.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p7_fig3.jpeg',
        page: '7',
        title: 'Lois de puissance',
        observe: 'Plusieurs courbes gamma modifient différemment la sortie.',
        teaches: 'Le paramètre gamma pilote la correction non linéaire.',
      },
      {
        file: 'transformationIntensite_p7_fig9.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p7_fig9.jpeg',
        page: '7',
        title: 'Image trop sombre',
        observe: 'Le support associe des gamma inférieurs à 1 à une expansion des intensités.',
        teaches: 'Gamma peut révéler des structures dans une image sombre.',
      },
      {
        file: 'transformationIntensite_p7_fig14.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p7_fig14.jpeg',
        page: '7',
        title: 'Image trop lumineuse',
        observe: 'Le support montre des corrections gamma 3, 4 et 5.',
        teaches: 'Gamma supérieur à 1 compresse les intensités dans une image trop claire.',
      },
      {
        file: 'transformationIntensite_p8_fig4.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p8_fig4.jpeg',
        page: '8',
        title: 'Gamma encoding',
        observe: 'La figure accompagne la sensibilité humaine aux faibles intensités.',
        teaches: 'La correction gamma sert aussi au stockage et à l’affichage.',
      },
    ],
    lab: {
      kind: 'intensity-gamma',
      title: 'Piloter log et gamma sur la même image',
      intro: 'Passe du logarithme à gamma, puis ajuste les paramètres pour voir la courbe et l’image changer ensemble.',
      sourceNote: 'Fondé sur transformationIntensite.md pages 6-8 et sur labo_02.md exercices 2.5 et 2.6.',
      parts: [
        {
          id: 'log',
          title: 'Log',
          goal: 'Dilater les faibles intensités et compresser les fortes.',
          sourceNote: 'Fondé sur transformationIntensite.md page 6 et labo_02.md exercice 2.5.',
        },
        {
          id: 'gamma',
          title: 'Gamma',
          goal: 'Modifier gamma pour corriger image sombre ou claire.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 7-8 et labo_02.md exercice 2.6.',
        },
      ],
    },
    flashcards: [
      { id: 'log-effect', question: 'Effet du log sur les faibles intensités ?', answer: 'Il les dilate vers une plage de sortie plus large.' },
      { id: 'gamma-formula', question: 'Formule gamma affichée dans le cours ?', answer: 'g(x,y)=(f(x,y))^gamma.' },
      { id: 'gamma-dark', question: 'Gamma inférieur à 1 sert dans les exemples à quoi ?', answer: 'À corriger une image trop sombre en expansion des intensités.' },
      { id: 'gamma-display', question: 'Que font les moniteurs selon le cours ?', answer: 'Ils appliquent une correction inverse pour restituer les intensités d’origine.' },
    ],
    quiz: [
      {
        id: 'gamma-q1',
        question: 'Le log transforme les faibles intensités vers…',
        options: ['une plage plus large', 'une ROI', 'un espace de Hough'],
        answerIndex: 0,
        feedback: 'Le support dit que le range d’intensités faibles est transformé vers une plage plus large.',
      },
      {
        id: 'gamma-q2',
        question: 'Dans les exemples du cours, gamma 0.6, 0.4, 0.3 concernent…',
        options: ['une image trop sombre', 'un seuillage', 'une égalisation sans paramètre'],
        answerIndex: 0,
        feedback: 'Ces valeurs apparaissent dans l’exemple d’expansion des intensités pour une image trop sombre.',
      },
      {
        id: 'gamma-q3',
        question: 'Pourquoi le gamma encoding est-il utile selon le cours ?',
        options: ['Stocker plus de nuances faibles', 'Supprimer les pixels voisins', 'Calculer M x N x k'],
        answerIndex: 0,
        feedback: 'Le support relie gamma encoding à la sensibilité de l’œil et aux nuances de faibles intensités.',
      },
    ],
    pitfalls: [
      'Dire que log augmente uniformément toutes les intensités.',
      'Inverser gamma < 1 et gamma > 1.',
      'Confondre gamma encoding et correction inverse du moniteur.',
    ],
    examSummary: 'Le log dilate les faibles intensités et compresse les fortes. La loi gamma g(x,y)=(f(x,y))^gamma manipule le contraste : gamma < 1 aide les images sombres, gamma > 1 aide les images trop lumineuses. Gamma encoding et decoding sont liés au stockage et à l’affichage.',
  },
  {
    id: 'histogrammes-intensite',
    chapter: 2,
    number: 4,
    chapterTitle: 'Transformations d’intensité',
    title: 'Histogrammes, densité et cumulative',
    shortTitle: 'Histogrammes',
    status: 'ready',
    focus: 'Histogramme d’intensités, densité, cumulative, canaux, effet d’une transformation',
    source: { file: 'transformationIntensite.md', page: '11-14' },
    modeIntros: {
      learn: 'Lire un histogramme comme une distribution des intensités et comprendre la cumulative.',
      lab: 'Changer une distribution d’image et voir l’histogramme et la cumulative se recalculer.',
      review: 'Savoir expliquer fréquence, densité, cumulative et histogramme par canal.',
    },
    learnSections: [
      {
        eyebrow: 'Fréquences',
        title: 'Un histogramme compte les pixels par intensité',
        body: [
          'Le labo demande un tableau de fréquence : la position correspond à l’intensité, la valeur au nombre de pixels ayant cette intensité.',
          'Le cours montre ensuite l’histogramme des intensités et l’histogramme pour chaque canal.',
          'Un histogramme donne donc une vue globale des valeurs sans montrer directement où elles sont dans l’image.',
        ],
        checkpoint: 'Histogramme : intensité en abscisse, nombre de pixels en ordonnée.',
      },
      {
        eyebrow: 'Probabilité',
        title: 'La densité est présentée comme limite d’un histogramme',
        body: [
          'Le rappel du cours définit la densité de probabilité et indique qu’elle peut être vue informellement comme la limite d’un histogramme.',
          'La fonction de distribution cumulative associe à x la probabilité d’obtenir une valeur inférieure ou égale.',
          'Le cours rappelle aussi que F(b)-F(a) donne la probabilité d’être dans un intervalle.',
        ],
        checkpoint: 'La cumulative additionne progressivement les probabilités ou fréquences.',
      },
      {
        eyebrow: 'Transformation',
        title: 'Modifier les intensités modifie l’histogramme',
        body: [
          'La section “Histogramme et transformation d’intensité - Log” dit qu’une transformation d’intensité consiste à modifier l’histogramme des intensités.',
          'Le chapitre pose alors l’idée de travailler directement sur les histogrammes pour obtenir des propriétés désirables.',
          'Cette idée prépare la normalisation et l’égalisation d’histogramme.',
        ],
        checkpoint: 'Une transformation point par point se voit aussi comme un déplacement de l’histogramme.',
      },
    ],
    figureNotes: [
      {
        file: 'transformationIntensite_p11_fig1.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p11_fig1.jpeg',
        page: '11',
        title: 'Densité et cumulative',
        observe: 'Le support relie histogramme, densité et fonction cumulative.',
        teaches: 'La cumulative résume les fréquences accumulées.',
      },
      {
        file: 'transformationIntensite_p12_fig1.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p12_fig1.jpeg',
        page: '12',
        title: 'Histogramme des intensités',
        observe: 'La figure affiche la distribution des niveaux de gris.',
        teaches: 'Le contraste d’une image se lit en partie dans l’étalement de son histogramme.',
      },
      {
        file: 'transformationIntensite_p13_fig1.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p13_fig1.jpeg',
        page: '13',
        title: 'Histogramme par canal',
        observe: 'Le support montre que chaque canal couleur peut avoir son histogramme.',
        teaches: 'Une image couleur peut demander plusieurs distributions, pas une seule.',
      },
      {
        file: 'transformationIntensite_p14_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p14_fig2.jpeg',
        page: '14',
        title: 'Log et histogramme',
        observe: 'La transformation log déplace la distribution des intensités.',
        teaches: 'Lire avant/après permet de comprendre l’effet réel de T.',
      },
      {
        file: 'labo_02_p4_fig11.jpeg',
        assetPath: '/course-assets/chapter-02/labo-02/labo_02_p4_fig11.jpeg',
        page: 'labo 2.7',
        title: 'Affichage des histogrammes',
        observe: 'Le labo demande d’afficher les histogrammes des images calculées.',
        teaches: 'Comparer les traitements passe par le couple image + histogramme.',
      },
    ],
    lab: {
      kind: 'histogram',
      title: 'Lire histogramme et cumulative',
      intro: 'Change la distribution des pixels et active la cumulative pour voir comment l’information statistique se construit.',
      sourceNote: 'Fondé sur transformationIntensite.md pages 11-14 et sur labo_02.md exercice 2.7.',
      parts: [
        {
          id: 'histogram',
          title: 'Histogramme',
          goal: 'Changer la distribution et lire les fréquences.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 11-14 et labo_02.md exercice 2.7.',
        },
        {
          id: 'cumulative',
          title: 'Cumulative',
          goal: 'Afficher ou masquer l’accumulation des fréquences.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 11-14 et labo_02.md exercice 2.7.',
        },
      ],
    },
    flashcards: [
      { id: 'hist-frequency', question: 'Dans le labo, que contient hist_1 ?', answer: 'Un tableau où l’index est l’intensité et la valeur le nombre de pixels.' },
      { id: 'density-limit', question: 'Comment le cours décrit-il informellement une densité ?', answer: 'Comme la limite d’un histogramme.' },
      { id: 'cdf-role', question: 'Que donne la cumulative F_X(x) ?', answer: 'La probabilité d’obtenir une valeur inférieure ou égale à x.' },
      { id: 'hist-transform', question: 'Que fait une transformation d’intensité à l’histogramme ?', answer: 'Elle modifie l’histogramme des intensités.' },
    ],
    quiz: [
      {
        id: 'hist-q1',
        question: 'Dans un histogramme d’intensité, la position correspond…',
        options: ['à l’intensité', 'au voisinage n x n', 'au nom du capteur'],
        answerIndex: 0,
        feedback: 'L’énoncé du labo dit que la position de l’élément correspond à l’intensité.',
      },
      {
        id: 'hist-q2',
        question: 'La cumulative donne la probabilité…',
        options: ['d’obtenir une valeur inférieure ou égale', 'de choisir un seuil humain', 'de redimensionner une ROI'],
        answerIndex: 0,
        feedback: 'C’est la définition donnée dans le rappel du cours.',
      },
      {
        id: 'hist-q3',
        question: 'Pourquoi comparer image et histogramme ?',
        options: ['Parce que T modifie la distribution', 'Parce que l’histogramme donne les coordonnées x,y', 'Parce que gamma supprime la couleur'],
        answerIndex: 0,
        feedback: 'Le chapitre montre que les transformations déplacent l’histogramme des intensités.',
      },
    ],
    pitfalls: [
      'Croire qu’un histogramme conserve la position spatiale des pixels.',
      'Confondre densité et cumulative.',
      'Oublier les histogrammes séparés par canal pour une image couleur.',
    ],
    examSummary: 'Un histogramme compte les pixels par intensité. La densité peut être vue comme une limite d’histogramme, et la cumulative additionne les probabilités jusqu’à une valeur. Une transformation d’intensité modifie la distribution des intensités.',
  },
  {
    id: 'normalisation-egalisation',
    chapter: 2,
    number: 5,
    chapterTitle: 'Transformations d’intensité',
    title: 'Normalisation et égalisation d’histogramme',
    shortTitle: 'Normaliser & égaliser',
    status: 'ready',
    focus: 'Stretching linéaire, contraste, densité uniforme, T(I)=Imax F_old(I)',
    source: { file: 'transformationIntensite.md', page: '15-19' },
    modeIntros: {
      learn: 'Distinguer normalisation linéaire et égalisation d’histogramme, puis lire leurs effets sur le contraste.',
      lab: 'Comparer une image faible contraste, sa version normalisée et sa version égalisée.',
      review: 'Savoir retrouver l’idée de T(I)=Imax F_old(I) et les contraintes de monotonie.',
    },
    learnSections: [
      {
        eyebrow: 'Normalisation',
        title: 'Le stretching linéaire étend la plage de valeurs',
        body: [
          'Le cours définit la normalisation d’histogramme comme une transformation d’intensité linéaire appliquée à chaque pixel.',
          'Son objectif est d’étendre la plage de valeurs à l’ensemble des valeurs disponibles.',
          'Le support indique que la forme de l’histogramme est préservée, mais étendue, et que le contraste est amélioré.',
        ],
        checkpoint: 'Normaliser : étirer la plage, sans changer fondamentalement la forme.',
      },
      {
        eyebrow: 'Égalisation',
        title: 'Une image plus contrastée tend vers une densité proche de l’uniforme',
        body: [
          'Le cours observe qu’une image avec plus de contraste présente une densité proche de l’uniforme.',
          'Il rappelle que la cumulative d’une distribution uniforme est une droite.',
          'L’égalisation vise donc à transformer les intensités pour obtenir une distribution plus uniforme.',
        ],
        checkpoint: 'Égaliser : chercher une distribution d’intensités plus uniforme.',
      },
      {
        eyebrow: 'Formule',
        title: 'La transformation est monotone et s’appuie sur la cumulative',
        body: [
          'Le support impose que T soit monotone croissante afin de conserver l’ordre des intensités.',
          'Il établit ensuite la relation T(I)=Imax F_old(I).',
          'Le chapitre précise aussi que l’égalisation ne nécessite pas de paramétrisation.',
        ],
        checkpoint: 'La formule clé du cours est T(I)=Imax F_old(I).',
      },
    ],
    figureNotes: [
      {
        file: 'transformationIntensite_p15_fig1.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p15_fig1.jpeg',
        page: '15',
        title: 'Stretching linéaire',
        observe: 'La plage d’intensité est étendue.',
        teaches: 'La normalisation améliore le contraste en utilisant plus de valeurs disponibles.',
      },
      {
        file: 'transformationIntensite_p15_fig3.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p15_fig3.jpeg',
        page: '15',
        title: 'Histogramme étendu',
        observe: 'La forme est préservée mais étalée.',
        teaches: 'Normaliser n’est pas égaliser : la distribution ne devient pas nécessairement uniforme.',
      },
      {
        file: 'transformationIntensite_p16_fig2.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p16_fig2.jpeg',
        page: '16',
        title: 'Contraste plus élevé',
        observe: 'Le support relie contraste et densité proche de l’uniforme.',
        teaches: 'L’égalisation vise une distribution plus équilibrée.',
      },
      {
        file: 'transformationIntensite_p17_fig9.jpeg',
        assetPath: '/course-assets/chapter-02/transformation-intensite/transformationIntensite_p17_fig9.jpeg',
        page: '17',
        title: 'Transformation par cumulative',
        observe: 'La visualisation montre le lien entre cumulative ancienne et nouvelle intensité.',
        teaches: 'T(I)=Imax F_old(I) est la règle centrale de l’égalisation.',
      },
      {
        file: 'labo_02_p5_fig9.jpeg',
        assetPath: '/course-assets/chapter-02/labo-02/labo_02_p5_fig9.jpeg',
        page: 'labo 2.8',
        title: 'Égalisation en labo',
        observe: 'Le labo demande histogramme normalisé, cumulative, LUT et image égalisée.',
        teaches: 'L’égalisation se programme comme une table de correspondance construite depuis la cumulative.',
      },
    ],
    lab: {
      kind: 'histogram-equalization',
      title: 'Normaliser ou égaliser ?',
      intro: 'Pars d’une image peu contrastée, puis compare stretching linéaire et égalisation par cumulative.',
      sourceNote: 'Fondé sur transformationIntensite.md pages 15-19 et sur labo_02.md exercices 2.4 et 2.8.',
      parts: [
        {
          id: 'normalize',
          title: 'Normalisation',
          goal: 'Étendre linéairement la plage d’intensités.',
          sourceNote: 'Fondé sur transformationIntensite.md page 15 et labo_02.md exercice 2.4.',
        },
        {
          id: 'equalize',
          title: 'Égalisation',
          goal: 'Comparer l’histogramme égalisé par cumulative.',
          sourceNote: 'Fondé sur transformationIntensite.md pages 16-19 et labo_02.md exercice 2.8.',
        },
      ],
    },
    flashcards: [
      { id: 'normalize-range', question: 'Que fait la normalisation linéaire ?', answer: 'Elle étend la plage de valeurs à l’ensemble des valeurs disponibles.' },
      { id: 'normalize-shape', question: 'Que devient la forme de l’histogramme normalisé ?', answer: 'Elle est préservée, mais étendue.' },
      { id: 'equalize-formula', question: 'Formule clé de l’égalisation dans le cours ?', answer: 'T(I)=Imax F_old(I).' },
      { id: 'equalize-param', question: 'L’égalisation nécessite-t-elle une paramétrisation ?', answer: 'Le cours dit que non.' },
    ],
    quiz: [
      {
        id: 'equalize-q1',
        question: 'La normalisation linéaire préserve surtout…',
        options: ['la forme de l’histogramme', 'les coordonnées des voisins', 'le nom des fichiers'],
        answerIndex: 0,
        feedback: 'Le support dit que la forme de l’histogramme est préservée, mais étendue.',
      },
      {
        id: 'equalize-q2',
        question: 'L’égalisation cherche une densité…',
        options: ['proche de l’uniforme', 'toujours concentrée au centre', 'identique au négatif'],
        answerIndex: 0,
        feedback: 'Le cours relie contraste plus élevé et densité proche de l’uniforme.',
      },
      {
        id: 'equalize-q3',
        question: 'Pourquoi T doit-elle être monotone croissante ?',
        options: ['Pour conserver l’ordre des intensités', 'Pour supprimer la cumulative', 'Pour changer la taille M x N'],
        answerIndex: 0,
        feedback: 'Le support indique que le comptage et l’ordre des intensités restent identiques.',
      },
    ],
    pitfalls: [
      'Confondre normalisation et égalisation.',
      'Croire que l’égalisation demande un seuil choisi par l’humain.',
      'Oublier que T est monotone croissante dans la démonstration.',
    ],
    examSummary: 'La normalisation applique une transformation linéaire pour étendre la plage d’intensités tout en préservant la forme de l’histogramme. L’égalisation vise une densité plus uniforme, utilise la cumulative et suit T(I)=Imax F_old(I), sans paramétrisation.',
  },
  {
    id: 'sources-images',
    chapter: 1,
    number: 2,
    chapterTitle: 'Introduction',
    title: 'Sources d’images',
    shortTitle: 'Sources',
    status: 'ready',
    focus: 'Énergie électromagnétique, acoustique, synthétique',
    source: { file: 'introduction.md', page: '11-14' },
    modeIntros: {
      learn: 'Classifier les images selon le signal physique qui les produit et sa manière d’interagir avec la matière.',
      lab: 'Changer de modalité pour voir ce que chaque type de source révèle ou mesure.',
      review: 'Savoir relier rayons X, IRM, radar, ultrasons et images synthétiques à leur source.',
    },
    learnSections: [
      {
        eyebrow: 'Principe',
        title: 'Une image peut venir de plusieurs sources d’énergie',
        body: [
          'Le cours propose de classifier une image selon sa source d’énergie.',
          'Les sources se distinguent par le processus physique qui génère le signal et par leur manière d’interagir avec la matière.',
          'La vision numérique étend la perception au-delà de la partie visible humaine.',
        ],
        checkpoint: 'Une image n’implique pas forcément une scène visible en RGB.',
      },
      {
        eyebrow: 'Électromagnétique',
        title: 'Le spectre électromagnétique dépasse largement le visible',
        body: [
          'Le support cite des exemples électromagnétiques : rayons gamma, rayons X, ultraviolet, visible, infrarouge, micro-ondes et ondes radio.',
          'Les rayons X exploitent l’absorption par les objets denses ; les micro-ondes sont utilisées par les radars ; les ondes radio interviennent dans l’IRM.',
          'Chaque bande révèle des contrastes différents selon l’interaction avec la matière.',
        ],
        checkpoint: 'Rayons X, IR, radar et IRM ne sont pas des variantes décoratives : ce sont des sources physiques différentes.',
      },
      {
        eyebrow: 'Autres sources',
        title: 'L’acoustique et le synthétique produisent aussi des images',
        body: [
          'Le cours distingue aussi l’énergie acoustique, par exemple les ultrasons utilisés en échographie.',
          'Il mentionne également les images synthétiques générées par ordinateur.',
          'Une image est donc une représentation issue d’un signal, pas seulement une photographie visible.',
        ],
        checkpoint: 'Ultrasons = acoustique ; image synthétique = générée par ordinateur.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p11_fig5.jpeg',
        page: '11',
        title: 'Sources d’énergie',
        observe: 'La vision numérique est placée au-delà du visible humain.',
        teaches: 'La notion de vision dépend du signal perceptible ou mesuré.',
      },
      {
        file: 'introduction_p12_fig4.jpeg',
        page: '12',
        title: 'Énergie électromagnétique',
        observe: 'Le cours donne des exemples d’animaux et de détecteurs hors visible.',
        teaches: 'Un capteur peut “voir” ce que l’œil humain ne voit pas.',
      },
      {
        file: 'introduction_p13_fig5.jpeg',
        page: '13',
        title: 'Rayons X',
        observe: 'Les objets denses filtrent davantage les rayons X.',
        teaches: 'Le contraste dépend de l’interaction physique avec la matière.',
      },
      {
        file: 'introduction_p14_fig19.jpeg',
        page: '14',
        title: 'IRM',
        observe: 'Le support décrit champ magnétique, protons d’hydrogène et signal radio.',
        teaches: 'L’IRM relève des ondes radio dans un contexte magnétique.',
      },
      {
        file: 'introduction_p14_fig23.jpeg',
        page: '14',
        title: 'Échographie',
        observe: 'Les ultrasons rebondissent sur les tissus plus denses.',
        teaches: 'L’énergie acoustique peut produire une image mesurée.',
      },
    ],
    lab: {
      kind: 'sources',
      title: 'Choisir une modalité, comprendre son contraste',
      intro: 'Sélectionne une source et observe le type de signal, le principe d’interaction et l’exemple du cours.',
      sourceNote: 'Fondé sur les exemples pages 11-14.',
      parts: [
        {
          id: 'electromagnetic',
          title: 'Électromagnétique',
          goal: 'Comparer rayons X, infrarouge et IRM selon le signal.',
          sourceNote: 'Fondé sur les sources électromagnétiques pages 11-14.',
        },
        {
          id: 'medical-acoustic',
          title: 'Acoustique et synthétique',
          goal: 'Comparer ultrasons et image synthétique avec les autres modalités.',
          sourceNote: 'Fondé sur énergie acoustique et images générées par ordinateur, pages 11-14.',
        },
      ],
    },
    flashcards: [
      { id: 'source-classer', question: 'Selon quoi le cours propose-t-il de classifier une image ?', answer: 'Selon sa source d’énergie.' },
      { id: 'source-x', question: 'Pourquoi les os apparaissent-ils blancs en rayons X selon le support ?', answer: 'Les objets denses absorbent/filtrent davantage les rayons X.' },
      { id: 'source-irm', question: 'Quelle source intervient dans l’IRM décrite par le cours ?', answer: 'Des ondes radio dans un champ magnétique.' },
      { id: 'source-ultrasons', question: 'À quelle famille appartiennent les ultrasons ?', answer: 'Énergie acoustique, mécanique.' },
    ],
    quiz: [
      {
        id: 'sources-q1',
        question: 'Une échographie utilise principalement…',
        options: ['Des ultrasons', 'Des rayons gamma', 'Une image synthétique'],
        answerIndex: 0,
        feedback: 'Le cours place l’échographie dans les exemples d’ultrasons.',
      },
      {
        id: 'sources-q2',
        question: 'Les radars mentionnés dans le cours utilisent surtout…',
        options: ['Des micro-ondes', 'Des cônes rétiniens', 'Des pixels RGB'],
        answerIndex: 0,
        feedback: 'Le support décrit une pulsation de micro-ondes et l’énergie de retour vers l’antenne radar.',
      },
      {
        id: 'sources-q3',
        question: 'L’IRM décrite dans le support capte finalement…',
        options: ['Un signal radio émis lors du réalignement', 'Un son visible', 'Un gradient HOG'],
        answerIndex: 0,
        feedback: 'Le support explique qu’après l’arrêt du signal radio, la matière se réaligne en émettant un signal radio capté.',
      },
    ],
    pitfalls: [
      'Réduire “image” à “lumière visible”.',
      'Confondre les ultrasons avec une source électromagnétique.',
      'Parler d’IRM sans mentionner champ magnétique et signal radio.',
    ],
    examSummary: 'Le chapitre classe les images selon leur source d’énergie et leur interaction avec la matière. Les exemples couvrent électromagnétique, acoustique et synthétique : rayons X, IR, radar, IRM, ultrasons, images générées par ordinateur.',
  },
  {
    id: 'traitement-analyse',
    chapter: 1,
    number: 3,
    chapterTitle: 'Introduction',
    title: 'Traitement et analyse d’image',
    shortTitle: 'Pipeline',
    status: 'ready',
    focus: 'Acquisition, amélioration, segmentation, classification',
    source: { file: 'introduction.md', page: '9, 16-23' },
    modeIntros: {
      learn: 'Comprendre la différence entre transformer une image et en extraire une information exploitable.',
      lab: 'Construire un pipeline cohérent à partir des étapes du support.',
      review: 'Retenir l’ordre logique des opérations et les jalons historiques cités dans le cours.',
    },
    learnSections: [
      {
        eyebrow: 'Pipeline',
        title: 'Le support distingue traitement et analyse',
        body: [
          'Le schéma de vision numérique liste acquisition, amélioration, compression, morphologie, segmentation, extraction de caractéristiques et classification.',
          'Certaines étapes rendent l’image plus utile ; d’autres servent à extraire une décision ou du sens.',
          'Le cours relie ce processus à une fonction cognitive ou à l’IA.',
        ],
        checkpoint: 'Améliorer une image n’est pas encore classer un objet.',
      },
      {
        eyebrow: 'Humain vs machine',
        title: 'La vision humaine donne du sens ; la vision numérique transforme des matrices',
        body: [
          'Le support oppose perception humaine hiérarchique, contexte, mémoire et sémantique à une transformation mathématique d’une matrice.',
          'Il note I(x,y) = intensité pour introduire la représentation mesurable de l’image.',
          'Textures, gradients et contours deviennent des éléments exploitables par des algorithmes.',
        ],
        checkpoint: 'La machine manipule une représentation numérique avant d’attribuer un sens.',
      },
      {
        eyebrow: 'Évolution',
        title: 'Feature engineering et deep learning sont deux étapes importantes',
        body: [
          'Le cours cite des fondations historiques : transmission d’images, premiers ordinateurs, programme spatial, imagerie médicale, essor informatique.',
          'Il présente des algorithmes classiques comme Viola-Jones et HOG, fondés sur des caractéristiques conçues manuellement.',
          'Le deep learning apprend des représentations, comme des embeddings ou des features déterminées par le réseau lui-même.',
        ],
        checkpoint: 'Feature engineering = caractéristiques conçues ; deep learning = caractéristiques apprises.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p9_fig1.jpeg',
        page: '9',
        title: 'Processing et analyse',
        observe: 'Le schéma liste les étapes principales du pipeline.',
        teaches: 'Le pipeline va de l’acquisition à la classification et au sens.',
      },
      {
        file: 'introduction_p16_fig7.jpeg',
        page: '16',
        title: 'Transformation mathématique',
        observe: 'L’image est ramenée à une intensité I(x,y).',
        teaches: 'La vision numérique part d’une représentation mathématique.',
      },
      {
        file: 'introduction_p16_fig9.jpeg',
        page: '16',
        title: 'Textures, gradients, contours',
        observe: 'Le support montre des indices visuels exploitables.',
        teaches: 'Les caractéristiques peuvent servir à l’analyse automatique.',
      },
      {
        file: 'introduction_p20_fig2.jpeg',
        page: '20',
        title: 'Viola-Jones',
        observe: 'Les features de type Haar représentent des contrastes rectangulaires.',
        teaches: 'Avant les réseaux profonds, on construisait explicitement des caractéristiques.',
      },
      {
        file: 'introduction_p22_fig7.jpeg',
        page: '22',
        title: 'Approche hiérarchique',
        observe: 'Le deep learning construit des représentations sur plusieurs couches.',
        teaches: 'Les features peuvent être apprises par le réseau lui-même.',
      },
    ],
    lab: {
      kind: 'pipeline',
      title: 'Assembler un pipeline de vision cohérent',
      intro: 'Active les étapes du support et observe comment on passe d’une image brute à une décision.',
      sourceNote: 'Fondé sur le schéma page 9 et les explications pages 16-23.',
      parts: [
        {
          id: 'processing',
          title: 'Traitement',
          goal: 'Suivre acquisition, amélioration et segmentation.',
          sourceNote: 'Fondé sur le pipeline page 9 et le traitement pages 16-17.',
        },
        {
          id: 'analysis',
          title: 'Analyse',
          goal: 'Suivre extraction de caractéristiques et classification.',
          sourceNote: 'Fondé sur analyse, feature engineering et classification pages 18-23.',
        },
      ],
    },
    flashcards: [
      { id: 'pipeline-acq', question: 'Quelle est la première étape du pipeline listé page 9 ?', answer: 'L’acquisition.' },
      { id: 'pipeline-seg', question: 'À quoi sert la segmentation ?', answer: 'À découper ou isoler des régions pertinentes avant l’analyse.' },
      { id: 'pipeline-feature', question: 'Que signifie feature engineering dans ce chapitre ?', answer: 'Concevoir/exploiter des caractéristiques comme contrastes, contours, gradients.' },
      { id: 'pipeline-dl', question: 'Que change le deep learning selon le cours ?', answer: 'La feature peut être déterminée par le réseau lui-même.' },
    ],
    quiz: [
      {
        id: 'pipeline-q1',
        question: 'Quelle étape vient logiquement avant la classification ?',
        options: ['Extraction de caractéristiques', 'Affichage RGB uniquement', 'Suppression du capteur'],
        answerIndex: 0,
        feedback: 'Le schéma place extraction de caractéristiques avant classification.',
      },
      {
        id: 'pipeline-q2',
        question: 'HOG représente principalement…',
        options: ['Des orientations de gradients', 'Des protons d’hydrogène', 'Des ultrasons'],
        answerIndex: 0,
        feedback: 'Le support décrit HOG comme une représentation statistique des orientations des gradients.',
      },
      {
        id: 'pipeline-q3',
        question: 'Dans AlexNet/deep learning, la feature est…',
        options: ['Déterminée par le réseau lui-même', 'Toujours dessinée à la main', 'Équivalente à brightness'],
        answerIndex: 0,
        feedback: 'Le cours indique que la feature est déterminée par le réseau lui-même.',
      },
    ],
    pitfalls: [
      'Croire que traitement et classification sont la même opération.',
      'Oublier l’acquisition au début du pipeline.',
      'Confondre feature engineering manuel et représentations apprises par deep learning.',
    ],
    examSummary: 'Le pipeline du chapitre va de l’acquisition vers amélioration/compression, morphologie, segmentation, extraction de caractéristiques et classification. Le cours oppose perception humaine et transformation mathématique de matrices, puis situe feature engineering et deep learning dans l’évolution de la vision numérique.',
  },
  {
    id: 'definition-image',
    chapter: 1,
    number: 4,
    chapterTitle: 'Introduction',
    title: 'Définition d’une image numérique',
    shortTitle: 'Image numérique',
    status: 'ready',
    focus: 'f(x,y), pixel, échantillonnage, discrétisation',
    source: { file: 'introduction.md', page: '25-28' },
    modeIntros: {
      learn: 'Comprendre comment une image devient une fonction discrète de deux coordonnées spatiales.',
      lab: 'Manipuler M, N et k pour observer pixels, intensités et mémoire.',
      review: 'Savoir définir f(x,y), pixel, échantillonnage et discrétisation sans confusion.',
    },
    learnSections: [
      {
        eyebrow: 'Intuition',
        title: 'Une image numérique est une mesure rangée dans une grille',
        body: [
          'Une image n’est pas seulement une photo affichée à l’écran. Pour un ordinateur, c’est un tableau organisé de valeurs numériques.',
          'Chaque case du tableau correspond à un pixel. Chaque pixel porte une valeur : une intensité en niveaux de gris, ou plusieurs valeurs quand l’image est en couleur.',
          'Le point important pour le cours : dès qu’une image devient numérique, on peut la stocker, la transformer et appliquer des algorithmes dessus.',
        ],
        checkpoint: 'Si tu peux dire “une image = une grille + des nombres”, tu as l’intuition de départ.',
      },
      {
        eyebrow: 'Définition du cours',
        title: 'La notation f(x,y) décrit la valeur de l’image en un point',
        body: [
          'Le cours définit une image numérique par une fonction f(x,y) avec deux dimensions spatiales discrètes.',
          'Les valeurs de f(x,y) sont finies et discrètes ; elles correspondent à l’intensité de l’image.',
          'Chaque élément est communément appelé pixel.',
        ],
        checkpoint: 'f(3,2) signifie : “quelle intensité vaut le pixel placé à cette position ?”',
      },
      {
        eyebrow: 'Échantillonnage',
        title: 'M et N fixent combien de positions existent dans l’image',
        body: [
          'Le support représente l’image comme une matrice MxN.',
          'M désigne la hauteur de l’image, N la largeur.',
          'Choisir M et N revient à choisir l’échantillonnage spatial, donc le nombre de positions représentées.',
        ],
        checkpoint: 'M x N décrit le nombre de pixels, pas la profondeur des intensités.',
      },
      {
        eyebrow: 'Discrétisation',
        title: 'La discrétisation des intensités dépend de k bits',
        body: [
          'Le cours indique que les choix d’échantillonnage et de discrétisation ont un impact important sur la taille de l’image.',
          'Pour un pixel codé sur 8 bits, l’intensité peut être représentée entre 0 et 255.',
          'k est le nombre de bits utilisé pour représenter l’intensité sur un pixel.',
        ],
        checkpoint: 'k ne dit pas combien il y a de pixels. k dit combien de bits représentent l’intensité d’un pixel.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p26_fig1.jpeg',
        page: '26',
        title: 'Image comme fonction et matrice',
        observe: 'La même image peut être vue comme une surface, une matrice et un ensemble de valeurs.',
        teaches: 'Le passage vers le numérique consiste à manipuler des valeurs organisées spatialement.',
      },
      {
        file: 'introduction_p27_fig1.jpeg',
        page: '27',
        title: 'Création d’une image numérique',
        observe: 'Le signal continu est représenté par des échantillons.',
        teaches: 'L’échantillonnage transforme une scène continue en positions discrètes.',
      },
      {
        file: 'introduction_p27_fig5.jpeg',
        page: '27',
        title: 'Échantillonnage et discrétisation',
        observe: 'Les positions et les valeurs sont toutes deux rendues discrètes.',
        teaches: 'Échantillonnage spatial et discrétisation des intensités sont deux décisions différentes.',
      },
      {
        file: 'introduction_p28_fig1.jpeg',
        page: '28',
        title: 'Effet des choix de numérisation',
        observe: 'La qualité perçue dépend du nombre de positions et de valeurs conservées.',
        teaches: 'Une mauvaise numérisation peut perdre de l’information avant tout traitement.',
      },
    ],
    lab: {
      kind: 'pixels',
      title: 'Lire f(x,y) dans une matrice',
      intro: 'Change M, N et k, puis clique sur un pixel pour lire une valeur d’intensité simulée.',
      sourceNote: 'Fondé sur les définitions et la représentation matricielle pages 25-30.',
      parts: [
        {
          id: 'sampling',
          title: 'Échantillonnage',
          goal: 'Changer M et N pour voir la grille spatiale.',
          sourceNote: 'Fondé sur f(x,y), pixel et échantillonnage pages 25-28.',
        },
        {
          id: 'quantization',
          title: 'Quantification',
          goal: 'Changer k pour voir le nombre de niveaux.',
          sourceNote: 'Fondé sur discrétisation et k bits, pages 27-28.',
        },
        {
          id: 'memory',
          title: 'Mémoire',
          goal: 'Relier M, N, k à b = M x N x k.',
          sourceNote: 'Fondé sur représentation matricielle et taille mémoire pages 29-30.',
        },
      ],
    },
    flashcards: [
      { id: 'image-numerique', question: 'Comment définir une image numérique ?', answer: 'Une fonction f(x,y) à coordonnées spatiales discrètes, avec des valeurs finies et discrètes correspondant à l’intensité.' },
      { id: 'fxy', question: 'Que représente f(x,y) ?', answer: 'La valeur d’intensité de l’image à une position spatiale discrète.' },
      { id: 'mn', question: 'Que représentent M et N ?', answer: 'M représente la hauteur, N représente la largeur.' },
      { id: 'k', question: 'Que représente k dans b = M x N x k ?', answer: 'Le nombre de bits pour représenter l’intensité sur un pixel.' },
    ],
    quiz: [
      {
        id: 'q-fxy',
        question: 'Dans le cours, f(x,y) désigne principalement…',
        options: ['La taille du fichier', 'La valeur du pixel en une position', 'Le nombre de couleurs'],
        answerIndex: 1,
        feedback: 'f(x,y) associe une intensité à une position spatiale discrète.',
      },
      {
        id: 'q-mn',
        question: 'Dans une matrice M x N, M désigne…',
        options: ['La hauteur', 'La largeur', 'La profondeur en bits'],
        answerIndex: 0,
        feedback: 'Le cours indique M = hauteur et N = largeur.',
      },
      {
        id: 'q-discretisation',
        question: 'La discrétisation des intensités concerne surtout…',
        options: ['Le choix des valeurs possibles', 'Le choix du nom du fichier', 'La classification HOG'],
        answerIndex: 0,
        feedback: 'Le cours parle du range des intensités dans la numérisation.',
      },
    ],
    pitfalls: [
      'Confondre échantillonnage spatial et discrétisation des intensités.',
      'Inverser M et N : dans le cours, M = hauteur et N = largeur.',
      'Oublier que b = M x N x k est exprimé en bits pour une image en niveaux de gris.',
    ],
    examSummary: 'Une image numérique est une fonction f(x,y) avec coordonnées spatiales discrètes. Les valeurs finies et discrètes correspondent à l’intensité, chaque élément étant un pixel. M x N donne la matrice ; k donne les bits d’intensité ; b = M x N x k donne les bits nécessaires en niveaux de gris.',
  },
  {
    id: 'representation-couleur',
    chapter: 1,
    number: 5,
    chapterTitle: 'Introduction',
    title: 'Représentation matricielle et couleur',
    shortTitle: 'Matrice & couleur',
    status: 'ready',
    focus: 'M x N, domaine spatial, RGB, taille mémoire',
    source: { file: 'introduction.md', page: '29-32' },
    modeIntros: {
      learn: 'Lire une image comme une matrice et comprendre comment RGB restitue la couleur par synthèse additive.',
      lab: 'Activer les canaux rouge, vert et bleu pour voir leur contribution.',
      review: 'Savoir expliquer M, N, k, domaine spatial et RGB sans mélanger bits et canaux.',
    },
    learnSections: [
      {
        eyebrow: 'Matrice',
        title: 'Une image peut être représentée par une matrice MxN',
        body: [
          'Le cours indique N = largeur de l’image et M = hauteur de l’image.',
          'L’image peut être représentée par une matrice MxN.',
          'Chaque élément de cette matrice, donc chaque pixel, correspond à une valeur d’intensité f(x,y).',
        ],
        checkpoint: 'M x N = hauteur x largeur selon le support.',
      },
      {
        eyebrow: 'Domaine spatial',
        title: 'Les coordonnées (x,y) engendrent le domaine spatial',
        body: [
          'Le plan engendré par les coordonnées (x,y) est appelé domaine spatial.',
          'Cela signifie que les opérations peuvent être décrites selon la position des pixels dans l’image.',
          'Cette représentation prépare les chapitres suivants sur les transformations et filtrages.',
        ],
        checkpoint: 'Domaine spatial = espace des coordonnées des pixels.',
      },
      {
        eyebrow: 'Taille',
        title: 'b = M x N x k vaut pour une image en niveaux de gris',
        body: [
          'Le cours donne le nombre de bits nécessaire à la représentation d’une image en niveau de gris : b = M × N × k.',
          'k est le nombre de bits pour représenter l’intensité sur un pixel.',
          'Si M = N, le support donne b = N² × k.',
        ],
        checkpoint: 'La formule est en bits et pour le niveau de gris dans le support.',
      },
      {
        eyebrow: 'Couleur',
        title: 'RGB restitue la couleur par synthèse additive',
        body: [
          'Le cours précise que RGB désigne un système d’affichage électronique.',
          'Il reproduit la couleur par synthèse additive à partir des trois couleurs primaires : rouge, vert et bleu.',
          'Il est utilisé dans de nombreux dispositifs d’affichage : écrans, téléviseurs, projecteurs, téléphones.',
        ],
        checkpoint: 'RGB = rouge, vert, bleu par synthèse additive.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p30_fig6.jpeg',
        page: '30',
        title: 'Taille des images',
        observe: 'Le support lie choix M,N,k et taille mémoire.',
        teaches: 'La résolution spatiale et les bits par pixel augmentent directement la taille.',
      },
      {
        file: 'introduction_p31_fig1.jpeg',
        page: '31',
        title: 'Représentation numérique',
        observe: 'La représentation numérique rend visibles les valeurs de pixels.',
        teaches: 'Une image peut être inspectée comme un tableau de nombres.',
      },
      {
        file: 'introduction_p32_fig2.jpeg',
        page: '32',
        title: 'Représentation couleur',
        observe: 'La couleur RGB combine rouge, vert et bleu.',
        teaches: 'La perception colorée est restituée par synthèse additive sur les écrans.',
      },
    ],
    lab: {
      kind: 'color',
      title: 'Composer une couleur avec RGB',
      intro: 'Active ou désactive rouge, vert et bleu pour observer la synthèse additive citée par le cours.',
      sourceNote: 'Fondé sur la représentation couleur RGB page 32.',
      parts: [
        {
          id: 'channels',
          title: 'Canaux RGB',
          goal: 'Activer ou désactiver rouge, vert, bleu.',
          sourceNote: 'Fondé sur représentation couleur RGB page 32.',
        },
        {
          id: 'synthesis',
          title: 'Synthèse additive',
          goal: 'Composer une couleur en ajustant les intensités RGB.',
          sourceNote: 'Fondé sur représentation couleur RGB page 32.',
        },
      ],
    },
    flashcards: [
      { id: 'matrix-m', question: 'Dans le cours, que vaut M ?', answer: 'La hauteur de l’image.' },
      { id: 'matrix-n', question: 'Dans le cours, que vaut N ?', answer: 'La largeur de l’image.' },
      { id: 'domain-spatial', question: 'Qu’est-ce que le domaine spatial ?', answer: 'Le plan engendré par les coordonnées (x,y).' },
      { id: 'rgb', question: 'Que signifie RGB dans ce chapitre ?', answer: 'Un système d’affichage par synthèse additive rouge, vert, bleu.' },
    ],
    quiz: [
      {
        id: 'matrix-q1',
        question: 'Le cours donne b = M x N x k pour…',
        options: ['Une image en niveaux de gris', 'Une onde acoustique', 'Un réseau AlexNet uniquement'],
        answerIndex: 0,
        feedback: 'La formule est donnée pour la représentation d’une image en niveau de gris.',
      },
      {
        id: 'matrix-q2',
        question: 'Le domaine spatial est lié…',
        options: ['Aux coordonnées (x,y)', 'Aux ondes radio de l’IRM', 'Au brightness subjectif'],
        answerIndex: 0,
        feedback: 'Le support définit le domaine spatial comme le plan engendré par les coordonnées (x,y).',
      },
      {
        id: 'matrix-q3',
        question: 'RGB reproduit la couleur par…',
        options: ['Synthèse additive', 'Échographie', 'Segmentation'],
        answerIndex: 0,
        feedback: 'Le support parle explicitement de synthèse additive à partir de rouge, vert et bleu.',
      },
    ],
    pitfalls: [
      'Inverser M et N.',
      'Utiliser b = M x N x k sans préciser que le support la donne pour le niveau de gris.',
      'Confondre k bits avec les trois canaux RGB.',
    ],
    examSummary: 'L’image est représentée par une matrice MxN avec M hauteur et N largeur. Chaque élément correspond à une intensité f(x,y) ; le plan (x,y) est le domaine spatial. Pour le niveau de gris : b = M x N x k. RGB restitue la couleur par synthèse additive rouge, vert, bleu.',
  },
  {
    id: 'roi-resize-interpolation',
    chapter: 1,
    number: 6,
    chapterTitle: 'Introduction',
    title: 'ROI, resizing et interpolation',
    shortTitle: 'ROI & resize',
    status: 'ready',
    focus: 'Region of interest, resizing, nearest, bilinéaire',
    source: { file: 'introduction.md', page: '33-35' },
    modeIntros: {
      learn: 'Comprendre comment sélectionner une zone utile, redimensionner et choisir les valeurs des nouveaux pixels.',
      lab: 'Comparer visuellement plus proche voisin et interpolation bilinéaire sur une grille simple.',
      review: 'Savoir définir ROI, resizing, nearest et bilinéaire avec les mots du support.',
    },
    learnSections: [
      {
        eyebrow: 'ROI',
        title: 'Une ROI désigne une zone de l’image',
        body: [
          'Le cours introduit Region Of Interest, ROI, comme une zone de l’image.',
          'L’idée est de désigner la partie pertinente pour un traitement ou une analyse.',
          'Cette notion sera utile dès qu’on veut focaliser un calcul sur une zone plutôt que sur toute l’image.',
        ],
        checkpoint: 'ROI = zone de l’image à considérer.',
      },
      {
        eyebrow: 'Resizing',
        title: 'Redimensionner crée la question des nouvelles intensités',
        body: [
          'La section Resizing du cours pose explicitement la question : quelles valeurs d’intensité pour les pixels en rouge ?',
          'Lorsqu’on change la taille d’une image, la grille de destination ne correspond pas toujours exactement aux pixels originaux.',
          'Il faut donc choisir une méthode pour attribuer des intensités aux positions nouvelles.',
        ],
        checkpoint: 'Le resizing n’est pas seulement géométrique : il pose une question de valeurs d’intensité.',
      },
      {
        eyebrow: 'Nearest',
        title: 'Le plus proche voisin copie le pixel original le plus proche',
        body: [
          'Pour le plus proche voisin, le cours indique qu’on recherche dans l’image originale le pixel le plus proche.',
          'La méthode est simple à comprendre : la nouvelle valeur vient du voisin existant le plus proche.',
          'Visuellement, cela peut conserver des blocs nets dans une grille agrandie.',
        ],
        checkpoint: 'Nearest = choisir la valeur du pixel original le plus proche.',
      },
      {
        eyebrow: 'Bilinéaire',
        title: 'L’interpolation bilinéaire combine des interpolations linéaires',
        body: [
          'Le cours décrit l’interpolation bilinéaire comme une interpolation linéaire pour obtenir P1 et P2, puis entre P1 et P2 pour la valeur du point P.',
          'Elle estime donc une valeur à partir de plusieurs voisins au lieu de copier seulement le plus proche.',
          'Le résultat visuel est généralement plus progressif dans les transitions.',
        ],
        checkpoint: 'Bilinéaire = interpolation linéaire dans deux directions.',
      },
    ],
    figureNotes: [
      {
        file: 'introduction_p33_fig2.jpeg',
        page: '33',
        title: 'Region Of Interest',
        observe: 'Le support illustre une zone d’intérêt dans l’image.',
        teaches: 'Une ROI sert à désigner une zone plutôt que toute l’image.',
      },
      {
        file: 'introduction_p34_fig1.jpeg',
        page: '34',
        title: 'Resizing',
        observe: 'Des pixels de destination demandent de nouvelles valeurs d’intensité.',
        teaches: 'Le redimensionnement impose une règle d’attribution des valeurs.',
      },
      {
        file: 'introduction_p35_fig5.jpeg',
        page: '35',
        title: 'Plus proche voisin',
        observe: 'La méthode cherche le pixel original le plus proche.',
        teaches: 'Nearest est une règle de copie depuis le voisin le plus proche.',
      },
      {
        file: 'introduction_p35_fig9.jpeg',
        page: '35',
        title: 'Interpolation bilinéaire',
        observe: 'La valeur de P est obtenue via P1 et P2.',
        teaches: 'La bilinéaire combine deux interpolations linéaires.',
      },
    ],
    lab: {
      kind: 'roi',
      title: 'Comparer ROI, nearest et bilinéaire',
      intro: 'Déplace une ROI, change le facteur de resize et compare les valeurs obtenues par deux méthodes.',
      sourceNote: 'Fondé sur ROI page 33, resizing page 34 et interpolation page 35.',
      parts: [
        {
          id: 'roi',
          title: 'Sélection ROI',
          goal: 'Déplacer une zone d’intérêt dans l’image.',
          sourceNote: 'Fondé sur ROI page 33.',
        },
        {
          id: 'resize',
          title: 'Resize',
          goal: 'Changer le facteur de redimensionnement.',
          sourceNote: 'Fondé sur resizing page 34.',
        },
        {
          id: 'interpolation',
          title: 'Interpolation',
          goal: 'Comparer plus proche voisin et bilinéaire.',
          sourceNote: 'Fondé sur interpolation page 35.',
        },
      ],
    },
    flashcards: [
      { id: 'roi-def', question: 'Que désigne une ROI ?', answer: 'Une zone de l’image, region of interest.' },
      { id: 'resize-question', question: 'Quelle question pose le resizing dans le cours ?', answer: 'Quelles valeurs d’intensité donner aux nouveaux pixels ?' },
      { id: 'nearest', question: 'Principe du plus proche voisin ?', answer: 'Chercher dans l’image originale le pixel le plus proche.' },
      { id: 'bilinear', question: 'Principe de l’interpolation bilinéaire ?', answer: 'Interpoler linéairement pour obtenir P1 et P2, puis interpoler entre P1 et P2 pour P.' },
    ],
    quiz: [
      {
        id: 'roi-q1',
        question: 'ROI signifie ici…',
        options: ['Zone de l’image', 'Nombre de bits', 'Brightness subjective'],
        answerIndex: 0,
        feedback: 'Le cours définit region of interest comme une zone de l’image.',
      },
      {
        id: 'roi-q2',
        question: 'Le plus proche voisin consiste à…',
        options: ['Prendre le pixel original le plus proche', 'Additionner RGB', 'Classer avec HOG'],
        answerIndex: 0,
        feedback: 'Le support dit qu’on recherche dans l’image originale le pixel le plus proche.',
      },
      {
        id: 'roi-q3',
        question: 'La bilinéaire utilise…',
        options: ['Des interpolations linéaires', 'Des ultrasons', 'Une luminance subjective'],
        answerIndex: 0,
        feedback: 'Le cours décrit une interpolation linéaire pour obtenir P1/P2 puis P.',
      },
    ],
    pitfalls: [
      'Croire que resize se limite à changer la taille sans choisir de valeurs.',
      'Confondre nearest et bilinéaire.',
      'Oublier que ROI signifie zone d’intérêt, pas une opération de couleur.',
    ],
    examSummary: 'Une ROI désigne une zone de l’image. Le resizing pose la question des valeurs d’intensité des nouveaux pixels. Le plus proche voisin copie le pixel original le plus proche ; l’interpolation bilinéaire estime P via des interpolations linéaires successives.',
  },
  ...advancedModules,
];

export const chapterModules: ChapterModule[] = moduleContent.map((module) => ({
  id: module.id,
  chapter: module.chapter,
  number: module.number,
  chapterTitle: module.chapterTitle,
  title: module.title,
  shortTitle: module.shortTitle,
  status: module.status,
  focus: module.focus,
  source: module.source,
}));
