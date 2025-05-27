---
layout: post
title: Space Data Overview
date: 2025-05-18
categories: [Personnal]
image: https://github.com/user-attachments/assets/d548796d-1f05-4e89-9b72-6fb4c76cdcb9
description: "Overview of space data, how to capture it, process it and value it."
---

> Work in progress, this post is currently being written and will be completed soon.

I assisted to the CNES “Data from Space” training that provided a comprehensive overview of Earth observation and mission data from how to capture the data to how to store the datasets on earth passing by all the processing and more. I took a lot of written notes during this training and the following is a structured and enhanced report based on my notes.

## Satellite Orbits and Sensor Types

### Orbital Regimes

<div style="overflow:hidden; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e0e0e0;">
    <embed src="{{ site.baseurl }}/simulations/orbits.html" width="100%" height="400px" style="border-radius:16px;"/>
</div>


>LEO: 200-2000 km altitude 90 min orbit
>MEO: 5000-20000 km altitude 12 hr orbit
>GEO: 35786 km altitude 24 hr orbit

Satellites are placed in different orbits depending on mission needs. The three primary orbit categories are:

* **Low Earth Orbit (LEO)**:

  * Typically ranges from \~200 km up to 2000 km altitude.
  * Many Earth observation satellites operate here, often in polar sun-synchronous orbits, allowing global coverage and consistent local solar lighting conditions.
  * At \~7.8 km/s, LEO satellites orbit Earth in approximately 90 minutes, providing high revisit frequency.

* **Medium Earth Orbit (MEO)**:

  * Spans approximately 5,000–20,000 km altitude.
  * Commonly used by navigation constellations like GPS and Europe’s Galileo.

* **Geostationary Orbit (GEO)**:

  * Lies at approximately 35,786 km altitude, where satellites orbit in Earth’s equatorial plane with a 24-hour period, effectively "hovering" over a fixed ground spot.
  * Ideal for communications and continuous weather monitoring.
  * Three GEO satellites can provide near-global coverage at low latitudes.

Each orbit type balances coverage, resolution, and revisit:

* **LEO**: Offers high spatial detail and global reach (with multiple satellites).
* **GEO**: Offers constant vigilance over one area, though at coarser resolution due to distance.

### Active vs. Passive Sensors

Satellite sensors generally fall into two categories:

* **Passive Sensors**:

  * Detect natural energy (like sunlight reflected off Earth or thermal emission) without emitting signals.
  * **Optical imagers** (e.g., RGB or multispectral cameras) rely on reflected sunlight, working only in daylight (visible bands) and impeded by clouds.
  * Example: Copernicus *Sentinel-2* satellites with multispectral cameras measuring reflected sunlight in 13 bands for mapping land cover and vegetation health.
  * **Thermal infrared sensors** detect emitted heat, useful for urban heat island mapping or wildfire monitoring at night.

* **Active Sensors**:

  * Emit energy and measure return signals.
  * Examples include radar and LiDAR instruments:

    * **Radar** (active microwave sensor): sends radio pulses and records backscatter, enabling imaging regardless of daylight or weather conditions. *Sentinel-1* with Synthetic Aperture Radar (SAR) exemplifies this, capturing high-resolution images day or night, even through clouds.
    * **LiDAR** (laser altimetry): emits laser pulses and measures reflections, often used for high-precision elevation mapping (e.g., NASA’s ICESat for ice sheet altimetry).

Active sensors are invaluable for penetrating cloud cover or darkness—for example, radar imaging can observe flooded areas during storms, and LiDAR can map forest structure by probing between leaves.

### Common Orbit-Sensor Pairings

Many Earth observation missions strategically pair sensor types with suitable orbits:

* **Sun-synchronous LEO**:

  * Ideal for passive optical sensors to ensure consistent lighting conditions.
  * Examples include French **Pléiades** and **SPOT** satellites, and ESA’s *Sentinel-2*.

* **Polar orbits**:

  * Used by active radar missions for global coverage (e.g., *Sentinel-1* SAR).

* **Geostationary orbits**:

  * Commonly used for weather satellites, continuously observing cloud movements (e.g., Meteosat, GOES).

* **Medium Earth Orbit (MEO)**:

  * Typically employed by navigation satellites (GPS, Galileo) to provide wide coverage with fewer satellites.

* **Specialized orbits**:

  * Used by astrophysics missions for stable observation environments (e.g., the **Gaia** space telescope orbiting the Sun-Earth L2 Lagrange point).

Each mission’s orbit is carefully selected to maximize sensor effectiveness and achieve mission objectives within physical and coverage constraints.


