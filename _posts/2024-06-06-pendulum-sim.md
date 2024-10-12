---
layout: post
title: "Simulateur de Pendule en Python et Contrôle PID"
date: 2024-06-06
categories: projets
image: https://github.com/user-attachments/assets/10754d80-acd4-4255-85b6-76317070e86f
---

<div style="text-align: center;">
    {% raw %}
    <iframe src="/assets/pendulum.html" width="100%" height="600" frameborder="0"></iframe>
    {% endraw %}
</div>


## Lien vers le code source

Vous pouvez suivre le projet sur GitHub et accéder au code source [ici](https://github.com/Lemonochrme/pendulum).

---

## Modèle mathématique simplifié du pendule simple

Un pendule simple est constitué d'une masse attachée à une tige rigide de longueur \( l \). La dynamique de ce système peut être modélisée par l'équation différentielle suivante :

$$
\frac{d^2\theta}{dt^2} + \frac{b}{m} \frac{d\theta}{dt} + \frac{g}{l} \sin(\theta) = 0
$$

### Explication des termes :
- \( l \) : longueur de la tige
- \( m \) : masse du pendule
- \( \theta \) : angle du pendule par rapport à l'axe horizontal
- \( g \) : accélération due à la gravité
- \( b \) : coefficient de friction

L'équation modélise l'évolution du mouvement du pendule sous l'effet de la gravité et d'une friction visqueuse. Ici, la fonction sinus introduit une non-linéarité qui rend la résolution de l'équation plus complexe, particulièrement pour de grandes oscillations.

### Hypothèses du modèle

Pour simplifier les premiers tests, on fait l'hypothèse que \( \theta \) reste relativement petit, ce qui permet de linéariser l'équation :

$$
\frac{d^2\theta}{dt^2} + \frac{b}{m} \frac{d\theta}{dt} + \frac{g}{l} \theta = 0
$$

Cette approximation est utilisée dans certaines simulations, mais l'objectif final reste de contrôler le système pour des oscillations plus larges et un comportement non linéaire.

---

## Mise en place d’une régulation par PID

Pour stabiliser le pendule en position haute (\( \theta = \pi \)), j'ai implémenté un contrôleur PID qui agit sur la force appliquée au système pour contrer les oscillations. Le contrôleur PID ajuste les paramètres suivants :

- \( K_p \) : gain proportionnel, qui réagit à l'erreur instantanée (différence entre l'angle actuel et la position cible).
- \( K_i \) : gain intégral, qui s'occupe de l'accumulation des erreurs passées pour réduire l'offset permanent.
- \( K_d \) : gain dérivé, qui anticipe l'erreur future en réagissant à la vitesse de changement de l'angle.

Le contrôleur PID est ajusté en fonction de ces trois paramètres pour obtenir une régulation optimale du pendule.

---

## Optimisation de \( K_p \), \( K_i \), et \( K_d \) via Q-Learning

Afin d'améliorer la précision du système et de mieux adapter le contrôle PID à des perturbations, j'explore également une approche d'apprentissage par renforcement avec l'algorithme de **Q-Learning**. Cet algorithme permettra d'optimiser les paramètres \( K_p \), \( K_i \), et \( K_d \) en temps réel en fonction des performances du système, et ainsi de rendre le contrôle du pendule plus robuste.

Le processus de Q-Learning se base sur une exploration de différentes combinaisons de paramètres et leur évaluation en fonction de la stabilité et de la performance du système.

---
