# **Transformation d'intensité**

**Vision Numérique** 

Tarik Garidi & Adrien Lescourt

#### Opérations dans le domaine spatial

La forme générale de la transformation d'un point (x,y) dans le domaine spatiale est:

$$g(x,y) = T[f(x,y)]$$

- **1. Filtrage spatial**: L'opérateur T est défini dans un voisinage *nxn* de chaque point
- **2. Transformation d'intensité**: le voisinage est 1x1. Ce type de transformation ne dépend que du point que l'on traite.

![](transformationIntensite_p1_fig5.jpeg)

Objectif de la transformation d'intensité: améliorer l'image en vue d'une utilisation spécifique. Le choix du type de transformation dépend du problème.

### Types de transformation d'intensité

L'intensité de chaque pixel peut être transformé selon :

![](transformationIntensite_p2_fig2.jpeg)

Choix populaires pour la fonction T:

- Linéaire Identité, Négatif,
- Linéaire par morceau: seuil
- Non linéaire: Log, puissance,..
- Décomposition sur les bits
- Transformations sur l'histogramme

3

### Transformations linéaires - Identité & Inversion

Inversion: utile souvent losrque les parties sombres sont dominantes

![](transformationIntensite_p3_fig2.jpeg)

L'anévrisme de l'aorte abdominale consiste en une dilatation localisée des parois de l'aorte dans sa portion abdominale

![](transformationIntensite_p3_fig4.jpeg)

Le risque principal: la rupture + sang dans l'abdomen

![](transformationIntensite_p3_fig6.jpeg)

#### Mammographie et son image en négatif

![](transformationIntensite_p3_fig8.jpeg)

#### Transformations linéaires - Inversion

![](transformationIntensite_p4_fig1.jpeg)

![](transformationIntensite_p4_fig2.jpeg)

Les couleurs sont transformées dans la couleur complémentaire Mélangées elles s'annulent, mises côte à côte, les couleurs complémentaires contrastent fortement entre elles et se mettent mutuellement en valeur (utilisation design, logo, art,..)

![](transformationIntensite_p4_fig4.jpeg)

![](transformationIntensite_p4_fig5.jpeg)

#### Transformations linéaires par morceaux - Seuillage

Permet de renforcer le contraste (différences dans les intensités), outil clé pour la segmentation

![](transformationIntensite_p5_fig2.jpeg)

![](transformationIntensite_p5_fig3.jpeg)

![](transformationIntensite_p5_fig4.jpeg)

![](transformationIntensite_p5_fig5.jpeg)

#### Angiographie:

![](transformationIntensite_p5_fig7.jpeg)

![](transformationIntensite_p5_fig8.jpeg)

![](transformationIntensite_p5_fig9.jpeg)

Potentiellement flexible (renforcement ciblé) mais nécessite un input humain (les seuils)

### Transformations non linéaires - Log

Echelle logarithmique: dilatation des valeurs petites, compression des valeurs grandes

![](transformationIntensite_p6_fig2.jpeg)

![](transformationIntensite_p6_fig3.jpeg)

- Le range d'intensités faibles est transformé vers une plage d'intensité plus large
- les objets de faibles intensités apparaissent plus clairement

# Transformations non linéaires - Lois de puissances (gamma)

Généralisation du Log et de l'exponentielle pour manipulation de contraste

$$g(x,y) = (f(x,y))^{\gamma}$$

![](transformationIntensite_p7_fig3.jpeg)

![](transformationIntensite_p7_fig4.jpeg)

![](transformationIntensite_p7_fig5.jpeg)

![](transformationIntensite_p7_fig6.jpeg)

![](transformationIntensite_p7_fig7.jpeg)

Expansion des intensités (image trop sombre). IRM d'une Fracture et correction gamma = 1, 0.6,0.4,0.3

![](transformationIntensite_p7_fig9.jpeg)

![](transformationIntensite_p7_fig10.jpeg)

![](transformationIntensite_p7_fig11.jpeg)

![](transformationIntensite_p7_fig12.jpeg)

Compression des intensités (image trop lumineuse, délavée). Image aérienne et correction gamma = 3,4,5

![](transformationIntensite_p7_fig14.jpeg)

![](transformationIntensite_p7_fig15.jpeg)

![](transformationIntensite_p7_fig16.jpeg)

![](transformationIntensite_p7_fig17.jpeg)

# Transformations non linéaires - Lois de puissances (gamma)

- Gamma encoding L'oeil humain est plus sensible aux différences dans le domaine de faible intensité. Pendant l'acquisition et la sauvegarde on effectue une correction gamma afin de stocker plus de nuances d'intensités faibles (gamma < 1) .
- Gamma decoding Les moniteurs apportent la correction inverse pour restituer les intensités d'origines (donc valeur de gamma typique = 1,5 ou 2).
- Originellement les tubes cathodiques présentent cette nonlinéarité que l'on a du compenser par gamma encoding. Aujourd'hui c'est surtout pour stocker plus efficacement les intensités plus faible

