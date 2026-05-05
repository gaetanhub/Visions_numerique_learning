# Brief Codex Web - Plateforme d'apprentissage Vision Numerique

## Objectif

Developper une plateforme web premium d'apprentissage pour le cours de Vision Numerique 2025-2026. La plateforme doit enseigner la theorie du cours de maniere pedagogique, visuelle et progressive, en commencant par le chapitre 1 complet.

La plateforme doit etre concue pour accueillir ensuite les 6 autres chapitres sans refonte majeure.

Source : `CONTEXTE.md`, page non identifiable.

## Fichiers a inclure dans le depot GitHub

Inclure dans le depot :

- `CONTEXTE.md`
- `CODEX_WEB_HANDOFF.md`
- `chapitre_01/` a `chapitre_07/`, avec :
  - les fichiers `.md` des supports de cours
  - les images `.jpeg`
  - les dossiers `_meta/` et fichiers `*_meta.json`

Ne pas inclure :

- `node_modules/`
- dossiers de build (`dist/`, `.vite/`)
- fichiers temporaires ou caches locaux

Les images sont necessaires, car la plateforme doit privilegier les supports visuels du cours. Leur nom encode souvent la page source, par exemple `introduction_p35_fig5.jpeg` indique une image issue de `introduction.md`, page 35.

Source : `CONTEXTE.md`, page non identifiable.

## Stack retenue

Utiliser :

- React
- Vite
- TypeScript
- `react-router-dom`
- `lucide-react`
- CSS modulaire ou CSS classique structure proprement
- Canvas/SVG natifs pour les visualisations interactives

La plateforme doit rester offline-first a l'execution. Elle ne doit pas dependre d'un CDN pour fonctionner.

Source : Claude.

## Portee de la premiere livraison

Coder uniquement la theorie du chapitre 1 complet.

Ne pas coder les laboratoires pour l'instant.

Le chapitre 1 actif doit couvrir :

1. Vision humaine et subjectivite
2. Sources d'images
3. Traitement et analyse d'image
4. Definition d'une image numerique
5. Representation matricielle et couleur
6. ROI, resizing et interpolation

Les chapitres 2 a 7 doivent apparaitre dans la navigation comme "a venir", sans contenu developpe.

Source : `introduction.md`, pages 5-35 ; `CONTEXTE.md`, page non identifiable.

## Decoupage global des 7 chapitres

1. Fondations et image numerique : vision humaine, sources d'images, traitement, definition de l'image numerique, representation, couleur, ROI, resizing, interpolation.  
   Source : `introduction.md`, pages 5-35.

2. Transformations d'intensite : identite, inversion, seuillage, log, gamma, bit planes, histogrammes, stretching, egalisation.  
   Source : `transformationIntensite.md`, pages 1-19.

3. Filtrage spatial passe-bas : frequence spatiale, convolution/correlation, kernels, box, gaussien, median, bilateral.  
   Source : `filtrageSpatial_1.md`, pages 1-20.

4. Filtrage spatial passe-haut et contours : derivees, gradient, Sobel, Laplacien, LoG, Canny, sharpening.  
   Source : `filtrageSpatial_passehaut.md`, pages 1-18.

5. Domaine frequentiel et Fourier : series/transformee de Fourier, amplitude/phase, convolution, DFT/FFT, filtres frequentiels, aliasing.  
   Source : `Fourier_domaine_frequenciel.md`, pages 1-33.

6. Morphologie mathematique : element structurant, erosion, dilatation, gradient morphologique, ouverture, fermeture, proprietes.  
   Source : `morphology.md`, pages 1-14.

7. Transformation de Hough : droites, espace des parametres, coordonnees polaires, accumulateur, interpretation, exemples.  
   Source : `transformation_de_hough.md`, pages 1-18.

## Contraintes pedagogiques non negociables

Chaque module doit contenir obligatoirement :

- une section "Prerequis"
- une section "Explication ultra-simple"
- une section de cours structuree et exacte
- une ou plusieurs figures du cours quand elles existent
- une visualisation interactive quand le concept s'y prete
- une section "A retenir"
- des flashcards
- un mini-quiz avec feedback pedagogique
- des sources visibles

La section "Explication ultra-simple" doit expliquer comme a un debutant absolu, voire a un enfant, sans supposer de connaissances prealables.

La section "Prerequis" doit expliquer ce qu'il faut comprendre avant d'attaquer le module. Si aucun prerequis n'est necessaire, l'indiquer explicitement.

Source : demande utilisateur ; `CONTEXTE.md`, page non identifiable.

## Contraintes de precision et sources

Priorite absolue aux fichiers du projet :

1. Lire `CONTEXTE.md`.
2. Lire le fichier de cours concerne.
3. Utiliser les fichiers `_meta/*.json` pour confirmer les pages et titres.
4. Utiliser les images locales du chapitre comme support visuel.

