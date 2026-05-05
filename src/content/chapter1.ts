export type Source = { file: string; page: string };
export type ModuleData = {
  id: string;
  title: string;
  prerequis: string[];
  ultraSimple: string[];
  points: string[];
  figures: string[];
  source: Source;
};

export const chapter1Modules: ModuleData[] = [
  {
    id: 'vision-humaine',
    title: 'Module 1 — Vision humaine et subjectivité',
    prerequis: ['Aucun prérequis technique.'],
    ultraSimple: ['L\'œil capte la lumière.', 'Le cerveau interprète et peut se tromper.'],
    points: ['Rétine, bâtonnets, cônes', 'Luminance, brightness, radiance', 'Lien vision humaine / vision numérique'],
    figures: ['introduction_p5_fig1.jpeg', 'introduction_p5_fig6.jpeg', 'introduction_p6_fig2.jpeg'],
    source: { file: 'introduction.md', page: '5-8' }
  },
  {
    id: 'sources-images',
    title: 'Module 2 — Sources d’images',
    prerequis: ['Comprendre qu’une image vient d’un signal mesuré.', 'Comprendre que ce signal n’est pas limité au visible.'],
    ultraSimple: ['Une image est une trace d’énergie.', 'Cette énergie peut être lumineuse, acoustique ou simulée.'],
    course: ['Spectre EM : gamma, X, UV, visible, IR, micro-ondes, radio.', 'Imagerie acoustique : ultrasons.', 'Imagerie synthétique pour simulation.'],
    figures: ['introduction_p11_fig5.jpeg', 'introduction_p12_fig4.jpeg', 'introduction_p13_fig3.jpeg', 'introduction_p14_fig4.jpeg'],
    aRetenir: ['Chaque modalité révèle des structures différentes.', 'La vision numérique fusionne parfois plusieurs modalités.'],
    flashcards: [
      { question: 'Exemple d’imagerie non visible ?', answer: 'Rayons X, IRM, radar, échographie.' },
      { question: 'Pourquoi utiliser plusieurs sources ?', answer: 'Pour observer des phénomènes invisibles dans le visible.' }
    ],
    quiz: [
      { question: 'Quelle source est acoustique ?', options: ['IRM', 'Ultrasons', 'UV'], answerIndex: 1, feedback: 'Oui, l’échographie est basée sur les ultrasons.' }
    ],
    interactiveHint: 'Parcours le spectre et vois quelles applications dominent selon la bande.',
    source: { file: 'introduction.md', page: '11-14' }
  },
  {
    id: 'traitement-analyse',
    title: 'Module 3 — Traitement et analyse d’image',
    prerequis: ['Savoir qu’une image peut être modifiée.', 'Distinguer amélioration et extraction d’information.'],
    ultraSimple: ['Traiter = rendre l’image plus utile.', 'Analyser = faire trouver une information par la machine.'],
    course: ['Chaîne classique : acquisition → amélioration → segmentation → caractéristiques → classification.', 'Applications médicales, industrie, mobilité.', 'Évolution : feature engineering vers deep learning.'],
    figures: ['introduction_p9_fig1.jpeg', 'introduction_p16_fig4.jpeg', 'introduction_p16_fig7.jpeg', 'introduction_p17_fig15.jpeg', 'introduction_p20_fig2.jpeg'],
    aRetenir: ['Le pipeline dépend de l’objectif final.', 'Analyser une image implique une décision automatique.'],
    flashcards: [
      { question: 'Segmentation : but principal ?', answer: 'Séparer l’image en régions/objets pertinents.' },
      { question: 'Feature engineering ?', answer: 'Concevoir manuellement les descripteurs utiles.' }
    ],
    quiz: [
      { question: 'Quel bloc suit souvent la segmentation ?', options: ['Classification', 'Acquisition', 'Quantification capteur'], answerIndex: 0, feedback: 'Correct : on extrait puis classe après segmentation.' }
    ],
    interactiveHint: 'Réordonne les étapes du pipeline pour valider la logique traitement/analyse.',
    source: { file: 'introduction.md', page: '9, 16-23' }
  },
  {
    id: 'definition-image',
    title: 'Module 4 — Définition d’une image numérique',
    prerequis: ['Comprendre les coordonnées (x,y).', 'Comprendre qu’un entier peut coder une intensité.'],
    ultraSimple: ['Une image est une grille de cases.', 'Chaque case (pixel) contient une valeur.'],
    course: ['Notation f(x,y).', 'Taille M x N.', 'Quantification des niveaux de gris sur k bits.'],
    figures: ['introduction_p26_fig1.jpeg', 'introduction_p27_fig1.jpeg', 'introduction_p27_fig2.jpeg'],
    aRetenir: ['Image discrète en espace et intensité.', 'La résolution spatiale et de quantification impactent la qualité.'],
    flashcards: [
      { question: 'Que signifie M x N ?', answer: 'Nombre de lignes et colonnes de l’image.' },
      { question: 'f(x,y) représente quoi ?', answer: 'La valeur d’intensité du pixel en (x,y).' }
    ],
    quiz: [
      { question: 'Une image 8 bits contient combien de niveaux ?', options: ['128', '256', '1024'], answerIndex: 1, feedback: 'Oui : 2^8 = 256 niveaux.' }
    ],
    interactiveHint: 'Fais varier k bits pour voir l’effet de quantification sur un dégradé.',
    source: { file: 'introduction.md', page: '24-29' }
  },
  {
    id: 'representation-couleur',
    title: 'Module 5 — Représentation matricielle et couleur',
    prerequis: ['Comprendre les matrices 2D.', 'Comprendre qu’une image couleur combine plusieurs canaux.'],
    ultraSimple: ['Gris = 1 matrice.', 'Couleur = 3 matrices (R, G, B).'],
    course: ['Image grayscale: M x N.', 'Image RGB : b = M x N x k avec k=3.', 'Canaux et composition couleur.'],
    figures: ['introduction_p30_fig6.jpeg', 'introduction_p31_fig1.jpeg', 'introduction_p32_fig2.jpeg', 'introduction_p33_fig2.jpeg'],
    aRetenir: ['La couleur ajoute une dimension de données.', 'Les traitements peuvent se faire canal par canal.'],
    flashcards: [
      { question: 'k vaut combien en RGB ?', answer: '3 canaux (R,G,B).' },
      { question: 'Différence gris/RGB ?', answer: '1 canal vs 3 canaux.' }
    ],
    quiz: [
      { question: 'Forme correcte d’une image RGB ?', options: ['M x N', 'M x N x 3', '3 x M x N x 3'], answerIndex: 1, feedback: 'Correct : tenseur 3D avec 3 canaux.' }
    ],
    interactiveHint: 'Active/désactive R, G, B pour comprendre la synthèse additive.',
    source: { file: 'introduction.md', page: '30-33' }
  },
  {
    id: 'roi-resize-interpolation',
    title: 'Module 6 — ROI, resizing et interpolation',
    prerequis: ['Savoir ce qu’est un pixel.', 'Comprendre qu’agrandir/réduire exige de recalculer des valeurs.'],
    ultraSimple: ['ROI = découper une zone utile.', 'Resize = changer la taille.', 'Interpolation = deviner les nouveaux pixels.'],
    course: ['ROI pour focus local.', 'Nearest neighbor: rapide mais crénelé.', 'Bilinear: plus lisse, coût supérieur.'],
    figures: ['introduction_p34_fig1.jpeg', 'introduction_p35_fig5.jpeg', 'introduction_p35_fig6.jpeg', 'introduction_p35_fig9.jpeg'],
    aRetenir: ['Le choix d’interpolation dépend du compromis vitesse/qualité.', 'ROI limite le calcul au pertinent.'],
    flashcards: [
      { question: 'Interpolation la plus simple ?', answer: 'Nearest neighbor.' },
      { question: 'Pourquoi utiliser une ROI ?', answer: 'Réduire le calcul et cibler l’information utile.' }
    ],
    quiz: [
      { question: 'Quelle interpolation est généralement plus lisse ?', options: ['Nearest neighbor', 'Bilinear', 'Aucune'], answerIndex: 1, feedback: 'Oui, bilinear lisse mieux les transitions.' }
    ],
    interactiveHint: 'Change le facteur d’échelle et compare nearest vs bilinear.',
    source: { file: 'introduction.md', page: '34-35' }
  }
];
