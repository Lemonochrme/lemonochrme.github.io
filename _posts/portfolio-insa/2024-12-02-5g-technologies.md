---
layout: post
title: 5G Technologies
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Descriptive Part

The 5G technologies course was more of an exporatory course rather than a pure technical course. The goal was to discovery 5G and mobile.

# Technical Part

We were asked to research, prepare and present a subject related to mobile communication in a concise but complete way. I've choosen to on 5G modulation techniques because in all the proposed sunjects I tought it was the most interesting of all in a pure technical way.

### **Introduction to Modulation in 5G**
Modulation in 5G plays a crucial role in transmitting information efficiently over carrier signals while optimizing factors such as range, robustness, and spectral usage. Unlike previous generations, 5G employs advanced modulation and multiplexing techniques to achieve higher throughput and lower latency.



### **Orthogonal Frequency Division Multiplexing (OFDM)**
**OFDM** is an evolution of Frequency Division Multiplexing (FDM) and is the backbone of 5G communication. It allows multiple data transmissions within the same bandwidth by splitting the signal into numerous subcarriers, each carrying data independently. 

![Image](/assets/posts-images/portfolio-insa/5g/856eb867-d2b0-48a0-85dd-a74acea87983.png)


- **Key Advantages**:
  - **High Spectral Efficiency**: Overlapping subcarriers use spectrum more effectively without interference.
  - **Multipath Handling**: Subcarriers remain orthogonal, ensuring no interference even in multipath propagation environments.
  - **Cyclic Prefix (CP)**: Absorbs delays caused by reflections, avoiding overlap of delayed signals with actual data.

- **5G-Specific Enhancements**:
  - Flexible subcarrier spacing ranging from 15 kHz to 240 kHz.
  - Support for Discrete Fourier Transform-Spread OFDM (DFT-s-OFDM) in uplink scenarios to reduce power consumption, especially for mobile devices.


### **Quadrature Amplitude Modulation (QAM)**

![Image](/assets/posts-images/portfolio-insa/5g/01e4b972-c2a3-4770-8a05-4081fbc21439.png)

In 5G, **QAM** is the modulation technique applied to each OFDM subcarrier. It combines amplitude and phase modulation to increase the data rate. Higher-order QAM, such as 256-QAM and 1024-QAM, is used to encode more bits per symbol, improving throughput but requiring higher Signal-to-Noise Ratios (SNR).

![Image](/assets/posts-images/portfolio-insa/5g/ff255561-dbdb-4a80-ba53-e83b4107b8d5.png)

- **QAM Tradeoffs**:
  - **High Data Rates**: Higher QAM orders allow more bits per transmission but demand greater SNR.
  - **Range vs. Efficiency**: Higher-order QAM is suitable for short-range, high-SNR conditions, such as dense urban environments.
  - Example: 1024-QAM can achieve exceptional data rates but is more sensitive to interference and limited in range compared to 16-QAM.


### **Modulation Tradeoffs in 5G**
5G improves upon 4G modulation techniques in the following ways:
- **Higher Spectral Efficiency**: By using up to 1024-QAM and broader channel bandwidths (up to 400 MHz in mmWave).
- **Reduced Latency**: Enhanced OFDM designs achieve sub-millisecond latency, critical for ultra-reliable low-latency applications.
- **Massive MIMO and Beamforming**: These technologies amplify the benefits of modulation by improving signal quality and capacity.

### **Challenges in 5G Modulation**
While 5G modulation techniques provide significant benefits, they also introduce challenges:
1. **Shorter Range**: High-frequency bands (e.g., mmWave) used for 5G have limited propagation.
2. **Interference Sensitivity**: High-order QAM requires precision hardware to mitigate noise and interference.
3. **Energy Efficiency**: Advanced techniques like DFT-s-OFDM help balance power consumption for devices like smartphones.



# Analytical Part



The 5G technologies course was an interesting experience because it gave us a lot of freedom in how we approached our work. We could choose the subject we wanted to research and present, which allowed me to focus on 5G modulation techniques, a topic I found fascinating. This freedom made the course engaging and allowed me to explore areas of mobile communication that aligned with my technical interests.

However, the course had some limitations. While it was a good introduction to 5G, the range of technical subjects available for research felt narrow. Most of the topics provided were either too broad or lacked the depth needed for someone looking for a more technical understanding of 5G. For example, while OFDM and QAM were interesting to study, other advanced 5G topics, such as network slicing or energy efficiency strategies in mmWave communication, were not included in the scope of the course.

Another limitation was the brief and limited focus on future technologies like 6G. Some groups presented on this topic, but the available information was scarce, and the discussions lacked depth. This was understandable given that 6G is still in early research stages, but it felt like a missed opportunity to explore 5G and existing (well documented technologies) more in depth.

Overall, the course provided a good introduction to 5G and mobile technologies and allowed me to focus on a subject I was passionate about. Still, it could have benefited from a wider range of technical topics.

| **Skill**                                                                                 | **Required Level** | **Self Evaluation** | **Skill Relevance** | **Main Skill Acquisition Method**    |
|-------------------------------------------------------------------------------------------|---------------------|----------------------|----------------------|---------------------------------------|
| Understand the principles of modulation in mobile communications (OFDM, QAM)             | 4                   | 4                    | Core                 | Lectures, Assignments                |
| Be able to explain the advantages of OFDM in managing multipath propagation               | 4                   | 4                    | Core                 | Assignments, Presentations           |
| Understand the trade-offs between QAM orders (e.g., 16-QAM, 256-QAM, 1024-QAM)            | 4                   | 4                    | Core                 | Assignments                          |
| Analyze the impact of subcarrier spacing on spectral efficiency and latency               | 3                   | 3                    | Extension            | Research, Presentations              |
| Evaluate the limitations and challenges of using mmWave bands in 5G                      | 4                   | 4                    | Core                 | Lectures, Assignments                |
| Understand the role of cyclic prefix (CP) in mitigating inter-symbol interference         | 4                   | 4                    | Core                 | Lectures, Research                   |
| Compare 5G modulation technologies with those used in 4G                                  | 3                   | 3                    | Extension            | Research, Assignments                |
| Identify the advantages of Discrete Fourier Transform-Spread OFDM (DFT-s-OFDM)           | 3                   | 3                    | Core                 | Assignments, Practical Exercises     |
| Understand the role of Massive MIMO and beamforming in enhancing 5G performance          | 4                   | 4                    | Core                 | Lectures, Assignments                |
| Assess the impact of high-order QAM on signal-to-noise ratio (SNR) requirements           | 4                   | 4                    | Core                 | Assignments, Research                |
| Be able to evaluate spectral efficiency and energy trade-offs in 5G modulation schemes    | 4                   | 3                    | Extension            | Assignments, Presentations           |
| Understand the impact of 5G latency optimizations for ultra-reliable low-latency applications (URLLC) | 3                   | 3                    | Extension            | Assignments, Discussions             |

*Table: Skills summary for the 5G Modulation Techniques Course*
