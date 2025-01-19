---
layout: post
title: 📱 Smart Devices
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Descriptive Part

## AIME Lab Work

 The gaz sensor is a project we carried out over the course of a week at the AIME micro-electronics laboratory. The goal was to make a nano-particle based passive gaz sensor using micro-electronics technology available in the lab. The work implied the following steps:
- Synthetize the $WO_3$ nano-particules using basic chemistry
- Coating the polysilicon substract with photosensible resin to protect the useful circuit.
- Dip the subtract into acid to remove unwanted conductive parts of the circuit.
- Clean the subtract.
- Powder the subtract using electrophoresis with nano-particles and check that it is coated evenly on the conductive combs.
- Cut the individual silicon dices off the wafer.
- Wire bond the die to the package using ultrasonic bonding.
- Characterize the gas sensor resistance.

## Microcontroller and Open Source Hardware (MOS&H)

This project is the continuity of the work we achieved at the AIME lab concerning the nano-particle gaz sensor. The goal was to integrate the analog gaz sensor into a complete embedded IoT system.

## Sensors Introduction

The goal was to gain basic knowledge about different types of sensors (actives, passives) and how to implement/use them in a system.

## Analog Electronics Lab

This part, like the MOSH was part of the continuity of the AIME work. The goal was to integrate the analog gas sensor into a complete analog chain for microcontroller integration.

# Technical Part

## AIME Lab Work

## Analog Electronics Lab: Signal Conditioning for the Analog Gas Sensor

### Gas sensor Characteristics

The gas sensor has an impedance of several gigaohms, requiring signal amplification. But amplification increases signal noise as well, hence the conditioning circuit needs several filters to improve signal quality:
- Filter for the high-frequency noise.
- Filter for the 50Hz outlet noise.
- Filter for the ADC sampling noise.

### Amplifier Design

When designing the signal conditioning circuit two types of amplifiers were considered: a standard low-cost amplifier and a costly very low offset amplifier (LT1050).

We performed simulations on both and found that the LTC1050, better suited our application (as expected) because a high offset could significantly affect the accuracy of the gas sensor readings.

![Image](/assets/posts-images/portfolio-insa/smart-devices/offset-opamp-comparison.png)
*Image: LTSpice Simulation of the circuit comparing the two OpAmps*




### Filters Specifications 

- First Filter: Cutoff frequency at 16 Hz.
- Second Filter: Cutoff frequency at 1.5 Hz.
- Third Filter: Cutoff frequency at 1.6 kHz.


![Image](/assets/posts-images/portfolio-insa/smart-devices/filters.png)
*Image: LTSpice Schematic of the cirtuit with the 3 filters outlined in blue*



### Filters LTSpice Simulations

Simulation of cutoff frequencies of the different filters:
- First filter: 16Hz
- Second filter: 1.5kHz
- Third filter: 1.6kHz

<table>
    <tr>
        <td><a href="/assets/posts-images/portfolio-insa/smart-devices/filtre1.png"><img src="/assets/posts-images/portfolio-insa/smart-devices/filtre1.png" alt="First Filter" style="max-width: 100%; height: auto;" /></a></td>
        <td><a href="/assets/posts-images/portfolio-insa/smart-devices/filtre2.png"><img src="/assets/posts-images/portfolio-insa/smart-devices/filtre2.png" alt="Second Filter" style="max-width: 100%; height: auto;" /></a></td>
        <td><a href="/assets/posts-images/portfolio-insa/smart-devices/filtre3.png"><img src="/assets/posts-images/portfolio-insa/smart-devices/filtre3.png" alt="Third Filter" style="max-width: 100%; height: auto;" /></a></td>
    </tr>
</table>


### Gas sensor model LTSpice simulations

In order to simulate the entire signal conditioning circuit, we needed an electrical model of the gas sensor, described as follow:

![Image](/assets/posts-images/portfolio-insa/smart-devices/model.png)
*Image: Gas sensor electrical model schematic*

With the gas sensor modeled in LTSpice, we can integrate it into the complete conditioning circuit (amplification and filters) to perform simulations.

![Image](/assets/posts-images/portfolio-insa/smart-devices/model-50hz-unfiltered.png)
*Image: LTSpice Simulation of the gas sensor model without 50Hz filtering*

![Image](/assets/posts-images/portfolio-insa/smart-devices/model-50hz-filtered.png)
*Image: LTSpice Simulation of the gas sensor model with 50Hz filtering*

Based on the above-cited images we can clearly see why the filters (and particularly the 50Hz filter) are useful. 


## Microcontroller and Open Source Hardware (MOSH)

![Image](/assets/posts-images/portfolio-insa/smart-devices/gaz-sensor-node.png)
*Image: 3D Render of the Gaz Sensor Integration Board*





# Analytical Part

## Microcontroller and Open Source Hardware (MOSH)

I strongly believe that Open Source and Open Hardware is the key to achieving sustainability, both in technology and the consumer industry. Open Source encourage accessible knowledge and accelerate innovation. Unlike proprietary solutions, Open Source gives everyone the tools to create, improve and share freely ensuring progress benefits everyone, not just a select few.

In out interdisciplinary innovative project, I worked on a non-intrusive cutting edge water leak detection system. We choose to make this project fully Open Source, from the hardware design to the software source code: everything is accessible to anyone on GitHub. By sharing it openly we ensure and everyone (researchers, developers, students...) can build on top our work  adapt it to their needs and create better solutions.

Isaac Newton once said, *"If I have seen further it is by standing on the shoulders of giants."* What progress could he have made if science had been private and secret?

I strongly support Open Source because it gives people the ability to learn and take control of the technology they use. The Internet gave free knowledge to everyone; Open Source and Open Hardware is only the logical continuation of this philosophy. A philosophy in which I believe.