# **Filtrage spatial**

**Vision Numérique** 

Tarik Garidi & Adrien Lescourt

## La fréquence

La fréquence est souvent présentée comme une répétition dans le temps mesurée en Hertz = cycles par secondes. Elle correspond aux nombres de cycles par unité de temps. La période correspond à la durée (en secondes) pour un cycle.

$$Fréquence = \frac{Répétitions}{Unité de temps} = \frac{1}{T}$$

![](filtrageSpatial_1_p1_fig3.jpeg)

Exemple: le coeur bas 120 fois par minutes = 2 cycles par seconde = 2 Hertz et donc une période = 0.5 S

## La fréquence dans une image

Définition: La fréquence en vision numérique correspond au taux de variation d'une intensité par unité de pixel. Elle correspond aux nombres de cycles d'intensités par unité d'espace.

$$Fréquence Spatiale = \frac{Répétitions}{Unité de longueur} = \frac{1}{Période[pixel]}$$

Exemple: une période de 6 pixels indique que l'intensité est la même tout les 6 pixels. Dans ce cas, la fréquence = 1/6 (par unité de pixel) → un pixel est 1/6 du cycle d'intensité

![](filtrageSpatial_1_p2_fig4.jpeg)

#### La fréquence dans une image

Les images peuvent être décrites comme un assemblage de hautes et basses fréquences.

![](filtrageSpatial_1_p3_fig2.jpeg)

Zone de basses fréquences: variations lentes des intensités par unité de pixels.

Zone de hautes fréquences: variations rapides des intensités par unité de pixels.

## Filtrer une image en utilisant le contenu fréquenciel (spectral)

Le graphisme des lettres utilisées dans le mot ci-dessous fait appel qu'à des fréquences spatiales basses/moyennes. Pour mettre en évidence ce contenu, il est utile d'appliquer un filtre passe-bas (atténue les hautes fréquences et laisse passer les basses fréquences) tel que le *plissage* des yeux.

![](filtrageSpatial_1_p4_fig2.jpeg)

#### On atténue les hautes fréquences (réduction du bruit)

![](filtrageSpatial_1_p5_fig1.jpeg)

## Image = Assemblage de fréquence? Analyse de Fourier

L'analyse de Fourier permet de représenter un signal en terme de signaux périodiques de fréquence f

Séries de Fourier (fonctions périodiques):

![](filtrageSpatial_1_p6_fig4.jpeg)

$$s(t) = a_0 + \sum_{k=1}^{\infty} \left( a_k \cdot \cos \left( 2\pi \cdot k \cdot f \cdot t \right) + b_k \cdot \sin \left( 2\pi \cdot k \cdot f \cdot t \right) \right)$$

![](filtrageSpatial_1_p6_fig6.jpeg)

Généralisation, Transformée de fourier:

![](filtrageSpatial_1_p6_fig8.jpeg)

$$\hat{s}(f) = \int_{-\infty}^{\infty} s(t)e^{-ift}dt$$

![](filtrageSpatial_1_p6_fig10.jpeg)

![](filtrageSpatial_1_p6_fig11.jpeg)

#### Contenu spectral **-** A quoi ca sert?

La transformée de Fourier (les séries de Fourier aussi en fait) donne les pondérations de chaque fréquence dans le signal

![](filtrageSpatial_1_p7_fig2.jpeg)

$$\sin(x) - \frac{1}{2} \times \sin(2x) + \frac{1}{3} \times \sin(3x) + \dots$$

![](filtrageSpatial_1_p7_fig4.jpeg)

![](filtrageSpatial_1_p7_fig5.jpeg)

- Signature: permet de distinguer des signaux rapidement
- Compression (on ne garde que les fréquences plus importantes mp3, jpeg,..)
- Filtrer les fréquences qui ne nous interessent pas!

#### Une image comme superposition d'images sinusoïdale

On peut décomposer une image en somme d'images sinusoïdales et l'analyse de fourier nous donne accès aux coefficients

$$= a(0,0)x + a(0,1)x + ...+ a(11,11)x + ...+ a(11,11)x$$

Les coefficients a(u,v) et b(u,v) sont les coéficients de Fourier de fréquences (u,v) . Ils donnent la contributions de cette fréquence dans l'image.

![](filtrageSpatial_1_p8_fig4.jpeg)

#### Filtrer les fréquences

Filtres passe-bas (low pass): lissage/floutage, on garde les fréquences basses

![](filtrageSpatial_1_p9_fig2.jpeg)

![](filtrageSpatial_1_p9_fig3.jpeg)