Chaque information issue du cours doit afficher une source au format :

`Source : introduction.md, page 25`

Si la page n'est pas identifiable avec certitude :

`Source : introduction.md, page non identifiable`

Ne jamais inventer une page.

Conserver les notations du cours, par exemple :

- `f(x,y)`
- `M x N`
- `b = M x N x k`
- `rho`
- `theta`

Source : `CONTEXTE.md`, page non identifiable.

## Modules a implementer pour le chapitre 1

### Module 1 - Vision humaine et subjectivite

Prerequis :

- Aucun prerequis technique.
- Comprendre seulement que la lumiere peut etre captee par l'oeil.

Explication ultra-simple :

- L'oeil fonctionne comme un capteur.
- Le cerveau interprete ce que l'oeil capte.
- Cette interpretation peut etre utile, mais aussi trompeuse, comme dans les illusions optiques.

Contenu :

- Retine
- Batonnets
- Cones
- Lumiere chromatique et monochromatique
- Radiance, luminance, brightness
- Subjectivite de la vision
- Lien entre vision humaine et vision numerique

Figures prioritaires :

- `introduction_p5_fig1.jpeg`
- `introduction_p5_fig6.jpeg`
- `introduction_p6_fig2.jpeg`
- `introduction_p7_fig2.jpeg`
- `introduction_p7_fig3.jpeg`
- `introduction_p7_fig4.jpeg`
- `introduction_p7_fig5.jpeg`

Source : `introduction.md`, pages 5-8.

### Module 2 - Sources d'images

Prerequis :

- Comprendre qu'une image vient d'un signal mesure.
- Comprendre qu'une machine peut capter autre chose que la lumiere visible.

Explication ultra-simple :

- Une image est une trace.
- Cette trace peut venir de la lumiere, des rayons X, des ultrasons, des ondes radio ou d'une simulation.
- La vision numerique permet de voir au-dela de ce que l'oeil humain voit.

Contenu :

- Energie electromagnetique
- Energie acoustique
- Image synthetique
- Rayons gamma
- Rayons X
- Ultra-violet
- Visible
- Infra-rouge
- Micro-ondes/radar
- Ondes radio/IRM
- Ultrasons/echographie

Figures prioritaires :

- `introduction_p11_fig5.jpeg`
- `introduction_p12_fig4.jpeg`
- toutes les figures `introduction_p13_*`
- toutes les figures `introduction_p14_*`

Source : `introduction.md`, pages 11-14.

### Module 3 - Traitement et analyse d'image

Prerequis :

- Savoir qu'une image peut etre modifiee ou analysee.
- Comprendre la difference entre "rendre une image plus visible" et "extraire une information".

Explication ultra-simple :

- Traiter une image, c'est la transformer pour qu'elle soit plus utile.
- Analyser une image, c'est demander a la machine d'y trouver quelque chose.
- Par exemple : ameliorer une photo medicale, detecter une voiture, classer un objet.

Contenu :

- Acquisition
- Amelioration
- Compression
- Morphologie
- Segmentation
- Extraction de caracteristiques
- Classification
- Historique de la vision numerique
- Applications humaines et machines
- Feature engineering et deep learning

Figures prioritaires :

- `introduction_p9_fig1.jpeg`
- `introduction_p16_fig4.jpeg`
- `introduction_p16_fig7.jpeg`
- `introduction_p16_fig9.jpeg`
- `introduction_p16_fig10.jpeg`
- `introduction_p17_fig15.jpeg`
- `introduction_p17_fig17.jpeg`
- figures des pages 18 a 23

Source : `introduction.md`, pages 9 et 16-23.

### Module 4 - Definition d'une image numerique

Prerequis :

- Comprendre des coordonnees simples `(x,y)`.
- Comprendre qu'un nombre peut representer une intensite.

Explication ultra-simple :

- Une image numerique est une grille.
- Chaque case de la grille est un pixel.
- Chaque pixel contient un nombre qui indique son intensite.

Contenu :

- Fonction `f(x,y)`
- Coordonnees spatiales discretes
- Valeurs finies et discretes
- Pixel
- Intensite
- Echantillonnage
- Discretisation/quantification

Figures prioritaires :

- `introduction_p26_fig1.jpeg`
- figures `introduction_p27_*`
- `introduction_p28_fig1.jpeg`

Source : `introduction.md`, pages 25-28.

### Module 5 - Representation matricielle et couleur

Prerequis :

- Lire une grille ou un tableau simple.
- Comprendre qu'un bit/octet sert a stocker une valeur numerique.

Explication ultra-simple :

- Une image est un tableau de nombres.
- Une image en niveaux de gris a souvent un seul nombre par pixel.
- Une image couleur RGB a trois composantes : rouge, vert, bleu.

