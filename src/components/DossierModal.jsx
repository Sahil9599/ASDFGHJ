import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, Mail, Phone, Globe } from 'lucide-react';

export default function DossierModal({ open, onClose, projects, onSoundClick }) {
  const handlePrint = () => {
    if (onSoundClick) onSoundClick();
    window.print();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 print:static print:bg-white print:p-0"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="dossier-printable w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0c0c14] text-zinc-200 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl print:max-h-none print:border-none print:bg-white print:text-black print:shadow-none"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between bg-black/60 print:hidden">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck size={14} />
                TECHNICAL DOSSIER // PRINTABLE CV
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  Save PDF / Print
                </button>
                <button
                  onClick={() => {
                    if (onSoundClick) onSoundClick();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg border border-white/15 hover:border-white text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:overflow-visible print:p-4">
              {/* Identity Block */}
              <div className="border-b border-white/15 pb-5 print:border-zinc-300">
                <h2 className="text-3xl font-syne font-black uppercase text-white print:text-black">
                  SAHIL
                </h2>
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mt-1 print:text-emerald-700">
                  Cyber Security Specialist &bull; Cisco CCNA &bull; Enterprise Linux Architect
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-zinc-400 print:text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <Mail size={12} /> sahilkumar202232@gmail.com
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={12} /> +91 7042131215
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={12} /> github.com/Sahil9599
                  </span>
                </div>
              </div>

              {/* Core Capabilities */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold print:text-emerald-700">
                  // CORE TECHNICAL COMPETENCIES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] print:border-zinc-300">
                    <div className="font-bold text-white print:text-black mb-1">Cisco Routing &amp; Switching (CCNA)</div>
                    <p className="text-zinc-400 print:text-zinc-700">
                      802.1Q Dot1Q encapsulation, Router-on-a-Stick, Catalyst trunking, Serial Se2/0 WAN links, NAT/PAT Overload &amp; Standard ACLs.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] print:border-zinc-300">
                    <div className="font-bold text-white print:text-black mb-1">RHEL 9 &amp; Linux Kernel Defense</div>
                    <p className="text-zinc-400 print:text-zinc-700">
                      Process &amp; kauditd thread telemetry (top), LVM NVMe partitioning (df -h), memory audits (free -h), systemctl, journalctl &amp; ss -tuln.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Lab Evidence */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold print:text-emerald-700">
                  // VERIFIED ENGINEERING LABS ({projects.length})
                </h3>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] print:border-zinc-300 space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-sm text-white print:text-black">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 print:bg-zinc-200 print:text-black">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 print:text-zinc-700 leading-relaxed">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.metrics.map((m) => (
                          <span
                            key={m}
                            className="text-[10px] font-mono text-emerald-400 print:text-emerald-700"
                          >
                            ✓ {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
