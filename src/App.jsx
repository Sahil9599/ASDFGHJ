import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import MatrixRain from './components/MatrixRain';
import ChromeCanvas from './components/ChromeCanvas';
import SubnetCalculator from './components/SubnetCalculator';
import CyberTerminal from './components/CyberTerminal';
import CursorGlow from './components/CursorGlow';
import SkillsRadar from './components/SkillsRadar';
import EngineeringTimeline from './components/EngineeringTimeline';
import DossierModal from './components/DossierModal';
import { sound } from './utils/sound';
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
  ZoomIn,
  Terminal,
  Volume2,
  VolumeX,
  Menu,
  FileText
} from 'lucide-react';

// ─── SVG Icon Components ────────────────────────────────────────────────────

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

// ─── Scroll Animation Wrapper ───────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, direction = 'up', className = '', once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };
  
  const offset = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Staggered Children Wrapper ─────────────────────────────────────────────

const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Animated Counter ───────────────────────────────────────────────────────

const AnimatedCounter = ({ value, suffix = '', prefix = '', duration = 1.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(prefix + '0' + suffix);

  useEffect(() => {
    if (!isInView) return;
    
    // Parse the numeric part
    const numericStr = value.replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    const decimals = numericStr.includes('.') ? numericStr.split('.')[1].length : 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      if (isNaN(target)) {
        setDisplay(prefix + value + suffix);
        return;
      }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (target * eased).toFixed(decimals);
      setDisplay(prefix + current + suffix);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(prefix + value + suffix);
      }
    };
    
    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, suffix, prefix, duration]);

  return <span ref={ref}>{display}</span>;
};

// ─── Typewriter Effect ──────────────────────────────────────────────────────

const Typewriter = ({ text, speed = 60, className = '', onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
        // Keep cursor blinking for a bit, then hide
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [isInView, text, speed, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && <span className="typewriter-cursor" />}
    </span>
  );
};

// ─── Preloader Component ────────────────────────────────────────────────────

const Preloader = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(() => onDone(), 600);
          }, 200);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className={`preloader ${done ? 'done' : ''}`}>
      <div className="preloader-icon text-4xl text-emerald-400">⬡</div>
      <div className="font-syne font-black text-xl text-white uppercase tracking-wider">
        SAHIL
      </div>
      <div className="font-mono text-xs text-emerald-400 tracking-widest uppercase">
        INITIALIZING DEFENSE CORE...
      </div>
      <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="font-mono text-[10px] text-zinc-500">
        {Math.min(Math.round(progress), 100)}% LOADED
      </div>
    </div>
  );
};


