---
layout: post
title: Energy for Connected Objects
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---


https://moodle.insa-toulouse.fr/course/view.php?id=979



### Portfolio: Energy for Connected Objects

# Descriptive Part  

The idea of sending power wirelessly dates back to Nikola Tesla and his invention of the Tesla coil. Tesla aimed to power devices over long distances using electromagnetic fields. In 1901, New York started building the Wardenclyffe Tower to distribute power wirelessly, but the project was halted in 1904 due to high costs.

![Image](/assets/posts-images/portfolio-insa/energy/nikola-wireless-power.png)
*Image: Nikola Tesla Wireless Power System [Source](https://cdn.prod.website-files.com/616e7bd6ab5a089243ca2fcf/62b96ce5e7cd972b1edf23fa_Nikola%20Tesla-17.jpg)*

During WWII, radio communications improved significantly for military use leading to advancements in data transmission over electromagnetic waves, this era also saw the creation of the magnetron, which later paved the way for the discovery of microwaves, a technology that causes water molecules to vibrate when exposed to a 2.4 GHz wave, creating heat.

In 2024, we are surrounded by wireless signals like Wi-Fi, Bluetooth, and other radio waves, which contain not just data but also energy that could theoretically be harvested. Imagine being able to power a sensor just by allocating a Wi-Fi channel to wireless power transmission.

A strong need for wireless power became apparent in 2014 when the Philae robot landed on a shadowed asteroid and couldn't recharge due to its solar dependency. Today, wireless power could help deliver energy to areas impacted by natural disasters or other energy disruptions. This project explores using Wi-Fi or other frequencies to power an LED wirelessly.

This course explores the principles and technologies behind powering connect objects without traditional wired/battery. We explored various ways to harvest energy from ambient sources: light, mechanical, thermal, electromagnetic... We also covered wireless power transfer methods with a focus on electromagnetic solutions. The course gave the basis to design "energy-intelligent", low-power, autonomous IoT devices. 

# Technical Part

## Energy Reflexions for the Inovative Project

Our WSN-based non-intrusive water leak detection project relies on batteries for operation. Each node in the distributed network is designed to include a battery that lasts for years due to the impracticality of changing batteries, as the nodes are embedded in the underground pipe network. 

This poses three critical requirements:

1. Nodes must be highly energy efficient to maximize battery life.
2. Nodes must support wireless recharging without physical intervention.
3. Nodes must be capable of harvesting ambient energy to help battery power and improve longevity.

These requirements drive the need for innovative energy solutions, combining efficient power management, wireless energy transfer, and ambient energy harvesting techniques.


### Energy Efficiency


### Wireless Charging Capabilities



### Energy Harvesting

#### Leveraging Temperature Difference: The Seebeck Effect

![Image](/assets/posts-images/portfolio-insa/energy/harvesting-peltier.png)

#### Vibration and Piezoelectricity

![Image](/assets/posts-images/portfolio-insa/energy/harvesting-piezo.png)

## Practical Lab Work

### Goal of the Practical Lab

The goal of the practical lab was to explore wireless power transfer for connected objects, specifically powering an LED without relying on wired connections or batteries, using ambient energy sources like Wi-Fi.

### Modeling the System

#### LED Power

We started by calculating how much power an LED needs. At full brightness, it required 44 mW, but even at its lowest functional level, we only needed 1.75 mW. This made us optimistic because these low requirements align well with what we could harvest wirelessly.

#### Capacitors and Energy Storage

![Image](/assets/posts-images/portfolio-insa/energy/energy_card_schema.png){: .center}

Next, we needed a way to store the energy we captured, so we looked at capacitors. After testing several options, we chose a 6.8 mF capacitor. It struck the right balance—low energy loss and enough capacity to keep the LED running smoothly.

#### Frequency Selection

The key was choosing the right frequency for energy transfer. Lower frequencies, like 868 MHz, turned out to be more efficient because they travel farther and lose less energy. We also used technologies like patch antennas to boost the signal and improve efficiency.

![Image](/assets/posts-images/portfolio-insa/energy/energy_max_freq.png){: .center}
*Image: Received Voltage Function of Frequency*


### Testing the System

Using GNURadio and an Analog Discovery 2, we tested how well we could power the LED at different frequencies and distances. We found that the 868 MHz range worked best, and our setup could light the LED from up to a meter away.













# Analytical Part  

I found the course particularly interesting. The practical lab was very interesting but felt a bit too short in my opinion. I would have preferred to allocate more time on this subject, particularly on all the more technical aspects. Additionally, I think labs focusing on energy harvesting technicals would be very valuable, particularly in applying these methods to the innovative project: a "Bureau d'Etude" style approach, similar to the one in WSN course.

# Skill Matrix



| **Skill/Objective**                                                               | **AE** | **Evaluation Method**       |
|-----------------------------------------------------------------------------------|--------|-----------------------------|
| Understand and apply methods for powering a connected object without wires or batteries, using ambient energy harvesting and wireless power transfer | 3      | Portfolio/Report            |
| Design and optimize low-power wireless connected objects considering hardware, software, and electromagnetic components | 3      | Portfolio/Report            |
| Evaluate and compare the state-of-the-art solutions for powering connected objects using modern technologies | 3      | Portfolio/Report            |
| Analyze and implement electricity storage methods suitable for connected objects, including supercapacitors and hybrid solutions | 3      | Portfolio/Report            |
| Develop and characterize connected object prototypes utilizing electromagnetic energy harvesting | 3      | Portfolio/Report            |
| Integrate power management systems and ensure efficient use of energy in connected objects | 3      | Portfolio/Report            |
| Assess environmental and application constraints to choose appropriate energy solutions for connected objects | 3      | Portfolio/Report            |
| Optimize components such as antennas, rectifiers, and rectennas for energy-efficient design of wireless sensing nodes | 2      | Portfolio/Report            |
| Identify and use Industrial, Scientific, and Medical (ISM) frequency bands for wireless power transfer applications | 2      | Portfolio/Lab/Report            |
| Apply best practices for software and hardware integration to minimize power consumption in connected objects | 3      | Portfolio/Report            |


1-level of application: follow-up of instructions or procedures  
2-level analysis: improvement or optimization of solutions or proposals  
3-level of control: design of programs or definitions of specifications  
4-level of expertise: definition of guidelines or strategies  



# References

1. [Tesla Science Center on Wardenclyffe Tower](https://teslasciencecenter.org/history/tower/)
2. [Wireless Power Transmission from Space to Earth](https://www.independent.co.uk/space/space-earth-wireless-power-beamed-b2353588.html)
3. [BBC News on Rosetta Mission](https://www.bbc.com/news/science-environment-30034060)
4. [BQ25504 Ultra Low-Power Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/bq25504.pdf)
5. [TPS6303x Buck-Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/tps63030.pdf)
6. [SML-D12x1 LED Datasheet](https://www.tme.eu/Document/932347758f1894d9ef5e9a8053d7c609/SML-D12Y1WT86.pdf)
7. [STM32C011x4/x6 Documentation](https://www.st.com/en/microcontrollers-microprocessors/stm32c011j4.html?icmp=tt40742_gl_lnkon_sep2024#sample-buy)