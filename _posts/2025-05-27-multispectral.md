---
layout: post
title: Designing a Multispectral Payload for Lightweight Drones
date: 2025-05-27
categories: [Personnal]
image: https://github.com/user-attachments/assets/d548796d-1f05-4e89-9b72-6fb4c76cdcb9
description: "A continuation of the autonomous fixed-wing platform project, this post explores the design and integration of a compact, embedded multispectral imaging payload. It covers the motivation for onboard spectral sensing, the hardware architecture based on the Radxa CM3, and the current progress toward enabling real-time, in-flight terrain understanding through visible, red, and near-infrared bands.."
---

> Work in progress, this post is currently being written and will be completed soon.

# Context

This is a continuation of the work I’ve been doing around the small flying wing I shared earlier. The idea is to explore how far I can push that platform, not just flying for flying. I want to embark intelligence, more precisely, for trying to detect things on the ground that might not be visible in normal RGB imagery. Stressed vegetation, early signs of erosion, or  in land use. I don’t know yet how far this can go, but I wanted to see if it’s at least possible to startchanges.


# Acknoledgement

I came up with this project idea and started building the first prototype before doing any literature review (I know bad practice but I'm not really aiming for academical). Later, while looking into similar works, I found out that low-cost dual-band multispectral systems have already been explored in research contexts. In particular, I’d like to mention the works by Cañada et al. (2020) on Raspberry Pi-based NDVI systems, and other experiments combining OV5647 modules. These studies confirm the feasibility of the approach, and they helped me validate some of the technical choices I had made independently.

This project doesn't aim to improve on those works directly, but to take the idea into a new direction: lighter, fully embedded and edge processed.


# How it started

The first thought was just to mount a single camera pointing down and do some basic analysis onboard. But that quickly ran into limits. If I want to detect subtle changes, like dry vs. healthy vegetation, RGB isn’t enough. I started looking into multispectral setups, and that’s where things got complicated. True multispectral sensors are out of reach for this kind of project, both in cost and in integration complexity.

So I began thinking low-cost, trying to see if I could get meaningful spectral separation by using different filters in front of standard sensors. I settled on a basic configuration: three identical camera modules, each with its own optical filter: one for visible light, one for red, one for near-infrared. The filters are integrated into M12 lenses, which simplifies the build and keeps things lightweight.

# Hardware Direction : Low Cost COTS

## Sensors and Filters

### OV5746

The OV5647 is natively supported by the Raspberry Pi ecosystem, with robust Linux drivers and extensive community documentation. Its popularity in both hobbyist and research projects means there is a lot of publicly available analysis, including detailed spectral response data. In addition it is available in NoIR version, i.e, without any IR-cut coating that would jeopardize the project (we need the near infra red band !).

![alt text](/assets/posts-images/personnal/multispectral/ov5746.png)
*Analytical Spectral Response of OV5647 from 10.1108/SR-12-2016-0276*

The spectral response of OV5647 clearly shows that the sensor can be used to capture both RED and NIR bands up to around 900 nm efficiently.

## Optical Filters

As explained earlier, the OV5647 sensor comes without any built-in filters, so it captures a wide range of light—from below 400 nm to above 900 nm (near-infrared). To analyze specific bands, we need to separate the light into the regions we care about. The best way to do this is by using optical filters that only let certain wavelengths through.

I chose to use M12 camera lenses with integrated optical filters. Each lens has a different filter: one passes only visible light (we wont use it because of hardware limitations), another passes red light (around 650 nm), and the third passes near-infrared light (around 850 nm). By mounting these filtered lenses on identical camera modules, each sensor captures a different part of the spectrum. This setup is simple, lightweight, and keeps the hardware cost low, while still allowing us to collect the data needed for multispectral analysis.

![alt text](/assets/posts-images/personnal/multispectral/lens.png)
*Lens with integrated filters : Visible, Red (650nm) and Near Infrared (850nm)*

## Onboard Computer (OBC)

At this point it was clear I couldn’t use a Raspberry Pi or similar single-board computer: they only support one camera natively. I could have tried stacking several, but it didn’t feel sustainable or clean. So I shifted to a SoM-based (System on Module) approach, specifically the Raspberry Pi CM5. It gives me access to multiple CSI interfaces and is compact enough to integrate into the airframe. I’m now working on designing a minimal carrier board that can host the CM3 and connect three CSI cameras directly, with synchronized triggering and clean power management.

![alt text](/assets/posts-images/personnal/multispectral/cm5.png)
*RSoM*

One of the big advantages of using a System on Module (SoM) like the Raspberry Pi CM5 is flexibility. Unlike a typical single-board computer (e.g., Raspberry Pi) a SoM lets you design your own base board to fit exactly what you need. The advantage is freedom, the drawback is you: you’re the designer, so every problem is now your (my) problem !

![alt text](/assets/posts-images/personnal/multispectral/cm5-back.webp)
*CM5 Back with interfacing Hirose DF40C-100DP-0.4V(51) dual connectors*
However, the CM5 only has two CSI camera inputs. This means I had to reduce the setup from three cameras to two: one for RED and one for NIR. By using a dual-band configuration, it is still possible to calculate useful indices like NDVI (Normalized Difference Vegetation Index):

NDVI = (NIR - RED) / (NIR + RED)

# Designing the Onboard Intrument Computer

There are still a lot of open questions. I’m not sure yet how well the image alignment will hold in flight. I ordered the components and will begin testing upon delivery. But the general structure is there, and I think it’s worth trying.

![alt text](/assets/posts-images/personnal/multispectral/pcb-wip.png)

![alt text](/assets/posts-images/personnal/multispectral/schematic-wip.png)

For now, I’m mostly trying not to go insane while designing the OBC PCB, there’s just so much documentation, so many pins, and a maze of standards to keep track of. But I'm here for this !

The goal isn’t to match what professional multispectral payloads can do it’s to see whether something simpler and cheaper could still be useful. If I can fly, capture all three bands, align them well enough, and compute something meaningful on board that will already be a great achievement !