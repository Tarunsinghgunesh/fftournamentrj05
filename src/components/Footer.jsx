import React from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Instagram, 
  Phone, 
  Mail, 
  ExternalLink, 
  Trophy,
  AlertTriangle,
  Code2,
  Calendar,
  MapPin
} from 'lucide-react';
import { playClick, playHover } from '../utils/audio';
import RJ05Logo from './RJ05Logo';

export default function Footer() {
  const rules = [
    { title: 'Strict Mobile-Only', desc: 'Android & iOS handhelds only. PC emulators (BlueStacks/LDPlayer) strictly prohibited.' },
    { title: 'Verified UID Match', desc: 'Every player inside custom room must match registered Free Fire UID on pass.' },
    { title: 'Bermuda Single Match', desc: 'Season 1 features exactly 1 decisive Bermuda match with 12 squads (48 players).' },
    { title: 'Mandatory 12-Digit UTR', desc: 'Every payment is cross-referenced with bank UTR in the official Google Sheet.' },
    { title: '₹600 Instant Prize', desc: 'Winning squad receives direct ₹600 UPI transfer immediately following match Booyah.' }
  ];

  return (
    <footer id="rules" className="relative bg-obsidian border-t border-white/10 pt-16 pb-12 overflow-hidden text-xs">
      
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-neonOrange/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* OFFICIAL TOURNAMENT PROTOCOLS SUMMARY */}
        {/* ========================================================= */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl glass-panel-glow border border-white/10">
          <div className="flex items-center gap-2 text-neonGold mb-4">
            <AlertTriangle className="w-5 h-5 text-neonGold" />
            <h3 className="font-orbitron font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              SEASON 1 TOURNAMENT (1ST MATCH) • OFFICIAL RULEBOOK PROTOCOLS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {rules.map((r, i) => (
              <div key={r.title} className="bg-obsidian/80 p-3.5 rounded-xl border border-white/5 space-y-1">
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
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-3">
              <RJ05Logo className="w-10 h-10" />
              <span className="font-orbitron font-extrabold text-lg text-white tracking-wider">
                RJ05 <span className="text-neonOrange">ESPORTS</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs font-light">
              Official Free Fire competitive arena managed by <strong className="text-white">Anirudh Singh</strong>. Real-time Google Sheet telemetry, mandatory 12-digit UTR verification, and instant ₹600 Booyah prize delivery.
            </p>

            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div>Host IGN: <strong className="text-white">ANIRUDH•RJ05</strong> (Level 61)</div>
              <div>Official FF UID: <code className="text-neonCyan font-mono">3029117867</code></div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Tournament Portal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#hero" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Season 1 Arena</a></li>
              <li><a href="#characters" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Tactical Character Powers</a></li>
              <li><a href="#map" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Bermuda Battlefield</a></li>
              <li><a href="#roster" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Live Roster & Slot Telemetry</a></li>
              <li><a href="#booking" onClick={() => playClick()} className="hover:text-neonOrange transition-colors">Squad Registration (₹100)</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Host Links */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Organizer Support
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
                <span className="text-slate-400 font-mono text-[11px]">Official UPI: 8209071700@ptsbi</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Match Summary */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Match Overview
            </h4>
            <div className="p-3 rounded-xl bg-obsidian border border-white/5 space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5 text-neonGold font-orbitron font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Sunday, 29 Nov 2026</span>
              </div>
              <div className="flex items-center gap-1.5 text-neonCyan font-orbitron">
                <MapPin className="w-3.5 h-3.5" />
                <span>Bermuda Map (Only)</span>
              </div>
              <div className="flex items-center gap-1.5 text-neonGreen font-orbitron">
                <Trophy className="w-3.5 h-3.5" />
                <span>1st Prize: ₹600 Cash</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* MANDATORY PROMINENT AGENCY BADGE: MADE BY TK WEB SOLUTIONS */}
        {/* ========================================================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <p className="text-slate-400 text-xs text-center sm:text-left">
            © 2026 <strong className="text-white">RJ05 Esports</strong>. All rights reserved. Directed by Anirudh Singh.
          </p>

          <div className="flex items-center">
            <a
              href="https://tkwebsolutions.in/"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surfaceLight hover:bg-surface border border-neonCyan/40 hover:border-neonCyan shadow-glow-cyan/20 hover:shadow-glow-cyan/50 transition-all duration-300 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonCyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neonCyan"></span>
              </span>
              <Code2 className="w-4 h-4 text-neonCyan group-hover:scale-110 transition-transform" />
              <span className="text-slate-300 text-xs font-medium">
                Made by{' '}
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