Contenu :

- Matrice `M x N`
- Largeur `N`, hauteur `M`
- Domaine spatial
- Intensite entre 0 et 255 pour 8 bits
- Taille d'image `b = M x N x k`
- Couleur RGB

Figures prioritaires :

- `introduction_p30_fig6.jpeg`
- `introduction_p31_fig1.jpeg`
- `introduction_p32_fig2.jpeg`

Source : `introduction.md`, pages 29-32.

### Module 6 - ROI, resizing et interpolation

Prerequis :

- Comprendre qu'une image est une grille de pixels.
- Comprendre la notion de pixels voisins.

Explication ultra-simple :

- Une ROI est une zone interessante de l'image.
- Redimensionner une image change le nombre de pixels.
- Quand on agrandit une image, il faut choisir ou inventer de nouvelles valeurs.
- Le plus proche voisin copie le pixel le plus proche.
- L'interpolation bilineaire melange les voisins pour obtenir une valeur plus douce.

Contenu :

- Region Of Interest
- Resizing
- Plus proche voisin
- Interpolation bilineaire

Figures prioritaires :

- `introduction_p33_fig2.jpeg`
- `introduction_p34_fig1.jpeg`
- toutes les figures `introduction_p35_*`

Source : `introduction.md`, pages 33-35.

## Architecture attendue

Structure proposee :

```text
site/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    data/
      chapters.ts
      chapter-01.ts
    types/
      course.ts
    components/
      AppShell.tsx
      ChapterNav.tsx
      LessonView.tsx
      SourceBadge.tsx
      FigureCard.tsx
      PrerequisitePanel.tsx
      BeginnerExplanation.tsx
      KeyTakeaways.tsx
      Flashcards.tsx
      Quiz.tsx
      ProgressBar.tsx
    visuals/
      PixelGridVisual.tsx
      SamplingQuantizationVisual.tsx
      RgbChannelsVisual.tsx
      RoiVisual.tsx
      ResizeInterpolationVisual.tsx
    styles/
      global.css
  public/
    course-assets/
      chapter-01/
```

La structure peut etre ajustee, mais elle doit rester data-driven et extensible aux chapitres 2 a 7.

Source : Claude.

## Design attendu

Le site doit ressembler a une vraie plateforme d'apprentissage, pas a une landing page.

Priorites :

- navigation claire par chapitre/module
- lecture confortable
- beaucoup de visuel
- figures du cours mises en valeur
- visualisations interactives sobres et utiles
- progression visible
- quiz courts
- responsive desktop/mobile
- pas de texte qui se chevauche
- pas de decoration gratuite

Source : Claude.

## Tests et verification

Commandes attendues :

```bash
npm install
npm run dev
npm run build
```

Verification manuelle :

- le chapitre 1 est complet
- les chapitres 2 a 7 sont visibles mais marques "a venir"
- toutes les images chargees existent
- chaque lecon affiche ses sources
- chaque module contient prerequis + explication ultra-simple
- les quiz fonctionnent
- les flashcards fonctionnent
- la progression persiste apres refresh
- le site est utilisable en mobile et desktop

Source : Claude.

## Definition of Done

Le projet est termine pour cette premiere livraison si :

- l'application React/Vite compile sans erreur
- le chapitre 1 est entierement navigable
- chaque module a un contenu pedagogique debutant absolu
- chaque module cite ses sources
- les figures principales du chapitre 1 sont integrees
- les visualisations principales fonctionnent
- la progression locale fonctionne
- le design est coherent, premium et responsive
- le depot ne contient pas `node_modules/`

Source : Claude.

## Prompt de demarrage a donner a Codex Web

Tu peux donner ce prompt a Codex Web :

```text
Lis d'abord CONTEXTE.md puis CODEX_WEB_HANDOFF.md.

Objectif : developper la premiere version de la plateforme React/Vite decrite dans CODEX_WEB_HANDOFF.md.

Commence par creer l'application dans site/ avec React, Vite et TypeScript. Implemente uniquement le chapitre 1 complet. Les chapitres 2 a 7 doivent etre visibles dans la navigation comme "a venir".

Respecte strictement les contraintes pedagogiques :
- chaque module contient prerequis, explication ultra-simple, cours structure, figures, visualisation si utile, points cles, flashcards, quiz et sources ;
- chaque information issue du cours affiche Source : fichier.md, page X ;
- les figures locales du cours sont prioritaires ;
- l'application doit rester offline-first.

Avant de coder le contenu, inspecte les fichiers chapitre_01/introduction/introduction.md et chapitre_01/introduction/_meta/introduction_meta.json pour verifier les pages et les figures.

Quand l'implementation est terminee, lance npm run build et corrige les erreurs.
```

Source : Claude.
