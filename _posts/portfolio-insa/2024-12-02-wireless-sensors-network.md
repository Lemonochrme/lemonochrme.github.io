---
layout: post
title: 📡 Wireless Sensors Network
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Descriptive Part

The goal of this course was to discover Wireless Sensor Networks and communication protocols by researching on the subject, synthetise a report and present the subject in front of the whole class. 

# Technical Part

The WSN course was articulated in three main parts: the lec ture course, the presentation assignements and the technical lab or Bureau d'Etude. In this section we will focus on the last two points as the lecture course is an introduction.

## LoRa Physical Layer

For the first presentation on WSN we were asked to research and present on various communication protocols like zigbee or sigfox. We choose to work on the LoRa communication protocol. In this section I will summary in a concise but technical manner what I learnt and understood on LoRa Physical Layer.

### Protocol Stack Overview

The LoRa Physical Layer (or LoRa PHY) operate just above the RF layer (ISM Bands) and its role is to provide a robust, long-range radio communication link with low power consumption.

> ISM Bands: 169 MHz, 433 MHz (Asia), 868 MHz (Europe), and 915 MHz (North America).


![Image](/assets/posts-images/portfolio-insa/wsn/stack.png)

### Chirp Spread Spectrum Modulation (CSS)

LoRa uses a unique spread spectrum modulation type capable of transmitting information below the noise level.

Advantages:
- High immunity to noise and interference.
- Ability to transmit over long distances with low power levels.


![white](/assets/posts-images/portfolio-insa/wsn/css.png)

Chirp Spread Spectrum modulation uses "chirps" signals whose frequency varies linearly over time, enabling interference-resistant encoding.

![Image](/assets/posts-images/portfolio-insa/wsn/css-signal.png)

### Spreading Factor

![Image](/assets/posts-images/portfolio-insa/wsn/sf.png)

Spreading Factors orthogonoality mearns that LoRa signals can cohexists on the same rf channel without interfering. I give a more detailed explanation of why this is possible in the 5g modulation post.

### Symbols

In order to communicate, the LoRa PHY layer make uses of symbols to transmit informations. A symbol represents one or more data bits. A symbol has $2^{SF}$ possible values.

The Spreading Factor value has a direct influence on the possible range and data rate of the LoRa communication. The higher the SF (SF6 to SF12), the greater the range but the lower the data rate.

![Image](/assets/posts-images/portfolio-insa/wsn/symbol.png)

### Structure of a LoRa Frame

![Image](/assets/posts-images/portfolio-insa/wsn/lora-frame.png)

| Preamble | Synchronization | Payload | CRC |
|----------|-----------------|---------|-----|
| Synchronization sequence used by the receiver to lock onto the signal. | Synchronization sequence to align the receiver with the transmitter. | Contains the data transmitted by the node. | Ensures data integrity. |

### Lora Demodulation: Correlation

![Image](/assets/posts-images/portfolio-insa/wsn/correlation.png)

> Transmitter symbols must be the same as receiver symbols, in other words the Spreading Factor must match between RX and TX !


## Analyzing MAC Protocols for IoT Applications


## Bureau d'Etude


# Analytical

Prior to this curriculum I had little to no idea of Wireless Sensor Networks. I found this course; or rather the format of the course; particularly interesting, in fact, while I do not dislike classical lectures, I am not found of them because I think they lack interactivity and are not particularly engaging. For this matter the way the course was organised particularly suited me and I found the Reaserch Part to be extremely enriching. 

## *Why do the format of the course suited me well ?*

Above all, I am a self learner. I enjoy discovering and exploring new subjects by myself. The research-based nature of this course allowed me to develop my knowledge on WSN bu actively searching for informations, reading a lot of academic articles and synthetize all I had learnt into a concise report. This process helped me understand the topic way more efficiently than the standalone lecture. Moreover, now that I have some perspective on the situation I can affirm that the knowledge retention is far superior in a self-research course than in a traditional lecture-based course.

In addition, the presentaiton assignment (both on LoRa and on WSN Mac layers) required me to not only understand the subject but also to be able to explain complex concepts to others in a clear and concise manner. And as we all now, we truly understand a concept when we are able to explain it *well* to others. Preparing and doing the presentation improved greatly my communications skills and my ability to simplify complex technical ideas: in other words: science popularization skills.

## *What experience did I gained*

