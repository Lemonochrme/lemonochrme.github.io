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

In 2024, we live in a world surrounded by wireless signals like Wi-Fi, Bluetooth, and radio waves, which contain not just data but also energy that could theoretically be harvested.

A strong need for wireless power became apparent in 2014 when the Philae robot landed on a shadowed asteroid and couldn't recharge due to its solar dependency. Today, wireless power could help deliver energy to areas impacted by natural disasters or other energy disruptions. This project explores using Wi-Fi or other frequencies to power an LED wirelessly.

This course explores the principles and technologies behind powering connect objects without traditional wired/battery. We explored various ways to harvest energy from ambient sources: light, mechanical, thermal, electromagnetic... We also covered wireless power transfer methods with a focus on electromagnetic solutions. The course gave the basis to design "energy-intelligent", low-power, autonomous IoT devices. 

# Technical Part

## Practical Lab Work

The technical work involved selecting components like the BQ25504 ultra-low-power boost converter and a supercapacitor for energy storage. Capacitors of different capacities were evaluated to optimize power loss and energy storage. Frequencies of 868 MHz and 2.45 GHz were tested for their propagation and energy transfer efficiency. Practical testing was conducted using GNURadio and an Analog Discovery 2 device to analyze power output and LED activation. Results showed that wireless energy transfer is feasible but limited in range and efficiency, making it more of a proof of concept.

# Analytical Part  

I found the course particularly intriguing but somewhat unfulfilling. The introduction to the lab was captivating but felt too brief, leaving me eager to explore the technical aspects further. Additional labs focusing on energy harvesting techniques would be valuable, particularly in applying these methods to innovative projects. A hands-on "Bureau d'Étude" style approach, similar to the one in the WSN course, could significantly enhance the learning experience. This would provide an opportunity to implement and test energy harvesting in real-world scenarios, making the course more comprehensive and impactful.



## References

1. [Tesla Science Center on Wardenclyffe Tower](https://teslasciencecenter.org/history/tower/)
2. [Wireless Power Transmission from Space to Earth](https://www.independent.co.uk/space/space-earth-wireless-power-beamed-b2353588.html)
3. [BBC News on Rosetta Mission](https://www.bbc.com/news/science-environment-30034060)
4. [BQ25504 Ultra Low-Power Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/bq25504.pdf)
5. [TPS6303x Buck-Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/tps63030.pdf)
6. [SML-D12x1 LED Datasheet](https://www.tme.eu/Document/932347758f1894d9ef5e9a8053d7c609/SML-D12Y1WT86.pdf)
7. [STM32C011x4/x6 Documentation](https://www.st.com/en/microcontrollers-microprocessors/stm32c011j4.html?icmp=tt40742_gl_lnkon_sep2024#sample-buy)