# SAHIL // Cyber Security & Defensive Systems Portfolio

A high-performance, futuristic portfolio website built with **React**, **Three.js (WebGL)**, and **Tailwind CSS**, designed in an obsidian black and liquid chrome aesthetic.

Exclusively showcases verified hands-on engineering labs with high-resolution screenshot evidence across **Cisco Network Engineering (CCNA)** and **Enterprise Linux Systems Defense (RHEL 9)**.

---

## 🛡️ Verified Hands-On Engineering Labs

### 🌐 CCNA Projects (Cisco Packet Tracer)
1. **Inter-VLAN Routing with IEEE 802.1Q Dot1Q & Serial WAN**
   - Sub-interfaces (`Fa0/0.1`, `Fa0/0.2`), Router-on-a-Stick architecture.
   - Dynamic 802.1Q trunking on Catalyst switch uplinks.
   - Cross-site Serial link (`Se2/0`) synchronization (`30.0.0.1/30` <-> `30.0.0.2/30`).
   - Verified 100% end-to-end ICMP ping reachability across subnets with 0% packet loss.

2. **Enterprise Network Address Translation (NAT / PAT Overload)**
   - Perimeter NAT/PAT configuration on Cisco edge router.
   - Translates internal corporate LAN (`10.0.0.0/24`) through `Fa0/0` (inside) to public WAN gateway IP (`200.0.0.1`) on `Fa1/0` (outside).
   - Standard Access Control List (`access-list 1 permit 10.0.0.0 0.0.0.255`) overload.
   - Live ICMP simulation validating bidirectional communication with public server (`200.0.0.2`).

### 🐧 Linux Projects (RHEL 9 & Enterprise Linux)
3. **RHEL 9 Real-Time Kernel Process & Resource Telemetry (`top`)**
   - Live system load and CPU distribution auditing (98.7% idle headroom, 346 total tasks).
   - Security thread verification: PID 38 `kauditd` (kernel audit dispatcher routing security events to `auditd`).
   - Process tree verification: PID 1 `systemd`, PID 2 `kthreadd`, VMware guest daemon `vmtoolsd`.

4. **RHEL 9 Storage/LVM Partitioning, Memory & Systemd Journal Triage**
   - Volatile memory state inspection via `free -h` (1.6Gi total, 489Mi cache, 0.0Ki swap).
   - Disk partitioning & LVM verification via `df -h` (`/dev/mapper/rhel_192-root`, 29G, 17% utilized) on NVMe storage.
   - Service unit integrity verification via `systemctl --failed` (*0 loaded units failed*).
   - Low-level kernel error triage via `journalctl -p err -n 20` analyzing SMBus and PAM keyring control checks.

5. **Linux Kernel Network Stack, Socket Auditing & Diagnostic Verification**
   - Network adapter analysis (`ens160` - `192.168.183.129/24`) with default gateway routing (`ip route`).
   - Comprehensive listening socket inspection using `ss -tuln` (auditing authorized TCP 22 SSH, TCP 631, UDP 323 chrony).
   - Dual-stack IPv4/IPv6 name service switch resolution verification via `getent hosts google.com`.

---

## ✨ Features

- **Liquid Chrome 3D Real-Time WebGL (Three.js)**: Interactive floating metallic sculpture with studio specular reflections, mouse physics, and geometry morphing.
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

## 👤 Author & Contact
**Sahil**  
*Cyber Security Specialist &bull; Cisco CCNA &bull; Linux Systems Defense*  

- 📧 **Email**: [sahilkumar202232@gmail.com](mailto:sahilkumar202232@gmail.com)
- 📱 **Mobile**: [+91 7042131215](tel:+917042131215)
- 💬 **WhatsApp**: [Chat on WhatsApp (+91 7042131215)](https://wa.me/917042131215)
- 💼 **LinkedIn**: [linkedin.com/in/sahil-0b0172445](https://www.linkedin.com/in/sahil-0b0172445)
- 🐙 **GitHub**: [github.com/Sahil9599](https://github.com/Sahil9599)
