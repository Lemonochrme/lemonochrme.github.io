---
layout: post
title: "💧 Non-Intrusive Detection of Water Leaks in Pipeline Networks Using Vibration and Acoustic Sensors"
date: 2024-10-02
categories: [INSA]
image: /assets/covers/pipe.png
---

Link to the source code repository: https://github.com/what-a-leak

The project promotion website is accessible here: https://what-a-leak.github.io/

# Descriptive Part

## Overview of the project

This project is conducted as part of a multidisciplinary innovative project within the ISS curriculum. The goal is to develop a system that accurately detects water leaks in networks using a non-intrusive method. Starting from scratch, we had to conceptualize the entire project, from hardware to software, while addressing protocols and other specifications. As a result, this project effectively illustrates the various notions covered in our courses.

Initially, the idea was to develop a method to detect household water leaks. However, as we delved deeper into the project, we gradually shifted our focus from a domestic solution to a distributed approach for public water network infrastructures. This is due to the fact that public water infrastructures are significantly more subject to water losses due to undetected leaks, representing a major economic and environmental issue. On the other hand, monitoring household water leaks is a well known and already addressed problem, hence irrelevant for us.


## My role in the project

Our team consists of five members. With the exception of one member specializing in computer science and networking, the rest of us come from an automatic control and electronics background. At first, this might seem suboptimal for a multidisciplinary project. However, as we progressed, we realized that each team member could contribute significantly, even outside their primary area of expertise. Personally, although my academic background is in automatic control and electronics, I have led many personal projects and gained experience in various engineering fields. This experience naturally positioned me to oversee the technical aspects of the project.

My role in this project is twofold, in one hand I'm responsible of the general technical direction of the project and on the other hand, as I'm fairly confortable with hardware electronic design, microcontroller programming, signal processing, harmonic analysis and machine learning, I take care of these aspects.

For other aspects, such as the design of the MAC Communication Protocol, the development of the web application, and the database implementation, we delegated these tasks to team members that were more competent or more willing to work on these subjects. This decision was made to optimize the global efficiency of the team and to ensure that every individual in the team had a fair share of work.


# Technical Part

## Principle

![Image](/assets/posts-images/portfolio-insa/project/principle.png)
*Image: Distributed Non-Intrusive Leak Detection Principle*

## Hardware Design

Our hardware journey (yes, it was a journey) started with the design of sensor nodes capable of detecting both acoustic and vibrational signals. We chose high-performance components like the ICS-43434 MEMS microphone and LSM6DS3TR IMU, both known for their sensitivity and bandwidth. Sounds simple, right? Not quite.

First, integrating these components onto a compact, low-power PCB was a puzzle. We iterated through two PCB designs. The first version, MARK1, was functional but had issues with power efficiency and noise susceptibility. So, for MARK2, we swapped out components like the LDO regulator for a low-dropout version and added a real-time clock (RTC) for timestamping. We even integrated a battery monitoring system to ensure nodes wouldn’t unexpectedly fail in the field.

Then came the mechanical housing. Designing enclosures that protected the electronics while allowing precise sensor-pipeline coupling was tricky. Using SolidWorks, we modeled and 3D-printed several prototypes. Each iteration taught us something new—how to minimize vibrations, improve durability, or ensure waterproofing. (We’re pretty sure we could write a novel on trial-and-error at this point.)

![Image](/assets/posts-images/portfolio-insa/project/architecture.png)
*Image: Hardware Architecture*



## Spectral Analysis and Signal Processing

Detecting water leaks isn’t as straightforward as it sounds. The challenge lies in the fact that leaks emit acoustic signals that blend into their environment. These signals are often masked by noise from surrounding activities, such as traffic or machinery. Our solution had to extract meaningful features from this chaotic and unpredictable background.

Using Fast Fourier Transform (FFT), we converted raw time-domain signals into the frequency domain, where leak signatures (specific high-frequency patterns) became more distinguishable. However, this was far from easy. For instance, the frequency characteristics of leaks varied depending on the type of pipe—plastic pipes tend to attenuate high frequencies, while metal pipes transmit them better. To tackle this, we developed custom filtering techniques to isolate the relevant spectral features. 

We also faced the issue of compressing FFT data for transmission. Raw FFT outputs are massive (our initial test produced 2048 bytes per frame), and LoRa, our communication protocol, couldn’t handle such payloads. The solution? A combination of data reduction and lossy compression. By focusing only on the most relevant frequency bands (typically under 22 kHz) and leveraging the sparsity of the signal, we reduced the payload size to fit within LoRa’s constraints. Was it perfect? No, but it was efficient, and that’s what mattered.


## Machine Learning

Machine learning brought the magic—well, sort of. The task was to teach a model to differentiate between “leak” and “no leak” signals. We started with supervised learning, using Support Vector Machines (SVM). Collecting training data was an adventure in itself: we generated spectrograms under controlled conditions, with and without leaks, and labeled each dataset manually. The result? A highly accurate model (near-perfect in our tests) that could reliably classify leak signals.

