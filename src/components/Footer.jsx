import React from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Instagram, 
  Phone, 
  Mail, 
  ExternalLink, 
  Heart, 
  Sparkles,
  Trophy,
  AlertTriangle,
  Code2
} from 'lucide-react';
import { playClick, playHover } from '../utils/audio';

export default function Footer() {
  const rules = [
    { title: 'Mobile-Only Arena', desc: 'Strictly handheld devices (Android/iOS). Emulators & PC players are blocked.' },
    { title: 'Strict UID Match', desc: 'Player UID inside custom room must match boarding pass exactly.' },
    { title: 'No Teaming / Hacking', desc: 'Any collusion, hack, or script leads to instant ban & entry forfeiture.' },
    { title: 'Screen Recordings', desc: 'Top 3 survivors must keep end-screen results screenshot for verification.' },
    { title: '15-Min Payouts', desc: 'Prize funds are transferred via UPI immediately after anti-cheat validation.' }
  ];

  return (
    <footer id="rules" className="relative bg-obsidian border-t border-white/10 pt-16 pb-12 overflow-hidden text-xs">
      
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-neonOrange/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* TOURNAMENT RULES SUMMARY ACCORDION / STRIP */}
        {/* ========================================================= */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl glass-panel-glow border border-white/10">
          <div className="flex items-center gap-2 text-neonGold mb-4">
            <AlertTriangle className="w-5 h-5 text-neonGold" />
            <h3 className="font-orbitron font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              RJ05 ESPORTS • OFFICIAL RULEBOOK PROTOCOLS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {rules.map((r, i) => (
              <div key={r.title} className="bg-obsidian/70 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neonOrange/15 text-neonOrange font-orbitron font-bold text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-orbitron font-bold text-white text-[11px] truncate">
                    {r.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN FOOTER COLUMNS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neonOrange to-neonGold p-[2px] shadow-glow-orange">
                <div className="w-full h-full bg-obsidian rounded-[6px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-neonOrange" />
                </div>
              </div>
              <span className="font-orbitron font-extrabold text-lg text-white tracking-wider">
                RJ05 <span className="text-neonOrange">ESPORTS</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs font-light">
              Premier high-stakes competitive Free Fire tournament portal. Delivering zero-fee UPI slot automation, anti-cheat enforcement, and instantaneous Booyah rewards.
            </p>

            <div className="text-[11px] text-slate-400">
              <span>Official Organizer: </span>
              <strong className="text-white">Anirudh Singh (UID: 3029117867)</strong>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Arena Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#hero" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Tournament Arena</a></li>
              <li><a href="#characters" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Character Meta & Loadouts</a></li>
              <li><a href="#maps" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Battleground Maps (Bermuda)</a></li>
              <li><a href="#roster" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Live Roster & UID Search</a></li>
              <li><a href="#booking" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Book Slot (₹50 / ₹100 / ₹200)</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Host Links */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Connect & Support
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href="https://wa.me/918209071700" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => playClick()}
                  className="hover:text-neonGreen transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-neonGreen" />
                  <span>WhatsApp: +91 8209071700</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:anirudhgunesh5@gmail.com" 
                  onClick={() => playClick()}
                  className="hover:text-neonOrange transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-neonOrange" />
                  <span>anirudhgunesh5@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/i.e_anirudh_rj05" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => playClick()}
                  className="hover:text-pink-400 transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram: @i.e_anirudh_rj05</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[11px]">UPI: 8209071700@ybl</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Fairplay & Security Disclaimer */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Esports Integrity
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Garena Free Fire is a registered trademark of Garena International. RJ05 Esports is a community esports championship operating independently in compliance with fair-play guidelines.
            </p>
            <div className="inline-flex items-center gap-1.5 text-neonGreen text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Anti-Cheat Arena</span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM STRIP & MANDATORY AGENCY CREDIT */}
        {/* ========================================================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <p className="text-slate-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-white">RJ05 Esports</strong>. All rights reserved. Managed by Anirudh Singh.
          </p>

          {/* MANDATORY AGENCY CREDIT: TK WEB SOLUTIONS WITH NEON GLOW BADGE */}
          <div className="flex items-center">
            <a
              href="https://tkwebsolutions.in/"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surfaceLight/80 hover:bg-surfaceLight border border-neonCyan/30 hover:border-neonCyan shadow-glow-cyan/20 hover:shadow-glow-cyan/50 transition-all duration-300 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonCyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neonCyan"></span>
              </span>
              <Code2 className="w-3.5 h-3.5 text-neonCyan group-hover:scale-110 transition-transform" />
              <span className="text-slate-300 text-xs font-medium">
                Designed & Developed by{' '}
                <strong className="text-white font-orbitron font-bold group-hover:text-neonCyan transition-colors">
                  TK Web Solutions
                </strong>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-neonCyan transition-colors" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
