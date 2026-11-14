import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  Activity, 
  Send, 
  Terminal, 
  CheckCircle2, 
  Radio, 
  Lock, 
  Cpu, 
  Layers, 
  Repeat, 
  Share2, 
  GitFork, 
  Network as NetworkIcon,
  Zap
} from 'lucide-react';

const TOPOLOGIES_DATA = {
  star: {
    id: 'star',
    name: 'Star Topology',
    badge: 'MOST COMMON LAN',
    cabling: 'Cat6 / Cat6A UTP (RJ-45)',
    collisionDomain: '1 Collision Domain per Port (Full Duplex)',
    broadcastDomain: '1 Broadcast Domain (Splittable via VLANs)',
    spof: 'Central Switch / Hub only',
    formula: 'Cables = N, Ports = N',
    standard: 'IEEE 802.3 1000BASE-T / 10GBASE-T',
    description:
      'All peripheral devices connect directly to a central multiport switch or hub via point-to-point links. Failure of a single workstation cable has zero impact on other nodes. Central switch maintains CAM table for wire-speed unicast frame forwarding.',
    simPingLabel: 'Simulate CAM Frame Unicast',
    simActionLabel: 'Simulate Cable Cut (Node Isolation)',
    nodes: [
      {
        id: 'star-center',
        name: 'Core Catalyst Switch',
        role: 'Central Switching Fabric',
        ip: '192.168.1.1 (VLAN 1)',
        mac: '00:1A:2B:3C:4D:00',
        hardware: 'Cisco Catalyst 2960-24TT',
        status: 'ACTIVE - 24/24 GIGABIT',
        type: 'switch',
        x: 50,
        y: 50,
        acls: ['PortFast Enabled', 'BPDU Guard Active', 'CAM Dynamic Age 300s'],
        telemetry: 'Backplane: 32 Gbps | CAM Entries: 142 MACs',
      },
      {
        id: 'star-n1',
        name: 'Workstation 01',
        role: 'Engineering CAD Station',
        ip: '192.168.1.10/24',
        mac: '00:1A:2B:3C:4D:11',
        hardware: 'Cat6 Link -> Switch Port Gi0/1',
        status: 'OPTIMAL',
        type: 'client',
        x: 50,
        y: 15,
        acls: ['Port Security: 1 MAC Sticky', 'VLAN 10 Access'],
        telemetry: 'Speed: 1000 Mbps Full Duplex | Rx: 4.2 MB/s',
      },
      {
        id: 'star-n2',
        name: 'Database Cluster',
        role: 'Enterprise SQL Primary',
        ip: '192.168.1.20/24',
        mac: '00:1A:2B:3C:4D:22',
        hardware: 'Cat6A LACP Link -> Switch Port Gi0/2-3',
        status: 'OPTIMAL',
        type: 'server',
        x: 82,
        y: 35,
        acls: ['TLS 1.3 Required', 'ACL Deny Guest Inbound'],
        telemetry: 'Query Latency: 0.18ms | Throughput: 1.8 Gbps',
      },
      {
        id: 'star-n3',
        name: 'App Web Server',
        role: 'Nginx Reverse Proxy',
        ip: '192.168.1.30/24',
        mac: '00:1A:2B:3C:4D:33',
        hardware: 'Cat6 Link -> Switch Port Gi0/4',
        status: 'OPTIMAL',
        type: 'server',
        x: 82,
        y: 68,
        acls: ['Listen :443 TLS', 'DDoS Rate-Limit 500 req/s'],
        telemetry: 'Active Conns: 488 | Error Rate: 0.00%',
      },
      {
        id: 'star-n4',
        name: 'Finance Terminal',
        role: 'ERP Financial Auditor',
        ip: '192.168.1.40/24',
        mac: '00:1A:2B:3C:4D:44',
        hardware: 'Cat6 Link -> Switch Port Gi0/5',
        status: 'OPTIMAL',
        type: 'client',
        x: 50,
        y: 85,
        acls: ['VLAN 20 Isolated', 'Strict Accounting ACL'],
        telemetry: 'Packet Loss: 0.0% | RTT: 0.42ms',
      },
      {
        id: 'star-n5',
        name: 'SOC Analyst PC',
        role: 'SIEM Log Sentinel',
        ip: '192.168.1.50/24',
        mac: '00:1A:2B:3C:4D:55',
        hardware: 'Cat6 Link -> Switch Port Gi0/6',
        status: 'OPTIMAL',
        type: 'client',
        x: 18,
        y: 68,
        acls: ['SPAN Port Monitor Target', 'Wire-speed Mirroring'],
        telemetry: 'Promiscuous Sniffing Active | 0 Drops',
      },
      {
        id: 'star-n6',
        name: 'DMZ Honeytrap',
        role: 'Isolated Threat Decoy',
        ip: '192.168.1.99/24',
        mac: '00:1A:2B:3C:4D:99',
        hardware: 'Cat6 Link -> Switch Port Gi0/7',
        status: 'MONITORING',
        type: 'honeypot',
        x: 18,
        y: 35,
        acls: ['Quarantine VLAN 99', 'Block Lateral Movement'],
        telemetry: 'Trap Listening on :1337 | Logs to SIEM',
      },
    ],
    links: [
      { x1: 50, y1: 50, x2: 50, y2: 15 },
      { x1: 50, y1: 50, x2: 82, y2: 35 },
      { x1: 50, y1: 50, x2: 82, y2: 68 },
      { x1: 50, y1: 50, x2: 50, y2: 85 },
      { x1: 50, y1: 50, x2: 18, y2: 68 },
      { x1: 50, y1: 50, x2: 18, y2: 35 },
    ],
  },

  bus: {
    id: 'bus',
    name: 'Bus Topology',
    badge: 'LEGACY & INDUSTRIAL CAN BUS',
    cabling: 'Coaxial RG-58 (10BASE2) / RG-8 (10BASE5)',
    collisionDomain: 'Entire Bus is 1 Shared Collision Domain',
    broadcastDomain: 'Single Shared Broadcast Domain',
    spof: 'Backbone Cable Cut breaks entire bus',
    formula: 'Cables = 1 Trunk + N Drops',
    standard: 'IEEE 802.3 10BASE2 / ISO 11898 CAN',
    description:
      'All nodes tap into a single shared coaxial trunk cable terminated with 50-ohm BNC resistors at both ends to prevent signal reflection. Nodes use CSMA/CD to listen before transmitting. If two nodes transmit simultaneously, a collision jam signal is sent.',
    simPingLabel: 'Simulate Broadcast Transmission',
    simActionLabel: 'Simulate CSMA/CD Jam Collision',
    nodes: [
      {
        id: 'bus-t1',
        name: '50Ω Terminator L',
        role: 'Signal Reflection Absorber',
        ip: 'PHYSICAL TERMINATOR',
        mac: 'N/A (BNC 50-OHM)',
        hardware: '50Ω Coaxial Resistor Cap',
        status: 'ABSORBING RF ECHO',
        type: 'gateway',
        x: 10,
        y: 50,
        acls: ['Passive Impedance Match', 'Prevents Voltage Reflection'],
        telemetry: 'Resistance: 50.1Ω | Signal Return Loss: >26dB',
      },
      {
        id: 'bus-n1',
        name: 'Workstation A',
        role: 'BNC T-Connector Drop 1',
        ip: '10.0.0.10/24',
        mac: '00:1A:2B:3C:55:01',
        hardware: 'RG-58 Thinnet 0.5m Drop',
        status: 'HALF-DUPLEX CSMA/CD',
        type: 'client',
        x: 26,
        y: 20,
        acls: ['Listen-Before-Talk (CSMA/CD)', 'Backoff Timer Active'],
        telemetry: 'Carrier Detect: IDLE | Collisions: 0',
      },
      {
        id: 'bus-n2',
        name: 'Workstation B',
        role: 'BNC T-Connector Drop 2',
        ip: '10.0.0.11/24',
        mac: '00:1A:2B:3C:55:02',
        hardware: 'RG-58 Thinnet 0.5m Drop',
        status: 'HALF-DUPLEX CSMA/CD',
        type: 'client',
        x: 42,
        y: 80,
        acls: ['Half-Duplex Transceiver', 'Shared Bus Listener'],
        telemetry: 'Rx Frame: Listening | Frame Align: OK',
      },
      {
        id: 'bus-n3',
        name: 'File Server Alpha',
        role: 'Shared Storage Node',
        ip: '10.0.0.12/24',
        mac: '00:1A:2B:3C:55:03',
        hardware: 'RG-58 Thinnet 0.5m Drop',
        status: 'HALF-DUPLEX CSMA/CD',
        type: 'server',
        x: 58,
        y: 20,
        acls: ['Shared Channel Access', 'Collision Detect Enabled'],
        telemetry: 'Throughput: 10 Mbps Cap | Tx Slots: Normal',
      },
      {
        id: 'bus-n4',
        name: 'Print Spooler',
        role: 'Network Print Server',
        ip: '10.0.0.13/24',
        mac: '00:1A:2B:3C:55:04',
        hardware: 'RG-58 Thinnet 0.5m Drop',
        status: 'HALF-DUPLEX CSMA/CD',
        type: 'client',
        x: 74,
        y: 80,
        acls: ['CSMA/CD Exponential Backoff'],
        telemetry: 'Spool Queue: 0 pending | Carrier: Clear',
      },
      {
        id: 'bus-t2',
        name: '50Ω Terminator R',
        role: 'Signal Reflection Absorber',
        ip: 'PHYSICAL TERMINATOR',
        mac: 'N/A (BNC 50-OHM)',
        hardware: '50Ω Coaxial Resistor Cap',
        status: 'ABSORBING RF ECHO',
        type: 'gateway',
        x: 90,
        y: 50,
        acls: ['Passive Impedance Match', 'Ground Reference Stable'],
        telemetry: 'Resistance: 49.9Ω | Standing Wave Ratio: 1.02',
      },
    ],
    links: [
      // Main linear backbone
      { x1: 10, y1: 50, x2: 90, y2: 50, isBackbone: true },
      // Vertical drop cables
      { x1: 26, y1: 50, x2: 26, y2: 20 },
      { x1: 42, y1: 50, x2: 42, y2: 80 },
      { x1: 58, y1: 50, x2: 58, y2: 20 },
      { x1: 74, y1: 50, x2: 74, y2: 80 },
    ],
  },

  ring: {
    id: 'ring',
    name: 'Ring Topology',
    badge: 'TOKEN RING & FDDI FIBER',
    cabling: 'STP (Type 1) / Dual Multimode Fiber (FDDI)',
    collisionDomain: 'Zero Collisions (Deterministic Token Passing)',
    broadcastDomain: '1 Unidirectional Logical Ring Loop',
    spof: 'Single ring break (Mitigated by Counter-Rotating FDDI)',
    formula: 'Links = N, Transceivers = 2 per node (Rx/Tx)',
    standard: 'IEEE 802.5 Token Ring / ANSI X3T9.5 FDDI',
    description:
      'Each node connects to exactly two neighbors forming a continuous circular loop. A tiny 3-byte Token circulates endlessly. Only the station holding the token can transmit data frames, providing 100% deterministic packet delivery with mathematically guaranteed zero collision risk.',
    simPingLabel: 'Rotate 3-Byte Token Loop',
    simActionLabel: 'Simulate Token Capture & Transmit',
    nodes: [
      {
        id: 'ring-n1',
        name: 'Station Alpha',
        role: 'Active Ring Monitor (ARM)',
        ip: '172.16.10.1/24',
        mac: '00:00:81:AA:01:01',
        hardware: 'Token Ring Adapter 16 Mbps',
        status: 'MONITORING TOKEN TIMERS',
        type: 'router',
        x: 50,
        y: 16,
        acls: ['Active Monitor Frequency Sync', 'Purge Lost Token Routine'],
        telemetry: 'Token Rotation Time: 4.12ms | Jitter: <0.01ms',
      },
      {
        id: 'ring-n2',
        name: 'Station Beta',
        role: 'Engineering Design Node',
        ip: '172.16.10.2/24',
        mac: '00:00:81:AA:01:02',
        hardware: 'MAU (Multistation Access Unit) Port 2',
        status: 'REPEATER RE-CLOCKING',
        type: 'client',
        x: 82,
        y: 35,
        acls: ['Token Repeat Mode', 'Frame Copied Flag Ready'],
        telemetry: 'Tx Delay: 2.5 bit-times | Phase Lock: LOCKED',
      },
      {
        id: 'ring-n3',
        name: 'Station Gamma',
        role: 'Production Database',
        ip: '172.16.10.3/24',
        mac: '00:00:81:AA:01:03',
        hardware: 'MAU Port 3 - Fiber NIC',
        status: 'REPEATER RE-CLOCKING',
        type: 'server',
        x: 82,
        y: 68,
        acls: ['Token Priority Level 4', 'Early Token Release'],
        telemetry: 'Buffer Fill: 12% | Latency: 0.28ms',
      },
      {
        id: 'ring-n4',
        name: 'Station Delta',
        role: 'Backup File Node',
        ip: '172.16.10.4/24',
        mac: '00:00:81:AA:01:04',
        hardware: 'MAU Port 4',
        status: 'REPEATER RE-CLOCKING',
        type: 'server',
        x: 50,
        y: 84,
        acls: ['Beaconing Health Check', 'Wrap-around Relay OK'],
        telemetry: 'Ring Health: 100% | CRC Checksums: PASS',
      },
      {
        id: 'ring-n5',
        name: 'Station Epsilon',
        role: 'Security Workstation',
        ip: '172.16.10.5/24',
        mac: '00:00:81:AA:01:05',
        hardware: 'MAU Port 5',
        status: 'REPEATER RE-CLOCKING',
        type: 'client',
        x: 18,
        y: 68,
        acls: ['Promiscuous Ring Inspector', 'Token Watchdog'],
        telemetry: 'Tokens Handled (1h): 840,291 | Missed: 0',
      },
      {
        id: 'ring-n6',
        name: 'Station Zeta',
        role: 'Gateway Relay',
        ip: '172.16.10.6/24',
        mac: '00:00:81:AA:01:06',
        hardware: 'MAU Port 6',
        status: 'REPEATER RE-CLOCKING',
        type: 'gateway',
        x: 18,
        y: 35,
        acls: ['Ring-to-Ethernet Bridge', 'Translational MAC Bridging'],
        telemetry: 'Frames Forwarded: 1.2M | Loss: 0.00%',
      },
    ],
    links: [
      { x1: 50, y1: 16, x2: 82, y2: 35 },
      { x1: 82, y1: 35, x2: 82, y2: 68 },
      { x1: 82, y1: 68, x2: 50, y2: 84 },
      { x1: 50, y1: 84, x2: 18, y2: 68 },
      { x1: 18, y1: 68, x2: 18, y2: 35 },
      { x1: 18, y1: 35, x2: 50, y2: 16 },
    ],
  },

  mesh: {
    id: 'mesh',
    name: 'Mesh Topology (Full Mesh)',
    badge: 'MISSION-CRITICAL WAN / ZERO SPOF',
    cabling: 'Redundant Single-Mode Fiber (SMF) & Dedicated T3/E3 Leased Lines',
    collisionDomain: 'Point-to-Point Dedicated Link per Node Pair',
    broadcastDomain: 'Routed Layer 3 (OSPF / IS-IS / BGP Fabric)',
    spof: 'ABSOLUTE ZERO SINGLE POINT OF FAILURE',
    formula: 'Total Physical Links = N × (N - 1) / 2',
    standard: 'RFC 2328 OSPFv2 / RFC 4271 BGP-4 / Full Mesh WAN',
    description:
      'Every single node is connected via a direct, dedicated physical link to every other node in the network. For 5 nodes, exactly 10 redundant links exist. If any cable or interface fails, routing protocols instantly reroute traffic with zero packet loss.',
    simPingLabel: 'Simulate Multipath ECMP Route',
    simActionLabel: 'Simulate Link Sever & Auto-Reroute',
    nodes: [
      {
        id: 'mesh-n1',
        name: 'DataCenter Core A',
        role: 'Primary BGP Edge Gateway',
        ip: '10.255.0.1/32 (Loopback0)',
        mac: '00:1A:2B:FF:01:01',
        hardware: 'Cisco ASR 9000 Carrier Router',
        status: 'HIGH-AVAILABILITY FULL MESH',
        type: 'router',
        x: 50,
        y: 16,
        acls: ['OSPF Cost 10 on all links', 'BGP Full Transit AS65001'],
        telemetry: 'Neighbors: 4 Full Adj | Converged: 0.02s',
      },
      {
        id: 'mesh-n2',
        name: 'DataCenter Core B',
        role: 'Secondary Regional Hub',
        ip: '10.255.0.2/32 (Loopback0)',
        mac: '00:1A:2B:FF:01:02',
        hardware: 'Cisco ASR 9000 Carrier Router',
        status: 'HIGH-AVAILABILITY FULL MESH',
        type: 'router',
        x: 84,
        y: 40,
        acls: ['OSPF Area 0 Backbone', 'ECMP 4-Way Load Balancing'],
        telemetry: 'Link Load: 24% | Fiber Jitter: 0.04ms',
      },
      {
        id: 'mesh-n3',
        name: 'DataCenter Core C',
        role: 'Disaster Recovery Edge',
        ip: '10.255.0.3/32 (Loopback0)',
        mac: '00:1A:2B:FF:01:03',
        hardware: 'Juniper MX480 Universal Edge',
        status: 'HIGH-AVAILABILITY FULL MESH',
        type: 'router',
        x: 71,
        y: 84,
        acls: ['BFD Fast Detection (50ms)', 'MPLS Traffic Engineering'],
        telemetry: 'BFD Sessions: 4/4 UP | Fiber Attenuation: 0.18dB',
      },
      {
        id: 'mesh-n4',
        name: 'DataCenter Core D',
        role: 'Cloud Interconnect Gateway',
        ip: '10.255.0.4/32 (Loopback0)',
        mac: '00:1A:2B:FF:01:04',
        hardware: 'Arista 7280R3 Core Fabric',
        status: 'HIGH-AVAILABILITY FULL MESH',
        type: 'router',
        x: 29,
        y: 84,
        acls: ['BGP EVPN VXLAN Gateway', 'Segment Routing SRv6'],
        telemetry: 'Direct Peering: 100G links | Packet Loss: 0.00%',
      },
      {
        id: 'mesh-n5',
        name: 'DataCenter Core E',
        role: 'Security Defense Citadel',
        ip: '10.255.0.5/32 (Loopback0)',
        mac: '00:1A:2B:FF:01:05',
        hardware: 'Fortinet FortiGate 3000F Cluster',
        status: 'HIGH-AVAILABILITY FULL MESH',
        type: 'firewall',
        x: 16,
        y: 40,
        acls: ['Full Mesh IPSec Over-the-Top', 'Hardware Encrypted Links'],
        telemetry: 'IPSec Tunnels: 4 Active | Crypto: AES-256-GCM',
      },
    ],
    // 5 nodes = 5*(4)/2 = 10 links
    links: [
      { x1: 50, y1: 16, x2: 84, y2: 40 },
      { x1: 50, y1: 16, x2: 71, y2: 84 },
      { x1: 50, y1: 16, x2: 29, y2: 84 },
      { x1: 50, y1: 16, x2: 16, y2: 40 },
      { x1: 84, y1: 40, x2: 71, y2: 84 },
      { x1: 84, y1: 40, x2: 29, y2: 84 },
      { x1: 84, y1: 40, x2: 16, y2: 40 },
      { x1: 71, y1: 84, x2: 29, y2: 84 },
      { x1: 71, y1: 84, x2: 16, y2: 40 },
      { x1: 29, y1: 84, x2: 16, y2: 40 },
    ],
  },

  tree: {
    id: 'tree',
    name: 'Tree Topology (Hierarchical)',
    badge: 'CISCO 3-TIER ENTERPRISE CAMPUS',
    cabling: 'Fiber Backbone (Core/Dist) + Cat6 UTP (Access Tier)',
    collisionDomain: 'Segmented at each Switchport',
    broadcastDomain: 'VLAN boundary enforced at Distribution layer',
    spof: 'Mitigated by redundant uplinks & HSRP / VRRP',
    formula: 'Hierarchical Root-and-Branch Scaling',
    standard: 'Cisco Enterprise Campus Design / IEEE 802.1D / RSTP',
    description:
      'Implements Cisco classical 3-tier hierarchical design: Core Layer (high-speed transport backbone), Distribution Layer (policy routing, ACL filtering, VLAN boundaries), and Access Layer (end-user workstation connectivity). Scales infinitely without broadcast storms.',
    simPingLabel: 'Simulate Upstream Tier Traversal',
    simActionLabel: 'Simulate Distribution Layer Policy Drop',
    nodes: [
      // Core Tier
      {
        id: 'tree-c1',
        name: 'Core Router 01',
        role: 'Tier 1: Enterprise Campus Core',
        ip: '10.0.0.1/30 (Backbone)',
        mac: '00:1A:2B:CC:01:01',
        hardware: 'Cisco Catalyst 9500 Core 100G',
        status: 'ACTIVE CORE FABRIC',
        type: 'router',
        x: 35,
        y: 18,
        acls: ['Zero ACL Filtering (Raw Speed)', 'OSPF Area 0 LSA Purge'],
        telemetry: 'Throughput: 80 Gbps | Latency: 0.08ms',
      },
      {
        id: 'tree-c2',
        name: 'Core Router 02',
        role: 'Tier 1: Enterprise Campus Core',
        ip: '10.0.0.2/30 (Backbone)',
        mac: '00:1A:2B:CC:01:02',
        hardware: 'Cisco Catalyst 9500 Core 100G',
        status: 'ACTIVE CORE FABRIC',
        type: 'router',
        x: 65,
        y: 18,
        acls: ['HSRP Priority 110 (Active Gateway)', 'EtherChannel Trunk'],
        telemetry: 'Throughput: 78 Gbps | CPU: 4.1%',
      },
      // Distribution Tier
      {
        id: 'tree-d1',
        name: 'Dist Switch West',
        role: 'Tier 2: Policy & Inter-VLAN Routing',
        ip: '10.10.0.1/24 (SVI)',
        mac: '00:1A:2B:DD:02:01',
        hardware: 'Cisco Catalyst 9300 Multigigabit',
        status: 'DISTRIBUTION AGGREGATOR',
        type: 'switch',
        x: 25,
        y: 50,
        acls: ['Inter-VLAN Route Filtering', 'QoS DSCP EF Voice Trust'],
        telemetry: 'Route Cache: 8,400 prefixes | STP: Root Bridge',
      },
      {
        id: 'tree-d2',
        name: 'Dist Switch East',
        role: 'Tier 2: Policy & Inter-VLAN Routing',
        ip: '10.20.0.1/24 (SVI)',
        mac: '00:1A:2B:DD:02:02',
        hardware: 'Cisco Catalyst 9300 Multigigabit',
        status: 'DISTRIBUTION AGGREGATOR',
        type: 'switch',
        x: 75,
        y: 50,
        acls: ['Corporate Security ACL List 101', 'DHCP Snooping Active'],
        telemetry: 'HSRP: Standby State | Uptime: 248 days',
      },
      // Access Tier
      {
        id: 'tree-a1',
        name: 'Access SW Bldg A',
        role: 'Tier 3: User Desktop Port Edge',
        ip: '10.10.1.2 (Mgmt)',
        mac: '00:1A:2B:AA:03:01',
        hardware: 'Catalyst 2960X PoE+ 48P',
        status: 'EDGE ACCESS TIER',
        type: 'client',
        x: 15,
        y: 84,
        acls: ['Port Security Max 2 MACs', '802.1X Dynamic VLAN Assignment'],
        telemetry: 'PoE Budget: 340W / 740W | Endpoints: 42 PCs',
      },
      {
        id: 'tree-a2',
        name: 'Access SW Bldg B',
        role: 'Tier 3: Engineering Access',
        ip: '10.10.2.2 (Mgmt)',
        mac: '00:1A:2B:AA:03:02',
        hardware: 'Catalyst 2960X PoE+ 48P',
        status: 'EDGE ACCESS TIER',
        type: 'client',
        x: 38,
        y: 84,
        acls: ['BPDU Guard Enabled', 'Root Guard on Uplink'],
        telemetry: 'Speed: 1 Gbps to Desktops | Errors: 0',
      },
      {
        id: 'tree-a3',
        name: 'Access SW DataCenter',
        role: 'Tier 3: Server Rack Top-of-Rack',
        ip: '10.20.1.2 (Mgmt)',
        mac: '00:1A:2B:AA:03:03',
        hardware: 'Nexus 9300-FX Low Latency',
        status: 'DATA CENTER ACCESS',
        type: 'server',
        x: 62,
        y: 84,
        acls: ['LACP Dual-Homing', 'Jumbo Frames 9216 MTU'],
        telemetry: '10G Server Interfaces: 32 active | 0 drops',
      },
      {
        id: 'tree-a4',
        name: 'Access SW Bldg C',
        role: 'Tier 3: Executive Wing Access',
        ip: '10.20.2.2 (Mgmt)',
        mac: '00:1A:2B:AA:03:04',
        hardware: 'Catalyst 2960X PoE+ 48P',
        status: 'EDGE ACCESS TIER',
        type: 'client',
        x: 85,
        y: 84,
        acls: ['Private VLAN Community Isolation', 'ARP Inspection (DAI)'],
        telemetry: 'DAI Logged: 0 poisoned ARPs | Health: 100%',
      },
    ],
    links: [
      // Core cross-link
      { x1: 35, y1: 18, x2: 65, y2: 18 },
      // Core 1 to Dist 1 & 2
      { x1: 35, y1: 18, x2: 25, y2: 50 },
      { x1: 35, y1: 18, x2: 75, y2: 50 },
      // Core 2 to Dist 1 & 2
      { x1: 65, y1: 18, x2: 25, y2: 50 },
      { x1: 65, y1: 18, x2: 75, y2: 50 },
      // Dist 1 to Access 1 & 2
      { x1: 25, y1: 50, x2: 15, y2: 84 },
      { x1: 25, y1: 50, x2: 38, y2: 84 },
      // Dist 2 to Access 3 & 4
      { x1: 75, y1: 50, x2: 62, y2: 84 },
      { x1: 75, y1: 50, x2: 85, y2: 84 },
    ],
  },

  hybrid: {
    id: 'hybrid',
    name: 'Hybrid / Enterprise WAN',
    badge: 'SAHIL CCNA CERTIFIED LAB ARCHITECTURE',
    cabling: 'Serial V.35 WAN + Cat6 Dot1Q Trunking + DMZ Fiber',
    collisionDomain: 'Full Duplex Switched + Point-to-Point WAN',
    broadcastDomain: 'Split across IEEE 802.1Q VLAN 10, 20 & 30',
    spof: 'Mitigated by Perimeter NGFW Stateful Inspection',
    formula: 'Star LANs + Point-to-Point WAN + Stateful Edge',
    standard: 'IEEE 802.1Q / RFC 3022 NAT / Cisco IOS 15.1',
    description:
      'Combines Star-topology corporate departments with a cross-site Serial WAN connection (30.0.0.0/30 at 64k clock rate), Router-on-a-Stick Dot1Q sub-interfaces, and a perimeter NAT/PAT overload gateway guarding an isolated DMZ honeytrap.',
    simPingLabel: 'Simulate Cross-VLAN WAN Traversal',
    simActionLabel: 'Simulate Perimeter Attack Intercept',
    nodes: [
      {
        id: 'hyb-wan',
        name: 'WAN Gateway',
        role: 'Public Edge / Serial Link',
        ip: '200.0.0.1/30',
        mac: '00:1A:2B:3C:4D:01',
        hardware: 'Serial Se2/0 (Clock 64000)',
        status: 'OPTIMAL',
        type: 'gateway',
        x: 82,
        y: 20,
        acls: ['Permit Established', 'Deny Inbound Unsolicited', 'NAT Pool 200.0.0.1-200.0.0.8'],
        telemetry: 'Tx: 14.2 Mbps | Rx: 8.9 Mbps | Loss: 0.00%',
      },
      {
        id: 'hyb-router',
        name: 'Cisco 2811 Router',
        role: 'Router-on-a-Stick / NAT-PAT',
        ip: '10.0.0.1 (Fa0/0.10, Fa0/0.20)',
        mac: '00:1A:2B:3C:4D:02',
        hardware: 'Cisco 2811 ISR, IOS 15.1',
        status: 'OPTIMAL',
        type: 'router',
        x: 50,
        y: 20,
        acls: ['Dot1Q Trunking', 'NAT Overload (ACL 1)', 'Sub-if Fa0/0.10 & Fa0/0.20'],
        telemetry: 'CPU: 3.4% | Memory: 32% | MTU: 1500',
      },
      {
        id: 'hyb-firewall',
        name: 'Perimeter NGFW / IDS',
        role: 'Deep Packet Inspection & Zero-Trust',
        ip: '10.0.0.254',
        mac: '00:1A:2B:3C:4D:03',
        hardware: 'Stateful Hardened Firewall Engine',
        status: 'ARMED',
        type: 'firewall',
        x: 50,
        y: 50,
        acls: ['Stateful SPI', 'Drop Malformed SYN', 'Anti-Spoofing RFC 2827'],
        telemetry: 'Blocked Threats (24h): 1,482 | Latency: 0.4ms',
      },
      {
        id: 'hyb-switch',
        name: 'Catalyst 2960 Core',
        role: '802.1Q L2 Managed Switch',
        ip: '10.0.0.2 (Management)',
        mac: '00:1A:2B:3C:4D:04',
        hardware: 'Catalyst 2960-24TT-L',
        status: 'OPTIMAL',
        type: 'switch',
        x: 50,
        y: 80,
        acls: ['Port Security Max 1 MAC', 'BPDU Guard Enabled', 'Spanning-Tree RSTP'],
        telemetry: 'Trunk Fa0/24 ACTIVE | STP: Forwarding',
      },
      {
        id: 'hyb-pc14',
        name: 'SOC Terminal (PC14)',
        role: 'SOC Analyst Workstation',
        ip: '10.0.10.2/24',
        mac: '00:1A:2B:3C:4D:14',
        hardware: 'Host Workstation - Linux Triage',
        status: 'OPTIMAL',
        type: 'client',
        x: 18,
        y: 80,
        acls: ['Default Gateway 10.0.10.1', 'Audit Logging Enabled'],
        telemetry: 'Ping: 0.8ms | Auth: 2FA Token Active',
      },
      {
        id: 'hyb-server',
        name: 'RHEL 9 App Server',
        role: 'Production Web & Reverse Proxy',
        ip: '10.0.20.2/24',
        mac: '00:1A:2B:3C:4D:20',
        hardware: 'Red Hat Enterprise Linux 9.4 x86_64',
        status: 'OPTIMAL',
        type: 'server',
        x: 82,
        y: 80,
        acls: ['Listen :443 (TLS 1.3)', 'Firewalld Zone: Internal', 'SELinux Enforcing'],
        telemetry: 'Uptime: 99.98% | Services: systemd 0 failed',
      },
      {
        id: 'hyb-honeypot',
        name: 'DMZ Decoy Node',
        role: 'Isolated Threat Honeytoken',
        ip: '172.16.1.100/24',
        mac: '00:1A:2B:3C:4D:99',
        hardware: 'Containerized Honeytrap (Port 1337)',
        status: 'MONITORING',
        type: 'honeypot',
        x: 18,
        y: 20,
        acls: ['Strict Sandbox Isolation', 'Log to SIEM Journal', 'Block Outbound Pivot'],
        telemetry: 'Port 1337 Listener | 0 Internal Exposure',
      },
    ],
    links: [
      { x1: 82, y1: 20, x2: 50, y2: 20 },
      { x1: 18, y1: 20, x2: 50, y2: 20 },
      { x1: 50, y1: 20, x2: 50, y2: 50 },
      { x1: 50, y1: 50, x2: 50, y2: 80 },
      { x1: 50, y1: 80, x2: 18, y2: 80 },
      { x1: 50, y1: 80, x2: 82, y2: 80 },
    ],
  },
};

