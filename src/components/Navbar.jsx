import React, { useState, useEffect } from 'react';
import { Shield, Zap, Search, Volume2, VolumeX, Menu, X, Trophy, Flame } from 'lucide-react';
import { getMuteState, toggleMute, playClick, playHover } from '../utils/audio';

export default function Navbar({ onOpenSearch }) {
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleMuteChange = (e) => {
      setIsMuted(e.detail.isMuted);
    };
    window.addEventListener('rj05-mute-changed', handleMuteChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('rj05-mute-changed', handleMuteChange);
    };
  }, []);

  const handleToggleSound = () => {
    const next = toggleMute();
    setIsMuted(next);
  };

  const navLinks = [
    { label: 'Arena', href: '#hero' },
    { label: 'Characters', href: '#characters' },
    { label: 'Battlegrounds', href: '#maps' },
    { label: 'Live Roster', href: '#roster' },
    { label: 'Book Slot', href: '#booking' },
    { label: 'Organizer', href: '#contact' },
    { label: 'Rules', href: '#rules' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-obsidian/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-obsidian/90 via-obsidian/60 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a 
            href="#hero" 
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neonOrange to-neonGold p-[2px] shadow-glow-orange group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-obsidian rounded-[6px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-neonOrange group-hover:text-neonGold transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-extrabold text-xl tracking-wider text-white flex items-center gap-1.5">
                RJ05 <span className="text-neonOrange">ESPORTS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold font-orbitron -mt-1">
                Free Fire Championship
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="text-sm font-medium text-slate-300 hover:text-neonOrange transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neonOrange group-hover:w-full transition-all duration-200"></span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-3">
            
            {/* Live Green Auto-Verify Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen text-xs font-semibold tracking-wide shadow-glow-green/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neonGreen"></span>
              </span>
              <Zap className="w-3.5 h-3.5 fill-neonGreen" />
              <span>Auto-Verify Active</span>
            </div>

            {/* Quick Search Slot / UID button */}
            <button
              onClick={() => {
                playClick();
                if (onOpenSearch) onOpenSearch();
                const el = document.getElementById('roster');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={() => playHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfaceLight/80 hover:bg-surfaceLight border border-white/10 hover:border-neonCyan/50 text-slate-200 hover:text-neonCyan text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer"
              title="Search Slot / Player UID"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search Slot/UID</span>
            </button>

            {/* Audio Synth Mute / Unmute Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isMuted 
                  ? 'border-white/10 text-slate-400 hover:text-white bg-surface/60' 
                  : 'border-neonOrange/40 text-neonOrange bg-neonOrange/10 shadow-glow-orange/30'
              }`}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            {/* Book Now Primary Button */}
            <a
              href="#booking"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neonOrange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange hover:scale-105 transition-all duration-200"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Enter Arena</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white bg-surface/70"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 glass-panel rounded-xl p-4 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-neonGreen text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neonGreen"></span>
                </span>
                <span>MacroDroid Instant Verification</span>
              </div>
              <span className="text-[11px] text-slate-400">UID: 3029117867</span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-medium text-slate-200 hover:text-neonOrange py-1.5 px-2 rounded-md hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#booking"
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="mt-2 text-center py-2.5 rounded-lg bg-gradient-to-r from-neonOrange to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange"
            >
              Book Slot (₹50 / ₹100 / ₹200)
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
