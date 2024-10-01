---
layout: post
title: "Cloud and Edge Computing Lab"
date: 2024-10-01
categories: lab virtualization containers
---

# Lab 1 : Virtualization and Containerization

## I. Theoretical Part

### 1. Similarities and Differences Between the Main Virtualization Hosts (VM and CT)

The figure below shows two different setups for virtualization:

1. **Hypervisor Type 2 Setup**:  
   This setup uses an OS-level Virtual Machine (VM) such as Qemu or VirtualBox. It contains three VMs with distinct apps running on them. Each guest VM can have a different OS (e.g., Linux-based or Windows-based) and run completely different applications. The VMs are independent and use the resources provided by the Host OS.

2. **Container Setup**:  
   In this setup, there is no VM. Instead, it relies on a container, which depends on the Host OS architecture. Although the environment is independent, shared libraries and programs are contained within a single instance.

#### Comparison Between Virtualization and Containerization:

| Criteria                     | Virtual Machine (VM)                                      | Container (CT)                                         |
|------------------------------|----------------------------------------------------------|--------------------------------------------------------|
| **Virtualization Cost**       | Requires powerful hardware; optimized for cross-compilation but can be costly. | Cheaper (e.g., Docker uses less hardware and is cost-effective). |
| **CPU, Memory, Network Usage**| Uses too many resources but is helpful for kernel-level programming. | Minimal overhead as it runs natively, sharing resources can be an issue. |
| **Security (Access Rights, Resources Sharing)** | Safest solution—no direct access to hardware. | Libraries are not shared but might still pose risks for advanced users. |
| **Performance**               | Poor performance due to CPU emulation, especially for different architectures. | Better performance as it uses the host kernel directly. |
| **Tooling for CI**            | Cross-platform tests enabled by VMs, great for specific cases. | Containers integrate directly with tools like GitLab/GitHub. |

### 2. Similarities and Differences Between Existing CT Types  

#### Comparison Criteria:
- **Application isolation and resources** (multi-tenancy).
- **Containerization level** (operating system, application).
- **Tooling** (API, CI integration).

#### Comparison of Different Container Providers:

| Container Provider | Application Isolation and Resources       | Containerization Level | Tooling                                                                                       |
|--------------------|------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| **Docker**         | Strong isolation with cgroups and namespaces. Less ideal for multi-tenancy. | Application-level       | Docker CLI, API, Compose, CI/CD integration. Rootful.                                          |
| **Podman**         | Better for multi-tenancy with rootless containers. Uses cgroups. | Application-level       | Docker-compatible CLI, rootless mode, no daemon required.                                      |
| **LXC/LXD**        | OS-level isolation suitable for multi-tenancy.         | OS-level (lightweight VMs) | REST API, not as integrated with CI/CD pipelines.                                              |
| **Rocket (rkt)**   | Strong security with systemd-nspawn.                      | Application-level       | API support, integrates with systemd.                                                          |
| **OpenVZ**         | Excellent for multi-tenancy with up to 20 customer networks.  | OS-level (containerized VMs) | Integrated with Proxmox, lacks Docker-like API but useful in web hosting environments.         |
| **containerd**     | Strong isolation.                                            | Application-level       | API-driven, integrates well with Kubernetes.                                                   |
| **systemd-nspawn** | Good isolation with systemd, trusted multi-tenancy.        | OS-level (lightweight VMs) | Integrated with systemd, lacks CI/CD capabilities.                                             |


![image](https://github.com/user-attachments/assets/e2c15eab-223d-47e7-bbdb-7d5e854293d4)


### 3. Similarities and Differences Between Type 1 & Type 2 Hypervisors

- **Type 1 - Bare-metal Virtualization**:  
   The virtualization runs directly on the host hardware and manages resources (e.g., memory, CPU). It acts like a lightweight OS but cannot run anything more. In the case of **KVM**, it's a Linux kernel driver that schedules virtual machines.

- **Type 2 - Hosted Virtualization**:  
   Type 2 hypervisors (e.g., VirtualBox, Qemu) rely on an underlying OS (Linux/GNU, Windows) and are built specifically for virtualization tasks. They request resources from the underlying OS, unlike Type 1 hypervisors that run directly on hardware.

### 4. Differences Between Two Main Network Connection Modes for Virtualization Hosts

(TODO: Add description)

## II. Practical Part

(TODO: Add practical examples)

## References

- NinjaOne article on Virtualization cost: [NinjaOne Blog](https://www.ninjaone.com/blog/cost-of-virtualization/)
- Red Hat Docs: [Red Hat](https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/9/html/managing_monitoring_and_updating_the_kernel/what-namespaces-are_setting-limits-for-applications)
- Multi Tenant Docs: [Neodelta](https://neodelta.eu/glossaire/multi-tenancy)
- Systemd Docs: [Red Hat Systemd Documentation](https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/introduction-to-systemd_configuring-basic-system-settings)
- Wikipedia article on systemd: [Wikipedia Systemd](https://fr.wikipedia.org/wiki/Systemd)
- What is KVM?: [Red Hat KVM](https://www.redhat.com/en/topics/virtualization/what-is-KVM)
- What is a Hypervisor?: [Red Hat Hypervisor](https://www.redhat.com/en/topics/virtualization/what-is-a-hypervisor)

### Image References:
- [Canonical Virtualization Setup](https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_720/https://lh4.googleusercontent.com/YSb3RYd4vqqf-_7JqfUSsUTKk4vfNImhYD3leIlVx87SJGs7sLitqCct4rE08iJNCtR5CbG93ZF8sFwYBieIy0ez6lUY8Vl0fEyCVMgKubRDOJo2EK4FN7JWVF40OMTY6cjePKlk)
- [Docker and rkt Comparison](https://jvns.ca/images/docker-rkt.png)
