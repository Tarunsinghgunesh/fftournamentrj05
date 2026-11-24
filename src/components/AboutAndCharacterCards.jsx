import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wind, 
  Ghost, 
  Volume2, 
  VolumeX, 
  Clock,
  MapPin,
  Trophy,
  Target,
  Skull,
  Crown,
  ChevronRight,
  Flame,
  Award
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
      imageSrc: '/char-alok.jpg',
      description: 'Creates a 5m rhythmic aura that increases sprint velocity by 15% and continuously restores 3 HP/sec for 10s. Crucial for Bermuda safe zone rotations when under crossfire.',
      stats: {
        auraHeal: 95,
        sprintBuff: 85,
        teamUtility: 100,
        cooldown: 45
      },
      icon: Activity
    },
    {
      id: 'chrono',
      name: 'CHRONO',
      role: 'Head-On Rusher',
      specialAbility: 'Time Turner',
      archetypeColor: '#FF5500',
      badge: 'Active Force Field',
      imageSrc: '/char-chrono.jpg',
      description: 'Deploys a spherical force field that absorbs up to 800 incoming weapon damage. Allows aggressive rushers to safely breach enemy compounds in Clock Tower & Factory.',
      stats: {
        auraHeal: 40,
        sprintBuff: 75,
        teamUtility: 90,
        cooldown: 75
      },
      icon: ShieldCheck
    },
    {
      id: 'kelly',
      name: 'KELLY "THE SWIFT"',
      role: 'Lethal Flanker',
      specialAbility: 'Deadly Velocity',
      archetypeColor: '#FFAA00',
      badge: 'Awakened Passive',
      imageSrc: '/char-kelly.jpg',
      description: 'Passive sprint speed is boosted by 6%. After sprinting 4 seconds, Awakened Deadly Velocity activates: first shot on target inflicts 106% critical damage.',
      stats: {
        auraHeal: 25,
        sprintBuff: 100,
        teamUtility: 75,
        cooldown: 15
      },
      icon: Wind
    },
    {
      id: 'wukong',
      name: 'WUKONG',
      role: 'Stealth Infiltrator',
      specialAbility: 'Camouflage',
      archetypeColor: '#00FF66',
      badge: 'Active Stealth',
      imageSrc: '/char-wukong.jpg',
      description: 'Transforms into a bush for 15s with 10% movement penalty. Breaks upon firing, and cooldown resets instantly whenever an enemy combatant is knocked down.',
      stats: {
        auraHeal: 30,
        sprintBuff: 80,
        teamUtility: 80,
        cooldown: 60
      },
      icon: Ghost
    }
  ];

  return (
    <section id="characters" className="relative py-24 bg-obsidian overflow-hidden border-t border-white/5">
      
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neonOrange/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-neonCyan/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: 3D CHARACTER & TACTICAL POWER SHOWCASE */}
        {/* ========================================================= */}
        <div className="mb-24">
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

                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto my-2 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative group-hover:scale-105"
                      style={{ borderColor: isSelected ? char.archetypeColor : 'rgba(255,255,255,0.1)' }}
                    >
                      <img 
                        src={char.imageSrc} 
                        alt={char.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
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
                  className="glass-panel-glow border-beam rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 flex-shrink-0 shadow-2xl relative"
                      style={{ 
                        borderColor: characters[selectedCharacter].archetypeColor,
                        boxShadow: `0 0 30px ${characters[selectedCharacter].archetypeColor}50` 
                      }}
                    >
                      <img 
                        src={characters[selectedCharacter].imageSrc} 
                        alt={characters[selectedCharacter].name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-orbitron font-bold text-white border border-white/20">
                        {characters[selectedCharacter].badge}
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: characters[selectedCharacter].archetypeColor }} />
                          <span className="text-xs font-orbitron uppercase tracking-widest text-slate-400">{characters[selectedCharacter].role}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full border text-xs font-orbitron font-bold"
                          style={{ 
                            color: characters[selectedCharacter].archetypeColor,
                            borderColor: `${characters[selectedCharacter].archetypeColor}50`,
                            backgroundColor: `${characters[selectedCharacter].archetypeColor}15`
                          }}
                        >
                          {characters[selectedCharacter].specialAbility}
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white mt-1">
                        {characters[selectedCharacter].name}
                      </h3>

                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
                        {characters[selectedCharacter].description}
                      </p>
                    </div>
                  </div>

                  {/* Stat Bars */}
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
        {/* SECTION 2: OFFICIAL TOURNAMENT MAP: BERMUDA & ₹600 BOOYAH */}
        {/* ========================================================= */}
        <div id="map" className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Real Booyah Trophy Banner */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-neonGold/40 shadow-glow-gold/20 group">
              <img
                src="/booyah-trophy.jpg"
                alt="Free Fire Booyah Championship Cup"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neonGold/20 border border-neonGold/50 text-neonGold text-xs font-orbitron font-bold mb-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>SEASON 1 BOOYAH CHAMPION</span>
                </div>
                <div className="text-2xl font-black font-orbitron text-white">
                  ₹600 Cash Trophy
                </div>
                <p className="text-[11px] text-slate-300">
                  Instant UPI prize delivery to the winning squad leader.
                </p>
              </div>
            </div>

            {/* Right Column: Bermuda Battlefield Specifications */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-neonGold font-orbitron text-xs font-bold uppercase tracking-widest block">
                    Certified Battleground Map
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white uppercase mt-0.5">
                    BERMUDA <span className="text-neonOrange">(ONLY)</span>
                  </h3>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-obsidian border border-neonCyan/40 text-neonCyan font-orbitron text-xs font-bold">
                  Strict 12 Squads / 48 Players
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="bg-obsidian/80 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-neonOrange font-orbitron font-bold">
                    <Target className="w-4 h-4" />
                    <span>Hot Drops & Compound Zones</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Clock Tower, Factory Complex, Peak High Grounds, and Pochinok. Intense mobile-only combat.
                  </p>
                </div>

                <div className="bg-obsidian/80 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-neonGreen font-orbitron font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Anti-Cheat & Mobile-Only</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    No PC emulators (BlueStacks/LDPlayer). Registered Free Fire UIDs are strictly cross-checked.
                  </p>
                </div>

              </div>

              <div className="p-3.5 rounded-xl bg-surfaceLight/80 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Match Date & Time:</span>
                  <strong className="text-white font-orbitron">Sunday, 29 November 2026</strong>
                </div>
                <a
                  href="#booking"
                  onClick={() => playClick()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neonOrange to-orange-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider shadow-glow-orange hover:scale-105 transition-all"
                >
                  Book Bermuda Slot
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