![](filtrageSpatial_1_p9_fig4.jpeg)

• Les hautes fréquences spatiales correspondent à un niveau de gris qui varie fortement sur quelques pixels, par exemple, dans une zone de l'image très texturée, sur les contours,..

![](filtrageSpatial_1_p9_fig6.jpeg)

• Les basses fréquences spatiales correspondent à une variation lente du niveau de gris, par exemple dans une zone de dégradé.

Filtres passe-haut (high pass): détection de contours, on garde les fréquences hautes

![](filtrageSpatial_1_p9_fig9.jpeg)

![](filtrageSpatial_1_p9_fig10.jpeg)

![](filtrageSpatial_1_p9_fig11.jpeg)

#### Retour vers le domaine spatial

Le **domaine de fréquences** correspond à la représentation de l'image en terme de fréquences spatiales du signal, le long des lignes ou le long des colonnes de l'image.

Le **domaine spatiale** correspond au plan (x,y) de l'image elle-même. Les transformations dans ce domaine se caractérisent par des manipulations sur les pixels de l'image.

![](filtrageSpatial_1_p10_fig3.jpeg)

![](filtrageSpatial_1_p10_fig4.jpeg)

![](filtrageSpatial_1_p10_fig5.jpeg)

![](filtrageSpatial_1_p10_fig6.jpeg)

- Lissage/floutage
- Détection de contours

Les opération de filtrage sont souvent plus rapide dans ce domaine car les filtres sont des multiplications!

11 Les filtres sont implémentés par des correlations/convolutions. Opérations potentiellement couteuses qui impliquent le voisinnage du pixel que l'on manipule.

#### Opérations dans le domaine spatial

La forme générale de la transformation d'un point (x,y) dans le domaine spatiale est:

$$g(x,y) = T[f(x,y)]$$

**Filtrage spatial**: L'opérateur T est défini dans un voisinage *nxn* de chaque point

- Voisinage de dimension impaire
- Pour les bords on doit compléter l'image (Padding,..)
- Opérations linéaires ou non linéaires

![](filtrageSpatial_1_p11_fig7.jpeg)

## Mécanisme de filtrage spatial - La convolution / corrélation

Chaque pixel de l'image f(x,y) est transfomé par une opération qui dépend du voisinage de x. Cette dépendance du voisinage est implémentée à l'aide d'un kernel ω(x,y). L'idée est d'utiliser la **convolution/corrélation** entre f et ω:

![](filtrageSpatial_1_p12_fig2.jpeg)

#### En mathématique:

$$(\omega \star f)(t) = \int \omega(x)f(t-x)dx$$

la convolution de deux fonctions f et ω permet de construire une troisième fonction qui exprime la facon dont la forme de l'une est influencée par la forme de l'autre.

Le résultat de la convolution est la somme des produits: (4x0) + (0x0)+..+(0x1)+(-4x2) = -8

En filtrage: on impose une forme au kernel afin d'influencer la forme de l'image originale

#### La convolution / corrélation - Exemple avec zéro *padding*

![](filtrageSpatial_1_p13_fig1.jpeg)

## Types de filtrages: choix du kernel

On aimerait supprimer les informations inutiles (donc on fait des moyennes pour lisser les différences)

![](filtrageSpatial_1_p14_fig2.jpeg)

Contours: on aimerait faire apparaitre les zone ou les variations d'intensités sont importantes (donc on calcule des différences)

Kernel type moyenne (intégrale)

![](filtrageSpatial_1_p14_fig5.jpeg)

Kernel type dérivée

![](filtrageSpatial_1_p14_fig7.jpeg)

## Passe-bas - Kernel de type moyenne, lissage

**Objectif:** éliminer les détails de l'image

Détails = variations de pixels sur une zone *petite* par rapport à la taille du kernel. La taille du kernel détermine donc le degré de lissage

- Rendent l'image plus floue (Blurring) Généralement effectué en pré-traitement pour enlever les petits détails d'une image avant l'extraction de (grand) objects
- Réduisent le bruit de l'image (Denoising): La réduction de bruit peut également être effectuée par un filtrage non linéaire (filtrage fréquentiel) en filtrant les hautes fréquences.

#### Box (moyenne Gaussien: ou mediane):

![](filtrageSpatial_1_p15_fig6.jpeg)

|               | 0.3679 | 0.6065 | 0.3679 |
|---------------|--------|--------|--------|
| 1<br>1.8976 × | 0.6065 | 1.0000 | 0.6065 |
|               | 0.3679 | 0.6065 | 0.3679 |

![](filtrageSpatial_1_p15_fig9.jpeg)

