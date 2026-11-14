import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Network, 
  ShieldCheck, 
  FileText, 
  Copy, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CornerDownLeft, 
  Compass,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenDossier,
  onUnlockEasterEgg,
  onToggleSound,
  soundEnabled,
  onToggleGlyphs,
  glyphEnabled,
  onSoundClick
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allActions = [
    // Navigation
    {
      id: 'nav-hero',
      category: 'Navigation',
      title: 'Go to Hero / Executive Summary',
      icon: <Compass size={15} />,
      run: () => onNavigate('hero'),
    },
    {
      id: 'nav-topology',
      category: 'Navigation',
      title: 'Go to Network Topology Lab',
      icon: <Network size={15} className="text-[#ff4d54]" />,
      run: () => onNavigate('topology'),
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      title: 'Go to Skills Radar & Capability Matrix',
      icon: <ShieldCheck size={15} />,
      run: () => onNavigate('skills'),
    },
    {
      id: 'nav-netscope',
      category: 'Navigation',
      title: 'Go to NetScope CIDR Calculator',
      icon: <Terminal size={15} />,
      run: () => onNavigate('netscope'),
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Go to Enterprise Projects',
      icon: <FileText size={15} />,
      run: () => onNavigate('projects'),
    },
    {
      id: 'nav-timeline',
      category: 'Navigation',
      title: 'Go to Engineering Timeline',
      icon: <ArrowRight size={15} />,
      run: () => onNavigate('timeline'),
    },
    {
      id: 'nav-terminal',
      category: 'Navigation',
      title: 'Go to Interactive Cyber Terminal',
      icon: <Terminal size={15} className="text-[#d71921]" />,
      run: () => onNavigate('terminal'),
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Go to Contact & Transmission Channels',
      icon: <ExternalLink size={15} />,
      run: () => onNavigate('contact'),
    },

    // Quick Actions
    {
      id: 'action-dossier',
      category: 'Actions',
      title: 'Open Printable Dossier / CV',
      icon: <FileText size={15} className="text-[#d71921]" />,
      run: () => onOpenDossier && onOpenDossier(),
    },
    {
      id: 'action-hack',
      category: 'Easter Egg',
      title: 'Trigger Classified Ethical Hack [CTF Flag]',
      icon: <ShieldAlert size={15} className="text-[#ff4d54]" />,
      run: () => onUnlockEasterEgg && onUnlockEasterEgg(),
    },
    {
      id: 'action-copy-email',
      category: 'Actions',
      title: 'Copy Email: sahilkumar202232@gmail.com',
      icon: <Copy size={15} />,
      run: () => navigator.clipboard.writeText('sahilkumar202232@gmail.com'),
    },
    {
      id: 'action-copy-phone',
      category: 'Actions',
      title: 'Copy Phone: +91 7042131215',
      icon: <Copy size={15} />,
      run: () => navigator.clipboard.writeText('+91 7042131215'),
    },
    {
      id: 'action-open-github',
      category: 'External',
      title: 'Visit GitHub (Sahil9599)',
      icon: <ExternalLink size={15} />,
      run: () => window.open('https://github.com/Sahil9599', '_blank'),
    },
    {
      id: 'action-open-linkedin',
      category: 'External',
      title: 'Visit LinkedIn Profile',
      icon: <ExternalLink size={15} />,
      run: () => window.open('https://www.linkedin.com/in/sahil-0b0172445', '_blank'),
    },

    // Preferences
    {
      id: 'pref-toggle-sound',
      category: 'System',
      title: soundEnabled ? 'Mute Audio Synthesizer' : 'Enable Audio Synthesizer',
      icon: soundEnabled ? <VolumeX size={15} /> : <Volume2 size={15} />,
      run: () => onToggleSound && onToggleSound(),
    },
    {
      id: 'pref-toggle-glyphs',
      category: 'System',
      title: glyphEnabled ? 'Disable Dot-Matrix Glyphs' : 'Enable Dot-Matrix Glyphs',
      icon: <Sparkles size={15} />,
      run: () => onToggleGlyphs && onToggleGlyphs(),
    },
  ];

  const filteredActions = allActions.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = filteredActions[selectedIndex];
      if (action) {
        if (onSoundClick) onSoundClick();
        action.run();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Palette Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-dashed border-white/25 bg-[#0f0f0f]/98 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden space-y-0"
        >
          {/* Top Search Bar */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-black/50">
            <Search size={18} className="text-[#d71921] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search sections, tools, network topologies, or shortcuts..."
              className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:outline-none placeholder:text-zinc-600"
              spellCheck="false"
            />
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">ESC</span>
              <span>to close</span>
            </div>
          </div>

          {/* Action List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-zinc-500">
                No matching command or destination found for "{query}".
              </div>
            ) : (
              filteredActions.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSoundClick) onSoundClick();
                      item.run();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-mono text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#181818] border border-[#d71921]/60 text-white'
                        : 'border border-transparent text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-1.5 rounded-lg border ${
                        isSelected 
                          ? 'border-[#d71921]/40 bg-[#d71921]/15 text-[#ff4d54]' 
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="truncate font-medium">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-black/40 text-zinc-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft size={13} className="text-[#d71921]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="px-5 py-2.5 bg-black/70 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span>↑↓ to navigate</span>
              <span>↵ to execute</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d71921] nothing-led" />
              <span className="text-zinc-400">NOTHING OS COMMAND BUS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
