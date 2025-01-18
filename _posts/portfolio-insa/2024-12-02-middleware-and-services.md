---
layout: post
title: 🌐 Middleware and Services
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Descriptive Part

This "Grand Domaine" was separated into four different courses: Service Oriented Architecture, Middleware, Software Engineering and Cloud and Edge Computing. 

- For SOA, the goal was to get an introduction to service-oriented web development through an online course and two lab projects where we had to use the concepts learned along the way. 

- For Middleware, the format was a bit different. While the course was also online, the practical work was much more guided and took the form of standard "Travaux Pratiques" where we experienced the different concepts: oneM2M, MQTT, ACME or node-red.

- For Cloud and Edge Computing the goal was to understand the basics of cloud infrastructure and operation. The course was focused on Open Stack and Virtualization.

- The Software Engineering part was done through the course of the innovative project where we adopted a Agile methodology and the Service Oriented Architecture project labs where we had to implement a CI/CD pipeline for the application we where developping.

# Technical Part

## Service Architecture

Report on the first project detailing technical choices and presenting results: [Lab Report: Volunteering Application][1]

[1]:/download/devops-report.pdf

## Software Engineering

I wrote an entire report on Software Engineering with a focus on DevOps, available here: [Automation and DevOps in the Space Industry: Focus on GitLab-CI][1]

[1]:/download/devops-report.pdf

### Problem Statement

![Image](/assets/posts-images/portfolio-insa/middleware-service/problematique.png)


### Solution: Continous Integration

![Image](/assets/posts-images/portfolio-insa/middleware-service/solution.png)

### GitLab-CI Philosophy

The following principles are the same on all CI platforms. In the Service Architecture lab we used GitHub Actions.

![Image](/assets/posts-images/portfolio-insa/middleware-service/gitlab-ci-philosophy.png)

### Configuration as code: .gitlab-ci.yml

![Image](/assets/posts-images/portfolio-insa/middleware-service/gitlabci-yml.png)

## Nota Bene

This portfolio uses a Continuous Integration and Continuous Deployment (CI/CD) approach. In fact everytime I edit and push modifications, a GitHub Actions script is executed to automatically deploy the application online.

![alt text](/assets/posts-images/portfolio-insa/middleware-service/github-actions.png)


## Middleware

### Understanding MQTT


#### MQTT basics

![alt text](/assets/posts-images/portfolio-insa/middleware-service/middleware/mqtt-architecture.png)

MQTT (Message Queuing Telemetry Transport) is a communication protocol specifically designed to connect devices in an IoT system. MQTT uses a straightforward publish/subscribe architecture.

For example, a temperature sensor sends its data to an MQTT broker to be published under a temperature topic. End users (other devices) can then subscribe to this specific topic and receive the temperature data. 

MQTT is built on top of the TCP/IP layer ensuring reliable data delivery (from TCP Ack/Nack) while using minimal bandwidth: ideal for constrained IoT systems. In addition, communications are secured using the SSL/TLS standard.

In a nutshell MQTT is perfect for smart home or industrial monitoring applications.

#### Why use MQTT ?

MQTT is widely adopted in IoT because of its lightweightness, reliability and flexibility.

In the MQTT labs we experimented with MQTT on a ESP8266, the goal was to simulate a smart home:
- A button publishes a message when pressed (home/light/button)
- A light sensor publishes brightness levels (home/light/luminosity)
- A system subscribes to these topics and decides when to turn lights on or off (home/light/command)


## Cloud and Edge Computing




# Analytical Part