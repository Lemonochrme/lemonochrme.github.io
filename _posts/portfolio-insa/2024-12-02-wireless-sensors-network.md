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

*Table: LoRa Frame Description*

### Lora Demodulation: Correlation

![Image](/assets/posts-images/portfolio-insa/wsn/correlation.png)

> Transmitter symbols must be the same as receiver symbols, in other words the Spreading Factor must match between RX and TX !


## Analyzing MAC Protocols for IoT Applications: Efficient Communication in Wireless Sensor Networks

#### Importance of MAC Protocols
MAC protocols ensure that communication ressources are being use efficiently, in a word we have to balance three parameters: energy consumption, reliability and performance. Wireless Sensor Networks good operation heavily depends on the adapted design of the MAC protocol, poorly designed protocols potentially leads to wasted energy and communication failures (collisions). To give a tangible example, our water leak detection project (innovative project) require a MAC protocol tailored for energy efficiency, very low overhead and reliability.

### Classification of MAC Protocols

We can classify MAC protocols between three main sets: Contention-based, Schedule-based and hybrid (mix of the two).

#### Contention-Based Protocols
Contention-based protocols dynamically allocate the communication channel based on demand, offering flexibility but prone to collisions and energy inefficiencies.

- **CSMA/CA**: Nodes sense the channel before transmitting, avoiding direct collisions but consuming more energy due to constant listening.
- **S-MAC**: Introduces periodic sleep schedules and synchronization to save energy but faces challenges in dynamic or mobile networks.
- **B-MAC**: Enhances energy efficiency with low-power listening (LPL) and asynchronous operations, avoiding synchronization overheads.

#### Schedule-Based Protocols
Schedule-based protocols use predefined time slots for communication, eliminating collisions but requiring precise synchronization.

- **TDMA**: Allocates fixed slots, ensuring collision-free communication and energy savings by allowing nodes to sleep outside their slots. It struggles with dynamic network topologies due to its static scheduling.
- **L-MAC**: An improvement over TDMA with decentralized slot allocation, enhancing scalability and adaptability while maintaining energy efficiency.

#### Hybrid Protocols
Hybrid protocols combine contention-based and schedule-based methods to adapt to varying traffic conditions.

- **Z-MAC**: Switches between CSMA and TDMA modes depending on traffic levels, optimizing energy use and minimizing delays. However, it faces challenges with synchronization and hidden terminal issues.

#### Receiver-Initiated Protocols
These protocols invert the communication process, where the receiver initiates data exchange, reducing idle listening and energy consumption.

- **RI-MAC**: Uses beacons from the receiver to indicate readiness, enabling energy-efficient asynchronous operation suitable for low-traffic, sporadic communication. However, beacon overhead can add delays and energy costs.

### *How to choose the right mac protocol ?*

MAC protocol selection is tighly linked to the specific network requirements of the application like energy efficiency, mobility, synchro or security.

| **Protocol** | **Energy Efficiency** | **Sync**        | **Security** | **Scalability** |
|--------------|-----------------------|-----------------|--------------|-----------------|
| CSMA/CA      | Low              | No              | Low          | High            |
| S-MAC        | Moderate         | Yes             | Low          | Moderate        |
| B-MAC    | High             | No              | Low          | Moderate        |
| TDMA         | High                 | Strict          | Low          | Low             |
| L-MAC        | High                 | Local           | Low          | Moderate        |
| Z-MAC        | High                 | Less Strict     | Low          | High            |
| RI-MAC       | Very High            | No              | Low          | High            |

*Table: Comparative Analysis of MAC Protocols*


Contention-based protocols like S-MAC and B-MAC are flexible but energy-intensive. Schedule-based protocols (TDMA) are performant in static networks, while hybrids like Z-MAC offer some degrees of freedom for dynamic conditions. Receiver-initiated protocols optimize energy use for sporadic transmissions making them very efficient for low traffic scenarios.

There is no perfect MAC protocol *(yet?)* each protocol offers trade-offs, when selecting a MAC protocol, one must ask the right question: *What are the network's primary requirements?* And adapt the MAC protocol to fit the specific needs.

## Bureau d'Etude


# Analytical

Prior to this curriculum I had little to no idea of Wireless Sensor Networks. I found this course; or rather the format of the course; particularly interesting, in fact, while I do not dislike classical lectures, I am not found of them because I think they lack interactivity and are not particularly engaging. For this matter the way the course was organised particularly suited me and I found the Reaserch Part to be extremely enriching. 

## *Why do the format of the course suited me well ?*

Above all, I am a self learner. I enjoy discovering and exploring new subjects by myself. The research-based nature of this course allowed me to develop my knowledge on WSN bu actively searching for informations, reading a lot of academic articles and synthetize all I had learnt into a concise report. This process helped me understand the topic way more efficiently than the standalone lecture. Moreover, now that I have some perspective on the situation I can affirm that the knowledge retention is far superior in a self-research course than in a traditional lecture-based course.

In addition, the presentaiton assignment (both on LoRa and on WSN Mac layers) required me to not only understand the subject but also to be able to explain complex concepts to others in a clear and concise manner. And as we all now, we truly understand a concept when we are able to explain it *well* to others. Preparing and doing the presentation improved greatly my communications skills and my ability to simplify complex technical ideas: in other words: science popularization skills.

## *What experience did I gained*

