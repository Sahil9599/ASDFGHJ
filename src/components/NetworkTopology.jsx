import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Send, 
  Terminal, 
  CheckCircle2, 
  Radio,
  Lock,
  Cpu
} from 'lucide-react';

const TOPOLOGY_NODES = [
  {
    id: 'wan',
    name: 'WAN Gateway',
    role: 'Public Edge / Serial Link',
    ip: '200.0.0.1/30',
    mac: '00:1A:2B:3C:4D:01',
    vlan: 'External WAN',
    hardware: 'Serial Se2/0 (Clock 64000)',
    status: 'OPTIMAL',
    type: 'gateway',
    x: 82,
    y: 20,
    acls: ['Permit Established', 'Deny Inbound Unsolicited', 'NAT Pool 200.0.0.1-200.0.0.8'],
    telemetry: 'Tx: 14.2 Mbps | Rx: 8.9 Mbps | Loss: 0.00%',
  },
  {
    id: 'router',
    name: 'Cisco 2811 Router',
    role: 'Router-on-a-Stick / NAT-PAT',
    ip: '10.0.0.1 (Fa0/0.10, Fa0/0.20)',
    mac: '00:1A:2B:3C:4D:02',
    vlan: 'Dot1Q Trunk Gateway',
    hardware: 'Cisco 2811 ISR, IOS 15.1',
    status: 'OPTIMAL',
    type: 'router',
    x: 50,
    y: 20,
    acls: ['Dot1Q Trunking', 'NAT Overload (ACL 1)', 'Sub-if Fa0/0.10 & Fa0/0.20'],
    telemetry: 'CPU: 3.4% | Memory: 32% | MTU: 1500',
  },
  {
    id: 'firewall',
    name: 'Perimeter NGFW / IDS',
    role: 'Deep Packet Inspection & Zero-Trust',
    ip: '10.0.0.254',
    mac: '00:1A:2B:3C:4D:03',
    vlan: 'Inspection Inline',
    hardware: 'Stateful Hardened Firewall Engine',
    status: 'ARMED',
    type: 'firewall',
    x: 50,
    y: 50,
    acls: ['Stateful SPI', 'Drop Malformed SYN', 'Anti-Spoofing RFC 2827'],
    telemetry: 'Blocked Threats (24h): 1,482 | Latency: 0.4ms',
  },
  {
    id: 'switch',
    name: 'Catalyst 2960 Core',
    role: '802.1Q L2 Managed Switch',
    ip: '10.0.0.2 (Management)',
    mac: '00:1A:2B:3C:4D:04',
    vlan: 'VLAN 10, 20, 30, 99(Mgmt)',
    hardware: 'Catalyst 2960-24TT-L',
    status: 'OPTIMAL',
    type: 'switch',
    x: 50,
    y: 80,
    acls: ['Port Security Max 1 MAC', 'BPDU Guard Enabled', 'Spanning-Tree RSTP'],
    telemetry: 'Trunk Fa0/24 ACTIVE | STP: Forwarding',
  },
  {
    id: 'pc14',
    name: 'SOC Terminal (PC14)',
    role: 'SOC Analyst Workstation',
    ip: '10.0.10.2/24',
    mac: '00:1A:2B:3C:4D:14',
    vlan: 'VLAN 10 (Management)',
    hardware: 'Host Workstation - Linux Triage',
    status: 'OPTIMAL',
    type: 'client',
    x: 18,
    y: 80,
    acls: ['Default Gateway 10.0.10.1', 'Audit Logging Enabled'],
    telemetry: 'Ping: 0.8ms | Auth: 2FA Token Active',
  },
  {
    id: 'server',
    name: 'RHEL 9 App Server',
    role: 'Production Web & Reverse Proxy',
    ip: '10.0.20.2/24',
    mac: '00:1A:2B:3C:4D:20',
    vlan: 'VLAN 20 (Production)',
    hardware: 'Red Hat Enterprise Linux 9.4 x86_64',
    status: 'OPTIMAL',
    type: 'server',
    x: 82,
    y: 80,
    acls: ['Listen :443 (TLS 1.3)', 'Firewalld Zone: Internal', 'SELinux Enforcing'],
    telemetry: 'Uptime: 99.98% | Services: systemd 0 failed',
  },
  {
    id: 'honeypot',
    name: 'DMZ Decoy Node',
    role: 'Isolated Threat Honeytoken',
    ip: '172.16.1.100/24',
    mac: '00:1A:2B:3C:4D:99',
    vlan: 'VLAN 30 (DMZ Isolated)',
    hardware: 'Containerized Honeytrap (Port 1337)',
    status: 'MONITORING',
    type: 'honeypot',
    x: 18,
    y: 20,
    acls: ['Strict Sandbox Isolation', 'Log to SIEM Journal', 'Block Outbound Pivot'],
    telemetry: 'Port 1337 Listener | 0 Internal Exposure',
  },
];

