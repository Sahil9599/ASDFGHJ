# SAHIL // Cyber Security & Defensive Systems Portfolio

A high-performance, futuristic portfolio website built with **React**, **Three.js (WebGL)**, and **Tailwind CSS**, designed in an obsidian black and liquid chrome aesthetic.

Showcases verified hands-on engineering across **Cisco Network Engineering (CCNA)** and **Enterprise Linux Systems Defense (RHEL 9)**.

---

## 🛡️ Core Specializations

### 🌐 CCNA & Network Architecture
- **Inter-VLAN Routing with IEEE 802.1Q Dot1Q & Serial WAN**: Sub-interfaces (`Fa0/0.1`, `Fa0/0.2`), Router-on-a-Stick, dynamic 802.1Q trunking, Serial link (`Se2/0`) synchronization, and verified ICMP reachability across subnets with 0% packet loss.
- **Enterprise Network Address Translation (NAT / PAT Overload)**: Mapping private subnets (`10.0.0.0/24`) through Cisco IOS edge router to public WAN gateway IP (`200.0.0.1`) reaching external servers.
- **Site-to-Site Cryptographic IPsec VPN Tunnel**: IKEv2, AES-256-GCM encryption, SHA-512 data integrity, and Cisco ASA firewall packet inspection.
- **Zero-Trust Network Micro-Segmentation**: Private VLANs (PVLAN), Port Security MAC lockdown, and TACACS+/RADIUS AAA server integration.

### 🐧 Linux Systems Defense & RHEL 9
- **RHEL 9 Real-Time Kernel Process & Resource Monitoring (`top`)**: Load average tracking, CPU idle headroom, memory allocation, and kernel audit threads (`kauditd`, `systemd PID 1`, `vmtoolsd`).
- **RHEL 9 Storage/LVM, Memory & Systemd Journal Triage**: LVM logical root volumes (`/dev/mapper/rhel_192-root`), NVMe UEFI boot partitions, systemd unit verification (`systemctl --failed`), and kernel error triage via `journalctl -p err`.
- **Linux Kernel Network Stack & Socket Auditing**: Interface analysis via `ip addr`, low-level listening socket inspection via `ss -tuln`, routing table verification (`ip route`), and dual-stack IPv4/IPv6 name service switch resolution (`getent hosts`).
- **Automated Linux Enterprise Server Hardening Engine**: CIS Benchmark Level 2 automation, sysctl kernel lockdown, SELinux/AppArmor enforcement, and zero-password SSH keys.

---

## ✨ Features

- **Liquid Chrome 3D Real-Time WebGL (Three.js)**: Interactive floating metallic sculpture with studio specular reflections, mouse physics, and geometry morphing (Torus Knot, Möbius Loop, Mercury, Chrome Ring).
- **Interactive Screenshot Lightbox**: Full-resolution topology diagrams and terminal snapshots with annotated configuration specs.
- **Interactive Diagnostic Terminal (REPL)**: Interactive terminal emulator with commands (`topologies`, `ccna`, `linux`, `whoami`, `skills`, `contact`).
- **Lenis Inertial Momentum Smooth Scrolling**: High-end Awwwards-style luxury scrolling physics with metallic progress indicator and back-to-top navigation.
- **Web Audio API Synthesizer**: Subtle sci-fi click and hover sound FX toggle.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Sahil9599/ASDFGHJ.git
cd ASDFGHJ

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 👤 Author
**Sahil**  
*Cyber Security Specialist &bull; Network &bull; Linux Defense*  
Email: [sahil.cybersec@gmail.com](mailto:sahil.cybersec@gmail.com)
