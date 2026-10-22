import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Cpu, 
  Check, 
  Copy, 
  Layers, 
  Shield, 
  Server, 
  ArrowRight,
  Terminal,
  Share2
} from 'lucide-react';

export default function SubnetCalculator({ onSoundClick }) {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [copied, setCopied] = useState(false);

  // Validate and parse IP
  const parsed = useMemo(() => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return null;
    const nums = parts.map(p => Number(p));
    if (nums.some(n => isNaN(n) || n < 0 || n > 255 || !Number.isInteger(n))) return null;

    const ipInt = (nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3];
    const prefix = Math.min(32, Math.max(1, Number(cidr) || 24));
    
    // Mask calculations
    const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const intToIp = (val) => [
      (val >>> 24) & 255,
      (val >>> 16) & 255,
      (val >>> 8) & 255,
      val & 255
    ].join('.');

    const mask = intToIp(maskInt);
    const wildcard = intToIp(wildcardInt);
    const network = intToIp(networkInt);
    const broadcast = intToIp(broadcastInt);

    let firstUsable = 'N/A';
    let lastUsable = 'N/A';
    let usableHosts = 0;
    const totalHosts = Math.pow(2, 32 - prefix);

    if (prefix === 31) {
      firstUsable = network;
      lastUsable = broadcast;
      usableHosts = 2; // RFC 3021
    } else if (prefix === 32) {
      firstUsable = network;
      lastUsable = network;
      usableHosts = 1;
    } else {
      firstUsable = intToIp(networkInt + 1);
      lastUsable = intToIp(broadcastInt - 1);
      usableHosts = Math.max(0, totalHosts - 2);
    }

    // Class determination
    let ipClass = 'Unknown';
    if (nums[0] >= 1 && nums[0] <= 126) ipClass = 'Class A';
    else if (nums[0] >= 128 && nums[0] <= 191) ipClass = 'Class B';
    else if (nums[0] >= 192 && nums[0] <= 223) ipClass = 'Class C';
    else if (nums[0] >= 224 && nums[0] <= 239) ipClass = 'Class D (Multicast)';
    else if (nums[0] >= 240 && nums[0] <= 255) ipClass = 'Class E (Experimental)';

    // RFC 1918 Private status
    let isPrivate = false;
    if (nums[0] === 10) isPrivate = true;
    else if (nums[0] === 172 && nums[1] >= 16 && nums[1] <= 31) isPrivate = true;
    else if (nums[0] === 192 && nums[1] === 168) isPrivate = true;

    // Bit string for binary display
    const binaryMask = [];
    for (let i = 0; i < 32; i++) {
      binaryMask.push(i < prefix ? 1 : 0);
    }

    return {
      mask,
      wildcard,
      network,
      broadcast,
      firstUsable,
      lastUsable,
      usableHosts,
      totalHosts,
      ipClass,
      isPrivate,
      prefix,
      binaryMask,
      valid: true
    };
  }, [ip, cidr]);

  const presets = [
    { label: 'AWS VPC Tier', ip: '172.16.0.0', cidr: 16 },
    { label: 'Corporate LAN', ip: '192.168.1.0', cidr: 24 },
    { label: 'DMZ Cluster', ip: '192.168.10.0', cidr: 28 },
    { label: 'Cisco P2P WAN', ip: '30.0.0.1', cidr: 30 },
    { label: 'Global Backbone', ip: '10.0.0.0', cidr: 8 }
  ];

  const handleCopySummary = () => {
    if (!parsed) return;
    const text = `NetScope PRO Architecture Breakdown:
IP Address: ${ip}/${parsed.prefix}
Subnet Mask: ${parsed.mask}
Wildcard Mask: ${parsed.wildcard}
Network ID: ${parsed.network}
Usable Host Range: ${parsed.firstUsable} - ${parsed.lastUsable}
Broadcast Address: ${parsed.broadcast}
Total Usable Hosts: ${parsed.usableHosts.toLocaleString()}
Scope: ${parsed.isPrivate ? 'RFC 1918 Private IP' : 'Public IP'} (${parsed.ipClass})
Verified via Sahil's NetScope PRO Engine.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (onSoundClick) onSoundClick();
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-[#09090e]/90 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-white/40" />
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Network size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-syne font-bold text-lg text-white uppercase tracking-wider">
                NetScope PRO
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE ENGINE
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Interactive IPv4 Subnetting &amp; Bitwise Mask Computation Tool
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-all cursor-pointer self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">COPIED SPECS</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>COPY ARCHITECTURE</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Selector Chips */}
      <div>
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
          Verified Enterprise Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIp(preset.ip);
                setCidr(preset.cidr);
                if (onSoundClick) onSoundClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                ip === preset.ip && cidr === preset.cidr
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'border-white/10 bg-white/5 hover:border-white/30 text-zinc-300 hover:text-white'
              }`}
            >
              {preset.label} <span className="text-zinc-500 font-normal">({preset.ip}/{preset.cidr})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input row: IP & CIDR Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        <div className="lg:col-span-5 space-y-2">
          <label className="text-xs font-mono uppercase text-zinc-300 tracking-wider flex items-center justify-between">
            <span>Target IP Address</span>
            <span className="text-[11px] text-zinc-500 font-normal">e.g. 192.168.1.1</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/70 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-colors"
              placeholder="192.168.1.1"
            />
            <span className="absolute right-3 top-3.5 text-xs font-mono text-zinc-500">
              IPv4
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-zinc-300 tracking-wider">
              CIDR Prefix Length: <span className="text-emerald-400 font-bold">/{cidr}</span>
            </label>
            <span className="text-xs font-mono text-zinc-400">
              {parsed ? `${parsed.usableHosts.toLocaleString()} Usable Hosts` : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-4 pt-1">
            <input
              type="range"
              min="8"
              max="30"
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="flex-1 accent-emerald-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
            <span className="w-12 text-center py-2 px-2.5 rounded-lg border border-white/20 bg-black/60 font-mono text-sm font-bold text-white">
              /{cidr}
            </span>
          </div>
        </div>
      </div>

      {/* Bitwise Binary Visualizer */}
      {parsed && (
        <div className="p-4 rounded-xl border border-white/10 bg-black/50 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="uppercase tracking-wider flex items-center gap-1.5 text-zinc-300">
              <Cpu size={13} className="text-emerald-400" />
              Bitwise 32-Bit Binary Mask Representation:
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Network ({cidr})
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                Host ({32 - cidr})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 font-mono text-xs">
            {[0, 1, 2, 3].map((octetIdx) => (
              <div key={octetIdx} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                <div className="flex justify-center gap-0.5 sm:gap-1">
                  {parsed.binaryMask.slice(octetIdx * 8, (octetIdx + 1) * 8).map((bit, bitIdx) => (
                    <span
                      key={bitIdx}
                      className={`text-[10px] sm:text-xs font-bold px-0.5 ${
                        bit === 1 ? 'text-emerald-400' : 'text-zinc-600'
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  Octet {octetIdx + 1} ({parsed.mask.split('.')[octetIdx]})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Computed Architecture Results Grid */}
      {parsed ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Subnet Mask</span>
            <span className="font-mono text-sm sm:text-base font-bold text-white block select-all">
              {parsed.mask}
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Prefix /{parsed.prefix}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Network ID (Subnet)</span>
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-300 block select-all">
              {parsed.network}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Base routing address</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Broadcast Address</span>
            <span className="font-mono text-sm sm:text-base font-bold text-amber-300 block select-all">
              {parsed.broadcast}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">All host bits set</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Wildcard Mask</span>
            <span className="font-mono text-sm sm:text-base font-bold text-cyan-300 block select-all">
              {parsed.wildcard}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Cisco IOS ACL format</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 col-span-2 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Usable Host Range</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-white block select-all">
              {parsed.firstUsable} &mdash; {parsed.lastUsable}
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Valid addresses for interfaces and hosts
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Usable Hosts</span>
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-400 block">
              {parsed.usableHosts.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {parsed.totalHosts.toLocaleString()} total addresses
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Classification</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white">
                {parsed.ipClass}
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                parsed.isPrivate ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {parsed.isPrivate ? 'RFC 1918' : 'Public'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {parsed.isPrivate ? 'Internal Private' : 'Internet Routable'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-center font-mono text-xs text-red-400">
          Invalid IPv4 Address format. Enter standard dotted-decimal (e.g. 192.168.1.1).
        </div>
      )}
    </div>
  );
}
