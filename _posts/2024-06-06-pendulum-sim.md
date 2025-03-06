---
layout: post
title: "Simulateur de Pendule en Python"
date: 2024-06-06
categories: [Personnal]
image: https://github.com/user-attachments/assets/10754d80-acd4-4255-85b6-76317070e86f
description: "Ce projet présente une simulation de pendule en Python utilisant Pygame, avec implémentation d'un contrôleur PID et optimisation par machine learning."
---

Ce projet à pour but de renforcer mes compétences dans une multitude de domaines distincts, de manière évident nous allons aborder un problème de physique classique ce qui est un bon moyen de me remémorer certaines notions importantes, la programmation en Python ne devrait pas être trop compliquée mais j'aimerais apprendre à utiliser la bibliothèque Pygame que je ne connais pas encore. Une fois ces deux objectifs simples atteints nous pourrons nous concentrer sur des notions plus avancées tout en ayant un cadre ludique pour efféctuer les expérimentations. Nous allons améliorer la simulation du pendule de deux manière, d'une part par l'implémentation d'un contrôlleur PID afin d'asservir d'angle du pendule et finnalement une implémentation d'un algorithme de machine learning pour optimiser les paramètres du PID. Ce projet, simple de prime abord s'avèrera être un excellent moyen consollider mes compétences dans des domaines qui m'intérressent particulièrement.


## Qu'est ce qu'un pendule et comment le modéliser ?

### Préambule

Isaac Newton, dans ses *Principes Mathématiques de la Philosophie Naturelle*, définit le pendule simple comme suit : « A simple pendulum is an imaginary pendulum consisting of a heavy particle called the bob, suspended from a point by means of a rod or string without weight. » On peut dès lors en extraire les caractéristiques : un pendule simple est composé d'une masse dite ponctuelle (on suppose que les changements d'orientation et les déformations sont négligeables), attachée à un fil ou à un axe imaginaire dépourvu de poids.

### Mise en équation

Appliquons la seconde loi de Newton à notre problème. Dans un premier temps, identifions les forces qui agissent sur le pendule. Ce dernier est soumis à deux forces principales : 

1. La force gravitationnelle $ F_g = mg $, qui agit vers le bas.
2. La force de tension exercée par le fil ou l'axe, qui maintient la masse sur un arc de cercle et s'oppose au mouvement radial.

Pour analyser le mouvement, nous projetons la force gravitationnelle dans la direction tangentielle à la trajectoire du pendule, ce qui donne :

$$
F_t = -mg \sin(\theta)
$$

D'après la seconde loi de Newton :

$$
F_t = ma_t
$$

où $ a_t $ est l'accélération tangentielle, liée à l'accélération angulaire $ \ddot{\theta} $ par $ a_t = l\ddot{\theta} $, avec $ l $ la longueur du fil. Ainsi, nous avons :

$$
-mg\sin(\theta) = ml\ddot{\theta}
$$

D'où :

$$
\ddot{\theta} = -\frac{g}{l} \sin(\theta)
$$

![image](https://github.com/user-attachments/assets/1e95c3c2-cb97-4015-9c28-05c35a468090)


Le système en l'état ne perd pas d'énergie, ajoutons de la dissipation (frottements), pour ce faire il nous suffit de soustraire un terme proportionnel à la vitesse angulaire $\dot{\theta}$ appelons le $b$ :

$$
\ddot{\theta} = -\frac{g}{l} \sin(\theta) - b\dot{\theta}
$$

![image](https://github.com/user-attachments/assets/826ded21-67d0-4036-bd2b-da2be71363c7)


# Simulation

<embed src="{{ site.baseurl }}/simulations/pendulum.html" width="100%" height="600px">



Code Source: https://github.com/Lemonochrme/pendulum
