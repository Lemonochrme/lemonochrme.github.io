---
layout: post
title: Satellite RTEMS File System based on Multipartition System 
date: 2025-02-01
categories: [Personnal]
image: https://github.com/user-attachments/assets/d548796d-1f05-4e89-9b72-6fb4c76cdcb9
description: "Development of a PUS file system for satellite flight softwares based on RTEMS operating system and a time and space partitionned software architecture, as part of my CNES internship."
---

In modern space missions, data is no longer managed as a continuous stream of telemetry packets but is increasingly organized into separate files. This change is motivated by the need for operational efficiency, system autonomy, and better scalability of missions. ESA’s Packet Utilization Standard (PUS) Services 23, 24, and 25, combined with the CCSDS File Delivery Protocol (CFDP), enable this transformation by offering standardized mechanisms for onboard file management, transfer, and coordination.

During my internship at CNES (Centre National d’Études Spatiales), I’ve been tasked with the integration of `libpus`, a software library implementing ECSS PUS-C services, into a partitioned RTEMS-based flight software stack, as used in CNES's KOSMOS environment. The objective is to support command and telemetry exchanges based on files using PUS 23/24/25 in an actual onboard execution environment.

## A Brief Context: From Packets to Files

Historically, telecommands (TCs) and telemetry (TMs) were implemented as fixed or variable-length packets routed through hardware queues and software buffers. This design, while efficient for small control flows, becomes problematic for large data products (e.g., science images or onboard logs). Using files allows for more abstraction, selective retransmission (using CFDP Class 2), and compatibility with ground file systems. However, bringing file-based logic into embedded real-time software, especially under time and space partitioning (TSP), requires careful architectural adaptation.

## RTEMS, OSAL and Partition Isolation

One of the first tasks was to adapt the OSAL (Operating System Abstraction Layer) from LithOS/ARINC653 to RTEMS. Unlike LithOS, RTEMS does not support task late-binding: tasks must be created and launched explicitly. This required reimplementing key OSAL process and buffer primitives such as `OSAL__CreateProcess`, `OSAL__WriteInBuffer`, and `OSAL__ReadFromBuffer`, relying directly on RTEMS’s `rtems_task_create` and `rtems_message_queue_*` APIs.

![alt text](/assets/posts-images/personnal/cnes/arch.png)

Once they were operational, these buffers and processes were tested with independent RTEMS programs. Inter-partition communication was then verified by configuring XNG ports correctly between the sandbox (which simulates ground input) and the RTEMS partition, notably via the DQ04\_TC\_APPDK and SQ40\_TM\_APPDK queuing channels.

## libpus Integration: PUS1 as an Entry Point

The `libpus` library was extracted from its original KOSMOS-specific abstraction (APPDKPUS) and adapted to run in the simplified RTEMS partition. Initialization (`IF_LIBPUS__Initialiser`) required rewriting buffer and media configurations. I implemented a minimal environment where only a subset of services (notably PUS1 and PUS17) are active.

PUS1 acts as a telecommand dispatcher. It receives TC(17,1) packets (defined in the PUS-C standard as “normal command requests”), extracts the routing key (based on APID, service, and subservice), and forwards the request to the appropriate buffer. This key-based routing, done via a dichotomic search, required precise configuration of the routing table and associated media IDs in `pus1_configuration.h`.

## Debugging Integration

Due to the divergence between LithOS and RTEMS task models, many default assumptions of libpus failed silently. For example, task crashes were traced to stack overflows caused by misconfigured buffer depths and routing mismatches. Once isolated, the faulty media mappings were corrected by explicitly instantiating the entries for PUS1 and PUS17 only, using the correct media creation callbacks (RTEMS-specific).

At this stage, RTEMS can receive and parse a TC(17,1) command sent by the sandbox partition, route it via the libpus dispatcher, and handle it in a dedicated process. The next step is to extend this configuration to include PUS23 (file management), and to add functions for file creation, deletion, and remote copying using libpus.

## Challenges and Lessons

This integration demonstrated the inherent difficulty of porting a standard-compliant service stack (libpus) into a real-time, partitioned OS environment. Notably:

* **RTEMS lacks dynamic process scheduling mechanisms** found in ARINC653 systems, requiring explicit task management.
* **libpus is tightly coupled to a specific software architecture (APPDKPUS)** and assumes runtime services (e.g., event managers, blackboards) which are absent in RTEMS unless manually recreated.
* **XNG and message queue configurations must be precisely matched**, otherwise the partition may silently fail to receive or process commands.

Despite these issues, the architecture is now robust enough to handle real telecommands and could be extended to full file-based operations as specified by ECSS PUS-C.

## What's Next

In the next phase, the project will focus on enabling PUS23 support (e.g., subservice 23,1 for file deletion) and connecting the RTEMS partition to a file system or a CFDP endpoint, possibly running on another partition or physical node. This will enable realistic file transfer scenarios and prepare the system for end-to-end validation of onboard file-based workflows.