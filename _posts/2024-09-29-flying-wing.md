---
layout: post
title: Autonomous Flying Wing
date: 2024-09-29
categories: [Aero]
image: https://github.com/user-attachments/assets/fa5442fd-eb30-4976-98d5-264942c3b7c3

---

# Introduction
The project focuses on developing an autonomous flying wing, with the eventual goal of integrating a payload. While the payload specifics are still undecided, potential applications include **computer vision for mapping** and **biome recognition**. For now, the priority is on building the platform itself and making sure the flight control system works smoothly.

Key features of the project include:

- **Stable Flying**: Ensuring the flying wing maintains a steady and controlled flight.
- **Autonomous Navigation**: Implementing a flight control system capable of following GPS-defined paths.
- **Payload Integration**: Designing the platform to accommodate various payloads for different applications.



# Theory

## Path Following Algorithm Basics

<div style="text-align: center;">
    {% raw %}
    <h2>Click to add Waypoints</h2>
    <iframe src="/assets/gps-path-algorithm.html" width="100%" height="400" frameborder="0"></iframe>
    {% endraw %}
</div>

```
while simulation is running:
    if no more waypoints:
        stop the simulation
        exit loop
    
    get the next target waypoint
    
    targetAngle = atan2(targetWaypoint.y - flyingWing.y, targetWaypoint.x - flyingWing.x)
    
    angleDifference = targetAngle - flyingWing.angle
    normalize angleDifference to be between -π and π
    
    adjust flyingWing.angle based on angleDifference, limited by max turn rate
    
    increase flyingWing.velocity until maxSpeed is reached
    apply drag to reduce flyingWing.velocity slightly
    
    flyingWing.x += cos(flyingWing.angle) * flyingWing.velocity
    flyingWing.y += sin(flyingWing.angle) * flyingWing.velocity
    
    if flyingWing is close to the target waypoint:
        move to next waypoint

```