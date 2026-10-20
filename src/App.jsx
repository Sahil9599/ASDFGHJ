import React, { useState, useEffect, useRef } from 'react';
import ChromeCanvas from './components/ChromeCanvas';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { 
  ArrowUpRight, 
  ArrowUp,
  Terminal as TerminalIcon, 
  Volume2, 
  VolumeX, 
  Layers, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink,
  Code2,
  Database,
  Activity,
  Server,
  Network,
  Lock,
  Key,
  FolderLock,
  X,
  Maximize2,
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

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
  </svg>
);

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    'SAHIL-SEC-OS v5.2 // DEFENSIVE KERNEL INITIALIZED.',
    'Status: NETWORK SHIELD ARMED & LINUX HARDENING ACTIVE.',
    'Type "help" to inspect CCNA topologies, Linux exploits defense, or contact protocols.',
  ]);

  const lenisRef = useRef(null);

  // Initialize ultra-smooth inertial momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = lenis;

    const handleScroll = (e) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (e.scroll / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowScrollTop(e.scroll > 500);
    };

    lenis.on('scroll', handleScroll);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth scroll for anchor clicks
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        sound.playClick();
        lenis.scrollTo(targetElement, { offset: -70, duration: 1.4 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Close modal on Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImageModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('keydown', handleKeyDown);
      lenis.destroy();
    };
  }, []);

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('sahil.cybersec@gmail.com');
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    sound.playChime();
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'],
    });
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 6000);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    sound.playClick();

    let reply = '';
    if (cmd === 'help') {
      reply = 'Available commands: whoami, ccna, linux, topologies, skills, certs, contact, clear';
    } else if (cmd === 'whoami') {
      reply = 'SAHIL — Cyber Security Specialist, Cisco Certified Network Associate (CCNA), and Linux Systems Defense Architect.';
    } else if (cmd === 'topologies') {
      reply = 'Active Tested Topologies: 1. Inter-VLAN IEEE 802.1Q Dot1Q Router-on-a-Stick + Serial WAN | 2. Cisco Edge NAT/PAT Overload | 3. Linux Kernel Socket Audit & Routing.';
    } else if (cmd === 'ccna') {
      reply = 'CCNA STACK: Cisco IOS, Inter-VLAN 802.1Q Dot1Q, NAT/PAT Overload, Serial WAN (Se2/0), OSPF, HSRP, Extended ACLs, Port Security.';
    } else if (cmd === 'linux') {
      reply = 'LINUX STACK: Kernel Hardening, iproute2, ss -tuln Socket Inspection, CIS Benchmark, SELinux/AppArmor, iptables/nftables, Suricata IDS, Bash/Python Automation.';
    } else if (cmd === 'skills') {
      reply = 'Penetration Testing, Network Packet Inspection, Zero-Trust Architecture, Firewalls, Threat Intelligence, SIEM (Splunk/ELK), Memory Forensics.';
    } else if (cmd === 'certs') {
      reply = 'Certifications & Specialties: CCNA (Cisco Certified Network Associate), Linux Professional Institute (LPIC), Network Defense & Security Operations.';
    } else if (cmd === 'contact') {
      reply = 'Encrypted Comms: sahil.cybersec@gmail.com | LinkedIn: /in/sahil-cybersec | GitHub: @sahil-sec';
    } else if (cmd === 'clear') {
      setTerminalOutput([]);
      setTerminalInput('');
      return;
    } else if (cmd === '') {
      return;
    } else {
      reply = `Command not recognized: "${cmd}". Type "help" for a list of security diagnostics.`;
    }

    setTerminalOutput((prev) => [...prev, `$ ${terminalInput}`, reply]);
    setTerminalInput('');
  };

  // Only verified hands-on projects with genuine screenshots
  const projects = [
    // CCNA HANDS-ON PROJECTS (WITH EXACT USER SCREENSHOTS & TOPOLOGIES)
    {
      id: 'ccna-inter-vlan-dot1q',
      category: 'ccna',
      badge: 'CCNA TOPOLOGY // VERIFIED',
      title: 'Inter-VLAN Routing with IEEE 802.1Q Dot1Q & Serial WAN',
      subtitle: 'Cisco Router-on-a-Stick, Trunking & Dual-Site Routed Architecture',
      image: '/images/cisco-inter-vlan.png',
      desc: 'Engineered and simulated a multi-site enterprise network in Cisco Packet Tracer. Interconnected two site routers via a Serial WAN link (Se2/0 with 30.0.0.1/30 and 30.0.0.2/30). Each local site utilizes Cisco Catalyst switches trunked (802.1Q) to Cisco Routers using Router-on-a-Stick. Configured sub-interfaces with Dot1Q encapsulation for VLAN 1 (10.0.0.1/24 & 40.0.0.1/24) and VLAN 2 (20.0.0.1/24 & 50.0.0.1/24). Verified successful ICMP reachability across subnets with 0% packet loss.',
      highlights: [
        'IEEE 802.1Q Dot1Q sub-interface encapsulation on Fa0/0.1 and Fa0/0.2',
        'Serial Se2/0 WAN connection clock rate synchronization (30.0.0.1/30 to 30.0.0.2/30)',
        'Switchport Mode Trunk configured on Switch Fa0/1 uplink interfaces',
        'Demonstrated 100% successful ICMP end-to-end ping between PC14 (10.0.0.2) and PC16 (40.0.0.2)',
      ],
      metrics: ['0% Packet Loss', 'IEEE 802.1Q Dot1Q', 'Dual-Site Serial'],
      tech: ['Cisco Packet Tracer', 'Cisco IOS', '802.1Q Dot1Q', 'Serial WAN', 'Inter-VLAN', 'ICMP'],
      year: 'CCNA LABS',
    },
    {
      id: 'ccna-nat-pat',
      category: 'ccna',
      badge: 'CCNA EDGE // VERIFIED',
      title: 'Enterprise Network Address Translation (NAT / PAT Overload)',
      subtitle: 'Private IP to Public WAN Gateway with Cisco Edge Router',
      image: '/images/cisco-nat-pat.png',
      desc: 'Architected and validated perimeter Network Address Translation (NAT) and Port Address Translation (PAT) on a Cisco perimeter router. Translated private corporate subnet (10.0.0.0/24 with PC0 10.0.0.2 and PC1 10.0.0.3) to a single public IP address (200.0.0.1) on Fa1/0. Applied standard Access Control Lists (ACLs) to designate internal traffic, configured "ip nat inside" on Fa0/0 and "ip nat outside" on Fa1/0, and validated real-time ICMP packet delivery to Server0 (200.0.0.2).',
      highlights: [
        'Command: "ip nat inside source list 1 interface FastEthernet1/0 overload"',
        'Access List: "access-list 1 permit 10.0.0.0 0.0.0.255"',
        'Interface demarcation: Fa0/0 (ip nat inside) <-> Fa1/0 (ip nat outside)',
        'Verified in Packet Tracer simulation: successful translation and reply from public Server0 (200.0.0.2)',
      ],
      metrics: ['PAT Dynamic Overload', 'RFC 1918 Masked', '100% WAN Delivery'],
      tech: ['Cisco IOS NAT', 'PAT Overload', 'Standard ACL', 'FastEthernet', 'Public WAN Server'],
      year: 'CCNA LABS',
    },

    // LINUX PROJECTS (WITH SAHIL'S HARDENED LINUX TERMINAL SCREENSHOTS & AUDITS)
    {
      id: 'linux-rhel9-top-monitor',
      category: 'linux',
      badge: 'RHEL 9 KERNEL // VERIFIED',
      title: 'RHEL 9 Real-Time Kernel Process & Resource Telemetry (top)',
      subtitle: 'Process Lifecycle, Kernel Threads & kauditd Security Subsystem Analysis',
      image: '/images/rhel9-process-monitor.png',
      desc: 'Conducted real-time process lifecycle auditing and kernel thread analysis on Red Hat Enterprise Linux 9 (RHEL 9 64-bit on VMware). Utilized "top" to capture system load metrics (load average: 0.72, 0.46, 0.16), CPU state distribution (98.7% idle, 0.7% user, 0.5% system), and memory allocation across 1674.3 MiB physical RAM and 2060.0 MiB swap. Analyzed critical system daemons (systemd PID 1, vmtoolsd, gnome-shell) and kernel threads including "kauditd" (Linux security audit daemon), "oom_reaper" (out-of-memory handler), and "rcu_tasks_kthre".',
      highlights: [
        'Real-time CPU telemetry via "top": 346 total tasks (1 running, 345 sleeping, 0 zombie) with 98.7% idle headroom',
        'Kernel security thread audit: Inspected PID 38 "kauditd" (kernel audit daemon routing security events to auditd)',
        'Virtualization integration: Monitored PID 6923 "vmtoolsd" ensuring VMware hypervisor clock synchronization',
        'Core process tree hierarchy: Validated PID 1 "systemd", PID 2 "kthreadd", and asynchronous "kworker" pools',
      ],
      metrics: ['98.7% CPU Idle', '0 Zombie Tasks', 'kauditd Active'],
      tech: ['RHEL 9 (Red Hat)', 'top', 'kauditd', 'systemd (PID 1)', 'Kernel Threads', 'VMware'],
      year: 'RHEL 9 LABS',
    },
    {
      id: 'linux-rhel9-system-triage',
      category: 'linux',
      badge: 'RHEL 9 FORENSICS // VERIFIED',
      title: 'RHEL 9 Storage/LVM Partitioning, Memory & Systemd Journal Triage',
      subtitle: 'Filesystem Forensics, Zero Failed Units & journalctl Error Analysis',
      image: '/images/rhel9-storage-audit.png',
      desc: 'Executed a comprehensive storage, memory, and error-triage audit on Red Hat Enterprise Linux 9. Inspected volatile memory states via "free -h" (1.2Gi used, 489Mi buff/cache, 0.0Ki swap used). Analyzed disk partitioning and logical volumes using "df -h", validating LVM root volume "/dev/mapper/rhel_192-root" (29G total, 17% utilized) alongside NVMe UEFI boot partitions ("/dev/nvme0n1p1" & "/dev/nvme0n1p2"). Verified systemd unit integrity with "systemctl --failed" (confirming 0 failed loaded units), and conducted forensic error log triage with "journalctl -p err -n 20" to analyze low-level kernel SMBus warnings and PAM keyring control file states.',
      highlights: [
        'Volatile memory analysis via "free -h": 1.6Gi total RAM, 489Mi page buff/cache, and 0.0Ki swap pressure',
        'Storage & LVM layout via "df -h": Validated LVM root volume (/dev/mapper/rhel_192-root, 29G, 17% used) on NVMe',
        'Systemd service health via "systemctl --failed": "0 loaded units listed" (100% services operating normally)',
        'Log forensics via "journalctl -p err -n 20": Triaged kernel piix4_smbus address warnings and gkr-pam control checks',
      ],
      metrics: ['0 Failed Services', '17% LVM Utilized', 'journalctl Triaged'],
      tech: ['RHEL 9', 'df -h (LVM)', 'free -h', 'systemctl --failed', 'journalctl -p err', 'NVMe UEFI'],
      year: 'RHEL 9 AUDIT',
    },
    {
      id: 'linux-network-audit',
      category: 'linux',
      badge: 'LINUX AUDIT // VERIFIED',
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
      year: 'LINUX AUDIT',
    },
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className="relative min-h-screen bg-[#020203] text-white selection:bg-white selection:text-black">
      {/* Background radial gradient highlights mimicking presentation slide ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-b from-white/5 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-t from-zinc-800/10 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2.5px] z-[60] bg-white/5 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.7)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              onMouseEnter={() => sound.playHover()} 
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center font-mono font-bold text-xs tracking-wider group-hover:border-white transition-colors">
                ⬡
              </div>
              <div className="flex flex-col">
                <span className="font-syne font-black text-sm tracking-wider uppercase text-white group-hover:text-zinc-200">
                  SAHIL
                </span>
                <span className="text-[9px] font-mono tracking-ultra text-zinc-400">
                  CYBER SECURITY
                </span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TOPOLOGIES VALIDATED // CCNA &amp; LINUX
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <a href="#about" onMouseEnter={() => sound.playHover()} className="hover:text-white transition-colors">About Sahil</a>
            <a href="#what-we-do" onMouseEnter={() => sound.playHover()} className="hover:text-white transition-colors">Specializations</a>
            <a href="#vision" onMouseEnter={() => sound.playHover()} className="hover:text-white transition-colors">Defense Doctrine</a>
            <a href="#projects" onMouseEnter={() => sound.playHover()} className="hover:text-white transition-colors">CCNA &amp; Linux Labs</a>
            <a href="#terminal" onMouseEnter={() => sound.playHover()} className="hover:text-white transition-colors">Console</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
              className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:border-white/40 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-mono cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} />}
              <span className="text-[10px] hidden sm:inline">{soundEnabled ? 'FX ON' : 'FX OFF'}</span>
            </button>

            <a
              href="#contact"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider chrome-button font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              Contact Sahil
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 z-20 relative">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] font-mono tracking-ultra text-zinc-300 uppercase">
                <ShieldCheck size={13} className="text-emerald-400" />
                Cyber Security Specialist &bull; Network &bull; Linux
              </div>
              
              {/* Massive Title Matching Slide 1 Typography - Perfectly clamped so SECURITY is 100% visible without clipping */}
              <h1 className="text-[clamp(2.6rem,5.2vw,5.2rem)] font-syne font-black tracking-tight uppercase leading-[0.92] text-white">
                SAHIL<br />
                <span className="chrome-text inline-block">SECURITY</span>
              </h1>
              
              <p className="text-xs sm:text-sm font-mono tracking-ultra uppercase text-zinc-400 pt-2 font-medium">
                C C N A   &bull;   L I N U X   S Y S T E M S   &bull;   D E F E N S E
              </p>
            </div>

            {/* Core statement from presentation theme */}
            <p className="text-base sm:text-xl text-zinc-300 max-w-xl font-light leading-relaxed">
              We build and secure software and network topologies that empower organizations to effectively defend their data, infrastructure, and operations from sophisticated cyber threats.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projects"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest chrome-button font-bold flex items-center gap-2 cursor-pointer"
              >
                Inspect Hands-On Projects
                <ArrowUpRight size={14} />
              </a>

              <a
                href="#what-we-do"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-white bg-white/5 text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Security Arsenal
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-syne font-bold text-white">CCNA</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Cisco Topologies</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-syne font-bold text-white">100%</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Linux Hardened</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-syne font-bold text-white">0%</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Packet Loss Trace</div>
              </div>
            </div>
          </div>

          {/* Right 3D Chrome Canvas Column */}
          <div className="lg:col-span-5 h-[480px] sm:h-[580px] w-full relative flex items-center justify-center">
            <div className="absolute inset-0 ambient-spotlight rounded-full scale-125 pointer-events-none" />

            <div className="w-full h-full rounded-3xl chrome-border relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                  REAL-TIME 3D SHIELD // INTERACTIVE
                </span>
              </div>

              <ChromeCanvas shape="knot" className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: WHAT WE DO (Slide 2 theme) */}
      <section id="what-we-do" className="py-28 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500 block mb-3">
                C Y B E R   S E C U R I T Y   D I V I S I O N
              </span>
              <h2 className="text-4xl sm:text-6xl font-syne font-black tracking-tight uppercase text-white">
                WHAT WE DO
              </h2>
            </div>
            <p className="text-sm font-mono tracking-wider text-zinc-400 max-w-md">
              From Cisco routing, NAT/PAT, and 802.1Q VLAN trunking to low-level Linux socket telemetry and proactive threat containment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Network className="text-white" size={24} />,
                title: 'Cisco Routing & Inter-VLAN (CCNA)',
                desc: 'Configuring 802.1Q Dot1Q trunking, Router-on-a-Stick sub-interfaces, Serial WAN topologies, and OSPF/BGP dynamic routing tables.',
                tags: ['Cisco IOS', '802.1Q Dot1Q', 'Serial WAN', 'OSPF', 'VLANs'],
              },
              {
                icon: <Globe className="text-white" size={24} />,
                title: 'Perimeter NAT / PAT Overload Gateway',
                desc: 'Deploying edge Network Address Translation and Port Address Translation overload, mapping private subnets (10.0.0.0/24) to public IPs.',
                tags: ['NAT Overload', 'PAT', 'Access Lists', 'Edge Router'],
              },
              {
                icon: <Server className="text-white" size={24} />,
                title: 'Linux Systems & Socket Auditing',
                desc: 'Diagnosing network stacks with iproute2, auditing listening sockets with "ss -tuln", analyzing DNS switch resolvers, and enforcing CIS Benchmark L2.',
                tags: ['ss -tuln', 'iproute2', 'DNS Resolvers', 'auditd', 'Bash'],
              },
              {
                icon: <Lock className="text-white" size={24} />,
                title: 'Zero-Trust Micro-Segmentation & ACLs',
                desc: 'Stopping lateral attacker movement using Private VLANs, Extended Access Control Lists, TACACS+/RADIUS AAA servers, and 802.1X port defense.',
                tags: ['Private VLAN', 'Extended ACL', 'AAA Server', '802.1X'],
              },
              {
                icon: <ShieldCheck className="text-white" size={24} />,
                title: 'Intrusion Detection & Threat Hunting (IDS/IPS)',
                desc: 'Real-time packet inspection and automated threat blocking using Suricata and Snort, paired with dynamic nftables and fail2ban rules.',
                tags: ['Suricata', 'Snort', 'nftables', 'Wireshark', 'fail2ban'],
              },
              {
                icon: <Key className="text-white" size={24} />,
                title: 'Cryptographic VPNs & Secure Gateways',
                desc: 'Site-to-site IPsec tunnels with IKEv2 and AES-256 encryption on Cisco ASA, and high-performance WireGuard zero-trust bastion tunnels on Linux.',
                tags: ['IPsec IKEv2', 'WireGuard', 'Cisco ASA', 'OpenSSL'],
              },
            ].map((service, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => sound.playHover()}
                className="group p-8 rounded-2xl chrome-border hover:border-white/40 transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center mb-6 group-hover:border-white/50 group-hover:bg-white/10 transition-all">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-syne font-bold uppercase text-white mb-3 group-hover:text-zinc-200">
                  {service.title}
                </h3>
                
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {service.desc}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {service.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider bg-white/5 border border-white/10 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: ABOUT SAHIL (Slide 3 theme) */}
      <section id="about" className="py-28 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 3D Ribbon / Möbiüs Viewer */}
            <div className="lg:col-span-5 h-[440px] sm:h-[520px] rounded-3xl chrome-border relative overflow-hidden order-2 lg:order-1">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                  SECURITY TOPOLOGY // 3D CONTINUUM
                </span>
              </div>
              <ChromeCanvas shape="mobius" className="w-full h-full" />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <div>
                <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500 block mb-3">
                  C Y B E R   S E C U R I T Y   A R C H I T E C T
                </span>
                <h2 className="text-4xl sm:text-6xl font-syne font-black tracking-tight uppercase text-white mb-6">
                  ABOUT SAHIL
                </h2>
                
                {/* Statement matching presentation slide 3 */}
                <p className="text-xl sm:text-2xl text-zinc-200 font-normal leading-relaxed mb-6">
                  "We've advanced beyond incremental efficiencies to bring intelligence to the core of everything that matters most to your enterprise defense."
                </p>
                
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  I am Sahil, a Cyber Security specialist with verified hands-on expertise in Cisco Network Engineering (CCNA) and enterprise Linux defense. I design, configure, and validate multi-layered defense architectures—from sub-interface Dot1Q encapsulation and edge NAT translation to Linux kernel socket auditing and packet inspection.
                </p>
              </div>

              {/* Bento grid highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-1">CISCO NETWORKING (CCNA)</div>
                  <div className="font-syne font-bold text-white text-lg">Verified Packet Tracer Topologies</div>
                  <p className="text-xs text-zinc-400 mt-2">Router-on-a-Stick Dot1Q, multi-site Serial links, NAT overload, and access lists tested with zero packet loss.</p>
                </div>

                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-1">LINUX HARDENING &amp; KERNEL</div>
                  <div className="font-syne font-bold text-white text-lg">Subsystem Socket Audits</div>
                  <p className="text-xs text-zinc-400 mt-2">Low-level port inspection (ss -tuln), iproute2 subnet diagnosis, and dual-stack DNS resolution on enterprise Linux.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: VISION (Slide 4 theme) */}
      <section id="vision" className="py-28 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500">
              S E C U R I T Y   D O C T R I N E
            </span>
            <h2 className="text-4xl sm:text-7xl font-syne font-black tracking-tight uppercase text-white">
              VISION
            </h2>
            
            {/* Presentation Slide 4 text */}
            <p className="text-lg sm:text-2xl text-zinc-300 font-light leading-relaxed">
              We've advanced beyond incremental efficiencies to bring intelligence to the core of everything that matters most to your enterprise.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-zinc-500 tracking-ultra uppercase">
                ZERO-TRUST DEFENSE &bull; RESILIENT NETWORKS
              </span>
            </div>
          </div>

          {/* Interactive Vision Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            {[
              {
                phase: 'PILLAR 01 // ENTERPRISE CCNA',
                title: 'Inter-VLAN & NAT WAN Topologies',
                desc: 'Deploying robust 802.1Q dot1q encapsulation, cross-site serial routing, and edge PAT gateways with end-to-end packet verification.',
                status: 'VERIFIED & TESTED',
                color: 'text-emerald-400',
              },
              {
                phase: 'PILLAR 02 // LINUX DEFENSE',
                title: 'Kernel Socket Inspection & Zero-Trust',
                desc: 'Continuous socket auditing via "ss -tuln", CIS Benchmark Level 2 lockdown, and real-time IDS monitoring with Suricata.',
                status: 'OPERATIONAL',
                color: 'text-white',
              },
              {
                phase: 'PILLAR 03 // CYBER RESILIENCE',
                title: 'Automated Incident Response & Forensics',
                desc: 'Proactive vulnerability assessments, automated bash forensic log correlation, and sub-second anomaly containment.',
                status: 'ACTIVE DEFENSE',
                color: 'text-zinc-400',
              },
            ].map((milestone, i) => (
              <div 
                key={i}
                onMouseEnter={() => sound.playHover()}
                className="p-8 rounded-2xl chrome-border hover:border-white/40 transition-all duration-300 bg-gradient-to-b from-white/[0.04] to-transparent relative group"
              >
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
                  {milestone.phase}
                </div>
                <h3 className="text-xl font-syne font-bold text-white uppercase mb-4 group-hover:text-zinc-200">
                  {milestone.title}
                </h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {milestone.desc}
                </p>
                <div className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${milestone.color} flex items-center gap-2`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {milestone.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: SELECTED PROJECTS (Detailed CCNA & Linux with Verified Screenshots) */}
      <section id="projects" className="py-28 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500 block mb-3">
                S E C U R I T Y   P O R T F O L I O
              </span>
              <h2 className="text-4xl sm:text-6xl font-syne font-black tracking-tight uppercase text-white">
                PROJECTS
              </h2>
            </div>

            {/* Filter Tabs: All, CCNA Projects, Linux Projects */}
            <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
              {[
                { id: 'all', label: 'ALL PROJECTS' },
                { id: 'ccna', label: 'CCNA PROJECTS' },
                { id: 'linux', label: 'LINUX PROJECTS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    sound.playClick();
                  }}
                  className={`px-5 py-2 text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => sound.playHover()}
                className="group p-8 rounded-3xl chrome-border hover:border-white/50 transition-all duration-500 bg-gradient-to-b from-white/[0.04] to-transparent relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-ultra uppercase text-zinc-500">
                      {p.year}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border border-white/15 bg-white/5 text-zinc-300 font-semibold">
                      {p.badge}
                    </span>
                  </div>

                  {/* Screenshot Thumbnail Preview if available */}
                  {p.image && (
                    <div 
                      onClick={() => {
                        sound.playClick();
                        setSelectedImageModal(p);
                      }}
                      className="mb-6 rounded-2xl overflow-hidden border border-white/15 bg-black/80 relative cursor-pointer group/img"
                    >
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-52 object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-xl">
                          <ZoomIn size={13} />
                          Enlarge Topology &amp; Specs
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white mb-2 group-hover:text-zinc-200">
                    {p.title}
                  </h3>
                  
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 font-medium">
                    {p.subtitle}
                  </div>

                  <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                    {p.desc}
                  </p>

                  {/* Key Highlights list if available */}
                  {p.highlights && (
                    <div className="mb-6 space-y-1.5 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 mb-2 font-semibold">
                        Technical Highlights &amp; Validation:
                      </div>
                      {p.highlights.slice(0, 3).map((hl, hlIdx) => (
                        <div key={hlIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5">▹</span>
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-white/10 bg-black/40 mb-6">
                    {p.metrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-xs font-mono font-bold text-white">{metric}</div>
                        <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase mt-0.5">Benchmark</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider bg-white/5 border border-white/10 text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedImageModal(p);
                      }}
                      className="text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white flex items-center gap-1.5 group-hover:underline cursor-pointer"
                    >
                      Technical Architecture Spec
                      <ChevronRight size={13} />
                    </button>

                    <div className="flex items-center gap-2">
                      {p.image && (
                        <button 
                          onClick={() => {
                            sound.playClick();
                            setSelectedImageModal(p);
                          }}
                          className="p-2 rounded-full border border-white/15 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="View High-Res Topology"
                        >
                          <Maximize2 size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => sound.playClick()}
                        className="p-2 rounded-full border border-white/15 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Configuration Files / Scripts"
                      >
                        <Code2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Resolution Screenshot & Topology Lightbox Modal */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-3xl chrome-border bg-[#0a0a0f] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/15 bg-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono tracking-widest uppercase text-white font-bold">
                  {selectedImageModal.badge} // DETAILED SPECIFICATION
                </span>
              </div>

              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-2 rounded-full border border-white/20 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Full Image if available */}
              {selectedImageModal.image && (
                <div className="rounded-2xl overflow-hidden border border-white/20 bg-black shadow-inner">
                  <img 
                    src={selectedImageModal.image} 
                    alt={selectedImageModal.title}
                    className="w-full h-auto object-contain max-h-[460px] mx-auto"
                  />
                </div>
              )}

              <div>
                <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white mb-2">
                  {selectedImageModal.title}
                </h3>
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-4 font-semibold">
                  {selectedImageModal.subtitle}
                </div>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {selectedImageModal.desc}
                </p>
              </div>

              {/* Detailed Highlights */}
              {selectedImageModal.highlights && (
                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5">
                  <div className="text-[11px] font-mono tracking-widest uppercase text-white font-bold">
                    VERIFIED CONFIGURATION &amp; PROTOCOL HIGHLIGHTS:
                  </div>
                  {selectedImageModal.highlights.map((h, i) => (
                    <div key={i} className="text-xs font-mono text-zinc-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                {selectedImageModal.tech.map((t, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-md text-[10px] font-mono tracking-wider bg-white/10 border border-white/20 text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/15 bg-white/[0.02] flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                VERIFIED BY SAHIL // CCNA &amp; LINUX SECURITY
              </span>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider chrome-button font-bold cursor-pointer"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: INTERACTIVE SECURITY TERMINAL */}
      <section id="terminal" className="py-24 border-b border-white/10 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500 block mb-2">
              S E C U R I T Y   D I A G N O S T I C   C O N S O L E
            </span>
            <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white">
              INTERACTIVE REPL
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-2">
              Type <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">help</span>, <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">topologies</span>, <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">ccna</span>, <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">linux</span>, or <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">whoami</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-[#08080c] shadow-2xl overflow-hidden">
            {/* Terminal Top Bar */}
            <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-600" />
                <span className="w-3 h-3 rounded-full bg-zinc-600" />
                <span className="w-3 h-3 rounded-full bg-zinc-600" />
                <span className="ml-3 text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
                  sahil@security-bastion:~#
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SHIELD ACTIVE
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs sm:text-sm space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto">
              {terminalOutput.map((line, idx) => (
                <div 
                  key={idx} 
                  className={line.startsWith('$') ? 'text-white font-bold' : 'text-zinc-400 leading-relaxed'}
                >
                  {line}
                </div>
              ))}

              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'topologies', 'ccna', 'linux', 'whoami'..."
                  className="w-full bg-transparent border-none outline-none text-white font-mono placeholder:text-zinc-600"
                />
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: CONTACT & COLLABORATION */}
      <section id="contact" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-xs font-mono tracking-ultra uppercase text-zinc-500 block mb-3">
                  I N I T I A T E   S E C U R E   D I A L O G U E
                </span>
                <h2 className="text-4xl sm:text-7xl font-syne font-black uppercase text-white leading-tight">
                  CONNECT WITH<br />
                  <span className="chrome-text">SAHIL</span>
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed mt-6 max-w-lg">
                  Available for Cyber Security roles, Cisco Network Engineering, Linux Infrastructure Defense, and Enterprise Security Audits.
                </p>
              </div>

              {/* Quick Copy Email Box */}
              <div className="p-6 rounded-2xl chrome-border max-w-md bg-white/[0.02]">
                <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">
                  DIRECT ENCRYPTED TRANSMISSION
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="font-mono text-sm sm:text-base text-white select-all">
                    sahil.cybersec@gmail.com
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2.5 rounded-lg border border-white/15 bg-white/5 hover:border-white text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {[
                  { icon: <GithubIcon size={18} />, label: 'GitHub', href: 'https://github.com' },
                  { icon: <TwitterIcon size={18} />, label: 'X / Twitter', href: 'https://twitter.com' },
                  { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: 'https://linkedin.com' },
                  { icon: <Mail size={18} />, label: 'Email', href: 'mailto:sahil.cybersec@gmail.com' },
                ].map((social, sIdx) => (
                  <a
                    key={sIdx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 hover:border-white/50 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl chrome-border bg-gradient-to-b from-white/[0.04] to-transparent relative">
                {formSubmitted ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-syne font-bold uppercase text-white">Transmission Received</h3>
                    <p className="text-sm font-mono text-zinc-400 max-w-sm mx-auto">
                      Your inquiry has been encrypted and delivered directly to Sahil. Expect a response shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="text-xs font-mono tracking-ultra uppercase text-zinc-400 pb-2 border-b border-white/10">
                      SECURE INQUIRY DISPATCH
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                          Your Name / Organization
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Cisco Systems / Enterprise"
                          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                          Your Email
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                        Engagement Domain
                      </label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors"
                      >
                        <option value="network">Cisco Enterprise Network Architecture (CCNA)</option>
                        <option value="linux">Linux Server Hardening &amp; Kernel Security</option>
                        <option value="pentest">Vulnerability Assessment &amp; Threat Defense</option>
                        <option value="soc">Security Operations &amp; Incident Response</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                        Project Brief / Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detail your network requirements, Linux server audit scope, or security role details..."
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => sound.playHover()}
                      className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-widest chrome-button font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                    >
                      Transmit Dispatch
                      <ArrowUpRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="font-syne font-black text-sm tracking-widest uppercase text-white">
              SAHIL // CYBER SECURITY
            </div>
            <div className="text-[10px] font-mono tracking-ultra text-zinc-500 mt-1 uppercase">
              CCNA &bull; LINUX ARCHITECT &bull; ALL RIGHTS RESERVED
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#what-we-do" className="hover:text-white transition-colors">Specializations</a>
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          </div>

          <div className="text-[10px] font-mono text-zinc-600">
            LIQUID CHROME v5.2 &bull; ZERO-TRUST SECURITY ARMED
          </div>
        </div>
      </footer>

      {/* Floating Back To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => {
            sound.playClick();
            lenisRef.current?.scrollTo(0, { duration: 1.4 });
          }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-white/20 bg-black/80 hover:border-white text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-110 flex items-center justify-center group cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
