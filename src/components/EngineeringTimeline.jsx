import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Network, Server, Terminal, Lock } from 'lucide-react';

const MILESTONES = [
  {
    phase: 'PHASE 01 // NETWORK FOUNDATION',
    title: 'Cisco CCNA Enterprise Routing & Switching',
    badge: 'CERTIFIED ARCHITECTURE',
    icon: Network,
    summary:
      'Engineered multi-site Cisco Packet Tracer topologies implementing Router-on-a-Stick (802.1Q Dot1Q encapsulation), Catalyst trunking, and cross-site Serial Se2/0 WAN synchronization with 0% packet loss.',
    tags: ['Cisco IOS', '802.1Q Dot1Q', 'Serial WAN', 'ICMP Verified'],
  },
  {
    phase: 'PHASE 02 // PERIMETER DEFENSE',
    title: 'Edge NAT / PAT Overload & ACL Isolation',
    badge: 'ZERO-TRUST GATEWAY',
    icon: Lock,
    summary:
      'Configured perimeter Network & Port Address Translation mapping RFC 1918 corporate LANs (10.0.0.0/24) to WAN gateways using standard ACLs and verified bidirectional public server reachability.',
    tags: ['NAT / PAT Overload', 'Standard ACL', 'RFC 1918', 'Fa0/0 ↔ Fa1/0'],
  },
  {
    phase: 'PHASE 03 // CUSTOM ENGINEERING TOOLING',
    title: 'NetScope PRO Bitwise Subnet Engine',
    badge: 'LIVE DIAGNOSTIC SUITE',
    icon: Terminal,
    summary:
      'Architected an interactive IPv4/IPv6 CIDR & VLSM subnetting utility with real-time 32-bit binary mask visualization, wildcard mask output for Cisco IOS ACLs, and RFC 1878 / 4291 compliance.',
    tags: ['React', 'Bitwise Math', 'VLSM', 'RFC 1878 / 4291'],
  },
  {
    phase: 'PHASE 04 // ENTERPRISE LINUX HARDENING',
    title: 'RHEL 9 Kernel Telemetry, LVM & Socket Auditing',
    badge: 'SYSTEMS FORENSICS',
    icon: Server,
    summary:
      'Executed deep Linux diagnostics on RHEL 9: audited kauditd kernel security threads via top, validated LVM NVMe partitions (df -h), verified 0 failed systemd units, triaged journalctl error logs, and audited ss -tuln listening sockets.',
    tags: ['RHEL 9', 'kauditd', 'LVM / NVMe', 'ss -tuln', 'journalctl'],
  },
];

function TimelineNode({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-70px' });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative pl-10 sm:pl-14 pb-10 last:pb-0"
    >
      {/* Glowing Timeline Node */}
      <div
        className={`absolute left-0 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all duration-700 ${
          isInView
            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.45)]'
            : 'border-white/15 bg-[#08080d] text-zinc-500'
        }`}
      >
        <Icon size={15} />
      </div>

      {/* Card */}
      <div className="animated-border p-6 rounded-2xl border border-white/10 bg-[#08080d]/85 hover:bg-[#0b0b13] transition-colors space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
            {item.phase}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1">
            <ShieldCheck size={11} />
            {item.badge}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-syne font-bold uppercase text-white">
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          {item.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function EngineeringTimeline() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical Spine */}
      <div
        aria-hidden="true"
        className="absolute left-[13px] sm:left-[17px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-emerald-500/60 via-cyan-500/40 to-transparent"
      />
      <div>
        {MILESTONES.map((item, idx) => (
          <TimelineNode key={item.phase} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}