![](transformationIntensite_p8_fig4.jpeg)

![](transformationIntensite_p8_fig5.jpeg)

#### Décomposition - "bit plane"

On décompose une intensité codé sur 8 bits dans les contributions de chaque bit

Par exemple: 194 = 11000010. Pour construire la contribution du bit le plus fort, on met à zéros les valeurs inférieures à 128 et à 1 celle qui sont supérieures

Image codé sur 8 bits (en haut a gauche) et les contributions de chacun des bits.

![](transformationIntensite_p9_fig4.jpeg)

#### Reconstruction partielle

![](transformationIntensite_p10_fig1.jpeg)

### Rappel - Histogramme, Densité et cumulative

![](transformationIntensite_p11_fig1.jpeg)

#### **Densité de probabilité:**

$$\mathbb{P}(a \le X \le b) = \int_a^b f(x) \, \mathrm{d}x.$$

- f est la densité de probabilté
- Informellement, une densité de probabilité peut-être vue comme la limite d'un histogramme

**Fonction Distribution Cumulative:** c'est la fonction qui pour tout réel x, associe la probabilité d'obtenir une valeur inférieure ou égale

$$F_X(x) = \mathbb{P}(X \leq x) = \int_{-\infty}^x f_X(t) \, \mathrm{d}t.$$

• Elle permet de calculer la probabilité que la variable x appartiennent à un intervalle ]a,b]:

$$\mathbb{P}(X \in ]a,b]) = \mathbb{P}(a < X \leq b) = F_X(b) - F_X(a)$$

# Histogramme des intensités

![](transformationIntensite_p12_fig1.jpeg)

![](transformationIntensite_p12_fig2.jpeg)

#### Histogramme pour chaque canal

![](transformationIntensite_p13_fig1.jpeg)

#### Histogramme et transformation d'intensité - Log

Une transformation d'intensité consiste a modifier l'histogramme des intensités

![](transformationIntensite_p14_fig2.jpeg)

![](transformationIntensite_p14_fig3.jpeg)

Idée: pourquoi ne pas travailler directement sur des transformations d'histogrammes afin d'obtenir des propriétés désirables!

### Normalisation d'histogramme (*streching*) linéaire

![](transformationIntensite_p15_fig1.jpeg)

Normaliser l'histogramme d'une image consiste à appliquer une transformation d'intensité linéaire à chaque pixel afin d'étendre la plage de valeurs à l'ensemble des valeurs disponibles.

![](transformationIntensite_p15_fig3.jpeg)

- La forme de l'histogramme est préservée (il est étendu)
- Améliore le contraste

### Histogramme *égalisé* - Contraste plus élevé

Observation: image avec plus de contraste présente une densité proche de l'uniforme

![](transformationIntensite_p16_fig2.jpeg)

Rappel: la cumulative pour une distribution uniforme est une droite

![](transformationIntensite_p16_fig4.jpeg)

Les intensités apparaissent avec la même probabilité: la densité de probabilité est uniforme. La probabilité pour chaque pixel (cas discret) idéalement est de <sup>1</sup> (− )

![](transformationIntensite_p16_fig6.jpeg)

### Egalisation d'histogramme

On veut transformer T: intensité → T(intensité) notre histogramme selon les contraintes suivantes:

1. T est monotone croissante donc le comptage (l'ordre) des intensités avant et après la transformation T sont identiques (les valeurs de la cumulative restent inchangées)

$$F_{old}(I) = F_{new}(T(I)) = \int_0^{T(I)} f_{new}(x) dx$$

![](transformationIntensite_p17_fig4.jpeg)

2. La densité de l'histogramme résultant est uniforme, donc la densité est :

On intègre facilement: 
$$F_{new}(T(I)) = \int_0^{T(I)} \frac{1}{I_{max}} = \frac{T(I)}{I_{max}}$$
  $\Longrightarrow$   $T(I) = I_{max} \ F_{new}(T(I)) = I_{max} \ F_{old}(I)$ 

$$T(I) = I_{max} F_{old}(I)$$

Visualisation de la transformation. Les valeurs de la cumulative avant/après restent inchangées

![](transformationIntensite_p17_fig9.jpeg)

### Egalisation d'histogramme

C'est une transformation qui ne nécessite pas de paramétrisation!

![](transformationIntensite_p18_fig2.jpeg)

![](transformationIntensite_p18_fig3.jpeg)

### Egalisation d'histogramme

![](transformationIntensite_p19_fig1.jpeg)

![](transformationIntensite_p19_fig2.jpeg)

![](transformationIntensite_p19_fig3.jpeg)

![](transformationIntensite_p19_fig4.jpeg)

#### Cette image est mal équilibrée:

- Trop ne niveaux de gris autours d'une même plage de valeurs
- l'histogramme cumulé comprend 2 phases presques plates (valeurs sombres et claires) et augmente brutalement dans les valeurs intermédaires
- Image égaliséee
- Cumulative linéaire