import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, Check, Copy, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';

export default function CyberTerminal({ onSoundClick }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: 'SAHIL DEFENSE KERNEL v4.19.0-hardened-rhel9 (x86_64)\nType "help" to view diagnostic commands or click quick action chips below.',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState([]);
  const terminalEndRef = useRef(null);

  const quickCommands = [
    'help',
    'ccna',
    'linux',
    'topologies',
    'netscope',
    'ping 8.8.8.8',
    'whoami',
    'skills',
    'contact',
    'clear',
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr) => {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;

    if (onSoundClick) onSoundClick();

    const lowerCmd = rawCmd.toLowerCase();
    setCmdHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    if (lowerCmd === 'clear') {
      setHistory([]);
      return;
    }

    let output = '';

    if (lowerCmd === 'help') {
      output = `AVAILABLE SYSTEM DIAGNOSTIC COMMANDS:
  help        - Display this command index
  ccna        - Cisco 802.1Q Dot1Q trunking, NAT/PAT & router configurations
  linux       - RHEL 9 kernel diagnostics, top telemetry, LVM & journalctl
  topologies  - Verified physical/logical network topologies breakdown
  netscope    - NetScope PRO CIDR algorithm & bitwise calculation engine
  ping [ip]   - Execute simulated ICMP ping echo sequence with latency metrics
  whoami      - Profile, credentials, and engineering security philosophy
  skills      - Full technical arsenal across networking, Linux & security
  contact     - Transmission channels (Email, Phone, WhatsApp, LinkedIn)
  clear       - Clear active terminal buffer`;
    } else if (lowerCmd === 'ccna') {
      output = `[+] CISCO PACKET TRACER ENTERPRISE LAB CONFIGS:
  * ROUTER-ON-A-STICK (802.1Q Dot1Q):
    interface FastEthernet0/0.1
      encapsulation dot1Q 1
      ip address 10.0.0.1 255.255.255.0
    interface FastEthernet0/0.2
      encapsulation dot1Q 2
      ip address 20.0.0.1 255.255.255.0
  * CROSS-SITE SERIAL WAN:
    interface Serial2/0 -> ip address 30.0.0.1 255.255.255.252 (clock rate 64000)
    Result: 100% end-to-end ICMP ping reachability across remote subnets.
  * NAT / PAT OVERLOAD PERIMETER:
    ip nat inside source list 1 interface FastEthernet1/0 overload
    access-list 1 permit 10.0.0.0 0.0.0.255
    Interfaces: Fa0/0 (inside) <-> Fa1/0 (outside public 200.0.0.1)`;
    } else if (lowerCmd === 'linux' || lowerCmd === 'rhel9') {
      output = `[+] RHEL 9 KERNEL & ENTERPRISE AUDIT TELEMETRY:
  * PROCESS AUDITING (top):
    Tasks: 346 total, 1 running, 345 sleeping, 0 stopped, 0 zombie
    %Cpu(s): 0.7 us, 0.5 sy, 0.0 ni, 98.7 id, 0.0 wa, 0.1 hi, 0.0 si
    Critical Thread: PID 38 [kauditd] (Kernel audit log dispatcher)
  * MEMORY STATE (free -h):
    Mem: 1.6Gi total, 1.2Gi used, 489Mi buff/cache, 0.0Ki swap pressure
  * STORAGE & LVM (df -h):
    /dev/mapper/rhel_192-root (29G total, 17% utilized) on NVMe UEFI
  * SERVICE UNIT TRIAGE:
    systemctl --failed -> "0 loaded units listed" (100% service uptime)
  * SOCKET AUDIT (ss -tuln):
    LISTEN 0 128 0.0.0.0:22 (sshd) | UDP 0 0 127.0.0.1:323 (chrony NTP)`;
    } else if (lowerCmd === 'topologies') {
      output = `[+] NETWORK & INFRASTRUCTURE TOPOLOGIES:
  [TOPOLOGY 1: INTER-VLAN & SERIAL WAN]
  [PC14: 10.0.0.2] -- VLAN 1 --\\
                              [2960 Switch] == Dot1Q Trunk == [Cisco 2811 Router]
  [PC15: 20.0.0.2] -- VLAN 2 --/                                     || (Se2/0: 30.0.0.1/30)
                                                                     || Serial WAN
  [PC16: 40.0.0.2] -- VLAN 1 --\\                                     ||
                              [2960 Switch] == Dot1Q Trunk == [Cisco 2811 Router]
  [PC17: 50.0.0.2] -- VLAN 2 --/                                 (Se2/0: 30.0.0.2/30)

  [TOPOLOGY 2: NAT/PAT OVERLOAD EDGE GATEWAY]
  [Corporate LAN: 10.0.0.0/24] -> [Cisco Edge Router Fa0/0]
                                          || NAT PAT Overload (ACL 1)
                                  [Fa1/0: Public 200.0.0.1] -> [Public Server: 200.0.0.2]`;
    } else if (lowerCmd === 'netscope') {
      output = `[+] NETSCOPE PRO ARCHITECTURE SPECIFICATIONS:
  * IPv4 & IPv6 CIDR calculation engine with bitwise shift operator translation.
  * Real-time network decomposition: Network ID, Broadcast, Usable Range, Wildcard mask.
  * RFC 1878 / RFC 4291 classification, classful matching, VLSM subdivision tree.
  * Built-in enterprise presets: AWS VPC CIDR blocks, RFC 1918 Class A/B/C, and P2P links.`;
    } else if (lowerCmd.startsWith('ping')) {
      const target = lowerCmd.split(' ')[1] || '8.8.8.8';
      output = `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=117 time=3.12 ms
64 bytes from ${target}: icmp_seq=2 ttl=117 time=2.98 ms
64 bytes from ${target}: icmp_seq=3 ttl=117 time=3.05 ms

--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 2.98/3.05/3.12/0.057 ms
[✓] ICMP End-to-End reachability confirmed with 0% packet loss.`;
    } else if (lowerCmd === 'whoami') {
      output = `[+] IDENTITY: SAHIL
  Role: Cyber Security Specialist & Network Architect
  Certification: CCNA Certified (Cisco Certified Network Associate)
  Systems: Red Hat Enterprise Linux 9 (RHEL 9), VMware ESXi
  Defensive Focus: Perimeter NAT/PAT, Inter-VLAN routing, socket triage & log forensics
  Philosophy: "Verified telemetry and packet captures speak louder than assumptions."`;
    } else if (lowerCmd === 'skills') {
      output = `[+] TECHNICAL ARSENAL:
  - CISCO ROUTING & SWITCHING:
    802.1Q Dot1Q, Router-on-a-Stick, Trunking, NAT/PAT Overload, Serial WAN, ACLs, STP
  - ENTERPRISE LINUX (RHEL 9):
    Kernel Process Triage (top), LVM Partitions (df -h), Memory Audits (free -h),
    systemd unit management (systemctl), journalctl error triage, iproute2
  - SECURITY & DIAGNOSTICS:
    ss -tuln socket auditing, Wireshark, ICMP delay metrics, DNS dual-stack, zero-trust`;
    } else if (lowerCmd === 'contact') {
      output = `[+] TRANSMISSION CHANNELS:
  Email:    sahilkumar202232@gmail.com
  Phone:    +91 7042131215
  WhatsApp: https://wa.me/917042131215
  LinkedIn: https://www.linkedin.com/in/sahil-0b0172445
  GitHub:   https://github.com/Sahil9599`;
    } else {
      output = `command not found: "${rawCmd}". Type "help" to view valid commands.`;
    }

    setHistory((prev) => [
      ...prev,
      { type: 'command', text: `sahil@security-node:~$ ${rawCmd}` },
      { type: 'response', text: output },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-[#07070c]/95 backdrop-blur-xl overflow-hidden shadow-2xl space-y-0">
      {/* Terminal Title Bar */}
      <div className="px-5 py-3 border-b border-white/10 bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-mono text-xs text-zinc-400">
            sahil@security-node:~ (bash / diagnostic-repl)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div className="p-5 font-mono text-xs sm:text-sm min-h-[300px] max-h-[460px] overflow-y-auto space-y-3 scroll-smooth">
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === 'command' ? (
              <span className="text-cyan-400 font-semibold">{item.text}</span>
            ) : item.type === 'system' ? (
              <span className="text-zinc-400 whitespace-pre-wrap">{item.text}</span>
            ) : (
              <span className="text-emerald-300 whitespace-pre-wrap font-mono">{item.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1 whitespace-nowrap">
          Quick Run:
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-[11px] font-mono text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Interactive Input Prompt */}
      <div className="px-5 py-3 border-t border-white/10 bg-black/70 flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-xs sm:text-sm font-bold flex items-center gap-1 whitespace-nowrap">
          <span>sahil@node</span>
          <span className="text-zinc-500">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-zinc-400">$</span>
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help' or command here and press Enter..."
          className="flex-1 bg-transparent border-none text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-zinc-600"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={() => {
            executeCommand(inputVal || 'help');
            setInputVal('');
          }}
          className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
          title="Send command"
        >
          <CornerDownLeft size={14} />
        </button>
      </div>
    </div>
  );
}