But real-world conditions are rarely perfect. Leaks don’t always sound the same, and noise levels fluctuate wildly. To address this, we explored unsupervised approaches like K-Means clustering and autoencoders. These algorithms helped us identify patterns in unknown leak scenarios. Implementing them on edge devices (our nodes) was another hurdle—we had to ensure they ran efficiently within the constrained processing power of the ESP32.

One unexpected but valuable realization was how machine learning complemented signal processing. The spectral features extracted during FFT served as excellent inputs for the algorithms, effectively bridging the gap between raw data and actionable insights.

## Overcoming Multidisciplinary Challenges

This project wasn’t just about engineering; it was about collaboration. Our team came from diverse backgrounds, yet none of us were experts in every domain this project required. For instance, while I handled the hardware and machine learning, another teammate specialized in web development, creating an interface for users to monitor leaks remotely. The communication protocol, designed by another member, ensured seamless data transmission between nodes.

But, let’s be honest—there were moments of chaos. Early on, our lack of experience with piping led to an unexpectedly leaky prototype (ironic, we know). It was frustrating, but we pivoted. Instead of focusing solely on physical emulation, we doubled down on signal simulation and spectral analysis.

Time management was another challenge. Working within the constraints of an academic project meant balancing ambition with feasibility. To stay on track, we adopted Agile methodologies, breaking the work into sprints and assigning epics based on our strengths. This not only improved efficiency but also ensured no one felt overwhelmed (or underutilized).

Perhaps the most satisfying part was seeing how our efforts came together. The hardware captured meaningful signals, the spectral analysis isolated leak signatures, and the machine learning algorithms made sense of it all. When the first successful leak detection happened, it felt like magic. But it wasn’t magic—it was engineering, perseverance, and a lot of caffeine.


# Analytical Part

Starting projects from scratch is an experience I really appreciate, as it provides an extensive learning opportunity. The freedom to explore solutions and concepts without limitations allows for a deep understanding of the subject matter. This project in particular, allowed me to apply theoretical knowledge to a practical real world problem which is a really important aspect of engineering. 

Leading the technical direction of the project gave me the opportunity to sharpen my technical thinking skills but also allowed me to improve my teamwork skills; a skill I need as I tend to prefer my own company when working on projects most of the time. As explained earlier, we decided to change (for the better) the project direction along the way: switch from a home consumer oriented project to a scalable public network solution, this part was a great experience to put to the test my resilience and flexibility.

Throughout the project, I extensively learned about a myriad of various technical concepts and aspects: embedded C development, learning the esp-idf framework, advanced signal processing, machine learning, energy efficient hardware design, project planning, data sciences or 3D modelling, and this list is not even exhaustive. Each of these areas contributed to refine my understanding of the project and allowed me to master the whole technical stack. I personnally think that the depth of knowledge gained from this project is unequivalent by any other course in the curriculum. 

Despite the significant progress made, the project faced harsh time constraints that limited the implementation of advanced concepts (sensor fusion, advanced edge machine learning...). The lack of time was a major drawback as we often worked overtime but still couldn't achieve everything we would have liked. This limitation ;while being out of our scope; highlighted the importance of efficient time management and realistic goal

In addition, the Agile methodology, which we were imposed, while beneficial to many cases (in industry for instance) was really not suited for the nature of this project. The rigid/fixed structure of Agile (early feature descriptions etc...) did not align with the dynamic, exploratory or even research oriented nature of our work leading to necessary overhead and time wasted managing the project.

Moreover, the Agile methodology, while beneficial in many scenarios, proved to be ill-suited for our schedules and the nature of this project. The rigid structure of Agile did not align well with the dynamic and exploratory nature of our work, leading to inefficiencies. This experience underscored the need for selecting appropriate project management methodologies based on the specific context and requirements of the project.

In conclusion, this project was a profound learning experience that allowed me to develop a wide range of skills and knowledge. However, the critical takeaway is the necessity for better time management and the selection of suitable methodologies to optimize project outcomes. The challenges faced and lessons learned will undoubtedly inform my approach to future projects, ensuring more effective and efficient execution.


# Skills Matrix

| Skill | Level | Evaluation Method |
| --- | --- | --- |
| Analyse a real-life problem | 4 | report/presentation |
| Suggest a technological solution to a problem | 4 | report/presentation |
| Implement a prototype to solve the problem | 4 | prototype |
| Present and debate (in English) the technical choice made | 4 | presentation |
| Produce a report (in English) for the developed project | 4 | report |

**Levels of Application:**
1. Follow-up of instructions or procedures
2. Improvement or optimization of solutions or proposals
3. Design of programs or definitions of specifications
4. Definition of guidelines or strategies