import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Shield, 
  Copy, 
  Check, 
  Users, 
  Flame, 
  Target, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Calendar,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import { playClick, playHover, playSuccess } from '../utils/audio';

export default function HeroArena() {
  const [copied, setCopied] = useState(false);
  const hostUid = '3029117867';
  const hostIgn = 'ANIRUDH•RJ05';

  // Target match countdown (Sunday, 29 November 2026, 18:00 IST)
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 21,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-29T18:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(hostUid);
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden cyber-grid">
      
      {/* High-Impact Cinematic Bermuda Battlefield Background Art */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.28 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="/bermuda-battlefield.jpg"
          alt="Free Fire Bermuda Battlefield Arena"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        {/* Radial vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-neonOrange/20 blur-[170px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-neonCyan/15 blur-[160px] pointer-events-none rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Top Badges with Smooth Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surfaceLight/95 border border-neonOrange/60 text-neonOrange text-xs font-semibold tracking-wider font-orbitron shadow-glow-orange animate-pulse-slow">
            <Flame className="w-3.5 h-3.5 fill-neonOrange" />
            <span>SEASON 1 TOURNAMENT • 1ST MATCH</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neonCyan/15 border border-neonCyan/40 text-neonCyan text-xs font-semibold tracking-wider font-orbitron">
            <Calendar className="w-3.5 h-3.5 text-neonCyan" />
            <span>SUNDAY, 29 NOVEMBER 2026</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neonGold/15 border border-neonGold/40 text-neonGold text-xs font-semibold tracking-wider font-orbitron">
            <MapPin className="w-3.5 h-3.5 text-neonGold" />
            <span>BERMUDA (ONLY)</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl">
            DROP. <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonOrange via-neonGold to-orange-500 animate-pulse">SURVIVE.</span><br />
            CLAIM THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-teal-300 to-neonGreen drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">BOOYAH!</span>
          </h1>
          <p className="mt-5 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to the official 1st Match of <strong className="text-white font-medium">RJ05 Esports Season 1</strong>. Exactly 12 Squads (48 Players Max) battling on Bermuda for the ₹600 Booyah Trophy.
          </p>
        </motion.div>

        {/* Countdown Timer Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="glass-panel-glow border-beam rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neonOrange font-orbitron uppercase tracking-widest mb-3">
              <Clock className="w-4 h-4 text-neonOrange animate-spin" style={{ animationDuration: '8s' }} />
              <span>Match Kickoff Countdown (Sunday, 29 Nov 2026)</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
              <div className="bg-obsidian/90 border border-white/10 rounded-xl p-2.5 shadow-inner">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Days</span>
              </div>
              <div className="bg-obsidian/90 border border-white/10 rounded-xl p-2.5 shadow-inner">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-neonGold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Hours</span>
              </div>
              <div className="bg-obsidian/90 border border-white/10 rounded-xl p-2.5 shadow-inner">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-neonCyan">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Minutes</span>
              </div>
              <div className="bg-obsidian/90 border border-white/10 rounded-xl p-2.5 shadow-inner">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-neonGreen">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Seconds</span>
              </div>
            </div>

            {/* Live Timing & Room Announcement Banner */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-neonGold font-orbitron font-bold text-[11px]">
                <Radio className="w-3.5 h-3.5 text-neonOrange animate-pulse" />
                <span>MATCH TIMING BROADCAST:</span>
              </div>
              <span className="text-[11px] text-slate-300 text-center sm:text-right">
                Exact slot timing & custom room ID will be announced live on this portal and dispatched to all players!
              </span>
            </div>
          </div>
        </motion.div>

        {/* Real Tournament Parameter Cards with Hover Effects */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10"
        >
          {/* Card 1: 1st Prize */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonGold hover:border-white/30 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-1.5 text-neonGold mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-[10px] font-orbitron uppercase font-bold tracking-wider">1st Prize (Booyah)</span>
            </div>
            <div className="text-2xl font-black font-orbitron text-white">
              ₹600
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Winning Squad Cash Payout</p>
          </div>

          {/* Card 2: Entry Fee */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonOrange hover:border-white/30 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-1.5 text-neonOrange mb-1">
              <Target className="w-4 h-4" />
              <span className="text-[10px] font-orbitron uppercase font-bold tracking-wider">Entry Fees</span>
            </div>
            <div className="text-xl font-black font-orbitron text-white">
              ₹100 <span className="text-xs text-slate-400 font-normal">Squad</span> | ₹25 <span className="text-xs text-slate-400 font-normal">Solo</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">₹25 per player</p>
          </div>

          {/* Card 3: Total Capacity */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonCyan hover:border-white/30 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-1.5 text-neonCyan mb-1">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-orbitron uppercase font-bold tracking-wider">Total Capacity</span>
            </div>
            <div className="text-xl font-black font-orbitron text-white">
              12 Squads
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">48 Players Maximum (1 Match)</p>
          </div>

          {/* Card 4: Verified Host FF UID */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonGreen hover:border-white/30 hover:scale-[1.02] transition-all duration-300 relative">
            <div className="flex items-center justify-between text-neonGreen mb-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-orbitron uppercase font-bold tracking-wider">Host In-Game UID</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black font-mono text-white tracking-wider">
                {hostUid}
              </span>
              <button
                onClick={handleCopyUid}
                className="p-1.5 rounded-md bg-white/5 hover:bg-neonGreen/20 text-slate-300 hover:text-neonGreen transition-colors cursor-pointer"
                title="Copy Host UID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">IGN: {hostIgn} (Lv. 61)</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <a
            href="#booking"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-neonOrange via-orange-500 to-neonGold hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-glow-orange hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>Book Squad Slot (₹100)</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#roster"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-panel hover:bg-surfaceLight border border-white/15 hover:border-neonCyan/60 text-slate-200 hover:text-neonCyan font-orbitron font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Live Slots Telemetry</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