export default function NetworkTopology({ onSoundClick }) {
  const [activeTopologyKey, setActiveTopologyKey] = useState('star');
  const currentTopology = TOPOLOGIES_DATA[activeTopologyKey];
  const [selectedNode, setSelectedNode] = useState(currentTopology.nodes[0]);
  const [simulationState, setSimulationState] = useState('idle'); // idle | running | alert
  const [simStep, setSimStep] = useState(0);
  const [simLog, setSimLog] = useState(`Ready. Select any node or simulate packet flows on ${currentTopology.name}.`);

  const runSound = () => {
    if (onSoundClick) onSoundClick();
  };

  const handleSwitchTopology = (key) => {
    runSound();
    setActiveTopologyKey(key);
    const newTopo = TOPOLOGIES_DATA[key];
    setSelectedNode(newTopo.nodes[0]);
    setSimulationState('idle');
    setSimStep(0);
    setSimLog(`Loaded ${newTopo.name} (${newTopo.badge}). Click any node to inspect telemetry.`);
  };

  // Run simulation specific to the selected topology
  const handleSimulate = (isSecondaryAction = false) => {
    runSound();
    setSimulationState(isSecondaryAction ? 'alert' : 'running');
    setSimStep(0);

    if (activeTopologyKey === 'star') {
      if (!isSecondaryAction) {
        setSimLog('[*] Workstation 01 (192.168.1.10) sends Ethernet Frame -> Core Catalyst Switch...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Core Switch CAM table lookup: MAC 00:1A:2B:3C:4D:22 found on Port Gi0/2 (0.04μs latency).');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Frame delivered directly to Database Cluster. Other ports remained 100% quiet (Zero Collision).');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[!] SIMULATION: Disconnecting Workstation 04 cable link...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[!] Port Gi0/5 changed state to down. Link failure isolated to single drop cable.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] STAR RESILIENCE CONFIRMED: Core switch and all other 5 stations remain 100% active and unaffected.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    } else if (activeTopologyKey === 'bus') {
      if (!isSecondaryAction) {
        setSimLog('[*] Workstation A initiates CSMA/CD transmission along linear Coaxial Trunk...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Signal propagates across entire bus. All drops inspect destination MAC address.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Unmatched nodes drop frame; 50Ω Terminators absorb energy at both ends to prevent signal echo.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[!] SIMULATION: Workstation A and Workstation B transmit simultaneously on shared wire...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[⚠️] CSMA/CD COLLISION DETECTED! Voltage threshold exceeded -> 32-bit Jam Signal broadcasted!');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Binary Exponential Backoff triggered: Stations wait random slot intervals before retransmitting.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    } else if (activeTopologyKey === 'ring') {
      if (!isSecondaryAction) {
        setSimLog('[*] Circulating 3-byte Token: Station Alpha (ARM) -> Station Beta...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Token rotates sequentially: Station Beta -> Gamma -> Delta -> Epsilon -> Zeta.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Loop completed in 4.12ms. Token handed back to Active Ring Monitor. Exactly 0 collisions.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[*] Station Beta seizes Free Token, flips bit to Busy, and appends 4KB payload for Station Delta...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Frame passes Gamma -> Station Delta copies frame into buffer and sets "Address Recognized" bit.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Frame returns to Station Beta (Sender). Sender strips payload and releases fresh Free Token.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    } else if (activeTopologyKey === 'mesh') {
      if (!isSecondaryAction) {
        setSimLog('[*] Injecting traffic from Core Router Alpha -> Core Router Delta (Full Mesh)...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] OSPF Equal-Cost Multi-Path (ECMP): Packet distributed across 4 parallel 100G fiber trunks.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Zero hop bottlenecks. End-to-end jitter < 0.04ms. Full wire-speed saturation confirmed.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[!] SEVERING DIRECT TRUNK: Fiber link between Core A and Core D cut!');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[!] BFD detects loss in 12ms! OSPF SPF calculation runs instantly -> Rerouting via Core E & Core C.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] ZERO PACKET LOSS: Mesh redundancy delivers sub-50ms failover across alternate mesh vectors.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    } else if (activeTopologyKey === 'tree') {
      if (!isSecondaryAction) {
        setSimLog('[*] User at Access SW Bldg A sends frame targeting Server Rack in DataCenter...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Frame traverses Tier 3 Access -> Tier 2 Dist Switch West (VLAN 10) -> Core 100G Backbone.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Routed down via Dist Switch East into DataCenter Access Switch. Route summary retained in Core.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[!] POLICY ENFORCEMENT: Unauthorized guest PC on Access SW Bldg A attempts direct DC probe...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[🛡️] INTERCEPT: Distribution Switch West ACL 101 triggered! Rule "deny ip guest 10.20.0.0/16" enforced.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] Core backbone protected from rogue traffic. Incident logged to enterprise syslog server.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    } else {
      // Hybrid
      if (!isSecondaryAction) {
        setSimLog('[*] SOC Terminal PC14 (10.0.10.2) pings RHEL 9 App Server across Dot1Q sub-interfaces...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[+] Cisco 2811 sub-interface Fa0/0.10 routes to Fa0/0.20 -> Stateful Firewall permits established session.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] ICMP Echo reply verified: 64 bytes, 0% packet loss, RTT 0.82ms.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      } else {
        setSimLog('[!] ALERT: External SYN flood targeting DMZ Honeytoken from WAN IP 198.51.100.44...');
        setTimeout(() => {
          setSimStep(50);
          setSimLog('[🛡️] PERIMETER DEFENSE: Hardened NGFW SPI table detects anomaly -> Drop malformed frame & trigger ACL.');
        }, 800);
        setTimeout(() => {
          setSimStep(100);
          setSimLog('[✓] INTRUSION BLOCKED: Attacking IP quarantined for 3600 seconds. Zero internal exposure.');
          setTimeout(() => setSimulationState('idle'), 1500);
        }, 1800);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Topology Type Switcher Tabs */}
      <div className="p-3 rounded-2xl border border-dashed border-white/20 bg-[#111111]/95 backdrop-blur-xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { key: 'star', label: 'Star', icon: <Share2 size={13} /> },
            { key: 'bus', label: 'Bus', icon: <Activity size={13} /> },
            { key: 'ring', label: 'Ring', icon: <Repeat size={13} /> },
            { key: 'mesh', label: 'Mesh', icon: <NetworkIcon size={13} /> },
            { key: 'tree', label: 'Tree', icon: <GitFork size={13} /> },
            { key: 'hybrid', label: 'Enterprise Hybrid', icon: <Layers size={13} /> },
          ].map((item) => {
            const isActive = activeTopologyKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSwitchTopology(item.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#d71921] text-white font-bold shadow-[0_0_15px_rgba(215,25,33,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 pr-3 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#d71921] nothing-led" />
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            {currentTopology.badge}
          </span>
        </div>
      </div>

      {/* Topology Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-dashed border-white/20 bg-[#111111]/90 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4d54] uppercase tracking-wider font-bold">
              {currentTopology.name.toUpperCase()}
            </span>
            <span className="text-zinc-600">//</span>
            <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {currentTopology.standard}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-white font-bold">
            {currentTopology.name} Interactive Lab
          </h3>
          <p className="font-mono text-xs text-zinc-400 max-w-2xl">
            {currentTopology.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => handleSimulate(false)}
            disabled={simulationState !== 'idle'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send size={13} className="text-[#d71921]" />
            <span>{currentTopology.simPingLabel}</span>
          </button>

          <button
            onClick={() => handleSimulate(true)}
            disabled={simulationState !== 'idle'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#d71921]/40 bg-[#d71921]/10 hover:bg-[#d71921]/20 text-white font-mono text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap size={13} className="text-[#ff4d54]" />
            <span>{currentTopology.simActionLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas (Left) + Architectural Specs & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Canvas */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-dashed border-white/20 bg-[#0a0a0a] relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Dot matrix grid inside */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Connecting Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {currentTopology.links.map((link, idx) => (
              <line
                key={`link-${idx}`}
                x1={`${link.x1}%`}
                y1={`${link.y1}%`}
                x2={`${link.x2}%`}
                y2={`${link.y2}%`}
                stroke={link.isBackbone ? '#d71921' : 'rgba(255, 255, 255, 0.28)'}
                strokeDasharray={link.isBackbone ? 'none' : '4 4'}
                strokeWidth={link.isBackbone ? '4' : '2'}
              />
            ))}

            {/* Simulated Animated Pulse on Wire */}
            {simulationState !== 'idle' && (
              <circle
                r="6"
                fill={simulationState === 'alert' ? '#d71921' : '#ffffff'}
                className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                cx={`${simStep === 0 ? 25 : simStep === 50 ? 50 : 75}%`}
                cy={`${simStep === 0 ? 50 : simStep === 50 ? 50 : 50}%`}
              />
            )}
          </svg>

          {/* Interactive Topology Nodes */}
          <div className="relative w-full h-[370px]" style={{ zIndex: 2 }}>
            {currentTopology.nodes.map((node) => {
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
                  className={`absolute p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 min-w-[105px] text-center ${
                    isSelected
                      ? 'border-[#d71921] bg-[#1a1112] shadow-[0_0_20px_rgba(215,25,33,0.35)] scale-105'
                      : 'border-white/15 bg-[#121212]/92 hover:border-white/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {node.type === 'gateway' && <Radio size={13} className="text-white/80" />}
                    {node.type === 'router' && <Cpu size={13} className="text-[#ff4d54]" />}
                    {node.type === 'firewall' && <ShieldCheck size={13} className="text-[#d71921]" />}
                    {node.type === 'switch' && <Activity size={13} className="text-white/80" />}
                    {node.type === 'server' && <Server size={13} className="text-zinc-300" />}
                    {node.type === 'client' && <Terminal size={13} className="text-zinc-300" />}
                    {node.type === 'honeypot' && <Lock size={13} className="text-amber-400" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d71921] nothing-led" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-white tracking-wide truncate max-w-[95px]">
                    {node.name}
                  </span>
                  <span className="font-mono text-[8px] text-zinc-400 bg-black/40 px-1 py-0.2 rounded border border-white/5 truncate max-w-[95px]">
                    {node.ip.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Diagnostic Console Line */}
          <div className="relative z-10 mt-2 p-3 rounded-xl border border-white/10 bg-black/85 font-mono text-xs flex items-center gap-2">
            <span className="text-[#d71921] font-bold">{'>'}</span>
            <span className="text-zinc-300 truncate">{simLog}</span>
          </div>
        </div>

        {/* Right: Architectural Matrix & Selected Node Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          {/* Architectural Specs Card */}
          <div className="p-5 rounded-2xl border border-dashed border-white/20 bg-[#111111]/95 backdrop-blur-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-[10px] text-[#ff4d54] uppercase tracking-wider font-bold">
                TOPOLOGY ARCHITECTURAL SPECS
              </span>
              <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {currentTopology.name}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase block">Media & Cabling</span>
                <span className="text-zinc-200 font-semibold">{currentTopology.cabling}</span>
              </div>

              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase block">Collision Domain</span>
                <span className="text-zinc-200">{currentTopology.collisionDomain}</span>
              </div>

              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase block">Single Point of Failure (SPOF)</span>
                <span className="text-red-300 font-medium">{currentTopology.spof}</span>
              </div>

              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase block">Scaling Formula</span>
                <span className="text-white font-bold">{currentTopology.formula}</span>
              </div>
            </div>
          </div>

          {/* Selected Node Details Card */}
          <div className="p-5 rounded-2xl border border-dashed border-white/20 bg-[#111111]/95 backdrop-blur-xl space-y-3 font-mono text-xs">
            <div className="border-b border-white/10 pb-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#ff4d54] uppercase tracking-wider">
                  ACTIVE NODE TELEMETRY
                </span>
                <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[9px] text-white">
                  {selectedNode.status}
                </span>
              </div>
              <h4 className="font-display text-base text-white font-bold">{selectedNode.name}</h4>
              <p className="text-[11px] text-zinc-400">{selectedNode.role}</p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500">IP ADDRESS</span>
                <span className="text-white font-bold">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500">MAC / HW</span>
                <span className="text-zinc-300 truncate max-w-[150px]">{selectedNode.mac}</span>
              </div>
            </div>

            {/* ACL Rules */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                Node ACLs & Policies:
              </span>
              {selectedNode.acls.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded bg-black/50 border border-white/5 text-[10px] text-zinc-300">
                  <CheckCircle2 size={11} className="text-[#d71921] shrink-0" />
                  <span className="truncate">{rule}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl border border-white/10 bg-black/60 text-[10px] text-zinc-400">
              <span className="text-white font-semibold block mb-0.5">Live Bus Metrics:</span>
              {selectedNode.telemetry}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
