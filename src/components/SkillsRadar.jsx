import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Cpu } from 'lucide-react';

const SKILLS = [
  {
    id: 'cisco',
    label: 'Cisco Routing',
    shortLabel: 'CISCO CCNA',
    level: 92,
    color: '#d71921',
    detail: '802.1Q Dot1Q, Router-on-a-Stick, Serial Se2/0 WAN, Inter-VLAN & Catalyst Trunking',
  },
  {
    id: 'subnet',
    label: 'Subnetting & VLSM',
    shortLabel: 'CIDR / VLSM',
    level: 95,
    color: '#ffffff',
    detail: 'IPv4/IPv6 CIDR math, Bitwise mask computation, RFC 1878/4291 & NetScope PRO',
  },
  {
    id: 'nat',
    label: 'NAT/PAT & ACLs',
    shortLabel: 'NAT / ACL',
    level: 90,
    color: '#d71921',
    detail: 'Dynamic PAT Overload gateways, Standard ACL perimeter rules, RFC 1918 masking',
  },
  {
    id: 'rhel',
    label: 'RHEL 9 Kernel',
    shortLabel: 'RHEL 9',
    level: 88,
    color: '#e5e5e5',
    detail: 'top telemetry, kauditd security thread audit, LVM partitioning (df -h) & free -h',
  },
  {
    id: 'socket',
    label: 'Socket & Net Audit',
    shortLabel: 'SS / IPROUTE2',
    level: 87,
    color: '#d71921',
    detail: 'ss -tuln listening socket verification, iproute2, dual-stack DNS & ICMP RTT checks',
  },
  {
    id: 'forensics',
    label: 'Systemd & Forensics',
    shortLabel: 'JOURNALCTL',
    level: 85,
    color: '#a3a3a3',
    detail: 'systemctl unit health verification, journalctl -p err triage & PAM keyring audits',
  },
];

export default function SkillsRadar({ onSoundHover }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeSkill, setActiveSkill] = useState(SKILLS[0]);

  const size = 320;
  const center = size / 2;
  const maxRadius = 112;
  const levels = [0.25, 0.5, 0.75, 1];
  const angleStep = (Math.PI * 2) / SKILLS.length;

  const getPoint = (index, ratio) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * maxRadius * ratio,
      y: center + Math.sin(angle) * maxRadius * ratio,
    };
  };

  const dataPoints = SKILLS.map((s, i) => getPoint(i, isInView ? s.level / 100 : 0.05));
  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left: Interactive SVG Radar Chart */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-dashed border-white/20 bg-[#111111]/95 relative overflow-hidden nothing-card">
        <div className="w-full flex items-center justify-between mb-3 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d71921] nothing-led" />
            <Cpu size={12} className="text-[#d71921]" />
            DEFENSE CAPABILITY MATRIX
          </span>
          <span className="font-dot">6-AXIS TELEMETRY</span>
        </div>

        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[320px] h-auto overflow-visible"
          role="img"
          aria-label="Cyber Security & Network Engineering Skills Radar Chart"
        >
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d71921" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </radialGradient>
          </defs>

          {/* Concentric Polygon Rings */}
          {levels.map((lvl, idx) => {
            const pts = SKILLS.map((_, i) => {
              const p = getPoint(i, lvl);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={pts}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis Lines & Labels */}
          {SKILLS.map((skill, i) => {
            const outer = getPoint(i, 1);
            const labelPos = getPoint(i, 1.24);
            const isSelected = activeSkill.id === skill.id;
            return (
              <g key={skill.id}>
                <line
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={isSelected ? 'rgba(215, 25, 33, 0.7)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isSelected ? '1.5' : '1'}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  onClick={() => setActiveSkill(skill)}
                  className={`font-mono text-[9px] uppercase cursor-pointer transition-colors ${
                    isSelected ? 'fill-[#ff4d54] font-bold' : 'fill-zinc-400 hover:fill-white'
                  }`}
                >
                  {skill.shortLabel}
                </text>
              </g>
            );
          })}

          {/* Animated Skill Area Polygon */}
          <motion.polygon
            points={polygonPath}
            fill="url(#radarFill)"
            stroke="#d71921"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          {/* Interactive Vertex Nodes */}
          {SKILLS.map((skill, i) => {
            const pt = dataPoints[i];
            const isSelected = activeSkill.id === skill.id;
            return (
              <g
                key={skill.id}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setActiveSkill(skill);
                  if (onSoundHover) onSoundHover();
                }}
                onClick={() => setActiveSkill(skill)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 7 : 4.5}
                  fill={isSelected ? '#d71921' : '#0c0c0c'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Active Axis Detail Pill */}
        <div className="w-full mt-4 p-3.5 rounded-xl border border-dashed border-white/20 bg-black/60 text-left space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d71921]" />
              {activeSkill.label}
            </span>
            <span className="font-dot text-[#ff4d54] font-bold">{activeSkill.level}%</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
            {activeSkill.detail}
          </p>
        </div>
      </div>

      {/* Right: Animated Proficiency Bars */}
      <div className="lg:col-span-7 space-y-3.5">
        {SKILLS.map((skill, idx) => {
          const isSelected = activeSkill.id === skill.id;
          return (
            <div
              key={skill.id}
              onMouseEnter={() => {
                setActiveSkill(skill);
                if (onSoundHover) onSoundHover();
              }}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-[#d71921]/70 bg-[#151515]'
                  : 'border-dashed border-white/15 bg-[#101010]/90 hover:border-white/35'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={15}
                    className={isSelected ? 'text-[#d71921]' : 'text-zinc-500'}
                  />
                  <span className="font-syne font-bold text-sm uppercase text-white">
                    {skill.label}
                  </span>
                </div>
                <span className="font-dot text-sm font-bold text-white">
                  {skill.level}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: isSelected ? '#d71921' : '#ffffff',
                  }}
                />
              </div>

              <p className="text-[11px] font-mono text-zinc-400 mt-2">
                {skill.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
