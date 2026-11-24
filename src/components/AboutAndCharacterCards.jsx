import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  Radio, 
  Sparkles, 
  Activity, 
  Flame, 
  Crosshair, 
  Wind, 
  Ghost, 
  Volume2, 
  VolumeX, 
  Map, 
  Skull, 
  Crown, 
  Users, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { playClick, playHover, toggleMute, getMuteState } from '../utils/audio';

export default function AboutAndCharacterCards() {
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [isMuted, setIsMuted] = useState(getMuteState());

  const handleMuteToggle = () => {
    const next = toggleMute();
    setIsMuted(next);
  };

  const characters = [
    {
      id: 'alok',
      name: 'DJ ALOK',
      role: 'Support & Healer',
      specialAbility: 'Drop The Beat',
      archetypeColor: '#00F0FF',
      gradient: 'from-cyan-500 to-blue-600',
      badge: 'Team Anchor',
      description: 'Creates a 5m aura that increases moving and sprinting speed by 15% and restores 3 HP/s for 10 seconds. Essential for high-pressure team revivals in the final shrinking safe zones.',
      stats: {
        agility: 90,
        sustainability: 95,
        teamBuff: 100,
        cooldown: 45
      },
      icon: Activity,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <circle cx="50" cy="50" r="42" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" className="animate-spin" style={{ animationDuration: '30s' }} />
          <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke="#00F0FF" strokeWidth="2.5" fill="rgba(0, 240, 255, 0.08)" />
          <circle cx="50" cy="50" r="18" fill="url(#alokGlow)" />
          <path d="M40 50h20M50 40v20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 65c5-8 15-8 20 0s15 8 20 0" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <radialGradient id="alokGlow">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0055FF" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'chrono',
      name: 'CHRONO',
      role: 'Rusher & Shield',
      specialAbility: 'Time Turner',
      archetypeColor: '#FF5500',
      gradient: 'from-neonOrange to-amber-600',
      badge: 'Force Multiplier',
      description: 'Creates a force field that blocks 800 incoming damage points. The shield provides safe breathing room while pushing enemy squads head-on in open terrain.',
      stats: {
        agility: 75,
        sustainability: 98,
        teamBuff: 85,
        cooldown: 75
      },
      icon: ShieldCheck,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <circle cx="50" cy="50" r="40" stroke="#FF5500" strokeWidth="2" opacity="0.8" />
          <circle cx="50" cy="50" r="30" stroke="#FFAA00" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" stroke="#FF5500" strokeWidth="3" fill="rgba(255, 85, 0, 0.1)" />
          <path d="M50 32v18l12 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4" fill="#FFAA00" />
        </svg>
      )
    },
    {
      id: 'kelly',
      name: 'KELLY "THE SWIFT"',
      role: 'Flanker & Scout',
      specialAbility: 'Deadly Velocity',
      archetypeColor: '#FFAA00',
      gradient: 'from-amber-400 to-yellow-600',
      badge: 'Speed Demon',
      description: 'Spriting speed is increased up to 6%. Upon awakening, sprinting for 4 seconds activates Deadly Velocity: the first shot fired on target deals 106% bonus damage.',
      stats: {
        agility: 100,
        sustainability: 65,
        teamBuff: 70,
        cooldown: 15
      },
      icon: Wind,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path d="M20 70 L55 25 L45 50 L80 30 L40 85 L48 62 Z" fill="url(#kellyGlow)" stroke="#FFAA00" strokeWidth="2" />
          <circle cx="50" cy="50" r="42" stroke="#FFAA00" strokeWidth="1" strokeDasharray="8 6" opacity="0.5" />
          <defs>
            <radialGradient id="kellyGlow">
              <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF5500" stopOpacity="0.4" />
            </radialGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'wukong',
      name: 'WUKONG',
      role: 'Stealth Infiltrator',
      specialAbility: 'Camouflage',
      archetypeColor: '#00FF66',
      gradient: 'from-emerald-400 to-green-600',
      badge: 'Shadow Tactician',
      description: 'Transforms into a bush with a 10% reduction in movement speed, lasting for 15s. Breaks upon firing and resets immediately whenever an enemy target is downed.',
      stats: {
        agility: 80,
        sustainability: 85,
        teamBuff: 60,
        cooldown: 60
      },
      icon: Ghost,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path d="M50 18 C30 25 20 45 25 70 C35 60 45 65 50 82 C55 65 65 60 75 70 C80 45 70 25 50 18 Z" fill="rgba(0, 255, 102, 0.15)" stroke="#00FF66" strokeWidth="2.5" />
          <circle cx="42" cy="46" r="4" fill="#00FF66" />
          <circle cx="58" cy="46" r="4" fill="#00FF66" />
          <path d="M38 60 C45 66 55 66 62 60" stroke="#00FF66" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const battlegrounds = [
    {
      name: 'Bermuda (Remastered)',
      type: 'Primary Tournament Arena',
      slots: '48 Solo / 24 Duo / 12 Squad',
      highlight: 'Clock Tower & Factory Rush',
      prizeSplit: {
        booyah: '₹5,000 (1st Place)',
        runnerUp: '₹2,500 (2nd Place)',
        killBounty: '₹25 Per Confirmed Kill'
      },
      terrain: 'Urban factory complexes, clock tower sniping perches, coastal shipping docks, and tactical river bridges.',
      bannerGradient: 'from-amber-600/30 to-neonOrange/20'
    },
    {
      name: 'Purgatory',
      type: 'High Altitude Survival',
      slots: '48 Solo / 24 Duo / 12 Squad',
      highlight: 'Brasilia & Central Mountain',
      prizeSplit: {
        booyah: '₹3,000 (1st Place)',
        runnerUp: '₹1,500 (2nd Place)',
        killBounty: '₹20 Per Confirmed Kill'
      },
      terrain: 'Deep valleys, sweeping zipline networks, long-range sniper plateaus, and canal crossings.',
      bannerGradient: 'from-cyan-600/30 to-blue-600/20'
    },
    {
      name: 'Alpine',
      type: 'Snow & Extreme Compound Combat',
      slots: '48 Solo / 24 Duo / 12 Squad',
      highlight: 'Vantage & Snowfall Peak',
      prizeSplit: {
        booyah: '₹2,000 (1st Place)',
        runnerUp: '₹1,000 (2nd Place)',
        killBounty: '₹20 Per Confirmed Kill'
      },
      terrain: 'Snow-capped ridges, multi-story observation outposts, and tight indoor assault choke-points.',
      bannerGradient: 'from-emerald-600/30 to-teal-600/20'
    }
  ];

  return (
    <section id="characters" className="relative py-24 bg-obsidian overflow-hidden border-t border-white/5">
      
      {/* Background ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neonOrange/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-neonCyan/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: ABOUT TOURNAMENT ARENA PRO OVERVIEW */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-neonOrange text-xs font-orbitron uppercase tracking-widest font-bold">
              Fair Play Guaranteed • Professional Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight mt-2">
              THE RJ05 ESPORTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonOrange to-neonGold">STANDARD</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 font-light">
              We run our tournaments with strict esports integrity. Zero tolerance for emulators or hacks, automated zero-fee UPI slot allocation, and lightning-fast prize distribution within 15 minutes of the Booyah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neonOrange/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-neonOrange/10 border border-neonOrange/30 flex items-center justify-center text-neonOrange mb-4 group-hover:scale-110 transition-transform shadow-glow-orange/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Anti-Cheat Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-only lobby with rigorous Free Fire UID inspection. Emulators, scripts, and modded APKs are permanently banned from all RJ05 events.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neonCyan/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-neonCyan/10 border border-neonCyan/30 flex items-center justify-center text-neonCyan mb-4 group-hover:scale-110 transition-transform shadow-glow-cyan/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Instant Room Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Custom Room ID & Password are systematically sent via automated WhatsApp broadcast & HTML email 15 minutes before match countdown.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neonGold/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-neonGold/10 border border-neonGold/30 flex items-center justify-center text-neonGold mb-4 group-hover:scale-110 transition-transform shadow-glow-gold/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">15-Min Prize Payouts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Booyah champions and kill bounty leaders receive direct UPI prize payouts verified on official stream immediately following end-game results.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neonGreen/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-center text-neonGreen mb-4 group-hover:scale-110 transition-transform shadow-glow-green/20">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Zero-Fee UPI Automation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No gateway platform commissions. You pay direct to organizer UPI using dynamic paise matching (<code className="text-neonGreen">₹50.01</code>) with MacroDroid auto-verification.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: CHARACTER & ROLE 3D TILT COLLECTION CARDS */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-neonCyan text-xs font-orbitron uppercase tracking-widest font-bold">
                META ROLES & SKILL LOADOUTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-white uppercase tracking-tight mt-1">
                OPERATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonGreen">ARCHETYPES</span>
              </h2>
            </div>
            
            {/* Audio Toggle in corner for characters */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleMuteToggle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-xs text-slate-300 bg-surfaceLight/80 cursor-pointer transition-all"
                title="Toggle Web Audio Synthesizer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-neonOrange animate-pulse" />}
                <span>Cyber Synth Audio: {isMuted ? 'Muted' : 'Active'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 4 Character Select Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {characters.map((char, index) => {
                const IconComponent = char.icon;
                const isSelected = selectedCharacter === index;
                return (
                  <div
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(index);
                      playClick();
                    }}
                    onMouseEnter={() => playHover()}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-surface border-2 shadow-2xl scale-[1.03]' 
                        : 'bg-surface/50 border border-white/10 hover:border-white/20 hover:bg-surface/80'
                    }`}
                    style={{
                      borderColor: isSelected ? char.archetypeColor : undefined,
                      boxShadow: isSelected ? `0 0 25px ${char.archetypeColor}40` : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold font-orbitron px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                        {char.badge}
                      </span>
                      <IconComponent className="w-4 h-4" style={{ color: char.archetypeColor }} />
                    </div>

                    <div className="w-16 h-16 mx-auto my-2 p-1">
                      {char.svgArt}
                    </div>

                    <h4 className="font-orbitron font-extrabold text-sm text-white text-center mt-2 group-hover:text-neonOrange transition-colors">
                      {char.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 text-center font-medium">
                      {char.role}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Character Detail Terminal View */}
            <div className="lg:col-span-7">
              {characters[selectedCharacter] && (
                <div 
                  className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden border-2 transition-all duration-300"
                  style={{ borderColor: `${characters[selectedCharacter].archetypeColor}60` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: characters[selectedCharacter].archetypeColor }} />
                        <span className="text-xs font-orbitron uppercase tracking-widest text-slate-400">Class Analysis</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white mt-1">
                        {characters[selectedCharacter].name}
                      </h3>
                    </div>
                    
                    <div className="px-3.5 py-1.5 rounded-full border text-xs font-orbitron font-bold"
                      style={{ 
                        color: characters[selectedCharacter].archetypeColor,
                        borderColor: `${characters[selectedCharacter].archetypeColor}50`,
                        backgroundColor: `${characters[selectedCharacter].archetypeColor}15`
                      }}
                    >
                      {characters[selectedCharacter].specialAbility}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-6">
                    {characters[selectedCharacter].description}
                  </p>

                  {/* Stat Bars */}
                  <div className="space-y-3.5 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Agility & Sprint Velocity</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.agility}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.agility}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Survivability & Damage Mitigation</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.sustainability}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.sustainability}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Squad Buff Utility</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.teamBuff}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.teamBuff}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Cooldown: <strong className="text-white font-orbitron">{characters[selectedCharacter].stats.cooldown}s</strong></span>
                      </div>
                      <a 
                        href="#booking"
                        onClick={() => playClick()}
                        className="text-xs font-orbitron font-bold text-neonOrange hover:text-white flex items-center gap-1 transition-colors"
                      >
                        Equip In RJ05 Cup <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: BATTLEGROUND MAPS & PRIZE POOL CARDS */}
        {/* ========================================================= */}
        <div id="maps">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-neonGold text-xs font-orbitron uppercase tracking-widest font-bold">
              OFFICIAL ROTATION & DROP ZONES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-white uppercase tracking-tight mt-1">
              BATTLEGROUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGold to-neonOrange">MAPS</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Tournament rooms are hosted across certified competitive Free Fire maps with 48 active player slots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {battlegrounds.map((bg, idx) => (
              <div 
                key={bg.name}
                onMouseEnter={() => playHover()}
                className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neonGold/50 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Header banner */}
                <div className={`p-5 bg-gradient-to-br ${bg.bannerGradient} border-b border-white/10 relative`}>
                  <div className="flex items-center justify-between text-xs font-orbitron text-slate-300 mb-2">
                    <span className="px-2 py-0.5 rounded bg-black/40 text-neonGold font-bold">{bg.type}</span>
                    <span className="text-slate-400 font-mono">48 SLOTS</span>
                  </div>
                  <h3 className="font-orbitron font-extrabold text-xl text-white group-hover:text-neonGold transition-colors">
                    {bg.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <Crosshair className="w-3.5 h-3.5 text-neonOrange" />
                    <span>Hot Drop: <strong className="text-white">{bg.highlight}</strong></span>
                  </div>
                </div>

                {/* Content & Prize distribution */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {bg.terrain}
                  </p>

                  <div className="bg-obsidian/60 rounded-xl p-3 border border-white/5 space-y-2">
                    <div className="text-[11px] font-orbitron text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-neonGold" />
                      <span>Prize Allocation:</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">1st (Booyah)</span>
                      <span className="text-neonGold font-orbitron font-bold">{bg.prizeSplit.booyah}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">2nd Runner-Up</span>
                      <span className="text-slate-200 font-orbitron font-bold">{bg.prizeSplit.runnerUp}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-300 font-medium flex items-center gap-1">
                        <Skull className="w-3 h-3 text-cyberRed" /> Kill Bounty
                      </span>
                      <span className="text-neonOrange font-orbitron font-bold">{bg.prizeSplit.killBounty}</span>
                    </div>
                  </div>

                  <a
                    href="#booking"
                    onClick={() => playClick()}
                    className="w-full text-center py-2.5 rounded-lg bg-surfaceLight hover:bg-neonOrange/20 border border-white/10 hover:border-neonOrange text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all block cursor-pointer"
                  >
                    Select {bg.name.split(' ')[0]} Slot
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
