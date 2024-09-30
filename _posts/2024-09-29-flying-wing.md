---
layout: post
title: Autonomous Flying Wing
date: 2024-09-29
categories: [Aero]
---

### Introduction

The project focuses on developing an autonomous flying wing, with the eventual goal of integrating a payload. While the payload specifics are still undecided, potential applications include **computer vision for mapping** and **biome recognition**. For now, the priority is on building the platform itself and making sure the flight control system works smoothly.

### Current Progress

We've already built the wing and decided to use a pre-made airframe to save time. This lets us focus entirely on developing the **flight computer** and other electronics.

### Why Use a System-on-Chip (SoC)?

For the flight computer, we opted for the **Luckfox Pico Mini B** SoC. A **System-on-Chip** (SoC) is a compact and efficient way to integrate multiple components like the processor, memory, and I/O controllers onto a single chip. This makes SoCs perfect for projects like ours where size, power consumption, and performance are critical factors. The **Luckfox Pico Mini B** combines processing power, efficient power management, and integrated neural network support, making it an ideal choice for future enhancements like AI-based mapping.

### System Architecture

The architecture of our autonomous wing revolves around the **Luckfox Pico Mini B**. Here's a breakdown of the key components:

#### Flight Computer (SoC: Luckfox Pico Mini B)
- **Processing Unit**: Cortex A7@1.2GHz + RISC-V, offering a balanced mix of processing and efficiency.
- **GPS Module**: NEO6M, providing accurate location data during flight.
- **Transceiver**: HC-12 433MHz, handling communication between the wing and ground station.
- **IMU**: MPU9250 (9-axis), responsible for monitoring orientation and movement.
- **Battery**: LiPo 2S 7.4V, delivering the necessary power for all onboard electronics.

Each of these components plays a vital role in the wing's autonomy:
- The **GPS** ensures real-time location tracking.
- The **IMU** helps maintain stability and orientation, critical for autonomous flight.
- The **HC-12 transceiver** allows us to send control commands and telemetry data between the wing and the ground.

### PCB Design for Expansion

To tie all these components together, we are designing a **custom PCB** as an extension of the SoC. This PCB will integrate all the necessary inputs and outputs, such as the IMU, GPS, and power regulation for the various modules. The goal is to create a compact, efficient, and easily maintainable setup.

### Luckfox Pico Mini B Specifications

The **Luckfox Pico Mini B** has some impressive features that set it apart from other options:

- **Processor**: Single-core ARM Cortex-A7 (1.2GHz) with NEON and FPU.
- **NPU**: 0.5TOPS, supporting int4, int8, and int16 for AI-based tasks, like computer vision.
- **Built-in RISC-V MCU**: Ideal for low power consumption, with fast startup and picture capture for real-time data.
- **Memory**: 64MB DDR2 for smooth operation of demanding tasks.
- **GPIO Pins**: 17x GPIO pins to support sensors and actuators.
- **Camera Support**: MIPI CSI interface for future integration of a camera for mapping.

These features make the **Luckfox Pico Mini B** a highly capable core for our project, particularly when it comes to **AI-enhanced functionalities** like biome recognition and mapping in future iterations.

---

As the project progresses, the aim is to refine the flight system and prepare for the integration of a payload. Stay tuned for updates on the PCB design and how we optimize the wing's autonomous capabilities.
