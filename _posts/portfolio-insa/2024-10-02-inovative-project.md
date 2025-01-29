---
layout: post
title: "Non-Intrusive Detection of Water Leaks in Pipeline Networks Using Vibration and Acoustic Sensors"
date: 2024-10-02
categories: [INSA]
image: /assets/covers/pipe.png
---


![Image](/assets/posts-images/portfolio-insa/project/render-mark-2.png)

Link to the source code repository: [GitHub Repository](https://github.com/what-a-leak)

The project promotion website is accessible here: [What-A-Leak](https://what-a-leak.github.io/)

The project report can we accessed here: [Smart Water Leak Detection in Water Networks][42]

[42]:/download/project-report.pdf

# Descriptive Part

## Overview of the project

This project is conducted as part of a multidisciplinary innovative project within the ISS curriculum. The goal is to develop a system that accurately detects water leaks in networks using a non-intrusive method. Starting from scratch, we had to conceptualize the entire project, from hardware to software, while addressing protocols and other specifications. As a result, this project effectively illustrates the various notions covered in our courses.

Initially, the idea was to develop a method to detect household water leaks. However, as we delved deeper into the project, we gradually shifted our focus from a domestic solution to a distributed approach for public water network infrastructures. This is due to the fact that public water infrastructures are significantly more subject to water losses due to undetected leaks, representing a major economic and environmental issue. On the other hand, monitoring household water leaks is a well known and already addressed problem, hence irrelevant for us.
 

## My role in the project

Our team consists of five members. With the exception of one member specializing in computer science and networking, the rest of us come from an automatic control and electronics background. At first, this might seem suboptimal for a multidisciplinary project. However, as we progressed, we realized that each team member could contribute significantly, even outside their primary area of expertise. Personally, although my academic background is in automatic control and electronics, I have led many personal projects and gained experience in various engineering fields. This experience naturally positioned me to oversee the technical aspects of the project.

My role in this project is twofold, in one hand I'm responsible for the general technical direction of the project and on the other hand, as I'm fairly comfortable with hardware electronic design, microcontroller programming, signal processing, harmonic analysis and machine learning, I take care of these aspects.

For other aspects, such as the design of the MAC Communication Protocol, the development of the web application, and the database implementation, we delegated these tasks to team members that were more competent or more willing to work on these subjects. This decision was made to optimize the global efficiency of the team and to ensure that every individual in the team had a fair share of work.


# Technical Part

## Principle

![Image](/assets/posts-images/portfolio-insa/project/principle.png)
*Image: Distributed Non-Intrusive Leak Detection Principle*

## Hardware Design

![Image](/assets/posts-images/portfolio-insa/project/architecture.png)
*Image: Hardware Architecture*



The hardware design part began with the creation of the initial sensor nodes capable of detecting both acoustic and vibrational signals. Since we designed Mark 1 very early in the project, we didn't fully understand the project's scope. To accelerate the design process, we anticipated the needs and included untested components and multiple parts for the same function. For example, we integrated two different microphone technologies (analog and MEMS) to ensure at least one would work effectively.


<table>
  <tr>
    <td><img src="/assets/posts-images/portfolio-insa/project/mark-1.png" alt="Mark 1" style="max-width: 100%; height: auto;" /></td>
    <td><img src="/assets/posts-images/portfolio-insa/project/mark-2.png" alt="Mark 2" style="max-width: 100%; height: auto;" /></td>
  </tr>
</table>
*Image: Mark 1 and 2*

The designing of the boards was very challenging, as we were running short on time we had to make very quick decision about the component choices and decided to skip to the majority of prototyping phases to directly jump to the PCB production phase. This decision paid off, and was highly rewarding: due to careful design and technical considerations the soldered PCB came fully working. *All the components* (IMU, Microphone, Microcontroller, Analog Microphone, LoRa Module) were functionning as expected. And we could imediately start working on the implementation of the features.


Once we had worked with Mark 1 for a while, we noted some technical improvements to be made and quickly started the design process for the improved Mark 2.

When designing Mark 2, we corrected the errors of Mark 1 and added needed functionalities as we became more experienced with the project. The MEMS microphone used in Mark 1 (INMP441) was deprecated, so we switched to the up-to-date ICS-43434 equivalent. We implemented new features like the RTC module for synchronization (once the communication protocol was defined), a battery monitoring circuit, and a better low dropout LDO to improve energy efficiency and meet the high standards we imposed on ourselves.


## Spectral Analysis and Signal Processing

Detecting water leaks isn't an easy task. the challenge mainly lies in the fact that leaks emit acoustic signals that blend into their surrouding spectral environment. These signals are most of the time masked by noise from surround activities like traffic from the road above or machinery. Our solution had to extract meaningful features ;or *leak spectral signatures *as we call them; from this highly chaotic and unpredictable background.

To tackle this problem we used the Fast Fourier Transform that converts raw time-domain signals into the frequency domain, where leak signatures become more distinguishable.

![Image](/assets/posts-images/portfolio-insa/project/leak-waveform.png){: .center}
*Image: Unusable Waveform Containing Highly Valuable Data*


![Image](/assets/posts-images/portfolio-insa/project/leak-signature.png)
*Image: Spectrogram Processed from the Waveform, Leak Typical Signature Highlighted*



 

We faced the issue of compressing FFT data for transmission. Raw FFT outputs are massive (2048 bytes per frame), and LoRa, our communication protocol, couldn’t handle such payloads (256 bytes per messages maximum and we didn't wanted to fragment data). The solution? A combination of data reduction and lossy compression. By focusing only on the most relevant frequency bands (typically under 22 kHz and over 1kHz) we reduced the payload size to fit within LoRa’s constraints. Was it perfect? Absolutely not (I have no background in compression and no time to learn the proper way), but it was efficient, and that’s what mattered.


## Machine Learning

Machine learning brought the magic on the table. The task was to teach a model to differentiate between “leak” and “no leak” signals. We started with supervised learning, using Support Vector Machines (SVM). We wrote Jupyter Notebooks to standardize the collect and traning process. We generated spectrograms under controlled conditions, with and without leaks, and labeled each dataset. The result? A highly accurate model (near-perfect in our tests) that could reliably classify leak signals.

But real-world conditions are far from ideal. Leak sounds can vary significantly, and noise levels are highly unpredictable. To tackle this we are currently exploring unsupervised methods such as K-Means clustering and autoencoders. These approaches assist in uncovering patterns even in previously unobserved leak scenarios. Additionally, implementing these algorithms on the edge (our nodes) presents a unique challenge: we are working to ensure they operate efficiently with the limited processing power of the ESP32-C3.

![Image](/assets/posts-images/portfolio-insa/project/svn-confusion.png)
*Image: Confusion Matrix of Early Testing of SVN Algorithm*

One unexpected but valuable finding was how machine learning complemented signal processing. The spectral features extracted during FFT was a marvellous input for the algorithms, it was like frequency analysis is made to word hand-in-hand with machine learning.

# Analytical Part

Starting projects from scratch is an experience I really appreciate, as it provides an extensive learning opportunity. The freedom to explore solutions and concepts without limitations allows for a deep understanding of the subject. This project in particular, allowed me to apply theoretical knowledge to a practical real world problem which is a really important aspect of engineering. 

Leading the technical direction of the project gave me the opportunity to sharpen my technical thinking skills but also allowed me to improve my teamwork skills; a skill I need as I tend to prefer my own company when working on projects most of the time. As explained earlier, we decided to change (for the better) the project direction along the way: switch from a home consumer oriented project to a scalable public network solution, this part was a great experience to put to the test my resilience and flexibility.

Throughout the project, I extensively learned about a myriad of various technical concepts and aspects: embedded C development, learning the esp-idf framework, advanced signal processing, machine learning, energy efficient hardware design, project planning, data sciences or 3D modelling, and this list is not even exhaustive. Each of these areas contributed to refine my understanding of the project and allowed me to master the whole technical stack. I personnally think that the depth of knowledge gained from this project is unequivalent by any other course in the curriculum. 

Despite the significant progress made, the project faced harsh time constraints that limited the implementation of advanced concepts (sensor fusion, advanced edge machine learning...). The lack of time was a major drawback as we often worked overtime but still couldn't achieve everything we would have liked. This limitation ;while being out of our scope; highlighted the importance of efficient time management and realistic goal. There were also mistakes: Early on our *(shameful)* lack of experience with plumbering led to an unexpectedly leaky prototype (ironic, we know). It was frustrating, but we immediately managed to get up and move forward, *ad astra per aspera*.


To be a bit backbitting on the organization (not so original I know), the Agile methodology, which we were imposed, while beneficial to many cases (in industry for instance) was really not suited for the nature of this project. The rigid/fixed structure of Agile (early feature descriptions etc...) did not align with the dynamic, exploratory or even research oriented nature of our work leading to necessary overhead and time wasted managing the project.

In conclusion, this project was an absolute learning experience that allowed me to develop a wide range of skills and knowledge. I never learned so many things in a project; it was truly great.

Perhaps the most satisfying part was seeing how our efforts paid. The hardware captured meaningful signals, the spectral analysis isolated leak signatures, and the machine learning algorithms converted magically all this charabia into usefull conclusions. When the first successful leak detection happened it felt like magic. But it wasn’t magic: it was engineering, perseverance, and a lot *(a lot)* of overtime work.


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

# En vrac (à ranger)

## Vérification de la FFT par application numérique

On génère un sinus à 5 kHz, on s'attend donc à avoir une amplide élevée aux alentours de cette fréquence sur le spectre d'amplitude.

![Image](/assets/posts-images/portfolio-insa/inovative-project/i-like-maths.png)
*Image: The maths are always right*