![](filtrageSpatial_1_p15_fig10.jpeg)

## Exemples Box

|                  | 1 | 2 | 1 |
|------------------|---|---|---|
| $\frac{1}{16}$ × | 2 | 4 | 2 |
|                  | 1 | 2 | 1 |

#### Filtre low pass (atténue le bruit) puis seuillage:

![](filtrageSpatial_1_p16_fig6.jpeg)

![](filtrageSpatial_1_p16_fig8.jpeg)

![](filtrageSpatial_1_p16_fig10.jpeg)

La taille du kernel détermine le degré de floutage

![](filtrageSpatial_1_p16_fig14.jpeg)

![](filtrageSpatial_1_p16_fig15.jpeg)

![](filtrageSpatial_1_p16_fig18.jpeg)

![](filtrageSpatial_1_p16_fig19.jpeg)

![](filtrageSpatial_1_p16_fig22.jpeg)

![](filtrageSpatial_1_p16_fig23.jpeg)

## Gaussien

#### Les coefficients du filtre Gaussien s'obtiennent

par:

Avec K=1 et sigma = 1, on obtient:

![](filtrageSpatial_1_p17_fig4.jpeg)

le filtres

![](filtrageSpatial_1_p17_fig5.jpeg)

![](filtrageSpatial_1_p17_fig6.jpeg)

- 1. Isotropie (contrairement aux filtres Box simple). Lissage de meilleur qualité
- 2. Séparable
- 3. Besoin de kernels plus grand que box pour même blurring
- 4. Zone d'influence déterminée par le paramètre σ. Après 3σ on sait que le poids de la gaussienne est négligeable.

Exemple: 43 x 43 → σ ~ 7

On choisit 7 car on sait qu'après 3σ, le poids de la gaussienne est négligeable..

et 3 \* 7 = 21 pixels (poids négligeable après 21 pixels)

![](filtrageSpatial_1_p17_fig15.jpeg)

#### Médian

Le filtre médian est un filtre qui remplace la valeur d'un pixel par la valeur médiane des valeurs du voisinage de ce pixel.

Le filtre médian supprime le bruit, dès que les valeurs du bruit sont minoritaires sur le voisinage alors que le filtre moyenneur étale le bruit sur les pixels voisins.

Image avec bruit poivre et sel Moyenne 3x3 Moyenne 5x5 Médian 5x5

![](filtrageSpatial_1_p18_fig4.jpeg)

![](filtrageSpatial_1_p18_fig6.jpeg)

![](filtrageSpatial_1_p18_fig8.jpeg)

![](filtrageSpatial_1_p18_fig10.jpeg)

## Low pass - Filtrage Bilateral pour préserver les countours

#### Image originale:

![](filtrageSpatial_1_p19_fig2.jpeg)

![](filtrageSpatial_1_p19_fig3.jpeg)

![](filtrageSpatial_1_p19_fig4.jpeg)

![](filtrageSpatial_1_p19_fig5.jpeg)

La paramètre σ détermine la taille de la fenêtre et le degré de floutage

$$g(x,y) \sim \text{Gauss(spatial)} \times \text{Gauss(intensité)}$$

![](filtrageSpatial_1_p19_fig8.jpeg)

![](filtrageSpatial_1_p19_fig9.jpeg)

- Pondération spatiale: on laisse un pixel être influencé par le voisinage
- Pondération intensité: l'influence est plus forte pour les voisins qui ont une intensité "proche" du pixel (countours ne sont plus lissés)

#### Low pass - Filtrage Bilateral pour préserver les countours

#### Originale:

![](filtrageSpatial_1_p20_fig2.jpeg)

$$\sigma_{intensit\acute{\text{e}}}=0.1$$

![](filtrageSpatial_1_p20_fig4.jpeg)

 $\sigma_{intensit\acute{\theta}}=0.25$ 

![](filtrageSpatial_1_p20_fig6.jpeg)

 $\sigma_{intensit\acute{\text{e}}} = \infty$ 

![](filtrageSpatial_1_p20_fig8.jpeg)

![](filtrageSpatial_1_p20_fig9.jpeg)

![](filtrageSpatial_1_p20_fig10.jpeg)

![](filtrageSpatial_1_p20_fig11.jpeg)

 $\sigma_{spatial} = 2$ 

![](filtrageSpatial_1_p20_fig12.jpeg)

![](filtrageSpatial_1_p20_fig13.jpeg)

![](filtrageSpatial_1_p20_fig14.jpeg)

![](filtrageSpatial_1_p20_fig15.jpeg)