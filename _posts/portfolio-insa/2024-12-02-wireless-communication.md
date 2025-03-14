---
layout: post
title: Wireless Communication
date: 2024-11-18
categories: [INSA]
image: https://plus.unsplash.com/premium_photo-1675024346167-e5fd43181f16?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
description: "An in-depth exploration of wireless communication protocols and emerging network technologies for IoT applications."
---

# Descriptive Part

## Communication Protocols for LP-WPAN

Goals:
- Explain the specificities of a wireless communication channel and assess the impact of these specificities on the protocol stack of a wireless communication system (particularly the upper layers).
- Acquire knowledge of the protocols used in short-range, multi-hop wireless IoT networks, particularly the architecture promoted by the IETF for IoT (IPv6, 6LoWPAN, RPL, etc.).

## Emerging Networks (Software Defined Networks)

Goal:
- Assess the general benefits and main limitations of adopting SDN (and network softwarization) in an IoT application.
- Understand, design, set-up and operate a basic/academic SDN based IoT Network.

# Technical Part

## Communication Protocols for LP-WAN

### IoT network characteristics and specificities

IoT networks and particularly LP-WANs (Low-Power Wireless Personal Area Networks) have specific characteristics and constraints that make them very different from standard computer networks.

From an energy efficiency point of view, IoT devices are most of the time battery-powered and absolutely need to conserve energy. Because changing a battery is expensive both in time and cost, the lifetime of IoT system on self suffient power source can range from one month to a year base the specific application. Duty cycles and efficient power management is then essential to minimize energy consumption.

Because of energy efficiency and other parameters like Physical Layer limitation (LoRa for instance limits its packets size to 256 bytes), IoT networks typically transmit very small amounts of data. In the case of LP-WAN: 20 to 250kbps. 

We can define Internet as generally distance agnostic, so much that we don't think much about distance in conventional networks. However, this is absolutely not the case with IoT networks because of Physical Layer limitation. These networks generally have short (few meters) to medium (E.g. few kilometers with LoRa) range when talking node to node (or one hop) communication. Multi-hop or mesh topologies can greatly extend this range. Still because of the reliance on rf communication of the Physical Layer, communications in IoT networks are easily subject to interferences from various sources like other devices using the same channel or environmental channel like signal attenuation/reflection. This results in an unpredictable and variable communication link quality. Moreover, in contrary to Internet and other common static networks, IoT networks can be extensively mobile and require specific mechanism to manage node movement and dynamic topology reshaping.

The essence of IoT networks is to connect a large number of devices, this require efficient mechanisms to manage the important traffic generated by the network. For example, in a mesh IoT network, each nodes role may be threefold: send, receiver and route packets.

The application being deployed on the IoT network directly influence its capabilities. For example some IoT applications may demand very low latency while other may require reliability. Most of application require some soft of security protocols in order to provide confidentiality, integrity and/or authentication while being very low in overhead due to limited ressources.

Due to IoT networks being generally scaled, individual IoT devices need to be low-cost.


IEEE 802.15.4 for LR WPAN (Low Rate Wireless Personal Area Network) limit packet sizes to optimize energy efficiency and minimize complexity at the cost of requiring fragmentation for larger data structure. 

Like explained earlier, IoT networks can take a variety of topology forms depending on the specific application. For example mesh, star and tree topologies are very common.

