---
layout: post
title: Edge AI for Biome Classification
date: 2025-05-14
categories: [Personnal]
image: https://github.com/user-attachments/assets/d548796d-1f05-4e89-9b72-6fb4c76cdcb9
description: "Deploying Real-Time Biome Classification on a RV1103 : An Edge AI Pipeline under Linux."
---

The goal of this project is to classify biomes (forest, urban, water, etc.) using a camera and a small embedded computer. Why? Because I have a Luckfox Pico board with an RV1103 SoC and a CSI camera lying around, and I want to learn how to build real-time edge AI systems. Later, this could be useful as a vision module for my autonomous flying wing project.

The RV1103 is a System-on-Chip (SoC) that includes a single-core ARM Cortex-A7 processor and a built-in NPU (Neural Processing Unit) capable of 0.5 TOPS (Tera Operation per Seconds). This makes it suitable for lightweight AI inference on the edge, without needing a cloud connection. It runs Linux and supports common interfaces like CSI for camera input, making it a good low-power platform for experimentation.

In this first part, I focus on setting up a working AI pipeline: capturing frames and (try) running inference and visualizing the output.


# Setting up the environment

![Image](/assets/posts-images/personnal/edge-ai/setup.jpg)

Connected to RV1103 via SSH over USB, the camera is successfully recognized, an rkipc.ini file has been generated :

```sh
[root@luckfox root]# ls /userdata/
ethaddr.txt  image.bmp    rkipc.ini    video0       video1       video2
```

The `rkipc.ini` file is the main configuration file used by the Rockchip IP Camera (RKIPC) service running on the SoC. It controls how video, audio, ISP (Image Signal Processor), and encoding pipelines are initialized. It includes settings for video resolution, frame rate, encoding format (e.g, H.265), image enhancement, exposure, and more. The parameters are used to configure the hardware and drivers at boot time or when the camera service starts. 

Modifying this file allows for tune the system for our specific use case for example maybe reducing resolution to increase inference speed.


We can check that the camera is working via  network video stream : 

![alt text](/assets/posts-images/personnal/edge-ai/network-camera-view.png)