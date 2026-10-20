import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import MatrixRain from './components/MatrixRain';
import { 
  ArrowUpRight, 
  ArrowUp,
  ShieldCheck, 
  Mail, 
  Phone,
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink,
  Server,
  Network,
  Lock,
  X,
  ZoomIn
} from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('sahilkumar202232@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText('7042131215');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#a1a1aa', '#71717a'],
    });
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only the 5 verified projects with real screenshots
  const projects = [
    {
      id: 'ccna-inter-vlan-dot1q',
      category: 'ccna',
      badge: 'CCNA LAB',
      title: 'Inter-VLAN Routing with IEEE 802.1Q Dot1Q & Serial WAN',
      subtitle: 'Cisco Router-on-a-Stick, 802.1Q Trunking & Cross-Site Routed WAN',
      image: '/images/cisco-inter-vlan.png',
      desc: 'Configured and validated an enterprise multi-site network in Cisco Packet Tracer. Interconnected two site routers via a Serial WAN link (Se2/0 with 30.0.0.1/30 and 30.0.0.2/30). Built Router-on-a-Stick sub-interfaces on FastEthernet0/0 with Dot1Q encapsulation for VLAN 1 (10.0.0.1/24 & 40.0.0.1/24) and VLAN 2 (20.0.0.1/24 & 50.0.0.1/24). Demonstrated 100% end-to-end ICMP ping reachability across remote subnets.',
      highlights: [
        'IEEE 802.1Q Dot1Q encapsulation configured on sub-interfaces Fa0/0.1 and Fa0/0.2',
        'Serial Se2/0 WAN connection clock rate synchronization (30.0.0.1/30 to 30.0.0.2/30)',
        'Switchport Mode Trunk configured on Switch Fa0/1 uplink interfaces',
        'Demonstrated 100% successful ICMP end-to-end ping between PC14 (10.0.0.2) and PC16 (40.0.0.2)',
      ],
      metrics: ['0% Packet Loss', 'IEEE 802.1Q Dot1Q', 'Dual-Site Serial WAN'],
      tech: ['Cisco Packet Tracer', 'Cisco IOS', '802.1Q Dot1Q', 'Serial WAN (Se2/0)', 'Inter-VLAN', 'ICMP'],
    },
    {
      id: 'ccna-nat-pat',
      category: 'ccna',
      badge: 'CCNA LAB',
      title: 'Enterprise Network Address Translation (NAT / PAT Overload)',
      subtitle: 'Private IP to Public WAN Gateway with Cisco Edge Router',
      image: '/images/cisco-nat-pat.png',
      desc: 'Architected and validated perimeter Network Address Translation (NAT) and Port Address Translation (PAT) on a Cisco router. Mapped private corporate subnets (10.0.0.0/24 with PC0 10.0.0.2 and PC1 10.0.0.3) to a single public IP address (200.0.0.1) on Fa1/0. Applied standard Access Control Lists (ACLs) to designate inside traffic, configured "ip nat inside" and "ip nat outside", and verified real-time ICMP packet delivery to public Server0 (200.0.0.2).',
      highlights: [
        'NAT Overload Command: "ip nat inside source list 1 interface FastEthernet1/0 overload"',
        'Access List: "access-list 1 permit 10.0.0.0 0.0.0.255"',
        'Interface demarcation: Fa0/0 (ip nat inside) <-> Fa1/0 (ip nat outside)',
        'Validated in Packet Tracer simulation: successful translation and reply from public Server0 (200.0.0.2)',
      ],
      metrics: ['PAT Dynamic Overload', 'RFC 1918 Masked', '100% WAN Delivery'],
      tech: ['Cisco IOS NAT', 'PAT Overload', 'Standard ACL', 'FastEthernet', 'Public WAN Server'],
    },
    {
      id: 'netscope-subnet-calculator',
      category: 'ccna',
      badge: 'NETSCOPE PRO // CCNA TOOL',
      title: 'NetScope PRO: Network Engineering & Subnet Architecture Calculator',
      subtitle: 'Visual Subnetting Breakdown, VLSM Trees, RFC 1878/4291 & Bitwise Engine',
      image: '/images/netscope-subnet-calculator.png',
      desc: 'Architected and developed NetScope PRO, an advanced diagnostic suite for network engineers and CCNA practitioners. Features an interactive IPv4 & IPv6 CIDR subnet calculator, real-time bitwise mask computation, classful architecture matching (Class A/B/C), VLSM subdivision tree generation, and usable host range mapping (calculating Network ID, Broadcast, Usable Range, and Wildcard Masks). Includes instant presets for RFC 1918 private subnets, AWS VPC CIDR blocks, Carrier NAT, and P2P links with PDF/CSV export.',
      highlights: [
        'Real-time CIDR / VLSM calculation from /0 up to /32 with dynamic prefix sliders and bitwise translation',
        'Automated RFC 1878 / RFC 4291 classification with network block capacity & usable host computation (254 hosts on /24)',
        'Full address decomposition: Subnet ID (192.168.1.0), Broadcast (192.168.1.255), Usable host range (192.168.1.1 - 192.168.1.254), and Wildcard mask (0.0.0.255)',
        'Quick architecture presets for Enterprise AWS VPC tiers, RFC 1918 Class A/B/C, Carrier NAT, and Point-to-Point links',
      ],
      metrics: ['Instant CIDR Math', 'RFC 1878 / 4291', 'VLSM Subdivisions'],
      tech: ['React', 'TypeScript', 'IPv4 & IPv6 CIDR', 'VLSM Algorithms', 'Bitwise Subnetting', 'RFC 1918'],
    },
    {
      id: 'linux-rhel9-top-monitor',
      category: 'linux',
      badge: 'RHEL 9 LAB',
      title: 'RHEL 9 Real-Time Kernel Process & Resource Telemetry (top)',
      subtitle: 'Process Lifecycle, Kernel Threads & kauditd Security Subsystem Analysis',
      image: '/images/rhel9-process-monitor.png',
      desc: 'Conducted real-time process lifecycle auditing and kernel thread analysis on Red Hat Enterprise Linux 9 (RHEL 9 64-bit on VMware). Utilized "top" to capture system load metrics (load average: 0.72, 0.46, 0.16), CPU state distribution (98.7% idle, 0.7% user, 0.5% system), and memory allocation across 1674.3 MiB physical RAM and 2060.0 MiB swap. Analyzed critical system daemons (systemd PID 1, vmtoolsd, gnome-shell) and kernel threads including "kauditd" (Linux security audit daemon).',
      highlights: [
        'Real-time CPU telemetry via "top": 346 total tasks (1 running, 345 sleeping, 0 zombie) with 98.7% idle headroom',
        'Kernel security thread audit: Inspected PID 38 "kauditd" (kernel audit daemon routing security events to auditd)',
        'Virtualization integration: Monitored PID 6923 "vmtoolsd" ensuring VMware hypervisor clock synchronization',
        'Core process tree hierarchy: Validated PID 1 "systemd", PID 2 "kthreadd", and asynchronous "kworker" pools',
      ],
      metrics: ['98.7% CPU Idle', '0 Zombie Tasks', 'kauditd Active'],
      tech: ['RHEL 9 (Red Hat)', 'top monitor', 'kauditd', 'systemd (PID 1)', 'Kernel Threads', 'VMware'],
    },
    {
      id: 'linux-rhel9-system-triage',
      category: 'linux',
      badge: 'RHEL 9 LAB',
      title: 'RHEL 9 Storage/LVM Partitioning, Memory & Systemd Journal Triage',
      subtitle: 'Filesystem Forensics, Zero Failed Units & journalctl Error Analysis',
      image: '/images/rhel9-storage-audit.png',
      desc: 'Executed a comprehensive storage, memory, and error-triage audit on Red Hat Enterprise Linux 9. Inspected volatile memory states via "free -h" (1.2Gi used, 489Mi buff/cache, 0.0Ki swap used). Analyzed disk partitioning and logical volumes using "df -h", validating LVM root volume "/dev/mapper/rhel_192-root" (29G total, 17% utilized) alongside NVMe UEFI boot partitions ("/dev/nvme0n1p1" & "/dev/nvme0n1p2"). Verified systemd unit integrity with "systemctl --failed" (confirming 0 failed loaded units), and conducted forensic error log triage with "journalctl -p err -n 20".',
      highlights: [
        'Volatile memory analysis via "free -h": 1.6Gi total RAM, 489Mi page buff/cache, and 0.0Ki swap pressure',
        'Storage & LVM layout via "df -h": Validated LVM root volume (/dev/mapper/rhel_192-root, 29G, 17% used) on NVMe',
        'Systemd service health via "systemctl --failed": "0 loaded units listed" (100% services operating normally)',
        'Log forensics via "journalctl -p err -n 20": Triaged kernel piix4_smbus address warnings and gkr-pam control checks',
      ],
      metrics: ['0 Failed Services', '17% LVM Utilized', 'journalctl Triaged'],
      tech: ['RHEL 9', 'df -h (LVM)', 'free -h', 'systemctl --failed', 'journalctl -p err', 'NVMe UEFI'],
    },
    {
      id: 'linux-network-audit',
      category: 'linux',
      badge: 'LINUX LAB',
      title: 'Linux Kernel Network Stack, Socket Auditing & Diagnostic Verification',
      subtitle: 'Subsystem Analysis via iproute2, ss -tuln & Dual-Stack DNS Telemetry',
      image: '/images/linux-network-audit.png',
      desc: 'Conducted a deep-level diagnostic audit of an enterprise Linux operating system network subsystem. Configured and analyzed interface ens160 (192.168.183.129/24) with gateway 192.168.183.2. Audited all listening network sockets using "ss -tuln" (identifying active SSH daemon on port 22, CUPS on 631, and mDNS 5353). Tested ICMP packet transmission and round-trip delay (3.05ms PTT), inspected kernel IP route table, and resolved dual-stack IPv4/IPv6 address records via "getent hosts".',
      highlights: [
        'Interface configuration audit via "ip addr": ens160 state UP, MTU 1500, dynamic DHCP lease',
        'Socket security audit via "ss -tuln": Verified authorized listening TCP/UDP sockets (SSH port 22, chrony NTP 323)',
        'Kernel routing inspection via "ip route": Default route via 192.168.183.2 on ens160 metric 100',
        'Dual-stack IPv4/IPv6 name service switch resolution verification via "getent hosts google.com"',
      ],
      metrics: ['3.05ms PTT Latency', 'Zero Rogue Ports', 'IPv4/IPv6 Dual-Stack'],
      tech: ['RHEL / CentOS', 'iproute2 (ip addr, ip route)', 'ss -tuln Socket Audit', 'DNS Resolution', 'ICMP Diagnostics'],
    },
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#e0e0e0] font-sans selection:bg-white selection:text-black">
      
      {/* Cyber Security Matrix Rain Background Effect */}
      {matrixEnabled && <MatrixRain opacity={0.16} />}

      {/* 1. Clean Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#07070a]/95">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center font-mono font-bold text-xs text-white">
              ⬡
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-black text-sm tracking-wider uppercase text-white">
                SAHIL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400">
                CYBER SECURITY
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
              Specializations
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors cursor-pointer">
              Projects ({projects.length})
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMatrixEnabled(!matrixEnabled)}
              title={matrixEnabled ? 'Turn off Matrix Effect' : 'Turn on Matrix Effect'}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono transition-all cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${matrixEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
              <span>{matrixEnabled ? 'MATRIX: ON' : 'MATRIX: OFF'}</span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Clean, High Impact & Completely Lag-Free */}
      <section className="pt-36 pb-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CCNA Certified &bull; Linux Systems &bull; Network Defense
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-syne font-black tracking-tight uppercase leading-[0.9] text-white">
            SAHIL<br />
            <span className="chrome-text">SECURITY</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Cyber Security Specialist with verified hands-on expertise in Cisco enterprise routing topologies (CCNA) and Red Hat Enterprise Linux (RHEL 9) kernel defense and diagnostic auditing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              View Hands-On Projects
              <ArrowUpRight size={14} />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-white bg-white/5 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Contact Sahil
            </button>
          </div>

          {/* Clean Stats */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10 max-w-xl mx-auto">
            <div>
              <div className="text-3xl font-syne font-bold text-white">CCNA</div>
              <div className="text-xs font-mono text-zinc-400 uppercase mt-1">Cisco Routing</div>
            </div>
            <div>
              <div className="text-3xl font-syne font-bold text-white">RHEL 9</div>
              <div className="text-xs font-mono text-zinc-400 uppercase mt-1">Linux Kernel</div>
            </div>
            <div>
              <div className="text-3xl font-syne font-bold text-white">100%</div>
              <div className="text-xs font-mono text-zinc-400 uppercase mt-1">Verified Labs</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Specializations - Clean 3-Card Grid */}
      <section id="about" className="py-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 block mb-2">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-syne font-black uppercase text-white">
              WHAT I SPECIALIZE IN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0f] space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white">
                <Network size={20} />
              </div>
              <h3 className="text-lg font-syne font-bold uppercase text-white">Cisco Networking (CCNA)</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Inter-VLAN routing with 802.1Q Dot1Q sub-interfaces, Router-on-a-Stick, Serial WAN clock synchronization, and high-availability dynamic routing.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['802.1Q Dot1Q', 'Serial WAN', 'Trunking', 'Packet Tracer'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">{t}</span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0f] space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white">
                <Server size={20} />
              </div>
              <h3 className="text-lg font-syne font-bold uppercase text-white">Linux Systems &amp; RHEL 9</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Kernel diagnostics, process telemetry with `top`, storage LVM volume inspection, systemd unit health (`systemctl`), and `journalctl` error log triage.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['RHEL 9', 'top monitor', 'LVM df -h', 'systemctl', 'journalctl'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">{t}</span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0f] space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-syne font-bold uppercase text-white">Security &amp; Edge NAT</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Perimeter NAT/PAT overload gateway implementation, standard and extended access lists (ACLs), low-level socket inspection (`ss -tuln`), and zero-trust isolation.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['NAT / PAT', 'Access Lists', 'ss -tuln', 'Socket Audit'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified Hands-On Projects Section */}
      <section id="projects" className="py-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                VERIFIED LAB EVIDENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-syne font-black uppercase text-white">
                HANDS-ON PROJECTS
              </h2>
            </div>

            {/* Simple Clean Tabs */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-lg border border-white/15 bg-[#0a0a0f]">
              {[
                { id: 'all', label: `ALL (${projects.length})` },
                { id: 'ccna', label: 'CCNA & TOOLS (3)' },
                { id: 'linux', label: 'LINUX LABS (3)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-[#08080c] overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all duration-300"
              >
                <div>
                  {/* Clean Screenshot Header with Zoom Hint */}
                  <div 
                    onClick={() => setSelectedProject(p)}
                    className="relative h-56 bg-black border-b border-white/10 overflow-hidden cursor-pointer group"
                  >
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-102" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                        <ZoomIn size={14} />
                        View Full Screenshot
                      </span>
                    </div>
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 border border-white/20 text-white font-semibold">
                      {p.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-syne font-bold uppercase text-white leading-snug">
                      {p.title}
                    </h3>
                    
                    <div className="text-xs font-mono text-emerald-400 font-medium">
                      {p.subtitle}
                    </div>

                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Quick bullet points */}
                    <div className="pt-2 space-y-1">
                      {p.highlights.slice(0, 2).map((hl, i) => (
                        <div key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400">▹</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer specs & CTA */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(p)}
                    className="w-full py-2.5 rounded-lg border border-white/15 hover:border-white bg-white/5 text-xs font-mono uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Inspect Full Topology &amp; Specs
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Clean Modal Lightbox for Project Screenshots */}
      {selectedProject && (
        <div 
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl border border-white/20 bg-[#0d0d12] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between bg-black/50">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                {selectedProject.badge} // VERIFIED LAB EVIDENCE
              </span>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg border border-white/15 hover:border-white text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="rounded-xl overflow-hidden border border-white/15 bg-black">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-auto object-contain max-h-[460px] mx-auto"
                />
              </div>

              <div>
                <h3 className="text-2xl font-syne font-bold uppercase text-white mb-1">
                  {selectedProject.title}
                </h3>
                <div className="text-xs font-mono text-emerald-400 mb-3">
                  {selectedProject.subtitle}
                </div>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {selectedProject.desc}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                <div className="text-xs font-mono uppercase text-white font-bold mb-1">
                  VERIFIED CONFIGURATIONS &amp; COMMAND VALIDATION:
                </div>
                {selectedProject.highlights.map((h, i) => (
                  <div key={i} className="text-xs font-mono text-zinc-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tech.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-white/10 border border-white/20 text-white">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/15 flex items-center justify-between bg-black/50">
              <span className="text-[10px] font-mono text-zinc-400">
                VERIFIED BY SAHIL
              </span>
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Clean, Simple Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-white/10 bg-[#08080c] p-8 sm:p-12 space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white">
                LET'S CONNECT
              </h2>
              <p className="text-sm text-zinc-400 font-light max-w-md mx-auto">
                Available for Cyber Security roles, Cisco Network Engineering, and Linux Systems Defense.
              </p>
            </div>

            {/* Direct Contact Options: Email & Phone / WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              
              {/* Email Card */}
              <div className="p-4 rounded-xl border border-white/15 bg-black/60 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <Mail size={14} className="text-white" />
                  <span>Email Transmission</span>
                </div>
                <div className="font-mono text-sm text-white select-all break-all">
                  sahilkumar202232@gmail.com
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={copyEmail}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedEmail ? 'COPIED' : 'COPY EMAIL'}</span>
                  </button>
                  <a
                    href="mailto:sahilkumar202232@gmail.com"
                    className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Send Email"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="p-4 rounded-xl border border-white/15 bg-black/60 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-emerald-400" />
                    <span>Phone &bull; WhatsApp</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">ACTIVE</span>
                </div>
                <div className="font-mono text-sm text-white select-all">
                  +91 7042131215
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/917042131215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-medium"
                  >
                    <WhatsAppIcon size={14} />
                    <span>WHATSAPP</span>
                  </a>
                  <a
                    href="tel:+917042131215"
                    className="py-1.5 px-3 rounded-lg border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Call directly"
                  >
                    <Phone size={13} />
                  </a>
                  <button
                    onClick={copyPhone}
                    className="py-1.5 px-2.5 rounded-lg border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Copy number"
                  >
                    {copiedPhone ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Social & Direct Comms Bar */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/sahil-0b0172445"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white bg-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/Sahil9599"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white bg-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="GitHub Profile"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>

              <a
                href="https://wa.me/917042131215"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50 flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+917042131215"
                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white bg-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Call 7042131215"
              >
                <Phone size={16} />
                <span>Call</span>
              </a>
            </div>

            {/* Simple Form */}
            {formSubmitted ? (
              <div className="text-center py-6 space-y-2 border-t border-white/10 pt-6">
                <Check size={28} className="text-emerald-400 mx-auto" />
                <h4 className="font-syne font-bold uppercase text-white">Message Dispatched</h4>
                <p className="text-xs font-mono text-zinc-400">Thank you, Sahil will respond to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/50 text-white font-mono text-sm focus:border-white focus:outline-none placeholder:text-zinc-600"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/50 text-white font-mono text-sm focus:border-white focus:outline-none placeholder:text-zinc-600"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Your message or project scope..."
                  className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/50 text-white font-mono text-sm focus:border-white focus:outline-none placeholder:text-zinc-600 resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 7. Clean Minimal Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs font-mono text-zinc-500">
        <div>SAHIL // CYBER SECURITY &bull; CCNA &bull; LINUX ARCHITECT</div>
        <div className="text-[10px] text-zinc-600 mt-1">ALL RIGHTS RESERVED &bull; 2026</div>
      </footer>

      {/* Floating Back To Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-white/20 bg-black/90 hover:border-white text-white transition-all shadow-xl hover:scale-105 cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

    </div>
  );
}
