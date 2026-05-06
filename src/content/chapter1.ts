export type Source = { file: string; page: string };
export type Flashcard = { question: string; answer: string };
export type QuizItem = { question: string; options: string[]; answerIndex: number; feedback: string };

export type ModuleData = {
  id: string;
  title: string;
  objectifs: string[];
  prerequis: string[];
  ultraSimple: string[];
  course: string[];
  figures: string[];
  aRetenir: string[];
  erreursFrequentes: string[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
  source: Source;
  interactiveHint: string;
};

export const chapter1Modules: ModuleData[] = [
  {
    id: 'vision-humaine', title: 'Module 1 — Vision humaine et subjectivité',
    objectifs: ['Comprendre les limites perceptives humaines.', 'Distinguer mesure physique et sensation visuelle.'],
    prerequis: ['Aucun prérequis technique.', 'Lumière captée par l’œil.'],
    ultraSimple: ['L’œil capte la lumière, le cerveau raconte une histoire.', 'Cette histoire peut être utile mais biaisée.'],
    course: ['Rétine, bâtonnets, cônes.', 'Radiance vs luminance vs brightness.', 'Illusions optiques et subjectivité.'],
    figures: ['introduction_p5_fig1.jpeg','introduction_p5_fig6.jpeg','introduction_p6_fig2.jpeg','introduction_p7_fig2.jpeg','introduction_p7_fig3.jpeg'],
    aRetenir: ['Voir ≠ mesurer exactement.', 'La vision numérique cherche des mesures robustes.'],
    erreursFrequentes: ['Confondre luminance (mesure) et brightness (perception).'],
    flashcards: [{question:'Cônes: rôle principal ?',answer:'Perception des couleurs.'},{question:'Brightness ?',answer:'Clarté perçue subjectivement.'}],
    quiz: [
      {question:'Quel terme est subjectif ?', options:['Radiance','Brightness','Luminance'], answerIndex:1, feedback:'Brightness dépend de l’observateur.'},
      {question:'Les bâtonnets sont surtout utiles pour…', options:['Vision nocturne','Vision couleur','Compression'], answerIndex:0, feedback:'Ils sont sensibles en faible lumière.'}
    ],
    source: { file: 'introduction.md', page: '5-8' }, interactiveHint: 'Observe l’effet du contraste contextuel sur la perception.'
  },
  {
    id: 'sources-images', title: 'Module 2 — Sources d’images',
    objectifs: ['Connaître les principales modalités d’imagerie.', 'Relier source physique et application.'],
    prerequis: ['Image = mesure d’un signal.'],
    ultraSimple: ['Une image peut venir de la lumière, du son, ou d’une simulation.'],
    course: ['Spectre EM: gamma → radio.', 'Modalités non visibles: X, IR, radar, IRM.', 'Ultrasons en échographie.'],
    figures: ['introduction_p11_fig5.jpeg','introduction_p12_fig4.jpeg','introduction_p13_fig3.jpeg','introduction_p14_fig4.jpeg'],
    aRetenir: ['Chaque modalité révèle un contraste différent.'],
    erreursFrequentes: ['Penser que “image” implique forcément visible RGB.'],
    flashcards: [{question:'Modalité acoustique ?',answer:'Ultrasons.'},{question:'Modalité EM médicale ?',answer:'Rayons X ou IRM (onde radio + champ magnétique).'}],
    quiz: [
      {question:'Quelle modalité est acoustique ?', options:['Rayons X','Ultrasons','UV'], answerIndex:1, feedback:'Échographie = ultrasons.'},
      {question:'IRM observe surtout…', options:['Lumière visible','Signal radio magnétique','Acoustique pure'], answerIndex:1, feedback:'IRM repose sur phénomène RMN et radiofréquences.'}
    ],
    source: { file: 'introduction.md', page: '11-14' }, interactiveHint: 'Balaye les bandes pour voir les usages dominants.'
  },
  {
    id: 'traitement-analyse', title: 'Module 3 — Traitement et analyse d’image',
    objectifs: ['Distinguer amélioration et décision.', 'Comprendre le pipeline de vision.'],
    prerequis: ['Savoir qu’une image peut être transformée.'],
    ultraSimple: ['Traiter = rendre l’image plus utile.', 'Analyser = obtenir une réponse automatique.'],
    course: ['Pipeline: acquisition → amélioration → segmentation → features → classification.', 'Applications humain/machine.', 'Feature engineering et deep learning.'],
    figures: ['introduction_p9_fig1.jpeg','introduction_p16_fig4.jpeg','introduction_p16_fig7.jpeg','introduction_p17_fig15.jpeg','introduction_p20_fig2.jpeg'],
    aRetenir: ['Le but final décide des étapes.'],
    erreursFrequentes: ['Faire de la classification sans segmentation/features fiables.'],
    flashcards: [{question:'Segmentation ?',answer:'Découper en régions pertinentes.'},{question:'Classification ?',answer:'Attribuer une classe.'}],
    quiz: [
      {question:'Étape proche de la fin ?', options:['Acquisition','Classification','Capteur'], answerIndex:1, feedback:'Classification est en aval du pipeline.'},
      {question:'Deep learning remplace souvent…', options:['Tous les capteurs','Feature engineering manuel','Quantification'], answerIndex:1, feedback:'Il apprend des représentations automatiquement.'}
    ],
    source: { file: 'introduction.md', page: '9, 16-23' }, interactiveHint: 'Teste des ordres de pipeline et vois lesquels restent cohérents.'
  },
  {
    id: 'definition-image', title: 'Module 4 — Définition d’une image numérique',
    objectifs: ['Maîtriser f(x,y), M x N et k bits.', 'Relier la taille mémoire à b = M x N x k.'],
    prerequis: ['Coordonnées (x,y).', 'Entier = intensité.'],
    ultraSimple: ['Image numérique = grille de pixels + nombres.'],
    course: ['f(x,y) pour la valeur locale.', 'M x N pour la taille.', 'k bits => 2^k niveaux.'],
    figures: ['introduction_p26_fig1.jpeg','introduction_p27_fig1.jpeg','introduction_p27_fig2.jpeg'],
    aRetenir: ['Résolution spatiale et quantification sont distinctes.'],
    erreursFrequentes: ['Confondre dimension spatiale avec profondeur de bits.'],
    flashcards: [{question:'2^8 ?',answer:'256 niveaux.'},{question:'M x N ?',answer:'Lignes x colonnes.'}],
    quiz: [
      {question:'Image 10 bits =>', options:['1024 niveaux','256 niveaux','512 niveaux'], answerIndex:0, feedback:'2^10=1024.'},
      {question:'f(x,y) représente…', options:['Une classe','Une intensité locale','Un capteur'], answerIndex:1, feedback:'C’est la valeur du pixel en (x,y).'}
    ],
    source: { file: 'introduction.md', page: '24-29' }, interactiveHint: 'Baisse k pour visualiser la postérisation.'
  },
  {
    id: 'representation-couleur', title: 'Module 5 — Représentation matricielle et couleur',
    objectifs: ['Comprendre grayscale vs RGB.', 'Lire b = M x N x k.'],
    prerequis: ['Matrice 2D.', 'Canal couleur.'],
    ultraSimple: ['Gris = 1 couche, couleur = 3 couches RGB.'],
    course: ['M x N en gris.', 'M x N x 3 en RGB.', 'Traitement par canal puis recomposition.'],
    figures: ['introduction_p30_fig6.jpeg','introduction_p31_fig1.jpeg','introduction_p32_fig2.jpeg','introduction_p33_fig2.jpeg'],
    aRetenir: ['La couleur triple souvent le volume de données.'],
    erreursFrequentes: ['Mélanger l’ordre des dimensions du tenseur image.'],
    flashcards: [{question:'k en RGB ?',answer:'3.'},{question:'Pourquoi traiter par canal ?',answer:'Pour cibler les composantes de couleur.'}],
    quiz: [
      {question:'Forme RGB standard ?', options:['M x N','M x N x 3','3 x M x N x 3'], answerIndex:1, feedback:'Le format usuel est H x W x C.'},
      {question:'Image grayscale contient…', options:['1 canal','3 canaux','4 canaux'], answerIndex:0, feedback:'Un seul canal d’intensité.'}
    ],
    source: { file: 'introduction.md', page: '30-33' }, interactiveHint: 'Active/désactive les canaux pour voir leur contribution.'
  },
  {
    id: 'roi-resize-interpolation', title: 'Module 6 — ROI, resizing et interpolation',
    objectifs: ['Utiliser ROI pour focaliser le calcul.', 'Comparer nearest et bilinear.'],
    prerequis: ['Pixel et grille.', 'Resize = création de nouveaux pixels.'],
    ultraSimple: ['ROI: découpe utile. Resize: change taille. Interpolation: estime.'],
    course: ['ROI pour cibler une zone.', 'Nearest: rapide/crénelé.', 'Bilinear: plus doux/coût supérieur.'],
    figures: ['introduction_p34_fig1.jpeg','introduction_p35_fig5.jpeg','introduction_p35_fig6.jpeg','introduction_p35_fig9.jpeg'],
    aRetenir: ['Compromis qualité/temps selon contexte.'],
    erreursFrequentes: ['Appliquer un resize sans contrôler les effets d’aliasing.'],
    flashcards: [{question:'Interpolation rapide ?',answer:'Nearest neighbor.'},{question:'Pourquoi ROI ?',answer:'Limiter le calcul à la zone d’intérêt.'}],
    quiz: [
      {question:'La plus lisse en général ?', options:['Nearest','Bilinear','Aucune'], answerIndex:1, feedback:'Bilinear lisse mieux les transitions.'},
      {question:'ROI sert à…', options:['Augmenter bruit','Réduire la zone traitée','Changer le format fichier'], answerIndex:1, feedback:'ROI cible la zone utile.'}
    ],
    source: { file: 'introduction.md', page: '34-35' }, interactiveHint: 'Compare visuellement aliasing (nearest) et lissage (bilinear).'
  }
];
