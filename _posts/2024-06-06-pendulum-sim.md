---
layout: post
title: "Simulateur de Pendule en Python"
date: 2024-06-06
categories: [Personnal]
image: https://github.com/user-attachments/assets/10754d80-acd4-4255-85b6-76317070e86f
---

Ce projet à pour but de renforcer mes compétences dans une multitude de domaines distincts, de manière évident nous allons aborder un problème de physique classique ce qui est un bon moyen de me remémorer certaines notions importantes, la programmation en Python ne devrait pas être trop compliquée mais j'aimerais apprendre à utiliser la bibliothèque Pygame que je ne connais pas encore. Une fois ces deux objectifs simples atteints nous pourrons nous concentrer sur des notions plus avancées tout en ayant un cadre ludique pour efféctuer les expérimentations. Nous allons améliorer la simulation du pendule de deux manière, d'une part par l'implémentation d'un contrôlleur PID afin d'asservir d'angle du pendule et finnalement une implémentation d'un algorithme de machine learning pour optimiser les paramètres du PID. Ce projet, simple de prime abord s'avèrera être un excellent moyen consollider mes compétences dans des domaines qui m'intérressent particulièrement.


## Qu'est ce qu'un pendule et comment le modéliser ?

### Préambule
Appliquons la seconde loi de Newton à notre problème, dans un premier temps faisons la liste des forces qui agissent sur …
$$\ddot{\theta} = \frac{g}{l} \sin(\theta) - b\dot{\theta}$$


Isaac Newton dans ses Principes Mathématiques de la Philosophie Naturelle définie le pendule simple comme suit : "A simple pendulum is an imaginary pendulum consisting of a heavy particle called the bob, suspended from a point by means of a rod or string without weight." On dès à présent en extraire les caractéristiques: un pendule simple est composé d'une masse dite ponctuelle (on ne considérera ni les changement l'orientation ni la déformation) attachée à un fil ou axe imaginaire qui ne pèse rien.
### Mise en équation

Appliquons la seconde loi de Newton à notre problème, dans un premier temps faisons la liste des forces qui agissent sur notre pendule. Le pendule est soumis à deux forces principales, d'une part la force gravitationelle $F_g = mg$ qui agit vers le bas et la force de tension dans l'axe reliant la masse à l'origine du pendule, cet axe maintient la masse sur un arc de cercle.

On projette la force gravitationnelle sur la direction tangentielle à la trajectoire du pendule, cela nous donne :

$$F_t = -mg \sin(\theta)$$

D'après la seconde loi de Newton :

$$F_t = ma_t$$ avec $a_t$ l'accélération tangentielle liée à l'accélération angulaire $\ddot{\theta}$ par $a_t=l\ddot{\theta}$

Alors :

$$-mg\sin(\theta) = ml\ddot{\theta}$$

$$\ddot{\theta} = -\frac{g}{l} \sin(\theta)$$

Le système en l'état ne perd pas d'énergie, ajoutons de la dissipation (frottements), pour ce faire il nous suffit de soustraire un terme proportionnel à la vitesse angulaire $\dot{\theta}$ appelons le $b$ :

$$\ddot{\theta} = \frac{g}{l} \sin(\theta) - b\dot{\theta}$$