// ═════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [active3DShape, setActive3DShape] = useState('knot');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const [dossierOpen, setDossierOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -110]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setMobileMenuOpen(false);
        setDossierOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  const playHoverSound = () => {
    sound.playHover();
  };

  const playClickSound = () => {
    sound.playClick();
  };

  const copyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText('sahilkumar202232@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    playClickSound();
    navigator.clipboard.writeText('7042131215');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const scrollToSection = (id) => {
    playClickSound();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -64 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 6 Verified hands-on engineering lab projects with real screenshots
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
      category: 'tools',
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

  const navLinks = [
    { id: 'about', label: 'Capabilities' },
    { id: 'skills', label: 'Skills Matrix' },
    { id: 'netscope', label: 'NetScope Tool', badge: 'LIVE' },
    { id: 'projects', label: `Verified Labs (${projects.length})` },
    { id: 'timeline', label: 'Progression' },
    { id: 'terminal', label: 'REPL' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="relative min-h-screen bg-[#050508] text-[#e0e0e0] font-sans selection:bg-emerald-400 selection:text-black">
      
      {/* Preloader Overlay (mounts over scene so WebGL initializes behind it) */}
      <AnimatePresence>
        {preloading && (
          <motion.div
            key="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Preloader onDone={() => setPreloading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Cursor Glow Trail (Desktop Fine Pointer Only) */}
      <CursorGlow />

      {/* Cyber Security Matrix Rain Background Effect */}
      {matrixEnabled && <MatrixRain opacity={0.14} />}

      {/* Cyber Ambient Glow Mesh with Scroll Parallax */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: orb1Y }}
          className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px]"
        />
        <motion.div
          style={{ y: orb2Y }}
          className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]"
        />
        <motion.div
          style={{ y: orb3Y }}
          className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[140px]"
        />
      </div>

      {/* ═══════════ 1. NAVIGATION BAR ═══════════ */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#07070c]/85 backdrop-blur-xl">
        {/* Metallic Scroll Progress Bar */}
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-white z-50"
        />
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo Monogram */}
          <a 
            href="#" 
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl border border-white/20 bg-white/5 group-hover:border-emerald-400/60 group-hover:bg-emerald-500/10 flex items-center justify-center font-mono font-bold text-sm text-white group-hover:text-emerald-400 transition-all shadow-lg">
              ⬡
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-black text-sm tracking-wider uppercase text-white group-hover:text-emerald-300 transition-colors">
                SAHIL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400">
                DEFENSIVE ARCHITECT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onMouseEnter={playHoverSound}
                onClick={() => scrollToSection(link.id)}
                className="nav-link-underline hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Controls: Sound SFX & Matrix Rain & CTA & Mobile Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Disable SFX Click Audio' : 'Enable SFX Futuristic Audio'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                soundEnabled 
                  ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300' 
                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} />}
              <span className="hidden sm:inline">{soundEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>

            {/* Matrix Rain Toggle */}
            <button
              onClick={() => {
                playClickSound();
                setMatrixEnabled(!matrixEnabled);
              }}
              title={matrixEnabled ? 'Turn off Matrix Effect' : 'Turn on Matrix Effect'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono transition-all cursor-pointer text-zinc-300 hover:text-white"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${matrixEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="hidden sm:inline">{matrixEnabled ? 'MATRIX: ON' : 'MATRIX: OFF'}</span>
            </button>

            {/* Direct Contact Button (Desktop) */}
            <button
              onMouseEnter={playHoverSound}
              onClick={() => scrollToSection('contact')}
              className="hidden sm:block px-4 sm:px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider bg-white text-black font-bold hover:bg-emerald-400 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/20"
            >
              Get In Touch
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5 text-white cursor-pointer hover:border-emerald-400/50"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ MOBILE MENU OVERLAY ═══════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-[280px] h-full bg-[#0a0a12]/98 border-l border-white/10 backdrop-blur-xl flex flex-col lg:hidden"
            >
              {/* Mobile Menu Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-syne font-black text-sm tracking-wider uppercase text-white">
                  NAVIGATION
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg border border-white/15 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 px-6 py-6 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => scrollToSection(link.id)}
                    className="w-full text-left px-4 py-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {link.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className="px-6 py-5 border-t border-white/10 space-y-3">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full py-3 rounded-full font-mono text-xs uppercase tracking-wider bg-white text-black font-bold hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Get In Touch
                </button>
                <div className="flex items-center justify-center gap-3">
                  <a href="https://github.com/Sahil9599" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/15 text-zinc-400 hover:text-white">
                    <GithubIcon size={16} />
                  </a>
                  <a href="https://www.linkedin.com/in/sahil-0b0172445" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/15 text-zinc-400 hover:text-white">
                    <LinkedinIcon size={16} />
                  </a>
                  <a href="https://wa.me/917042131215" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:text-emerald-300">
                    <WhatsAppIcon size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ 2. HERO SECTION ═══════════ */}
      <section className="relative pt-32 sm:pt-40 pb-20 border-b border-white/10 cyber-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text & High-Impact Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Status Pill */}
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CCNA Certified &bull; RHEL 9 Defense &bull; Active Clearance Ready</span>
                </div>
              </FadeIn>

              {/* Main Headline with Typewriter */}
              <FadeIn delay={0.25}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-syne font-black tracking-tight uppercase leading-[0.95] text-white">
                  <Typewriter text="DEFENDING NETWORKS." speed={55} />
                  <br />
                  <span className="chrome-text">
                    <Typewriter text="HARDENING SYSTEMS." speed={55} />
                  </span>
                </h1>
              </FadeIn>

              {/* Sub-headline */}
              <FadeIn delay={0.5}>
                <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl">
                  Cyber Security Specialist &amp; Network Architect specializing in enterprise Cisco routing topologies (CCNA 802.1Q Dot1Q, NAT/PAT overload), Red Hat Enterprise Linux 9 kernel forensics, and zero-trust perimeter defense.
                </p>
              </FadeIn>

              {/* CTA Action Buttons */}
              <FadeIn delay={0.65}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => scrollToSection('projects')}
                    className="px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest bg-white text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:shadow-emerald-400/25 hover-glow"
                  >
                    <span>Explore Verified Labs</span>
                    <ArrowUpRight size={15} />
                  </button>

                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => scrollToSection('netscope')}
                    className="px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest border border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Network size={14} />
                    <span>Launch Subnet Tool</span>
                  </button>

                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => scrollToSection('terminal')}
                    className="px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Terminal size={14} />
                    <span>REPL Console</span>
                  </button>

                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => {
                      playClickSound();
                      setDossierOpen(true);
                    }}
                    className="px-5 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest border border-cyan-500/35 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>CV / Dossier</span>
                  </button>
                </div>
              </FadeIn>

              {/* Live Verified Telemetry Ticker with Animated Counters */}
              <FadeIn delay={0.8}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-2xl font-syne font-bold text-white flex items-center gap-1.5">
                      <AnimatedCounter value="0.0" suffix="%" />
                      <ShieldCheck size={16} className="text-emerald-400" />
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase">Packet Loss</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-syne font-bold text-emerald-300">
                      CCNA
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase">Cisco Certified</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-syne font-bold text-white">
                      RHEL 9
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase">Kernel Defense</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-syne font-bold text-cyan-300">
                      <AnimatedCounter value="3.05" suffix="ms" />
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase">Round-Trip PTT</div>
                  </div>
                </div>
              </FadeIn>

            </div>

            {/* Right Column: 3D Interactive WebGL Chrome Canvas */}
            <FadeIn delay={0.4} direction="right" className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-transparent p-2 shadow-2xl backdrop-blur-sm overflow-hidden group animated-border">
                
                {/* 3D WebGL Canvas */}
                <ChromeCanvas 
                  currentShape={active3DShape}
                  onShapeChange={(s) => {
                    setActive3DShape(s);
                    playClickSound();
                  }}
                  className="h-full rounded-2xl overflow-hidden" 
                />

                {/* Cyber HUD Floating Badges */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <div className="px-3 py-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md font-mono text-[10px] text-zinc-300 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DEFENSIVE CORE // ONLINE</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                  <div className="px-3 py-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md font-mono text-[10px] text-zinc-400 shadow-lg">
                    <span>THREE.JS // WEBGL 2.0</span>
                  </div>
                </div>

                {/* Subtle User Hint */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
                  <span className="px-3 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-zinc-400 uppercase tracking-widest backdrop-blur-md">
                    Click &amp; Drag to Rotate 3D Sculpture
                  </span>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ═══════════ 3. CORE SPECIALIZATIONS ═══════════ */}
      <section id="about" className="py-24 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <FadeIn>
            <div className="max-w-2xl mb-14">
              <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block mb-2 font-bold">
                // ARCHITECTURAL CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                ENGINEERED FOR RESILIENCE
              </h2>
              <p className="text-sm text-zinc-400 font-light mt-3">
                Deep-level hands-on competencies developed across hardware routers, enterprise switches, and hardened Linux kernel distributions.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Cisco CCNA */}
            <StaggerItem>
              <div 
                onMouseEnter={playHoverSound}
                className="tilt-card animated-border p-8 rounded-2xl border border-white/10 bg-[#08080d]/80 hover:bg-[#0a0a12] transition-all duration-300 space-y-4 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 group-hover:border-emerald-400/50 group-hover:bg-emerald-500/10 flex items-center justify-center text-white group-hover:text-emerald-400 transition-colors">
                  <Network size={22} />
                </div>
                <h3 className="text-xl font-syne font-bold uppercase text-white">
                  Cisco Enterprise Routing (CCNA)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Inter-VLAN routing with 802.1Q Dot1Q sub-interfaces, Router-on-a-Stick, Serial WAN clock rate synchronization, trunking uplinks, and verified 0% packet loss.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {['802.1Q Dot1Q', 'Router-on-a-Stick', 'Serial Se2/0', 'Trunking', 'Packet Tracer'].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Card 2: Linux RHEL 9 */}
            <StaggerItem>
              <div 
                onMouseEnter={playHoverSound}
                className="tilt-card animated-border p-8 rounded-2xl border border-white/10 bg-[#08080d]/80 hover:bg-[#0a0a12] transition-all duration-300 space-y-4 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 flex items-center justify-center text-white group-hover:text-cyan-400 transition-colors">
                  <Server size={22} />
                </div>
                <h3 className="text-xl font-syne font-bold uppercase text-white">
                  RHEL 9 Kernel &amp; Systems Triage
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Real-time kernel telemetry with `top`, storage LVM logical volume verification, memory swap pressure audits (`free -h`), systemd unit inspection, and `journalctl` error log triage.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {['RHEL 9', 'top monitor', 'kauditd Audit', 'LVM df -h', 'systemctl', 'journalctl'].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Card 3: Security & NAT */}
            <StaggerItem>
              <div 
                onMouseEnter={playHoverSound}
                className="tilt-card animated-border p-8 rounded-2xl border border-white/10 bg-[#08080d]/80 hover:bg-[#0a0a12] transition-all duration-300 space-y-4 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 group-hover:border-emerald-400/50 group-hover:bg-emerald-500/10 flex items-center justify-center text-white group-hover:text-emerald-400 transition-colors">
                  <Lock size={22} />
                </div>
                <h3 className="text-xl font-syne font-bold uppercase text-white">
                  Perimeter Defense &amp; NAT/PAT
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Edge NAT/PAT overload gateway implementation, standard and extended access lists (ACLs), low-level socket inspection (`ss -tuln`), and zero-trust internal isolation.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {['NAT / PAT Overload', 'Standard ACL', 'ss -tuln', 'Zero Rogue Ports', 'Wireshark'].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>

          </StaggerContainer>

        </div>
      </section>

      {/* ═══════════ 3.5 SKILLS RADAR & CAPABILITY MATRIX ═══════════ */}
      <section id="skills" className="py-24 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block mb-2 font-bold">
                  // QUANTIFIED PROFICIENCY
                </span>
                <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                  TECHNICAL RADAR
                </h2>
                <p className="text-sm text-zinc-400 font-light mt-3">
                  Interactive telemetry across networking protocols, kernel administration, and perimeter defense. Hover or select any axis to inspect details.
                </p>
              </div>
              <button
                onMouseEnter={playHoverSound}
                onClick={() => {
                  playClickSound();
                  setDossierOpen(true);
                }}
                className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText size={14} />
                <span>View Printable Dossier</span>
              </button>
            </div>
          </FadeIn>

          <SkillsRadar onSoundHover={playHoverSound} />
        </div>
      </section>

      {/* ═══════════ 4. NETSCOPE SUBNET CALCULATOR ═══════════ */}
      <section id="netscope" className="py-24 border-b border-white/10 relative bg-black/40">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          <FadeIn>
            <div className="max-w-2xl">
              <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block mb-2 font-bold">
                // INTERACTIVE CCNA NETWORK UTILITY
              </span>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                NETSCOPE PRO ENGINE
              </h2>
              <p className="text-sm text-zinc-400 font-light mt-3">
                Test and interact with the live bitwise subnetting calculation engine developed by Sahil. Adjust the CIDR prefix slider or pick enterprise presets to verify real-time network breakdown.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <SubnetCalculator onSoundClick={playClickSound} />
          </FadeIn>

        </div>
      </section>

      {/* ═══════════ 5. PROJECTS SECTION ═══════════ */}
      <section id="projects" className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block mb-2 font-bold">
                  // VERIFIED LAB EVIDENCE
                </span>
                <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                  HANDS-ON PROJECTS
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-lg">
                  High-resolution screenshots and verified CLI outputs from Cisco Packet Tracer topologies and Red Hat Enterprise Linux 9 installations.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-white/15 bg-[#0a0a10]">
                {[
                  { id: 'all', label: `ALL (${projects.length})` },
                  { id: 'ccna', label: 'CISCO CCNA (2)' },
                  { id: 'linux', label: 'RHEL 9 LABS (3)' },
                  { id: 'tools', label: 'NET TOOLS (1)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playClickSound();
                      setActiveTab(tab.id);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Projects Grid with Stagger Animation */}
          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p) => (
              <StaggerItem key={p.id}>
                <div
                  onMouseEnter={playHoverSound}
                  className="tilt-card animated-border rounded-2xl border border-white/10 bg-[#08080d] overflow-hidden flex flex-col justify-between hover:bg-[#0a0a12] transition-all duration-300 shadow-xl group"
                >
                  <div>
                    {/* Screenshot Thumbnail with Zoom Hint */}
                    <div 
                      onClick={() => {
                        playClickSound();
                        setSelectedProject(p);
                      }}
                      className="relative h-56 bg-black border-b border-white/10 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xl">
                          <ZoomIn size={14} />
                          Inspect Topology
                        </span>
                      </div>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-black/85 border border-white/20 text-white font-semibold">
                        {p.badge}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-syne font-bold uppercase text-white leading-snug group-hover:text-emerald-300 transition-colors">
                        {p.title}
                      </h3>
                      
                      <div className="text-xs font-mono text-emerald-400 font-medium">
                        {p.subtitle}
                      </div>

                      <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3">
                        {p.desc}
                      </p>

                      {/* Bullet Highlights */}
                      <div className="pt-2 space-y-1.5">
                        {p.highlights.slice(0, 2).map((hl, i) => (
                          <div key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-400 font-bold">▹</span>
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer metrics & CTA */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.metrics.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          {m}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedProject(p);
                      }}
                      className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Inspect Full Specs
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* ═══════════ 5.5 ENGINEERING PROGRESSION TIMELINE ═══════════ */}
      <section id="timeline" className="py-24 border-b border-white/10 relative bg-[#06060b]/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block font-bold">
                // ARCHITECTURAL PROGRESSION
              </span>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                DEFENSE MILESTONES
              </h2>
              <p className="text-sm text-zinc-400 font-light">
                Structured evolution from Cisco Packet Tracer topologies and custom CIDR tooling to Red Hat Enterprise Linux 9 kernel forensics.
              </p>
            </div>
          </FadeIn>

          <EngineeringTimeline />
        </div>
      </section>

      {/* ═══════════ 6. DIAGNOSTIC TERMINAL ═══════════ */}
      <section id="terminal" className="py-24 border-b border-white/10 bg-black/50">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          
          <FadeIn>
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold">
                // LIVE COMMAND INTERACTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                DIAGNOSTIC TERMINAL
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light">
                Execute live terminal commands like `help`, `topologies`, `ccna`, `linux`, or `ping 8.8.8.8` to inspect verified technical logs.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <CyberTerminal onSoundClick={playClickSound} />
          </FadeIn>

        </div>
      </section>

      {/* ═══════════ 7. PROJECT MODAL LIGHTBOX ═══════════ */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-2xl border border-white/20 bg-[#0d0d14] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between bg-black/60">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedProject.badge} // LAB EVIDENCE ARCHIVE
                </span>
                <button 
                  onClick={() => {
                    playClickSound();
                    setSelectedProject(null);
                  }}
                  className="p-1.5 rounded-lg border border-white/15 hover:border-white text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Screenshot Frame */}
                <div className="rounded-xl overflow-hidden border border-white/15 bg-black">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-auto object-contain max-h-[480px] mx-auto"
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

                {/* Verified Commands & Configurations */}
                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Verified Architecture Highlights
                  </span>
                  <div className="space-y-2">
                    {selectedProject.highlights.map((hl, i) => (
                      <div key={i} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 font-bold mt-0.5">▹</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono bg-white/10 border border-white/20 text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/15 flex items-center justify-between bg-black/60">
                <span className="text-[11px] font-mono text-zinc-400">
                  VERIFIED ARCHITECTURE BY SAHIL
                </span>
                <button 
                  onClick={() => {
                    playClickSound();
                    setSelectedProject(null);
                  }}
                  className="px-5 py-2 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-zinc-200"
                >
                  Close Lightbox
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ 8. CONTACT SECTION ═══════════ */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="rounded-3xl border border-white/15 bg-[#08080e]/90 p-8 sm:p-12 space-y-10 shadow-2xl backdrop-blur-xl relative overflow-hidden animated-border">
              
              <div className="text-center space-y-3">
                <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold">
                  // TRANSMISSION INTERFACE
                </span>
                <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white leading-tight">
                  LET'S CONNECT
                </h2>
                <p className="text-sm text-zinc-400 font-light max-w-md mx-auto">
                  Open for Cyber Security Analyst roles, Cisco Network Engineering, and Linux Systems Hardening.
                </p>
              </div>

              {/* Contact Channels Grid */}
              <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                
                {/* Email Transmission */}
                <StaggerItem>
                  <div className="p-5 rounded-2xl border border-white/15 bg-black/60 flex flex-col justify-between space-y-3 hover-glow">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                      <Mail size={15} className="text-white" />
                      <span>Email Transmission</span>
                    </div>
                    <div className="font-mono text-sm text-white select-all break-all font-semibold">
                      sahilkumar202232@gmail.com
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={copyEmail}
                        className="flex-1 py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedEmail ? 'COPIED' : 'COPY EMAIL'}</span>
                      </button>
                      <a
                        href="mailto:sahilkumar202232@gmail.com"
                        className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Send Email"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </StaggerItem>

                {/* Phone & WhatsApp Card */}
                <StaggerItem>
                  <div className="p-5 rounded-2xl border border-white/15 bg-black/60 flex flex-col justify-between space-y-3 hover-glow">
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-emerald-400" />
                        <span>Phone &bull; WhatsApp</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">ACTIVE</span>
                    </div>
                    <div className="font-mono text-sm text-white select-all font-semibold">
                      +91 7042131215
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="https://wa.me/917042131215"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClickSound}
                        className="flex-1 py-2 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-bold"
                      >
                        <WhatsAppIcon size={14} />
                        <span>WHATSAPP</span>
                      </a>
                      <a
                        href="tel:+917042131215"
                        onClick={playClickSound}
                        className="py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Call directly"
                      >
                        <Phone size={13} />
                      </a>
                      <button
                        onClick={copyPhone}
                        className="py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:border-white text-xs font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Copy number"
                      >
                        {copiedPhone ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </StaggerItem>

              </StaggerContainer>

              {/* Social Channels Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/sahil-0b0172445"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-4 py-2 rounded-xl border border-white/15 hover:border-white bg-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href="https://github.com/Sahil9599"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-4 py-2 rounded-xl border border-white/15 hover:border-white bg-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <GithubIcon size={16} />
                  <span>GitHub Repository</span>
                </a>

                <a
                  href="https://wa.me/917042131215"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60 flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                >
                  <WhatsAppIcon size={16} />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    playClickSound();
                    setDossierOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:border-cyan-400 flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
                >
                  <FileText size={16} />
                  <span>Technical Dossier (PDF)</span>
                </button>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ 9. FOOTER ═══════════ */}
      <FadeIn>
        <footer className="py-10 border-t border-white/10 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="text-zinc-400">
            SAHIL // CYBER SECURITY &bull; CISCO CCNA &bull; ENTERPRISE LINUX ARCHITECT
          </div>
          <div className="text-[10px] text-zinc-600">
            ALL TELEMETRY VERIFIED &bull; 2026 &bull; OBSIDIAN BLACK &amp; LIQUID CHROME EDITION
          </div>
        </footer>
      </FadeIn>

      {/* Floating Back To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => {
              playClickSound();
              if (window.__lenis) {
                window.__lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full border border-white/20 bg-black/90 hover:border-emerald-400 text-white hover:text-emerald-400 transition-all shadow-2xl hover:scale-105 cursor-pointer backdrop-blur-md"
            title="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Printable Technical Dossier Modal */}
      <div className="dossier-print-host">
        <DossierModal
          open={dossierOpen}
          onClose={() => setDossierOpen(false)}
          projects={projects}
          onSoundClick={playClickSound}
        />
      </div>

    </div>
  );
}