export default function NetworkTopology({ onSoundClick }) {
  const [selectedNode, setSelectedNode] = useState(TOPOLOGY_NODES[1]);
  const [simulationState, setSimulationState] = useState('idle'); // idle | pinging | attacking
  const [packetProgress, setPacketProgress] = useState(0);
  const [simLog, setSimLog] = useState('Topology online. Select a node or launch diagnostic simulation.');

  const runSound = () => {
    if (onSoundClick) onSoundClick();
  };

  const handleSimulatePing = () => {
    runSound();
    setSimulationState('pinging');
    setPacketProgress(0);
    setSimLog('[*] ICMP Echo Request initiated from SOC Terminal (10.0.10.2)...');

    setTimeout(() => {
      setPacketProgress(25);
      setSimLog('[+] Hop 1: Switch 2960 received frame -> Tagged 802.1Q VLAN 10.');
    }, 600);

    setTimeout(() => {
      setPacketProgress(50);
      setSimLog('[+] Hop 2: Cisco 2811 Sub-if Fa0/0.10 -> Inter-VLAN routing to Fa0/0.20.');
    }, 1300);

    setTimeout(() => {
      setPacketProgress(75);
      setSimLog('[+] Hop 3: Perimeter Firewall verified stateful session -> Forwarded to RHEL 9 Server.');
    }, 2000);

    setTimeout(() => {
      setPacketProgress(100);
      setSimLog('[✓] ICMP Echo Reply confirmed: 64 bytes, RTT 0.82ms, 0% packet loss.');
      setTimeout(() => setSimulationState('idle'), 1200);
    }, 2700);
  };

  const handleSimulateAttack = () => {
    runSound();
    setSimulationState('attacking');
    setPacketProgress(0);
    setSimLog('[!] ALERT: Unauthorized SYN flood detected from External WAN IP 198.51.100.44...');

    setTimeout(() => {
      setPacketProgress(35);
      setSimLog('[!] Packet ingress via Serial WAN -> Route lookup targeting DMZ Honeytoken...');
    }, 700);

    setTimeout(() => {
      setPacketProgress(70);
      setSimLog('[🛡️] FIREWALL INTERCEPT: Stateful ACL triggered! Malformed payload dropped.');
    }, 1500);

    setTimeout(() => {
      setPacketProgress(100);
      setSimLog('[✓] MITIGATION SUCCESS: Intrusion logged to auditd, IP quarantined for 3600s.');
      setTimeout(() => setSimulationState('idle'), 1400);
    }, 2400);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-dashed border-white/20 bg-[#111111]/90 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d71921] nothing-led" />
            <span className="font-mono text-xs text-white uppercase tracking-wider">
              INTERACTIVE ARCHITECTURE // TOPOLOGY LAB
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-white font-semibold">
            Enterprise Hardened Infrastructure
          </h3>
          <p className="font-mono text-xs text-zinc-400">
            Click any network element below to inspect hardware telemetry, sub-interfaces, and ACL rules.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSimulatePing}
            disabled={simulationState !== 'idle'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send size={13} className="text-[#d71921]" />
            <span>Transmit ICMP Packet</span>
          </button>

          <button
            onClick={handleSimulateAttack}
            disabled={simulationState !== 'idle'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#d71921]/40 bg-[#d71921]/10 hover:bg-[#d71921]/20 text-white font-mono text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldAlert size={13} className="text-[#ff4d54]" />
            <span>Simulate Perimeter Intrusion</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Canvas & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Topology Graph (SVG Canvas) */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-dashed border-white/20 bg-[#0a0a0a] relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Dot matrix grid inside */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Connecting Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* WAN <-> Router */}
            <line 
              x1="82%" y1="20%" x2="50%" y2="20%" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />
            {/* Honeypot <-> Router */}
            <line 
              x1="18%" y1="20%" x2="50%" y2="20%" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />
            {/* Router <-> Firewall */}
            <line 
              x1="50%" y1="20%" x2="50%" y2="50%" 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />
            {/* Firewall <-> Switch */}
            <line 
              x1="50%" y1="50%" x2="50%" y2="80%" 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />
            {/* Switch <-> PC14 */}
            <line 
              x1="50%" y1="80%" x2="18%" y2="80%" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />
            {/* Switch <-> Server */}
            <line 
              x1="50%" y1="80%" x2="82%" y2="80%" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeDasharray="4 4" 
              strokeWidth="2" 
            />

            {/* Dynamic Packet Dot Animation during simulation */}
            {simulationState === 'pinging' && (
              <circle
                r="5"
                fill="#ffffff"
                className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                cx={
                  packetProgress <= 25 ? `${18 + (32 * packetProgress) / 25}%` :
                  packetProgress <= 50 ? '50%' :
                  packetProgress <= 75 ? '50%' :
                  `${50 + (32 * (packetProgress - 75)) / 25}%`
                }
                cy={
                  packetProgress <= 25 ? '80%' :
                  packetProgress <= 50 ? `${80 - (30 * (packetProgress - 25)) / 25}%` :
                  packetProgress <= 75 ? `${50 + (30 * (packetProgress - 50)) / 25}%` :
                  '80%'
                }
              />
            )}

            {simulationState === 'attacking' && (
              <circle
                r="6"
                fill="#d71921"
                className="filter drop-shadow-[0_0_10px_#d71921]"
                cx={`${82 - (32 * Math.min(packetProgress, 70)) / 70}%`}
                cy={`${20 + (30 * Math.min(packetProgress, 70)) / 70}%`}
              />
            )}
          </svg>

          {/* Interactive Node Badges */}
          <div className="relative w-full h-[360px]" style={{ zIndex: 2 }}>
            {TOPOLOGY_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    runSound();
                  }}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 min-w-[110px] text-center ${
                    isSelected
                      ? 'border-[#d71921] bg-[#1a1112] shadow-[0_0_20px_rgba(215,25,33,0.3)] scale-105'
                      : 'border-white/15 bg-[#121212]/90 hover:border-white/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {node.type === 'gateway' && <Radio size={14} className="text-white/80" />}
                    {node.type === 'router' && <Cpu size={14} className="text-[#ff4d54]" />}
                    {node.type === 'firewall' && <ShieldCheck size={14} className="text-[#d71921]" />}
                    {node.type === 'switch' && <Activity size={14} className="text-white/80" />}
                    {node.type === 'server' && <Server size={14} className="text-zinc-300" />}
                    {node.type === 'client' && <Terminal size={14} className="text-zinc-300" />}
                    {node.type === 'honeypot' && <Lock size={14} className="text-amber-400" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d71921] nothing-led" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white tracking-wide">
                    {node.name}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                    {node.ip.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Diagnostic Telemetry Console Line */}
          <div className="relative z-10 mt-2 p-3 rounded-xl border border-white/10 bg-black/80 font-mono text-xs flex items-center gap-2">
            <span className="text-[#d71921] font-bold">{'>'}</span>
            <span className="text-zinc-300 truncate">{simLog}</span>
          </div>
        </div>

        {/* Right: Selected Node Inspection Drawer */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-dashed border-white/20 bg-[#111111]/95 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header info */}
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-[#ff4d54] uppercase tracking-wider">
                  NODE TELEMETRY INSPECTOR
                </span>
                <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono text-[9px] text-white">
                  STATUS: {selectedNode.status}
                </span>
              </div>
              <h4 className="font-display text-lg text-white font-bold">{selectedNode.name}</h4>
              <p className="font-mono text-xs text-zinc-400">{selectedNode.role}</p>
            </div>

            {/* Properties table */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500">IP ADDRESS</span>
                <span className="text-white font-semibold">{selectedNode.ip}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500">MAC ADDRESS</span>
                <span className="text-zinc-300">{selectedNode.mac}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500">VLAN / DOMAIN</span>
                <span className="text-zinc-300">{selectedNode.vlan}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500">HARDWARE</span>
                <span className="text-zinc-300 truncate max-w-[160px] text-right" title={selectedNode.hardware}>
                  {selectedNode.hardware}
                </span>
              </div>
            </div>

            {/* Active Security Policies / ACLs */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                Active Policy & ACL Rules:
              </span>
              <div className="space-y-1">
                {selectedNode.acls.map((rule, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 p-2 rounded bg-black/50 border border-white/5 font-mono text-[11px] text-zinc-300"
                  >
                    <CheckCircle2 size={12} className="text-[#d71921] shrink-0" />
                    <span className="truncate">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Live Metrics */}
          <div className="p-3 rounded-xl border border-white/10 bg-black/60 font-mono text-[11px] text-zinc-400">
            <span className="text-white font-semibold block mb-0.5">Live Bus Metrics:</span>
            {selectedNode.telemetry}
          </div>
        </div>
      </div>
    </div>
  );
}
