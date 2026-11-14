import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Copy, Check, X, Award, Key } from 'lucide-react';
import MatrixRain from './MatrixRain';

export default function HackModeModal({ isOpen, onClose, onSoundClick }) {
  const [copied, setCopied] = useState(false);
  const flagText = 'FLAG{SAHIL_DEFENSE_KERNEL_ZERO_TRUST_BYPASS_2026}';

  if (!isOpen) return null;

  const handleCopy = () => {
    if (onSoundClick) onSoundClick();
    navigator.clipboard.writeText(flagText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with dark matrix rain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        >
          <MatrixRain opacity={0.35} />
        </motion.div>

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-xl rounded-2xl border-2 border-dashed border-[#d71921] bg-[#0c0c0c]/98 p-6 shadow-[0_0_50px_rgba(215,25,33,0.35)] space-y-6"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d71921]/20 border border-[#d71921]/60 flex items-center justify-center text-[#ff4d54]">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d71921] nothing-led" />
                  <span className="font-mono text-[10px] text-[#ff4d54] uppercase tracking-widest font-bold">
                    SECURITY AUDIT OVERRIDE // EXPLOIT CONFIRMED
                  </span>
                </div>
                <h3 className="font-display text-xl text-white font-bold tracking-tight">
                  CLASSIFIED ACCESS GRANTED
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Glitchy Exploit Dossier */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-white/10 bg-black/70 space-y-1.5 text-zinc-300">
              <p className="text-emerald-400 font-bold">[+] BUFFER OVERFLOW ON PORT 1337: EXECUTED</p>
              <p className="text-zinc-400">[+] FIREWALL PERIMETER ACL: BYPASSED</p>
              <p className="text-zinc-400">[+] PAYLOAD: AES-256 ZERO-TRUST ARTIFACT EXTRACTED</p>
              <p className="text-zinc-200">
                Congratulations! You successfully audited and uncovered Sahil's hidden defensive vault.
              </p>
            </div>

            {/* Secret Flag Pill */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase text-zinc-500 tracking-wider">
                Captured Capture-The-Flag (CTF) Token:
              </span>
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-[#d71921]/50 bg-[#160a0b] text-white">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Key size={14} className="text-[#d71921] shrink-0" />
                  <span className="font-mono text-xs sm:text-sm text-red-200 font-bold truncate">
                    {flagText}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Sahil's Personal Note to Recruiters & Engineers */}
            <div className="p-4 rounded-xl border border-dashed border-white/15 bg-black/50 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Award size={15} className="text-[#ff4d54]" />
                <span>Special Engineering Note from Sahil</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                "If you discovered this terminal easter egg, you value practical skills and curiosity as much as I do. 
                Whether you're looking for a CCNA-certified Network Architect, an Enterprise Linux engineer, or a Defensive Security Analyst — let's build resilient infrastructure together."
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/20 bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Close & Resume Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
