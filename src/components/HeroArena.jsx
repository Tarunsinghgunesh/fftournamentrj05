import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Copy, Check, Users, Flame, Skull, Target, ArrowRight, Zap, Clock, MapPin, Sparkles } from 'lucide-react';
import { playClick, playHover, playSuccess } from '../utils/audio';

export default function HeroArena() {
  const [copied, setCopied] = useState(false);
  const hostUid = '3029117867';

  // 48-Hour Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(hostUid);
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden cyber-grid">
      {/* Background radial spotlights & glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-neonOrange/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-neonCyan/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-neonGold/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Top Badges & Announcement */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surfaceLight/80 border border-neonOrange/40 text-neonOrange text-xs font-semibold tracking-wider font-orbitron shadow-glow-orange/20 animate-pulse-slow">
            <Flame className="w-3.5 h-3.5 text-neonOrange" />
            <span>SEASON 05 • CLUTCH CUP CHAMPIONSHIP</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-xs font-semibold tracking-wider font-orbitron">
            <Shield className="w-3.5 h-3.5 text-neonCyan" />
            <span>100% ANTI-CHEAT & PROSPECT VERIFIED</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-none drop-shadow-lg">
            DROP. <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonOrange via-neonGold to-orange-500">SURVIVE.</span><br />
            CLAIM THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-teal-300 to-neonGreen drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">BOOYAH!</span>
          </h1>
          <p className="mt-5 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            India's most streamlined Free Fire esports arena by <strong className="text-white font-medium">RJ05 Esports</strong>. Automated zero-fee UPI slot allocation with instant room credentials broadcast directly to your WhatsApp & Email.
          </p>
        </div>

        {/* Countdown Timer Strip */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="glass-panel-glow rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neonOrange font-orbitron uppercase tracking-widest mb-3">
              <Clock className="w-4 h-4 animate-spin text-neonOrange" style={{ animationDuration: '8s' }} />
              <span>Match Starts In (Room Credentials Lockdown)</span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              <div className="bg-obsidian/80 border border-white/10 rounded-xl p-2.5">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Hours</span>
              </div>
              <div className="bg-obsidian/80 border border-white/10 rounded-xl p-2.5">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-neonGold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Minutes</span>
              </div>
              <div className="bg-obsidian/80 border border-white/10 rounded-xl p-2.5">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-neonCyan">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Pool & Match Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
          
          {/* Card 1: Prize Pool */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonGold hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 text-neonGold mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-[11px] font-orbitron uppercase font-bold tracking-wider">Prize Pool</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-orbitron text-white">
              ₹10,000+
            </div>
            <p className="text-[11px] text-slate-400 mt-1">1st Booyah + Kill Bounties</p>
          </div>

          {/* Card 2: Battleground Maps */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonCyan hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 text-neonCyan mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-[11px] font-orbitron uppercase font-bold tracking-wider">Battleground</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-orbitron text-white">
              Bermuda
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Purgatory & Alpine in Finals</p>
          </div>

          {/* Card 3: Entry Fees */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonOrange hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 text-neonOrange mb-1">
              <Target className="w-4 h-4" />
              <span className="text-[11px] font-orbitron uppercase font-bold tracking-wider">Entry Tier</span>
            </div>
            <div className="text-lg sm:text-xl font-black font-orbitron text-white">
              ₹50 <span className="text-xs text-slate-400 font-normal">/</span> ₹100 <span className="text-xs text-slate-400 font-normal">/</span> ₹200
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Solo • Duo • Squad</p>
          </div>

          {/* Card 4: Host FF UID */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-neonGreen hover:border-white/20 transition-all relative">
            <div className="flex items-center justify-between text-neonGreen mb-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-[11px] font-orbitron uppercase font-bold tracking-wider">Official Host UID</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-xl font-black font-orbitron text-white tracking-wider">
                {hostUid}
              </span>
              <button
                onClick={handleCopyUid}
                className="p-1.5 rounded-md bg-white/5 hover:bg-neonGreen/20 text-slate-300 hover:text-neonGreen transition-colors cursor-pointer"
                title="Copy Official Host UID"
              >
                {copied ? <Check className="w-4 h-4 text-neonGreen" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Host: Anirudh Singh (RJ05)</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href="#booking"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-neonOrange via-orange-500 to-neonGold hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>Book Tournament Slot</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#roster"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-panel hover:bg-surfaceLight border border-white/15 hover:border-neonCyan/60 text-slate-200 hover:text-neonCyan font-orbitron font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Verify Player / Slot</span>
          </a>
        </div>

      </div>
    </section>
  );
}
