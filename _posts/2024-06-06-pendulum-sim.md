---
layout: post
title: "Simulateur de Pendule en Python"
date: 2024-06-06
categories: [Personnal]
image: https://github.com/user-attachments/assets/10754d80-acd4-4255-85b6-76317070e86f
description: "Ce projet présente une simulation de pendule en Python utilisant Pygame, avec implémentation d'un contrôleur PID et optimisation par machine learning."
---

## Objectifs du projet

Ce projet a pour but de renforcer mes compétences dans plusieurs domaines complémentaires. Nous allons aborder un problème classique de physique, une excellente occasion de me remémorer certaines notions fondamentales, tout en développant une simulation en Python.

Une fois ces premiers objectifs atteints, je pourrai me concentrer sur des aspects plus avancés, avec un cadre interactif pour mener différentes expérimentations. Le projet consistera notamment à améliorer la simulation du pendule de deux façons :

1. En implémentant un **contrôleur PID** pour asservir l’angle du pendule.
2. En utilisant un **algorithme de machine learning** pour optimiser les paramètres du PID.

## Qu’est-ce qu’un pendule, et comment le modéliser ?

### Préambule

Dans ses *Principes mathématiques de la philosophie naturelle* (ouvrage magnifiquement traduit par Emilie du Chatelet [accessible ici](https://gallica.bnf.fr/ark:/12148/bpt6k1040149v.texteImage)), Isaac Newton définit le pendule simple comme suit :

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


## Simulations en Python et PID

La simulation fonctionne en intégrant pas à pas l’équation différentielle du pendule amorti, mais cette fois-ci, on ajoute un contrôleur PID pour rendre le tout interactif et dynamique. L’idée n’est pas de chercher une solution analytique (ce qui n’aurait d’intérêt que pour de petits angles), mais bien de créer un cadre où l’on peut tester et observer des comportements complexes, notamment en contexte de contrôle automatique.

Ici, le pendule est suspendu à un axe horizontal… qui peut bouger (oui oui) ! On déplace l’axe latéralement pour essayer de garder le pendule en équilibre, pointe en haut ($\theta = \pi$), ce qui est naturellement instable. C’est le fameux problème du balancing pendulum : il faut réagir vite et anticiper les perturbations pour éviter que le pendule ne retombe.

Pour la simulation, on utilise une intégration d’Euler explicite, simple et transparente, adaptée à notre pas de temps. À chaque étape, l’état du système (angle $\theta$ et vitesse angulaire $\omega$) évolue selon :

$$
\ddot{\theta} = -\frac{g}{l} \sin(\theta) - b \dot{\theta} - \frac{v_{\text{axe}} \cos(\theta)}{l}
$$

Le terme $v_{\text{axe}}$ correspond à la vitesse horizontale de l’axe, contrôlée par le PID. Ce dernier ajuste la position de l’axe en fonction de l’écart entre l’angle actuel et la position cible ($\theta = \pi$). Comme il s’agit d’angles, il faut faire attention à la façon de calculer l’erreur pour éviter les problèmes de discontinuité ; on utilise donc :

$$
\text{erreur} = \arctan2\left(\sin(\pi - \theta), \cos(\pi - \theta)\right)
$$

![alt text](/assets/posts-images/personnal/pendulum/arctan2.png)
*Source: [Wikipedia](https://fr.wikipedia.org/wiki/Atan2#/media/Fichier:Arctangent2.svg)*

Cette erreur alimente les trois composantes du PID (proportionnelle, intégrale, dérivée), et la sortie est utilisée pour déplacer l’axe, tout en limitant la commande pour éviter des mouvements irréalistes.

À chaque frame, la boucle de simulation met à jour :

1. La position de l’axe (commande du PID),
2. La vitesse horizontale de l’axe,
3. L’accélération angulaire du pendule,
4. Le nouvel état du pendule.

![alt text](/assets/posts-images/personnal/pendulum/iteration-details.png)
```
θ : angle du pendule (en radians) : variable d'état principale.
ω : vitesse angulaire du pendule (en rad/s)
v_axe : vitesse horizontale du point de suspension (en px/s)
e : erreur entre l’angle cible (π) et l’angle actuel (θ).
commande : sortie du PID, vitesse de déplacement horizontale de l’axe.
Kp, Ki, Kd : gains proportionnel, intégral, dérivé du régulateur PID
dt : pas de temps de la simulation (en secondes).
```

La visualisation permet de suivre en temps réel l’angle, la vitesse, la position de l’axe et les différentes composantes du PID. On peut ainsi voir si le pendule se stabilise… ou si le contrôle échoue quand les paramètres ne sont pas adaptés !

![alt text](/assets/posts-images/personnal/pendulum/pendulum-no-pid.png)
*Pas de régulation PID*

![alt text](/assets/posts-images/personnal/pendulum/pendulum-pid.png)
*Gains PID relativement adaptés*




## Mise en Application de Q-Learning pour Recherche des Gains PID

## Simulation Web

<embed src="{{ site.baseurl }}/simulations/pendulum.html" width="100%" height="100%">



Code Source: https://github.com/Lemonochrme/pendulum