![Image](/assets/posts-images/portfolio-insa/wireless-communication/topologies.png)
*Image: Common Topologies in IoT Networks [Source](https://wizzdev.com/blog/overview-of-iot-network-topologies/)*


### Rationale for adopting an IPv6 based architecture to support the communications of an IoT system or use case

IPv4 address space: $4,294,967,296$ uniquely identified devices.

IPv6 address space: $340,282,366,920,938,463,463,374,607,431,768,211,456$ uniquely identified devices.

![Image](/assets/posts-images/portfolio-insa/wireless-communication/iot-devices.png){: .center}
*Image: IoT Devices Connected Estimation [Source](https://www.researchgate.net/figure/oT-Number-of-devices-worldwide-from-2015-to-2025-5_fig1_351075753)*


Based on the informations above-cited, we can clearly see why we do not use IPv4 architecture to support IoT networks communications. The address space provided by IPv4 is unsufficient to support the exponentially growing number of uniquely identified IoT devices.

IPv6 provides a vast address space (nearly $8^{28}$ times IPv4) suitable for large scale IoT networks where every device needs to be uniquely identified. In addition, IPv6 is compatible with LP-WAN  \footnote{LP-WAN: Low Power Wide Area Network} (E.g. [IEEE 802.15.4](https://standards.ieee.org/ieee/802.15.4/7029/)) making it suitable for most IoT application demanding low-power and low data rate. This is partially due to the fact that techniques like 6LoWPAN. 

6LoWPAN enable header compression in order to reduce drastically overhead, this help integrate IPv6 to constrained IoT networks.

One can argue that using IPv6 on a simple IoT network is overengineered but the fact that IPv6 allows IoT devices to be integrated seamlessly with Internet, enabling unmatched access to all types of communications is a turning point in IoT networks. Moreover, IPv6 supports multi-hop\footnote{Multi-hop: information is passed through multiple intermediate nodes before reaching its final destination} routing. This is critical when the network is very large (i.e. spreading across a wide area) and point-to-point communication impossible.

Even if fragmentation is considered by many to be very costful in term of ressources or medium utilization, IPv6 provide this feature.

### IPv6 Basics

#### Initialization Steps of IPv6

Let's explain IPv6 process by imagining a simple scenario. Given a smart device A that you just powered on and connected to a network switch. The first task performed by A is to set up an IPv6 address so it can communicate on the network.

On powering on, the network interface (eth0 for example) is activated, it automatically generates a link-local IPv6 address: this address is composed of a fixed prefix (FE80::/10) and unique identifier extracted from the MAC address. The link-local address is the start point for communication in the local network. In order to verify the validity of the address, A sends a Neighbor Solicitation (NS) message to the network using a multicast address; the role of NS is to ask the network if anyone is already using the address. A then listens for any Neighbor Advertisements (NA); if no one responds, A can freely use the address.

Once the link-local address is set up, A subscribes to specific multicast groups to enable essential IPv6 operations, these groups include the solicited-node multicast address for Neighbor Discovery Protocol (NDP). This ensures that communication with other devices on the same local network is efficient.

If A wants to reach outside the local network, it sends another multicast message: Router Solicitation (RS), asking if there is any router on the network that leads to the outside world. If so, a router replies with Router Advertisement (RA); it contains useful information like the network global prefix (E.g., 2001:db8::/64). Using the global prefix from the Router Advertisement, A combines it with its own unique identifier in order to create a global unicast IPv6 address. This address uniquely identifies A on the Internet. Additionally, A updates its routing table based on the information of the router, including the default gateway and any additional routing policies advertised.

During this process, the Duplicate Address Detection (DAD) is performed again for the newly formed global unicast address to ensure there are no address conflicts at a larger scale. If no conflict is detected, the address is marked as valid.

A is now fully set up to send and receive data to the local network or to the Internet. All this process happens automatically, including the configuration of routing and address resolution, which makes IPv6 very powerful.

#### Rationale


- Automatic Configuration: IPv6 configure devices without manual intervention thus reducing potential errors.
- Address Uniqueness: Duplicate Address Detection ensures each device has a unique address avoiding address collisions.
- Efficiency: Multicast is used instead of broadcast for tasks like address resolution reducing network utilization.
- Global Communication: The global addressing ensures devices can communicate across different networks even the Internet.


#### Requirements of IPv6

- Physical Network Requirements:IPv6 requires a minimum MTU of 1280 bytes, ensuring packets are not fragmented at the network layer. Support for multicast transmission is necessary for key protocols like NDP.
- Host Availability: Devices must remain available during critical steps like DAD and neighbor solicitation to participate in network setup and maintenance.

### IPv6 adaptation and extensions in order to enable its use atop a physical IoT network

- 6LoWPAN Header Compression
  - IPv6 headers are compressed to fit within smaller frame sizes, such as those in IEEE 802.15.4.
  - Compression leverages fields from the link layer to reduce redundancy.

- Routing Protocol (RPL)
  - The Routing Protocol for Low-Power and Lossy Networks (RPL) organizes the network into a Destination-Oriented Directed Acyclic Graph (DODAG).
  - It optimizes routing for multi-point-to-point traffic in constrained environments.

- Multicast for IPv6
  - IPv6 uses multicast for functions like Router Solicitation (RS) and Neighbor Discovery (ND), avoiding the overhead of broadcast communication.

### The IETF IPv6-based stack for IoT

The IETF IPv6-based stack for IoT is a framework designed to adapt the Internet Protocol to ressource limited IoT devices. It is built on IPv6, which provides as seen earier a colossal address space and supports efficient communication even for billions of devices. This stack integrates standard protocols with modifications specifically designed for low-power and lossy networks. At the center, the stack includes 6LoWPAN which compresses IPv6 headers, enables packet fragmentation and ensures interoperability between IPv6 and IoT devices operating in constrained environments (E.g. LP-WPANs). The RPL protocol is responsible for routing and organizes IoT devices into a Directed Acyclic Graph (DAG) that optimize paths for data flow (especially in multi-hop environments). At the application level, the CoAP protocol (Constrained Application Protocol) provides a lightweight REST alternative to HTTP allowing devices to energy efficiently communicate.

### Existing IPv6-based network technologies for IoT

- **6LoWPAN:** Used in smart homes, industrial monitoring, environmental monitoring systems. As seen earlier, it adapts IPv6 for low-power/bandwidth networks.
- **IPv6 over Bluetooth Low Energy (BLE):** Healthcare devices, fitness watches/trackers, all sorts of smart wearables.
- **IPv6 over Wi-Fi:** Home automation and consumer electronics.
- **LTE-M:** Low latency applications, connected vehicles, asset tracking, and healthcare monitoring.
- **Thread:** Home automation.

### Relevance of IPv6-based stack for Inovative Project

Our innovative project (see \url{http://wal.ovh/}) focuses on developing a WSN based water leak detection system for public water networks using acoustic and vibration sensors our goal is to identify specific spectral signatures emitted by leaks. The project relies on a distributed wireless sensor network with nodes communicating via LoRa. Scalability is at the heart of our project.

Using an IPv6-based stack could offer some advantages: as IPv6 provides global addressing it enables the management of a large number of nodes, and supports multi-hop routing with RPL which fits well with our project's topology needs (packets travels to servers via Internet). However, our project is very constrained in term of resources and IPv6 might add some significant overhead, even with header compression. This is why we developed our own communication and addressing protocol to specifically fit our needs. While potentially beneficial for future scalability, our current approach prioritizes simplicity. 


## Emerging Networks

### Terminology

**Data Plane:** The part of the network responsible for moving data (packets) from one device to another.

**Control Plane:** The part of the network that decides how data should be handled, it determines the path packets should take and define the rules for the data plane to follow.

**Flow:** A flow is a sequence of packets sharing common properties like source/destination IP or port.

**Northbound Interface:** Communication between the SDN controller and applications allowing apps to request and control network behavior (E.g. Load balancing).

**Southbound Interface:** Communication between the SDN controller and network devices to implement the instruction wanted by the controller.

### Introduction to SDN

Software Defined Networking is a modern response to traditional manually configured network infrastructures. SDN introduces a centralized and programmable control mechanism that manages the network behavior dynamically "à la volée". SDN separates the control and data planes. This new philosophy enable flexibility, scalability and efficiency. 

### What makes SDN different from legacy computer networks?


- Separation of Control and Data Planes: Traditional networks have the control and data planes integrated into devices like in a router, where the device both decides the best route for packets (control plane) and physically forwards those packets to the next device (data plane). SDN separates these planes: control logic is handled by a centralized \textit{controller}, while devices just moves packets around. 

- Programmability: SDN provides programmable interfaces (E.g. OpenFlow) to dynamically manage network flows which is not even thinkable in traditional systems.

- Flow-based Operations: Unlike destination-based routing in traditional systems SDN allows very flexible flow rule definition. We can apply specific rules to flows based on user defined criteria, not just destination (E.g. prioritizing video streaming over other activities).

- Open Interfaces: SDN allows applications to easily communicate with the controller (northbound) and the controller to manage network devices (southbound) using standard protocols, thus enabling easy integration to different systems. 


### Opportunities SDN Brings


- Simplified Network Management: Centralized control reduces complexity, manual configurations thus reducing errors: this is like DevOps.

- Dynamic Traffic Control: Real-time traffic optimization and customized control.

- Flexibility: New network services, techniques or even paradigms can be deployed quickly: eveything is software and \textit{soft}ware is flexible by definition.

- Cost Efficiency: Reduces dependence on proprietary solutions.

- Innovation: SDN opens the networks systems to new players by breaking the "gatekeeping" monopoly of traditional hardware firms (E.g. Cisco). Instead of relying on proprietary protocols and devices, SDN \textbf{promotes open standards}, thus enabling competition and companies/researchers to experiment and contribute.

### Main Challenges


- Security and Reliability: Centralized controllers become a critical point of attack and controller failure can disrupt the entire network.
    
- Standardization: Lack of universally accepted protocols for northbound and southbound interfaces.

### Personal Notes on SDN

While SDN centralizes control to simplify network management and improve flexibility comparison can be made to the evolution of cloud computing. Initially, centralizing everything in the cloud seemed like the perfect solution, but the emergence of edge computing outlined the limitations of centralization like latency, reliability or scalability. In the same way, centralized SDN control may face similar limits. The future might then lie in a more decentralized "Edge SDN" approach, where some control functions are distributed closer to the edge to improve performance, resilience, and scalability.

A parallel can also be made with cryptocurrencies like Bitcoin, which decentralize control across a network of nodes instead of relying on a single central authority. This approach prevents single points of failure and improves fault tolerance through distributed consensus mechanisms: a decentralized SDN architecture could divide control among multiple controllers operating at the edge, ensuring that the network stays operational if an individual controllers fails.

**Nota Bene:** While looking for references I came accross this paper: *DistBlockSDN: A Distributed Secure Blockchain Based SDN-IoT Architecture with NFV Implementation for Smart Cities* by Anichur Rahman et al. that pretty much sum up what it thought so I re-thinked the wheel I guess.

### Network Function Virtualization Introduction

NFV refers to the virtualization of network functions (such as routing, firewalls, NAT, DPI, IDS, DHCP, and compression) by implementing them as independent software modules running on standard servers rather than relying on proprietary hardware.

For example, instead of buying a physical firewall device a company can deploy a virtual firewall as software on an existing server, all the traffic will pass through it and be filtered if needed. This makes it very easy to update, scale, or move the firewall as needed saving costs and simplifying management.


### Opportunities NFV Brings


- Flexibility: Network functions can be modified or deployed dynamically without replacing hardware.

- Cost Savings: Reduces capital and operational expenses by using standard servers instead of proprietary tomorrow obsolete hardware devices.

- Scalability: Resources can be scaled up or down based on demand.

- Rapid Deployment: New services can be launched faster since functions are software.

- Simplified Management: Centralized automated operations.


### Personal Notes on NFV

NFV truly is a step forward in network flexibility, but its reliance on software introduces performance bottlenecks. Virtual firewalls, for instance, need to handle traffic at wire speed, which can be very challenging for standard server CPUs. I  was told that hardware is inherently faster, and I believe FPGAs could offer an excellent solution if general purpose FPGAs were widely adopted in server infrastructure. For now, the cost of FPGAs is still too high, thus a hybrid approach, using FPGAs for critical tasks and software for less demanding functions might be the tradeoff (maybe GPU is the key?).

### Are SDN and/or NFV relevant for your semester project ?

If we hypothetically scale the water detection system to cover all of France, managing the large amount of data from thousands of gateways (concentrators of the network's nodes, a single gateway can manage hundreds of nodes) becomes a challenge. Integrating SDN between the gateways and the servers could allow centralized control of data flow. SDN could for example prioritize critical leak alerts over monitoring and route data dynamically based on real-time network conditions.

# Analytical Part

- Good to know