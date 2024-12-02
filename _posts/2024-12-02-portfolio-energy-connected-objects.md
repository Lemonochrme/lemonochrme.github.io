---
layout: post
title: Energy for Connected Objects
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---


https://moodle.insa-toulouse.fr/course/view.php?id=979


## Introduction

The idea of sending power wirelessly dates back to Nikola Tesla and his invention of the Tesla coil. Tesla aimed to power devices over long distances using electromagnetic fields. In 1901, New York started building the Wardenclyffe Tower to distribute power wirelessly, but the project was halted in 1904 due to high costs.

During WWII, radio communications improved significantly for military use, leading to advancements in data transmission over electromagnetic waves. This era also saw the creation of the magnetron, which later paved the way for the discovery of microwaves, a technology that causes water molecules to vibrate when exposed to a 2.4 GHz wave, creating heat.

In 2024, we live in a world surrounded by wireless signals like Wi-Fi, Bluetooth, and radio waves, which contain not just data but also energy that could theoretically be harvested.

A strong need for wireless power became apparent in 2014 when the Philae robot landed on a shadowed asteroid and couldn't recharge due to its solar dependency. Today, wireless power could help deliver energy to areas impacted by natural disasters or other energy disruptions. This project explores using Wi-Fi or other frequencies to power an LED wirelessly.

## System Modeling

To understand the system requirements, we referred to several components:

- **BQ25504**: Ultra Low-Power Boost Converter ([datasheet link](https://www.ti.com/lit/ds/symlink/bq25504.pdf))
- **TPS6303x**: Buck-Boost Converter ([datasheet link](https://www.ti.com/lit/ds/symlink/tps63030.pdf))
- **SML-D12x1**: LED ([datasheet link](https://www.tme.eu/Document/932347758f1894d9ef5e9a8053d7c609/SML-D12Y1WT86.pdf))

### LED Power Requirements

From the LED’s datasheet, we determined that:

| Luminous Intensity | Current | Power  |
|--------------------|---------|--------|
| 25%                | 5 mA    | 9.5 mW |
| 50%                | 10 mA   | 20 mW  |
| 100%               | 20 mA   | 44 mW  |

Thus, the LED requires about 44 mJ for full brightness, 20 mJ for 50%, and 9.5 mJ for 25%. For comparison, a microcontroller like the STM32C011x4/x6 consumes less than the LED, indicating that this wireless power system could support even more complex devices.

### Capacitors for Energy Storage

Since consistent wireless power might not be guaranteed, energy storage is essential. We used a supercapacitor as the storage medium in combination with a Power Management Unit (PMU) and a DC-DC converter.

Based on capacitor specifications, we estimated losses and chose a capacitor of 6.8 mF, which offers a balance between low loss and sufficient energy storage.

## Frequency Selection

We considered two frequency options: 2.45 GHz and 868 MHz. Lower frequencies, like 868 MHz, offer better propagation, which generally makes them more effective for wireless power transmission. We enhanced the signals with specialized antennas (a patch for 868 MHz and a horn for 2.45 GHz), which help focus the energy in a specific direction for increased efficiency.

## Application in Leak Detection

Our project involves a water pipe leak detection system, where energy could be harvested from sources like water flow or temperature differences in the pipes. These alternative energy sources could power the wireless system effectively, eliminating the need for an external power supply.

## Testing the System

We used **GNURadio** software with an **Analog Discovery 2** to test our system’s output and adjust power and frequency settings. We found that frequencies between 720 MHz and 920 MHz yielded the best results, as shown in the graph below.

We also compared our results with other setups in the class, which demonstrated varied power outputs depending on the receiver frequencies.

The setup was able to light the LED from distances of up to 1 meter.

## Conclusion

In this project, we explored various ways to transmit power wirelessly, utilizing signals like Wi-Fi and LoRa to power small devices. However, a significant limitation remains: Wi-Fi and similar signals typically don't deliver enough power for sustained operation. While this is a promising concept, for now, direct connections or nearby energy harvesting sources may be more effective.

Future advancements in wireless technology might make wireless power more practical for a wide range of applications.

---

## References

1. [Tesla Science Center on Wardenclyffe Tower](https://teslasciencecenter.org/history/tower/)
2. [Wireless Power Transmission from Space to Earth](https://www.independent.co.uk/space/space-earth-wireless-power-beamed-b2353588.html)
3. [BBC News on Rosetta Mission](https://www.bbc.com/news/science-environment-30034060)
4. [BQ25504 Ultra Low-Power Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/bq25504.pdf)
5. [TPS6303x Buck-Boost Converter Datasheet](https://www.ti.com/lit/ds/symlink/tps63030.pdf)
6. [SML-D12x1 LED Datasheet](https://www.tme.eu/Document/932347758f1894d9ef5e9a8053d7c609/SML-D12Y1WT86.pdf)
7. [STM32C011x4/x6 Documentation](https://www.st.com/en/microcontrollers-microprocessors/stm32c011j4.html?icmp=tt40742_gl_lnkon_sep2024#sample-buy)