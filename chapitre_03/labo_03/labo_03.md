![](_page_0_Picture_2.jpeg)

# VISION NUMERIQUE 2025-2026

<tarik.garidi@hesge.ch> <adrien.lescourt@hesge.ch>

# **LABO 3 Filtrage spatial**

### **1 Objectifs**

Ce laboratoire traite le lissage d'images via le filtrage spatial. Vous étudierez les mécanismes de corrélation/convolution, ses impactes de performances en temps de traitement, et différents types de filtres passes bas.

### **2 Exercices**

#### **2.1 Corrélation / Convolution**

Implémentez la fonction de corrélation qui applique un filtre linéaire sur une image. Le filtre passé en paramètre, appelé kernel, doit être de forme carré, avec obligatoirement des cotés de tailles impaires. La fonction doit retourner une nouvelle image sans modifier l'image source.

Considérez la fonction nditer pour itérer une matrice numpy.

```
def xcorr(img: Img, kernel: ImgF) -> Img:
...
```

#### **2.2 Filtre moyenneur**

Utilisez votre fonction de corrélation pour implémenter un filtre moyenneur. blur\_size contient la taille d'un coté du kernel. Observez les résultats en faisant varier blur\_size entre 3 et 11 (impair uniquement), sur les images lena.png et testpattern1024.png.

```
def blur_avg(img: Img, blur_size: int) -> Img:
...
```

#### **2.3 Bruit impulsionnel**

Créez un fonction noise qui retourne une image parasitée avec du bruit impulsionnel. C'est à dire que chaque pixel de l'image source a une probabilité de basculer noir ou blanc. Ce bruit est aussi communément appelé poivre et sel.

```
def noise(img: Img, white_p: float, black_p: float) -> Img:
...
```

Ajoutez du bruit à l'image testpattern1024.png (10% de pixels blanc et 10% de pixels noirs) et filtrez la avec le moyenneur. Quelle taille de kernel vous semble approprié?

#### **2.4 Filtre médian**

Créez une fonction blur\_median, qui filtre l'image selon la médiane des pixels voisins. median\_size contient la taille d'un coté du kernel, et doit être impair.

```
def blur_median(img: Img, median_size: int) -> Img:
...
```

Filtrez l'image bruité avec le filtre médian. Quelle taille de kernel vous semble approprié?

Affichez dans une même figure les 4 images cotes à cotes:

- Image source
- Image bruitée
- Image filtrée avec le moyenneur
- Image filtrée avec le médian