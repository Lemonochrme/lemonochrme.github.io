---
layout: post
title: "Développement d'une Aile Volante Autonome"
date: 2024-09-29
categories: [projet, aéronautique, électronique]
---

# Développer une aile volante autonome : où j'en suis

L'idée derrière ce projet est de créer une aile volante capable de voler de manière autonome. À terme, j'aimerais intégrer une charge utile, mais ce point reste encore à définir. Une des pistes envisagées serait d'utiliser la **vision par ordinateur** pour réaliser de la **cartographie** ou identifier des **biomes**. Cela pourrait avoir des applications intéressantes pour l'exploration de zones isolées ou difficiles d'accès.

Cependant, pour l'instant, je me concentre sur la base, à savoir la **plateforme de vol** elle-même. L'aile volante est déjà construite, ce qui me permet de gagner du temps en utilisant un modèle pré-assemblé. Tout l'enjeu est désormais de mettre au point l'**ordinateur de vol**, le cœur de l'appareil qui va gérer tout le traitement des données et les actions en vol.

## Pourquoi un SoC (System on Chip) ?

Pour développer cet ordinateur de vol, j'ai opté pour un **System on Chip (SoC)**, plus précisément le **Luckfox Pico Mini B**. Le choix d'un SoC n'est pas anodin : il s'agit d'une puce intégrée qui regroupe en un seul composant tous les éléments essentiels d'un ordinateur (processeur, mémoire, interfaces de communication, etc.). Cela permet d'avoir une solution compacte, légère et économe en énergie — des critères essentiels pour une aile volante où chaque gramme compte et où l'autonomie est primordiale.

### Le SoC Luckfox Pico Mini B

J'ai choisi ce modèle de SoC car il offre un bon compromis entre puissance de calcul et consommation énergétique. Voici les spécifications techniques principales du **Luckfox Pico Mini B** :

- **Processeur** : ARM Cortex-A7 32-bit à 1.2 GHz, avec une unité RISC-V intégrée.
- **NPU (Neural Processing Unit)** : capable de traiter des algorithmes d'intelligence artificielle avec une puissance de calcul allant jusqu'à 1.0 TOPS (Tera Operations Per Second) en int4. Cela pourra s'avérer utile si, plus tard, j'intègre des fonctions de vision par ordinateur, par exemple pour identifier des objets au sol ou reconnaître des motifs géographiques.
- **Mémoire** : 64 MB DDR2, suffisant pour les calculs embarqués et la gestion des capteurs.
- **Stockage** : 128 MB SPI NAND FLASH, de quoi stocker les données essentielles et les logs de vol.
- **GPIO** : 17 broches pour connecter les différents capteurs et actuateurs (servos, transceiver, etc.).
- **Interface caméra** : Supporte le MIPI CSI pour connecter une caméra, ce qui pourra servir plus tard pour les tests de vision par ordinateur.

Le **Pico Mini B** a aussi l'avantage d'intégrer un système de gestion d'alimentation optimisé et un encodeur d'images performant, ce qui permettra de maximiser l'efficacité énergétique et la qualité des flux vidéo, si nécessaire.

## L'architecture de l'aile volante

L'architecture de l'aile volante est organisée autour du SoC et d'une série de composants critiques pour assurer le vol et la communication avec le sol. Voici un aperçu des principaux modules :

### Les composants principaux

1. **GPS NEO6M** : Ce module GPS permet de connaître la position exacte de l'aile à tout moment. Il est crucial pour la navigation autonome, notamment pour définir des plans de vol préprogrammés ou pour éviter des zones spécifiques.
  
2. **Transceiver HC-12 (433MHz)** : Ce module de communication sans fil permet à l'aile de transmettre des données à une station au sol. Il fonctionne à 433 MHz, ce qui offre une bonne portée tout en maintenant une consommation énergétique modérée. Cela permet d'envoyer des données de télémétrie, comme la position GPS, la vitesse ou l'état de la batterie.

3. **IMU MPU9250 (9 axes)** : Ce capteur inerte permet de mesurer l'orientation, la vitesse angulaire et l'accélération sur trois axes. Ces données sont essentielles pour stabiliser l'aile en vol et ajuster automatiquement son attitude en fonction des conditions de vol (vent, turbulences, etc.).

4. **Batterie LiPo 2S 7.4V** : L'alimentation principale de l'aile. J'utilise une batterie LiPo 2S de 7.4V pour alimenter le SoC et les autres systèmes embarqués. La gestion de l'énergie est un facteur clé dans ce projet, car elle détermine l'autonomie de l'aile en vol.

### Le rôle du PCB

Tous ces composants sont reliés à un **PCB sur mesure**, conçu spécifiquement pour mon projet. Le PCB intègre toutes les **entrées/sorties** du SoC et sert d'interface avec les différents capteurs et modules de communication. Il joue un rôle central dans la gestion des signaux provenant des capteurs (GPS, IMU) et dans le contrôle des servos qui gèrent les surfaces de contrôle de l'aile (ailerons et moteur brushless).

J'ai pris soin de concevoir un circuit qui permet une **connexion efficace** entre le SoC et les composants, tout en garantissant une **alimentation stable** à chaque module. Le PCB inclut également des régulateurs de tension pour convertir la tension de la batterie en 5V et 3.3V, selon les besoins des différents éléments du système.

## En résumé

Ce projet est encore en développement, mais les grandes lignes sont désormais bien établies. L'utilisation du **Luckfox Pico Mini B** en tant que cerveau de l'aile, associée à une série de capteurs et de modules de communication, pose les bases solides pour un système de vol autonome. La prochaine étape sera d'intégrer tous ces éléments, de finaliser le design du PCB et de procéder aux premiers essais en vol pour valider l'ensemble du système.

L'objectif final est d'avoir une **plateforme de vol stable et autonome**, qui pourra ensuite évoluer en fonction des besoins en intégrant, par exemple, de la vision par ordinateur ou d'autres technologies pour rendre l'aile encore plus polyvalente.
