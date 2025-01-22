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

Prior to this course, I had no background in Service Architecture or understanding of what it means. The main concepts like services and microservices were relatively easy to grasp, but the most challenging part of this course was using the Java in the different practical lab we followed.


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

### What is Cloud Computing?

In a nutshell, cloud computing delivers various services over the Internet: storage, processing power, applications... Instead of owning and maintaining physical servers, data centers etc. users can access all these ressources on demand from services providers.

It can provide the following advantages:
- **Scalability**: Easily scale resources up or down based on demand.
- **Cost Efficiency**: Pay only for the resources you use.
- **Accessibility**: Access services from anywhere with an internet connection.
- **Maintenance**: The cloud provider handles maintenance.

We can categorize Cloud Computing into three main models:
1. **Infrastructure as a Service (IaaS)**: Provides virtualized computing resources over the internet (AWS, Microsoft Azure)
2. **Platform as a Service (PaaS)**: Offers hardware and software tools over the internet. (Google App Engine)
3. **Software as a Service (SaaS)**: Delivers software applications over the internet on a subscription basis (Google Workspace)

![alt text](/assets/posts-images/portfolio-insa/middleware-service/cloud/models.png)
*Image: Cloud Computing Models (Credit: [RedHat](https://www.redhat.com/rhdc/managed-files/iaas-paas-saas-diagram3-1638x1046.png))*


Cloud Computing heavily relies on virtualization. In the following parts we will explore the differences between virtual machines and containers and compare various container types.

### Differences between virtual machines and containers

![alt text](/assets/posts-images/portfolio-insa/middleware-service/cloud/vm-ct.png)

The main difference between virtual machines and containers lies in their architecture and resource utilization.
- On the left a type 2 Hypervisor is used to create and manage multiple Virtual Machines on a host operating system (hence type 2, type 1: bare-metal hypervisor). Each VMs operate indepoendently with its own guest operating system and applications. Qemu or VVirtual Box are Type 2 hypervisors.

- On the right, containers are used instead of VMs. Containers share the host OS kernel but run isolated environments with their own libraries and dependencies. This makes containers lightweight and efficient, as they do not require a separate OS for each instance. Containers are ideal for deploying applications consistently across different environments while using fewer resources compared to VMs.

Difference Between Type 1 and Type 2 hypervisors
- **Type 1 Hypervisors:** Directly operate on hardware (E.g., KVM).
- **Type 2 Hypervisors:** Operate as software on existing OS (E.g., VirtualBox).


### Comparison of Container Types

| Container Provider | Application Isolation and Resources | Containerization Level | Tooling |
| --- | --- | --- | --- |
| **Docker** | Application Container. Strong isolation with cgroups and namespaces. Granular resource limits. Less ideal for multi-tenancy in shared environments. | Application-level containerization | Lot of ways to deal with Docker: Docker CLI, Docker API, Docker Compose. Strong CI/CD integration, widely used. Rootful. |
| **Podman** | Strong isolation (like Docker). Better for multi-tenancy with rootless containers (doesn’t require daemon). Supports cgroups and namespaces. | Application-level containerization | Docker-compatible CLI. No daemon, rootless mode |
| **LXC/LXD** | OS-level isolation (System Container). Suitable for multi-tenancy (offers good resource segregation). | OS-level containerization (lightweight VMs) | REST API. Not as integrated with CI/CD pipelines as Docker and Podman. |
| **Rocket (rkt)** | Strong security (isolates containers with systemd-nspawn) | Application-level containerization | API support, systemd integration |
| **OpenVZ** | Excellent for multi-tenancy (up to 20 customer networks). Provides strong isolation and resource management with low overhead. Shares a single kernel but offers isolated user spaces. | OS-level containerization (containerized VMs) | Lacks Docker-like API or CI/CD integration but is useful in web hosting environments. Integrated with Proxmox for UI. |
| **containerd** | Strong isolation. | Application-level containerization | API-driven, integrates well with Kubernetes. |
| **systemd-nspawn** | Light-weight namespace container. Offers good isolation using systemd. Suitable for trusted multi-tenancy. Can isolate resources but heavy configuration. | OS-level containerization (lightweight VMs) | Integrated with systemd, provides simple container management but lacks CI/CD capabilities. |

### Open Stack




### What is Edge Computing?

https://www.redhat.com/en/products/edge/hatville


Whereas cloud computing processes data in a centralized manner (data centers) edge computing allows computation and data storage closer to the location where it is needed (hence edge) avoiding unnecessary communications and improving response time. If it can be done on site why can we do it ?

![Edge Computing](/assets/posts-images/portfolio-insa/middleware-service/cloud/edge.png)
*Image: Edge Computing Architecture ([Credit](https://innovationatwork.ieee.org/real-life-edge-computing-use-cases/))*

Edge Computing compared to Cloud Computing:
- **Latency**: Edge Computing reduces latency by processing data locally.
- **Bandwidth**: Saves bandwidth.
- **Reliability**: Reducing dependency on central servers.
- **Security**: We keep sensitive data on site.

### Kubernetes

In the practical lab we experimented with Edge Computing with the help of Kubernetes (or k8s). K8S is an open source orchestration tool that automates the deployment/scaling/management of containerized applications. 


# Analytical Part

## Cloud and Edge Computing

I was already familiar with virtualization and hypervisor as I already worked with theses technologies. At CNES we extensively use Docker to deploy CI pipelines.

I worked a lot with hypervisors and particularly bare-metal hypervisors at FentISS (I did my abroad experience here in Valencia, Spain) where I worked with [](XtratuM): a space qualified bare-metal hypervisor.

On the other hand I was not particularly familiar with the Cloud/Open Stack part. This was a enriching experience but the last lab on Kubernetes was too short to be completed, I would have liked to learn more on K8S because a theses led at CNES is specifically oriented on this subject. The goal is to achieve decentralized computing on satelites networks using KLubernetes as a base line.

# Skills Matrix

| Skill Area | Level | Evaluation Method |
| --- | --- | --- |
| **Service Oriented Architecture** | AE | Evaluation method |
| Know how to define a Service Oriented Architecture | 4 | Project |
| Deploy an SOA with web services | 4 | Project |
| Deploy and configure an SOA using SOAP | 4 | Project |
| Deploy and configure an SOA using REST | 4 | Project |
| Integrate a process manager in an SOA | 4 | Project |
| **Middleware for the Internet of Things** | AE | Evaluation method |
| Know how to situate the main standards for the Internet of Things | 4 | TP Report |
| Deploy an architecture compliant to an IoT standard and implement a sensor network | 4 | TP Report |
| Deploy and configure an IoT architecture using OM2M | 4 | TP Report |
| Interact with the different resources of the architecture using REST services | 4 | TP Report |
| Integrate a new technology into the deployed architecture | 4 | TP Report |
| **Adaptability: Cloud Computing** | AE | Evaluation method |
| Understand the concept of cloud computing | 3 | TP Report |
| Use an IaaS-type cloud service | 3 | TP Report |
| Deploy and adapt a cloud-based platform for IoT | 3 | TP Report |

### Levels of Application
1. Follow-up of instructions or procedures
2. Improvement or optimization of solutions or proposals
3. Design of programs or definitions of specifications
4. Definition of guidelines or strategies
