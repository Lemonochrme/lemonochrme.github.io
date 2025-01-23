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


The technical aspects of the project required a comprehensive and multidisciplinary approach, blending hardware design, signal processing, communication protocols, and machine learning. This section describes the technical implementation, the challenges encountered during the project, and the solutions we developed to overcome them.

## Spectral Analysis and Signal Processing

The cornerstone of our system is its ability to detect specific acoustic and vibrational signatures emitted by water leaks. We used Fast Fourier Transform (FFT) to convert raw signals from the time domain into the frequency domain, enabling us to analyze the unique spectral characteristics of leaks. A major challenge was handling noisy environments, which often mask the leak frequencies. This required us to implement filtering techniques to isolate leak-relevant frequencies, such as high-frequency components typically associated with high-pressure leaks.

**Challenges and Solutions**  
One of the first challenges we encountered was the high variability of leak signatures due to differences in pipeline materials and environmental noise. To address this, we conducted an extensive analysis of various signal types, comparing their spectral signatures under controlled conditions. By focusing on the 0–22 kHz range, we reduced aliasing and noise interference, optimizing the detection pipeline. Moreover, data compression was necessary due to the limited packet size of LoRa communication. To tackle this, we developed a lossy compression technique that maintained critical leak signature data while achieving a 16:1 reduction in payload size.

## Hardware Design

Our hardware platform is built around MEMS-based sensors and an ESP32 microcontroller, chosen for its computational efficiency and low power consumption. We used the ICS-43434 MEMS microphone to capture acoustic signals and the LSM6DS3TR IMU for vibrational data. Designing a distributed sensor network that is both robust and energy-efficient was one of the most significant technical hurdles.

**Challenges and Solutions**  
The first version of the PCB (MARK1) encountered issues with power regulation and noise in sensor signals. To resolve these issues, we iteratively improved the design in the second version (MARK2) by implementing low-dropout regulators, adding battery monitoring, and upgrading to MEMS microphones with higher sensitivity. Another challenge arose in coupling sensors to the pipeline effectively. Using 3D modeling software, such as SolidWorks, we designed sensor housings to ensure direct contact with the pipe surface, thereby improving signal fidelity. Stress simulations and multiple iterations of 3D-printed prototypes helped us refine the design for durability and ease of installation.

## Machine Learning

Machine learning played a critical role in the classification of leak and non-leak signals. We implemented both supervised and unsupervised approaches, training Support Vector Machines (SVMs) on labeled datasets to achieve highly accurate leak detection. The lack of a reliable physical prototype initially hindered the collection of real-world data, so we simulated leaks using synthetic datasets to train the models.

**Challenges and Solutions**  
The primary challenge in this area was balancing the computational requirements of machine learning algorithms with the limited processing capabilities of the ESP32 microcontroller. We addressed this by designing lightweight models and leveraging edge computing to perform real-time analysis on the nodes. Furthermore, unsupervised methods, such as K-Means and auto-encoders, were explored to model unknown leak signatures, adding robustness to our system’s detection capabilities.

## Overcoming Multidisciplinary Challenges

Throughout the project, one of the overarching challenges was coordinating the various technical domains, from hardware and software to signal processing and machine learning. This required careful task delegation and collaboration within the team. For example, while I focused on the technical design and implementation, other team members managed the development of the web interface and database integration, ensuring that all components worked cohesively.

This project taught us the importance of iterative design and testing. Challenges like noisy signal environments, hardware malfunctions, and communication inefficiencies pushed us to explore innovative solutions that combined theoretical knowledge with practical implementation. Ultimately, our system achieved its goal of detecting water leaks efficiently, while laying the groundwork for future improvements in scalability and adaptability.


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