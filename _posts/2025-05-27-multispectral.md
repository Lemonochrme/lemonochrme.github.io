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


# How it started

The first thought was just to mount a single camera pointing down and do some basic analysis onboard. But that quickly ran into limits. If I want to detect subtle changes, like dry vs. healthy vegetation, RGB isn’t enough. I started looking into multispectral setups, and that’s where things got complicated. True multispectral sensors are out of reach for this kind of project, both in cost and in integration complexity.

So I began thinking low-cost, trying to see if I could get meaningful spectral separation by using different filters in front of standard sensors. I settled on a basic configuration: three identical camera modules, each with its own optical filter: one for visible light, one for red, one for near-infrared. The filters are integrated into M12 lenses, which simplifies the build and keeps things lightweight.

![alt text](/assets/posts-images/personnal/multispectral/theorical-spectral-response.png)
*Theorical spectral response of CMOS NoIR*

![alt text](/assets/posts-images/personnal/multispectral/lens.png)
*Lens with integrated filters : Visible, Red (650nm) and Near Infrared (850nm)*

# Hardware direction

At this point it was clear I couldn’t use a Raspberry Pi or similar single-board computer: they only support one camera natively. I could have tried stacking several, but it didn’t feel sustainable or clean. So I shifted to a SoM-based (System on Module) approach, specifically the Radxa CM5. It gives me access to multiple CSI interfaces and is compact enough to integrate into the airframe. I’m now working on designing a minimal carrier board that can host the CM3 and connect three CSI cameras directly, with synchronized triggering and clean power management.

![alt text](/assets/posts-images/personnal/multispectral/cm3.png)
*RSoM*

One of the big advantages of using a System on Module (SoM) like the Radxa CM3 is flexibility. Unlike a typical single-board computer (e.g., Raspberry Pi) a SoM lets you design your own base board to fit exactly what you need. The advantage is freedom, the drawback is you: you’re the designer, so every problem is now your (my) problem !

# Where I am

There are still a lot of open questions. I’m not sure yet how well the image alignment will hold in flight. I ordered the components and will begin testing upon delivery. But the general structure is there, and I think it’s worth trying.

![alt text](/assets/posts-images/personnal/multispectral/pcb-wip.png)

![alt text](/assets/posts-images/personnal/multispectral/schematic-wip.png)

For now, I’m mostly trying not to go insane while designing the OBC PCB, there’s just so much documentation, so many pins, and a maze of standards to keep track of. But I'm here for this !

The goal isn’t to match what professional multispectral payloads can do it’s to see whether something simpler and cheaper could still be useful. If I can fly, capture all three bands, align them well enough, and compute something meaningful on board that will already be a great achievement !