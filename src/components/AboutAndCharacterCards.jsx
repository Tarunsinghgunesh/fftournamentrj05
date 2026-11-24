import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wind, 
  Ghost, 
  Volume2, 
  VolumeX, 
  Clock,
  Sparkles,
  MapPin,
  Trophy,
  Target,
  Skull,
  Crown,
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
      role: 'Support Anchor',
      specialAbility: 'Drop The Beat',
      archetypeColor: '#00F0FF',
      badge: 'Active Aura',
      description: 'Creates a 5m rhythmic aura that increases sprint velocity by 15% and continuously restores 3 HP/sec for 10s. Crucial for Bermuda safe zone rotations when under crossfire.',
      stats: {
        auraHeal: 95,
        sprintBuff: 85,
        teamUtility: 100,
        cooldown: 45
      },
      icon: Activity,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <circle cx="50" cy="50" r="42" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" className="animate-spin" style={{ animationDuration: '30s' }} />
          <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke="#00F0FF" strokeWidth="2.5" fill="rgba(0, 240, 255, 0.08)" />
          <circle cx="50" cy="50" r="18" fill="url(#alokGlow)" />
          <path d="M40 50h20M50 40v20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
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
      role: 'Head-On Rusher',
      specialAbility: 'Time Turner',
      archetypeColor: '#FF5500',
      badge: 'Active Force Field',
      description: 'Deploys a spherical force field that absorbs up to 800 incoming weapon damage. Allows aggressive rushers to safely breach enemy compounds in Clock Tower & Factory.',
      stats: {
        auraHeal: 40,
        sprintBuff: 75,
        teamUtility: 90,
        cooldown: 75
      },
      icon: ShieldCheck,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <circle cx="50" cy="50" r="40" stroke="#FF5500" strokeWidth="2" opacity="0.8" />
          <circle cx="50" cy="50" r="30" stroke="#FFAA00" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" stroke="#FF5500" strokeWidth="3" fill="rgba(255, 85, 0, 0.12)" />
          <path d="M50 32v18l12 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'kelly',
      name: 'KELLY "THE SWIFT"',
      role: 'Lethal Flanker',
      specialAbility: 'Deadly Velocity',
      archetypeColor: '#FFAA00',
      badge: 'Awakened Passive',
      description: 'Passive sprint speed is boosted by 6%. After sprinting 4 seconds, Awakened Deadly Velocity activates: first shot on target inflicts 106% critical damage.',
      stats: {
        auraHeal: 25,
        sprintBuff: 100,
        teamUtility: 75,
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
      badge: 'Active Stealth',
      description: 'Transforms into a bush for 15s with 10% movement penalty. Breaks upon firing, and cooldown resets instantly whenever an enemy combatant is knocked down.',
      stats: {
        auraHeal: 30,
        sprintBuff: 80,
        teamUtility: 80,
        cooldown: 60
      },
      icon: Ghost,
      svgArt: (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <path d="M50 18 C30 25 20 45 25 70 C35 60 45 65 50 82 C55 65 65 60 75 70 C80 45 70 25 50 18 Z" fill="rgba(0, 255, 102, 0.15)" stroke="#00FF66" strokeWidth="2.5" />
          <circle cx="42" cy="46" r="4" fill="#00FF66" />
          <circle cx="58" cy="46" r="4" fill="#00FF66" />
        </svg>
      )
    }
  ];

  return (
    <section id="characters" className="relative py-24 bg-obsidian overflow-hidden border-t border-white/5">
      
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neonOrange/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-neonCyan/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: 3D CHARACTER & POWER SHOWCASE */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-neonCyan text-xs font-orbitron uppercase tracking-widest font-bold">
                META LOADOUT & TACTICAL ABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-white uppercase tracking-tight mt-1">
                FREE FIRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-teal-300 to-neonGreen">TACTICAL POWERS</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleMuteToggle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-xs text-slate-300 bg-surfaceLight/80 cursor-pointer transition-all"
                title="Toggle Web Audio Synthesizer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-neonOrange animate-pulse" />}
                <span>Cyber Synth Audio: {isMuted ? 'Muted' : 'Active'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 3D Tilt Character Selection Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {characters.map((char, index) => {
                const isSelected = selectedCharacter === index;
                const IconComp = char.icon;
                return (
                  <div
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(index);
                      playClick();
                    }}
                    onMouseEnter={() => playHover()}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 relative group overflow-hidden ${
                      isSelected 
                        ? 'bg-surface border-2 shadow-2xl scale-[1.03]' 
                        : 'bg-surface/50 border border-white/10 hover:border-white/20 hover:bg-surface/80'
                    }`}
                    style={{
                      borderColor: isSelected ? char.archetypeColor : undefined,
                      boxShadow: isSelected ? `0 0 25px ${char.archetypeColor}40` : undefined,
                      transform: isSelected ? 'perspective(600px) rotateX(2deg) rotateY(-2deg)' : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold font-orbitron px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {char.badge}
                      </span>
                      <IconComp className="w-4 h-4" style={{ color: char.archetypeColor }} />
                    </div>

                    <div className="w-16 h-16 mx-auto my-2 p-1 group-hover:scale-110 transition-transform">
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

            {/* Selected Character Terminal View */}
            <div className="lg:col-span-7">
              {characters[selectedCharacter] && (
                <div 
                  className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden border-2 transition-all duration-300"
                  style={{ borderColor: `${characters[selectedCharacter].archetypeColor}70` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: characters[selectedCharacter].archetypeColor }} />
                        <span className="text-xs font-orbitron uppercase tracking-widest text-slate-400">Tactical Archetype</span>
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

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 mb-6">
                    {characters[selectedCharacter].description}
                  </p>

                  {/* Power Stat Bars */}
                  <div className="space-y-3.5 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Sprint Velocity & Agility Boost</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.sprintBuff}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.sprintBuff}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Damage Shielding & Sustainability</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.auraHeal}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.auraHeal}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-orbitron text-slate-300 mb-1">
                        <span>Squad Teamfight Impact</span>
                        <span className="font-bold text-white">{characters[selectedCharacter].stats.teamUtility}%</span>
                      </div>
                      <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${characters[selectedCharacter].stats.teamUtility}%`,
                            backgroundColor: characters[selectedCharacter].archetypeColor
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Ability Cooldown: <strong className="text-white font-orbitron">{characters[selectedCharacter].stats.cooldown}s</strong></span>
                      </div>
                      <a 
                        href="#booking"
                        onClick={() => playClick()}
                        className="text-xs font-orbitron font-bold text-neonOrange hover:text-white flex items-center gap-1 transition-colors"
                      >
                        Equip In Bermuda Battle <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: OFFICIAL TOURNAMENT MAP: BERMUDA ONLY */}
        {/* ========================================================= */}
        <div id="map" className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-neonGold font-orbitron text-xs font-bold uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                <span>OFFICIAL TOURNAMENT MAP FOR SUNDAY, 29 NOV 2026</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-orbitron text-white uppercase mt-1">
                BERMUDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGold to-neonOrange">(ONLY)</span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-obsidian border border-neonGold/40 text-neonGold font-orbitron text-xs font-bold">
                1st Prize: ₹600 Cash
              </div>
              <div className="px-4 py-2 rounded-xl bg-obsidian border border-white/10 text-slate-300 font-orbitron text-xs">
                Capacity: 12 Squads / 48 Players
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-obsidian/70 rounded-2xl p-5 border border-white/5 space-y-2">
              <span className="text-[11px] font-orbitron font-bold text-neonOrange uppercase tracking-wider block">
                Primary Hot Drops
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clock Tower, Factory Complex, Peak High Grounds, and Pochinok. Strict mobile-only lobbies ensure authentic close-quarters shotgun & SMG combat.
              </p>
            </div>

            <div className="bg-obsidian/70 rounded-2xl p-5 border border-white/5 space-y-2">
              <span className="text-[11px] font-orbitron font-bold text-neonCyan uppercase tracking-wider block">
                Winning Prize Breakdown
              </span>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>1st Place (Booyah Squad):</span>
                  <strong className="text-neonGold font-orbitron">₹600 Cash</strong>
                </div>
                <div className="flex justify-between">
                  <span>Entry Fee (Squad of 4):</span>
                  <strong className="text-white font-orbitron">₹100 (₹25/P)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Solo Entry Option:</span>
                  <strong className="text-white font-orbitron">₹25</strong>
                </div>
              </div>
            </div>

            <div className="bg-obsidian/70 rounded-2xl p-5 border border-white/5 space-y-2">
              <span className="text-[11px] font-orbitron font-bold text-neonGreen uppercase tracking-wider block">
                Strict Fair Play Rules
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero tolerance for PC emulators, modified APKs, or teaming. Every participant is validated against registered Free Fire UIDs before the custom room commences.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
