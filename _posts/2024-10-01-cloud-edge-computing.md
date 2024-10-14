---
layout: post
title: "Cloud and Edge Computing Lab"
date: 2024-10-01
categories: lab virtualization containers
image: https://github.com/user-attachments/assets/88882602-2a5e-42d6-8849-5b9d12d6f27b
categories: [INSA]
---

# Lab 1: Virtualization & Cloud Computing Lab - 2023-2024

## Introduction

Virtualization and cloud computing are fundamental concepts in modern IT infrastructure, enabling the creation of flexible, scalable environments where multiple systems can run on shared hardware. This lab introduces key aspects of virtualization, including Virtual Machines (VMs), Containers (CTs), and cloud computing using platforms like Docker and OpenStack. We will delve into theoretical foundations such as different types of hypervisors, containerization technologies, and network configurations in virtualized environments. Additionally, we will explore practical applications of virtualization, from setting up VMs and containers to provisioning services in a cloud environment.

---

## Theoretical Part

### 1. Virtual Machines (VMs) vs Containers (CTs): A Detailed Comparison

![image](https://github.com/user-attachments/assets/0f0e65f9-51dd-407d-830b-1527ffaff0be)


Virtualization has revolutionized how we use hardware by enabling multiple isolated environments to run on a single physical machine. Two of the most prevalent technologies in this space are **Virtual Machines (VMs)** and **Containers (CTs)**, each with its own strengths, weaknesses, and use cases. While both aim to maximize resource efficiency and encapsulate environments, their internal architectures differ significantly.

#### Virtual Machines (VMs)
Virtual Machines are emulated hardware systems that run complete operating systems on top of a hypervisor. VMs have been widely used in environments where complete isolation and security are paramount, such as in data centers or when running different OS types on a single machine.

- **Hypervisor**: A hypervisor is responsible for managing and allocating hardware resources to each VM. There are two types of hypervisors:
  - **Type 1 (Bare-metal)**: Runs directly on the hardware without needing a host operating system. KVM and VMware ESXi are examples of this type.
  - **Type 2 (Hosted)**: Runs on a host OS and relies on the host for resource management. VirtualBox and VMware Workstation are popular examples.
  
#### Containers (CTs)
Containers provide a lighter-weight alternative to VMs by operating at the OS level rather than emulating full hardware. Instead of running separate operating systems, containers share the host OS's kernel but keep their own environments isolated, including libraries, binaries, and configurations.

![image](https://github.com/user-attachments/assets/98909aa7-0533-4aec-8842-814f2cc7ad69)


- **Container Engines**: Docker and Podman are popular container engines that manage containers at the application level, allowing developers to encapsulate their applications and dependencies in isolated environments.
- **Isolation**: Containers rely on kernel features like namespaces and cgroups to provide process and resource isolation. These mechanisms ensure that each container runs as if it were in its own operating system while sharing the host's kernel.

#### Detailed Comparison of VMs vs Containers

| **Feature**             | **Virtual Machines (VMs)**                                            | **Containers (CTs)**                                                |
|-------------------------|-----------------------------------------------------------------------|---------------------------------------------------------------------|
| **Architecture**         | Emulates hardware to run separate operating systems.                  | Shares host OS kernel, but isolates processes and file systems.      |
| **Performance**          | Higher overhead due to hardware emulation (CPU, memory, I/O).         | Near-native performance since there's no OS emulation.               |
| **Resource Usage**       | Requires more resources because each VM runs a full OS.               | Lightweight, as containers share the kernel and only isolate the application environment. |
| **Security**             | Full isolation: each VM is a complete OS, providing stronger isolation. | Weaker isolation compared to VMs, since containers share the host OS kernel. |
| **Portability**          | VMs are portable but require conversion or special images for different hypervisors. | Containers are highly portable across different environments using container images (e.g., Docker images). |
| **Management Complexity**| More complex to set up and manage due to full OS configuration.        | Easier to manage with container orchestration tools like Kubernetes. |
| **Use Case**             | Suitable for running multiple OS types on the same hardware or when strong isolation is required (e.g., different OS versions or security policies). | Ideal for microservices, CI/CD pipelines, or when the same OS is shared among multiple applications. |
  
#### Resource Utilization in VMs vs Containers

- **CPU, Memory, Network**: 
  - **VMs**: Each VM has independent allocations of CPU cores, memory blocks, and network interfaces. This leads to more predictable performance but also more resource consumption.
  - **Containers**: Containers share the host's CPU, memory, and network stack, leading to higher efficiency and faster startup times. However, this resource sharing can lead to contention in resource-heavy environments.
  
- **Virtualization Cost**: 
  - VMs require more powerful hardware due to the overhead of running separate operating systems. This can be inefficient in cases where the goal is to run multiple lightweight applications.
  - Containers, by contrast, are optimized for scenarios where performance and efficiency are more critical, especially in microservice architectures or CI/CD pipelines.

#### Security Considerations

Security is often a decisive factor when choosing between VMs and containers:
- **VMs**: The level of isolation provided by a VM is high. Each VM operates as an independent machine, with no direct access to the host’s hardware. Even if one VM is compromised, it typically cannot affect other VMs or the host OS. This makes VMs more secure for sensitive workloads like kernel-level programming.
  
- **Containers**: Containers, while offering lightweight and flexible isolation, have a shared kernel. This shared kernel creates a potential attack vector, where a vulnerability in the host kernel can be exploited by a container to affect other containers or the host OS. However, modern container security tools, like **Docker's rootless mode** and **Podman's daemon-less architecture**, have made significant strides in improving security.

---

### 2. Comparison of Container Types (CT)

Containers, despite their shared architecture, vary significantly in implementation based on the provider or engine used. Below is an in-depth comparison of the major container technologies, focusing on isolation, resource management, and tooling.

#### Application Isolation & Resources Management

- **Docker**: The most widely used container engine, Docker utilizes Linux features like namespaces and cgroups to isolate containers. This ensures each container runs in its own isolated environment, but resource sharing can lead to some contention in multi-tenant environments.
- **Podman**: Provides similar isolation as Docker but with better support for rootless containers, improving multi-tenant security. Podman’s lack of a daemon makes it more secure in environments requiring fine-grained access control.
- **LXC/LXD**: A system container solution, LXC/LXD isolates entire operating systems, providing stronger resource segregation compared to Docker. It’s ideal for multi-tenant environments but is heavier than application-level containers.
- **Rocket (rkt)**: Focuses on security by integrating directly with `systemd-nspawn` for isolation. Its performance and security focus make it less ideal for rapid development, but better for environments needing robust security.
- **OpenVZ**: Excellent for multi-tenancy, OpenVZ offers low overhead and strong resource management. It is often used in web hosting environments due to its ability to run multiple virtual private servers (VPS) with minimal overhead.

#### Containerization Levels

- **Application-level Containerization**: Solutions like Docker and Podman are designed to package applications and their dependencies, offering lightweight, fast-spawning environments. These solutions are ideal for microservice architectures.
- **OS-level Containerization**: LXC/LXD and OpenVZ focus on containerizing entire operating systems, providing a hybrid between VMs and traditional containers. These containers are heavier but offer better isolation for system-level processes.

#### Tooling and Integration

- **Docker**: Provides a comprehensive suite of tools (Docker CLI, Docker API, Docker Compose) and is deeply integrated into CI/CD pipelines (e.g., GitHub Actions, Jenkins).
- **Podman**: Similar tooling to Docker, but its rootless and daemon-less architecture makes it more secure in production environments.
- **LXC/LXD**: Offers a REST API for managing containers but lacks deep integration with CI/CD pipelines. Ideal for environments that prioritize system-level isolation over application-level flexibility.
- **OpenVZ**: Integrates well with web hosting control panels like Proxmox, but lacks the rich CI/CD ecosystem of Docker or Kubernetes.

---

### 3. Hypervisors: Type 1 vs Type 2

The role of a hypervisor is to enable the virtualization of hardware, allowing multiple OS instances to run on a single physical machine. Hypervisors can be categorized into two types:

- **Type 1 Hypervisors (Bare-metal)**: These hypervisors run directly on the hardware, without the need for an underlying operating system. They are commonly found in enterprise environments and data centers due to their efficiency and performance. 
  - **KVM (Kernel-based Virtual Machine)**: A popular Type 1 hypervisor integrated into the Linux kernel. KVM enables the Linux OS to act as a hypervisor, offering near-native performance for VMs.
  - **VMware ESXi**: A leading enterprise-grade Type 1 hypervisor, ESXi is used in many datacenters for running multiple VMs with high availability and resource management.
  
- **Type 2 Hypervisors (Hosted)**: These hypervisors run on top of an existing OS, relying on the OS to manage hardware resources. While less efficient than Type 1, Type 2 hypervisors are easier to set up and use for testing or desktop virtualization.
  - **VirtualBox**: A widely used Type 2 hypervisor that runs on various platforms like Windows, Mac, and Linux. It's primarily used for desktop virtualization and testing.
  - **QEMU**: A Type 2 hypervisor that can emulate different hardware architectures. It's commonly used for testing software on architectures like ARM or MIPS.

---

### 4. Network Connection Modes for Virtual

ization Hosts

Networking in virtualized environments is essential for ensuring communication between VMs/containers, hosts, and external networks. Two common modes of network configuration in virtualized systems are **NAT Mode** and **Bridge Mode**.

#### Network Address Translation (NAT) Mode
- **Private IP Addressing**: In NAT mode, VMs are assigned private IP addresses (e.g., `10.0.2.15`). These IPs are not accessible from the external network.
- **VM-to-Host Communication**: VMs can access external networks via the host, but external systems cannot directly access VMs unless port forwarding is configured.
- **Use Case**: NAT mode is suitable for simple setups or environments where isolation between the VM and the network is required.

#### Bridge Mode
- **Public IP Addressing**: In bridge mode, VMs appear as part of the host's local network. They are assigned IP addresses from the host's DHCP server, making them directly accessible.
- **VM-to-VM Communication**: VMs can communicate with each other freely, similar to how devices on the same local network communicate.
- **Use Case**: Preferred for environments where VMs need full access to the network, such as datacenters or when testing distributed systems.

---

## Practical Part

### 1. Creating and Configuring Virtual Machines

In the practical section, we first set up a Virtual Machine (VM) using VirtualBox. The VM was assigned a **NAT network** interface, enabling internet connectivity but isolating it from the host system.

#### Configuring NAT Connectivity
The VM received the IP address `10.0.2.15` for internet access. NAT mode translated this internal IP to the host’s external IP when communicating with the internet. However, to allow communication between the host and VM, we configured port forwarding. For example, port 4000 on the host was forwarded to port 22 on the VM, enabling SSH access:

![image](https://github.com/user-attachments/assets/a954606c-d5f0-4448-9b1e-5230d2d4036f)


```bash
ssh osboxes@localhost -p 4000
```

![image](https://github.com/user-attachments/assets/dbbea1de-5bd2-453f-87ce-e1fe689ffed2)


#### Cloning the VM
We cloned the VM using the following command in VirtualBox:

```bash
VBoxManage clonemedium <source.vdi> <destination.vdi>
```

![image](https://github.com/user-attachments/assets/7a6baffe-2411-447b-99d2-8edd1889ebf9)

![image](https://github.com/user-attachments/assets/d236bdc7-801a-4aa9-9dcd-c4786a7a3879)


This created a snapshot of the VM, which could be reused and relaunched with specific configurations, streamlining the setup for future labs.


### 2. Docker Containers Provisioning

#### Installing Docker and Running Containers
Next, we installed Docker and pulled the Ubuntu image:

```bash
docker pull ubuntu
```
![image](https://github.com/user-attachments/assets/d95b2574-3330-4272-ac7f-a3db00e99d53)

![image](https://github.com/user-attachments/assets/93bec7c8-4bca-45bf-a878-746906032f57)

![image](https://github.com/user-attachments/assets/ec68e48c-227c-481b-8012-bef9019b5d74)

![image](https://github.com/user-attachments/assets/81cc1a45-b072-4564-b7a3-2b4b87767c7a)

![image](https://github.com/user-attachments/assets/9e054484-b4eb-4d5f-a54c-2dd52d192cbc)



We then instantiated the Ubuntu container and verified that it could ping external sites like Google:

```bash
docker run -it ubuntu
ping google.com
```

The Docker container was assigned an IP on the `docker0` network (`172.17.0.2`), which allowed communication with the host through the network bridge.

#### Dockerfile Creation and Container Management
To automate container builds, we created a **Dockerfile**:

```Dockerfile
FROM ubuntu
RUN apt update -y
RUN apt install -y nano
CMD ["/bin/bash"]
```

We built and ran the Docker image with the following commands:

```bash
docker build -t user/nano .
docker run -it user/nano
```

To preserve the container state, we used `docker commit` to create a new image with preinstalled packages.

### 3. OpenStack: Virtual Machine Creation and Connectivity

#### Setting Up VMs on OpenStack
We created a new instance in OpenStack using the **small2 flavor** (1GB RAM, 20GB disk). After configuring the security rules and enabling SSH and ICMP, we could connect to the VM via its public floating IP.

```bash
ssh user@<floating_ip>
```

![image](https://github.com/user-attachments/assets/85ad4c22-2170-4f66-8d74-053696cb82e4)


![image](https://github.com/user-attachments/assets/83f8371c-b8df-46cf-a2e8-94e8247d7db8)


#### Private Network and Floating IPs
The instance was initially assigned a private IP (`192.168.x.x`), which was not accessible from the external network. To resolve this, we created a **floating IP** and associated it with the VM. This allowed us to ping and SSH into the VM from the host system.

### 4. Deploying a Web 2-tier Application on OpenStack

#### Microservice Architecture
We deployed a simple **Calculator Service** using a microservice architecture. Each service (addition, subtraction, multiplication, division) was deployed as a separate container. Communication between the **ComputeService** and the individual microservices was established using HTTP.

![image](https://github.com/user-attachments/assets/b18bca3e-4d25-4d02-85f2-8e83fedb6357)

![image](https://github.com/user-attachments/assets/a769a66e-b920-4d8d-bd85-7eea8c1db995)

![image](https://github.com/user-attachments/assets/74e0dad5-0117-43b2-b2d9-bbe48fdf71e3)

Client :

![image](https://github.com/user-attachments/assets/afdd2c23-54fd-4d6b-bd5c-ae1207d982ad)



#### Dockerfile for Microservices
The Dockerfile for each microservice was parameterized to dynamically download the appropriate service script based on the type:

```Dockerfile
FROM node
ARG TYPE
ENV TYPE=${TYPE}
RUN wget http://example.com/${TYPE}Service.js
CMD node ${TYPE}Service.js
```

This Dockerfile allowed us to build and run containers for each microservice:

```bash
docker build --build-arg TYPE="Sum" -t calc/sum .
docker run -d calc/sum
```

By setting up a gateway between the ComputeService and the microservices, we allowed for seamless communication across different networks.

### Conclusion

This lab provided a comprehensive overview of virtualization and cloud computing concepts, including the setup and management of VMs and containers. Through the practical exercises, we explored how to configure VMs in VirtualBox, deploy Docker containers, and provision VMs in OpenStack. The microservice-based Calculator application demonstrated the power of containerization in cloud environments, offering flexibility, scalability, and efficient resource utilization. 

Understanding these concepts is crucial for modern IT environments, as they form the backbone of cloud infrastructure and enable the rapid deployment of scalable applications.
