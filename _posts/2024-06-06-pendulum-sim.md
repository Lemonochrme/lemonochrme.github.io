---
layout: post
title: "Simulateur de Pendule en Python"
date: 2024-06-06
categories: [Personnal]
image: https://github.com/user-attachments/assets/10754d80-acd4-4255-85b6-76317070e86f
description: "Ce projet présente une simulation de pendule en Python utilisant Pygame, avec implémentation d'un contrôleur PID et optimisation par machine learning."
---

## Objectifs du projet

Ce projet a pour but de renforcer mes compétences dans plusieurs domaines complémentaires. Nous allons aborder un problème classique de physique — une excellente occasion de me remémorer certaines notions fondamentales — tout en développant une simulation en Python. La programmation en elle-même ne devrait pas poser de grandes difficultés, mais j’en profiterai pour découvrir et apprendre à utiliser la bibliothèque **Pygame**, que je ne maîtrise pas encore.

Une fois ces premiers objectifs atteints, je pourrai me concentrer sur des aspects plus avancés, avec un cadre ludique et interactif pour mener différentes expérimentations. Le projet consistera notamment à **améliorer la simulation du pendule** de deux façons :

1. En implémentant un **contrôleur PID** pour asservir l’angle du pendule.
2. En utilisant un **algorithme de machine learning** pour optimiser les paramètres du PID.

Ce projet, simple en apparence, s’avérera donc un excellent moyen de consolider mes compétences dans des domaines qui m’intéressent particulièrement, tout en m’amusant.


## Qu’est-ce qu’un pendule, et comment le modéliser ?

### Préambule

Dans ses *Principes mathématiques de la philosophie naturelle*, Isaac Newton définit le pendule simple comme suit :

> « A simple pendulum is an imaginary pendulum consisting of a heavy particle called the bob, suspended from a point by means of a rod or string without weight. »

On peut en déduire les caractéristiques suivantes : un **pendule simple** est constitué d'une masse ponctuelle (c’est-à-dire qu’on néglige sa taille, son orientation, et toute déformation), suspendue à un fil ou à un axe idéal, sans masse.

### Mise en équation

Appliquons la **seconde loi de Newton** à ce système.

Le pendule est soumis à deux forces principales :

1. La **force gravitationnelle** \( F_g = mg \), dirigée vers le bas.
2. La **force de tension** du fil, qui contraint la masse à se déplacer sur un arc de cercle.

Pour étudier le mouvement, on projette la force gravitationnelle dans la direction **tangentielle** à la trajectoire du pendule :

$$
F_t = -mg \sin(\theta)
$$

D’après la seconde loi de Newton :

$$
F_t = ma_t
$$

L’accélération tangentielle \( a_t \) est liée à l’accélération angulaire \( \ddot{\theta} \) par :

$$
a_t = l\ddot{\theta}
$$

où \( l \) est la longueur du fil. En remplaçant, on obtient :

$$
-mg\sin(\theta) = ml\ddot{\theta}
$$

D’où l’équation différentielle du pendule simple :

$$
\ddot{\theta} = -\frac{g}{l} \sin(\theta)
$$

![image](https://github.com/user-attachments/assets/1e95c3c2-cb97-4015-9c28-05c35a468090)  
*Solution de l’équation du pendule : oscillations sinusoïdales*

Dans ce modèle, aucune énergie n’est perdue. Pour rendre la simulation plus réaliste, ajoutons un **terme de dissipation** (par exemple, des frottements) proportionnel à la vitesse angulaire \( \dot{\theta} \), noté \( b \) :

$$
\ddot{\theta} = -\frac{g}{l} \sin(\theta) - b\dot{\theta}
$$

![image](https://github.com/user-attachments/assets/826ded21-67d0-4036-bd2b-da2be71363c7)  
*Solution avec dissipation : oscillations amorties*


## Simulations en Python






<embed src="{{ site.baseurl }}/simulations/pendulum.html" width="100%" height="600px">



Code Source: https://github.com/Lemonochrme/pendulum
