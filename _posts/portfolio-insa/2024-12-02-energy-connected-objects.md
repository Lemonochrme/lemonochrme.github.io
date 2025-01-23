---
layout: post
title: ⚡ Energy for Connected Objects
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

## Practical Lab Work

### Goal of the Practical Lab: Exploring Sustainable Power Solutions for Connected Objects

The goal of the practical lab was to understand how to power connected objects without relying on wires or batteries but by using wireless power transfer.

### What We Did: Designing and Testing Energy Harvesting Systems

During the lab, we first delved into theoretical concepts through lectures, which provided a strong foundation on energy storage technologies and various harvesting techniques, such as capturing light, mechanical, thermal, and electromagnetic energy. This helped us see how these sources could be applied in IoT systems. In the practical sessions, I worked on designing a connected object emulator, characterizing electromagnetic energy harvesters, and testing the emulator’s performance using both ambient energy and wireless power transfer methods. Each step required careful attention to detail, from selecting the right components to solving challenges in optimization and integration.

### What We Learned: Energy Efficiency and Autonomous Design

Through this experience, we learned not only the technical aspects of energy harvesting and wireless power transfer but also the complexities of implementing these solutions in real systems. I gained an appreciation for the trade-offs between efficiency, cost, and environmental constraints. It became clear how critical it is to design systems that balance energy use and autonomy, especially in applications where maintenance or battery replacement is impractical. Overall, the lab emphasized that while these technologies offer exciting possibilities, they also require a nuanced and innovative approach to achieve effective and sustainable results.










# Analytical Part  

I found the course particularly interesting. The practical lab was very interesting but felt a bit too short in my opinion. I would have preferred to allocate more time on this subject, particularly on all the more technical aspects. Additionally, I think labs focusing on energy harvesting technicals would be very valuable, particularly in applying these methods to the innovative project: a "Bureau d'Etude" style approach, similar to the one in WSN course.

# Skill Matrix


| Associated Skills | AE | Evaluation Method |
|--------------------|----|-------------------|
| Understand the fundamentals of wireless energy transmission, including Tesla coils and microwave beams. | 3 | Portfolio/Report |
| Model energy systems, calculate power requirements for LEDs, and evaluate power consumption of microcontrollers. | 3 | Portfolio/Report |
| Analyze capacitor specifications to select appropriate energy storage solutions for systems. | 3 | Portfolio/Report |
| Compare the impact of different frequencies and technologies (e.g., patches, horns) on energy propagation efficiency. | 3 | Portfolio/Report |
| Identify and integrate alternative energy sources for IoT applications, such as water flow and temperature differences. | 3 | Portfolio/Report |
| Design and test systems using software tools like GNURadio to assess power transfer and efficiency. | 3 | Portfolio/Report |
| Evaluate practical limitations of wireless energy transfer for future potential applications. | 3 | Portfolio/Report |


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