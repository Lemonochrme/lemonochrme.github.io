---
layout: post
title: UAV Flight Computer Prototype
date: 2025-05-19
categories: [Personnal]
image: https://github.com/user-attachments/assets/d548796d-1f05-4e89-9b72-6fb4c76cdcb9
description: "Hardware prototype of a compact flight computer for an autonomous flying wing, integrating GNSS, IMU, LoRa, ELRS, and environmental sensors."
---

> Work in progress, this post is currently being written and will be completed soon.

This post is part of a bigger project: building an autonomous flying wing. Here, I’m focusing on the development of a first prototype of the flight computer.

# Goals

Design and prototype a compact flight computer that will eventually serve as the core of an autonomous flying wing system. The long-term goal is to enable:

- GNSS-based waypoint navigation
- Real-time attitude stabilization (PID)
- Control of control surfaces (ailerons) and propulsion (BLDC motor)
- Sensor fusion for accurate state estimation
- Data transmission via long-range wireless (LoRa)
- Autonomous flight execution from takeoff to landing
- Low-latency manual override and control via ELRS link

# Key Features Wanted

- GNSS positioning using Ublox NEO-6M (for path tracking and timing)
- Environmental sensing: temperature, pressure, humidity (BMP280)
- IMU-based orientation and motion tracking (LSM6DS3TR)
- LoRa radio communication (SX1278 module)
- Embedded Linux platform for logic and perception (RV1103 SoC with CSI camera)

# Hardware Design

## Custom Luckfox Pico Part and Footprint

The Luckfox Pico board doesn’t exist in EasyEDA by default, so I created a custom symbol and footprint.

![alt text](/assets/posts-images/personnal/uav-flight-computer/1.png)
![alt text](/assets/posts-images/personnal/uav-flight-computer/2.png)
![alt text](/assets/posts-images/personnal/uav-flight-computer/3.png)


## Reuse of Previous Subsystems

Some features were reused from earlier projects:
- **BMP280**: from a gas sensor node based on WO3
- **LSM6DS3TR IMU**: from a water leak detection system using vibration analysis

<p align="center">
    <img src="/assets/posts-images/personnal/uav-flight-computer/5.png" alt="alt text">
</p>

If you're interested, feel free to check my other posts about these projects.

## GNSS Circuit (Ublox NEO-6M)

The GNSS part uses the bare NEO-6M chip. The RF track to the antenna (u.FL) must be impedance-matched to 50 ohms, which requires care during PCB routing.

There are other aspects to consider soon: V_BCKP battery, RF layout, hot start optimization, and potentially external flash/EEPROM.

This is where I’m currently at.

![alt text](/assets/posts-images/personnal/uav-flight-computer/4.png)

# Technical Review

## Low-Latency Control Link: ExpressLRS

ExpressLRS (ELRS) is an open-source (finally) RC control link designed for **ultra-low latency**, **long range**, and **high reliability** : making it very suitable for this project.

### Physical Layer

ELRS typically uses uses **Semtech SX127x or SX128x LoRa transceivers** as its physical layer, these radios operate in sub-GHz ISM bands (typically 868/915 MHz or 2.4 GHz).

- On the aircraft side an ELRS receiver module is installed, it communicates wirelessly with the transmitter and outputs CRSF protocol over UART.
- The ELRS receiver is essentially a LoRa radio with a lightweight firmware stack optimized for fast packet rates (approx. 500 Hz) adaptive frequency hopping and dynamic telemetry.

### Usage in this Flight Computer

In this system ELRS will provides:

- **Manual override** of flight surfaces and throttle
- **Reliable RC input** with latency < 10 ms.
- **Link statistics** (RSSI, LQ, SNR) to monitor connection quality (and ensure some sort of security).

The receiver will be connected via **UART** to the embedded SoC (RV1103) and the **CRSF protocol** decoded in software to retrieve RC channels and link telemetry.

This allows the onboard computer to:
- React to manual input (pilot-in-command mode)
- Monitor the link for failsafe triggers
- Switch between manual and autonomous control modes easily

# Next Steps

- BLDC Control (ESC)
- ELRS Interface circuit
- Control surfaces servos power management
- PCB routing, especially RF
- Power supply optimization
- First test board manufacturing using JLCPCB