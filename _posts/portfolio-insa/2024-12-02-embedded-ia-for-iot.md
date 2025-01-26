---
layout: post
title: Embedded IA for IoT
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Descriptive Part

The goal of this course was to gain solid foundations in machine learning and IA in general. The objectives included:
- understanding of the characteristics of supervised and unsupervised learning problems, as well as the basic methods and algorithms used to address them. 
- AI at the edge and the optimization techniques required to embed AI algorithms effectively. 
- Use Python libraries to solve real-world problems (with IoT data).

# Technical Part

## Introduction

Machine learning is a subset of the vast and electric world of Artificial Intelligence. It focuses on the development of algorithms that can learn from and make predictions on data.

Machine Learning *for IoT* focuses on creating models that can operate efficiently on devices with limited resources, such as microcontrollers, to process and analyze data locally (on the edge).

> Artificial Intelligence > Machine Learning > Deep Learning

Resource Constraints in Edge AI

- Very low processing power and memory.
- Use of Digital Signal Processors (DSP) or Neural Processing Units (NPU) to optimize performance and efficiency.
- Limited energy availability, necessitating energy-efficient algorithms and hardware.
- Real-time processing requirements, demanding low-latency solutions.

## Machine Learning Basics

## Support Vector Machine (SVM) Explained



## Machine Learning for the Inovative Project

From [MIT Course](https://web.mit.edu/6.034/wwwbob/svm-notes-long-08.pdf)



#### Project Context and Relevance of Machine Learning
The project addresses the pressing issue of water leaks in distribution networks, a problem that leads to significant water loss, estimated at 20% of the total volume transported in France. Traditional detection methods—such as manual inspections or acoustic sensors—are limited by their cost, intrusiveness, and scalability. Machine learning provides an innovative alternative by analyzing acoustic and vibrational data to detect patterns associated with leaks. These algorithms can classify signals in real time, enabling an efficient, non-invasive, and highly scalable solution.


#### Current Approach: Supervised Learning with Support Vector Machines (SVMs)
To establish a robust framework for detecting leaks, we implemented a supervised learning approach using Support Vector Machines (SVMs). This method is well-suited for binary classification problems, where the task is to distinguish between two classes: "leak" and "no leak."

The data collection process was fundamental to this approach. Using high-performance MEMS sensors, we recorded acoustic signals emitted by the water pipes under controlled conditions. These signals were then transformed into spectrograms, which provide a detailed time-frequency representation of the sound. Spectrograms reveal unique frequency patterns that correspond to leaks, often characterized by high-frequency components and consistent spectral signatures. The features extracted from these spectrograms formed the basis of the dataset used to train the SVM.

An SVM operates by mapping the data into a higher-dimensional space where it becomes linearly separable. This is achieved using kernel functions, which transform the input features into a new space. In our case, we employed a linear kernel due to its efficiency and interpretability for smaller datasets. The SVM then identifies the hyperplane that maximizes the margin between the two classes, ensuring that the model generalizes well to unseen data.

The training process involved feeding the SVM with labeled spectrogram data. Each spectrogram was tagged as either "leak" or "no leak," creating a supervised dataset. The model was optimized to minimize classification errors, achieving an excellent balance between precision and recall. The resulting model demonstrated the ability to accurately classify test samples, even under varying conditions, by focusing on critical spectral features such as peak amplitudes and harmonic patterns.

To ensure reliability, we tested the model on a separate validation set. The results were highly promising, with the SVM achieving near-perfect performance on the controlled dataset. However, we recognize the limitations of these initial tests, as real-world environments introduce challenges such as background noise and variable pipeline materials. To address this, we plan to incorporate additional training data that reflects real-world conditions, allowing the SVM to adapt and maintain its accuracy in noisy and diverse settings.

One key advantage of SVMs in this application is their robustness to overfitting, even with relatively small datasets. By focusing on the optimal decision boundary, the model avoids learning noise or irrelevant details, which is critical in practical scenarios where the data may not always align perfectly with ideal conditions.

Despite its strengths, the SVM approach has inherent constraints. It requires labeled data for training, which can be costly and time-consuming to collect. Moreover, while SVMs perform well in binary classification, they may struggle with more complex or ambiguous scenarios, such as distinguishing between subtle leak signatures and non-leak anomalies. These limitations motivate the transition to unsupervised learning methods.


#### Future Direction: Unsupervised Learning with Autoencoders
To overcome the challenges of supervised learning, we plan to implement unsupervised techniques, particularly autoencoders, which can detect anomalies without the need for labeled data. Autoencoders will be trained to reconstruct normal acoustic patterns. When the system encounters a signal that deviates significantly from this baseline—such as the high-frequency noise of a leak—it will flag the event as anomalous.

This approach offers several advantages. First, it eliminates the dependence on labeled training data, making it easier to scale across different environments and pipe materials. Second, autoencoders are highly adaptable, capable of detecting novel anomalies that may not have been present in the initial training dataset. Finally, their lightweight computational requirements make them ideal for deployment on edge devices, enabling real-time leak detection directly on sensor nodes.

By combining the precision of SVMs with the flexibility of autoencoders, the project aims to build a robust, scalable, and efficient solution for water leak detection. This hybrid approach ensures accurate classification while maintaining adaptability to real-world challenges, paving the way for a more sustainable water management infrastructure.

# Analytical Part