import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink, 
  Filter, 
  Users, 
  Flame, 
  Copy, 
  Check,
  ChevronDown
} from 'lucide-react';
import { playClick, playHover, playSuccess, playError } from '../utils/audio';

// Mock roster for instant demo & offline fallback
const DEFAULT_MOCK_ROSTER = [
  { slotNo: 'SLOT-01', ign: 'RJ05_ANIRUDH', uid: '3029117867', mode: 'Squad', status: 'CONFIRMED', time: '10:15 AM' },
  { slotNo: 'SLOT-02', ign: 'DEADLY_VIPER', uid: '1849201948', mode: 'Solo', status: 'CONFIRMED', time: '10:45 AM' },
  { slotNo: 'SLOT-03', ign: 'OP_HEADSHOT', uid: '2948201847', mode: 'Duo', status: 'CONFIRMED', time: '11:10 AM' },
  { slotNo: 'SLOT-04', ign: 'KILLER_SOUL', uid: '3948572019', mode: 'Squad', status: 'CONFIRMED', time: '11:30 AM' },
  { slotNo: 'SLOT-05', ign: 'CYBER_CLUTCH', uid: '9284729103', mode: 'Solo', status: 'CONFIRMED', time: '11:55 AM' },
  { slotNo: 'SLOT-06', ign: 'THUNDER_FF', uid: '4820192847', mode: 'Duo', status: 'CONFIRMED', time: '12:20 PM' },
  { slotNo: 'SLOT-07', ign: 'SNIPER_QUEEN', uid: '8472910482', mode: 'Solo', status: 'PENDING', time: '12:35 PM' },
  { slotNo: 'SLOT-08', ign: 'ALPHA_BEAST', uid: '5920194820', mode: 'Squad', status: 'CONFIRMED', time: '12:50 PM' },
  { slotNo: 'SLOT-09', ign: 'GHOST_RIDER_99', uid: '7392018472', mode: 'Solo', status: 'CONFIRMED', time: '01:05 PM' },
  { slotNo: 'SLOT-10', ign: 'TOXIC_WARRIOR', uid: '6192847102', mode: 'Duo', status: 'CONFIRMED', time: '01:25 PM' },
];

export default function LiveSearchAndRoster({ externalSearchQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(externalSearchQuery);
  const [filterMode, setFilterMode] = useState('ALL'); // ALL | CONFIRMED | PENDING
  const [roster, setRoster] = useState(DEFAULT_MOCK_ROSTER);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [copiedUid, setCopiedUid] = useState(null);

  // Sync external search query prop if changed from Navbar button
  useEffect(() => {
    if (externalSearchQuery) {
      setSearchTerm(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const fetchRoster = async () => {
    if (!scriptUrl) {
      setLastRefreshed(new Date().toLocaleTimeString());
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${scriptUrl}?action=list`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.roster)) {
        setRoster(data.roster);
        playSuccess();
      }
    } catch (err) {
      console.warn('Could not fetch from live Google Sheet. Using local roster data.', err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleCopyUid = (uid) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    playSuccess();
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Filtered and Searched list
  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchQuery = 
        !q ||
        item.ign.toLowerCase().includes(q) ||
        item.uid.toLowerCase().includes(q) ||
        item.slotNo.toLowerCase().includes(q);

      const matchFilter = 
        filterMode === 'ALL' || item.status === filterMode;

      return matchQuery && matchFilter;
    });
  }, [roster, searchTerm, filterMode]);

  const confirmedCount = roster.filter(r => r.status === 'CONFIRMED').length;
  const pendingCount = roster.filter(r => r.status === 'PENDING').length;

  return (
    <section id="roster" className="relative py-24 bg-surface/40 border-t border-white/5 cyber-grid-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-xs font-semibold tracking-wider font-orbitron mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>REAL-TIME VERIFICATION DIRECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            LIVE ROSTER & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonGreen">SLOT LOOKUP</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light">
            Search your Free Fire UID, In-Game Name, or Slot ID to instantly check your verification status, match tier, and entry credentials.
          </p>
        </div>

        {/* Live Search and Filter Bar */}
        <div className="glass-panel-glow rounded-2xl p-4 sm:p-6 mb-8 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neonCyan" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Free Fire UID (e.g. 3029117867), IGN, or Slot ID..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-obsidian/80 border border-white/10 focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white text-sm placeholder:text-slate-500 font-poppins outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Toggle Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => { setFilterMode('ALL'); playClick(); }}
                className={`px-3 py-2 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-neonCyan text-obsidian shadow-glow-cyan/50 font-bold'
                    : 'bg-surfaceLight/80 text-slate-300 hover:bg-surfaceLight border border-white/10'
                }`}
              >
                All ({roster.length})
              </button>

              <button
                onClick={() => { setFilterMode('CONFIRMED'); playClick(); }}
                className={`px-3 py-2 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'CONFIRMED'
                    ? 'bg-neonGreen text-obsidian shadow-glow-green/50 font-bold'
                    : 'bg-surfaceLight/80 text-neonGreen hover:bg-surfaceLight border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed ({confirmedCount})</span>
              </button>

              <button
                onClick={() => { setFilterMode('PENDING'); playClick(); }}
                className={`px-3 py-2 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'PENDING'
                    ? 'bg-neonOrange text-white shadow-glow-orange/50 font-bold'
                    : 'bg-surfaceLight/80 text-neonOrange hover:bg-surfaceLight border border-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending ({pendingCount})</span>
              </button>

              <button
                onClick={fetchRoster}
                disabled={loading}
                title="Refresh Live Data"
                className="p-2.5 rounded-lg bg-surfaceLight/80 hover:bg-surfaceLight text-slate-300 hover:text-neonCyan border border-white/10 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-neonCyan' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Query Recommendation Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
            <span className="font-orbitron text-[11px] text-slate-400">Quick Test Tags:</span>
            {['3029117867', 'SLOT-01', 'DEADLY_VIPER', 'Squad', 'Solo'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearchTerm(tag); playClick(); }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-neonCyan/20 hover:text-neonCyan border border-white/5 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-slate-500 font-mono">
              Last synced: {lastRefreshed}
            </span>
          </div>
        </div>

        {/* Results Table & Cards */}
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian/80 text-slate-400 font-orbitron uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Slot</th>
                  <th className="py-3.5 px-4">Player IGN</th>
                  <th className="py-3.5 px-4">Free Fire UID</th>
                  <th className="py-3.5 px-4">Match Mode</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-poppins">
                {filteredRoster.length > 0 ? (
                  filteredRoster.map((player) => (
                    <tr 
                      key={player.slotNo + player.uid} 
                      className="hover:bg-white/[0.02] transition-colors group"
                      onMouseEnter={() => playHover()}
                    >
                      <td className="py-3.5 px-4 font-orbitron font-bold text-neonGold">
                        {player.slotNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white group-hover:text-neonCyan transition-colors">
                        {player.ign}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span>{player.uid}</span>
                          <button
                            onClick={() => handleCopyUid(player.uid)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-neonCyan transition-all cursor-pointer"
                            title="Copy UID"
                          >
                            {copiedUid === player.uid ? <Check className="w-3 h-3 text-neonGreen" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-medium">
                          {player.mode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {player.status === 'CONFIRMED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen font-orbitron text-[10px] font-bold tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            CONFIRMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neonOrange/10 border border-neonOrange/30 text-neonOrange font-orbitron text-[10px] font-bold tracking-wider">
                            <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        {player.time || 'Today'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <ShieldAlert className="w-8 h-8 text-neonOrange mx-auto mb-2 opacity-80" />
                      <p className="font-orbitron font-semibold text-white">No Registered Slot Found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try searching with another UID or check if you registered under a different In-Game Name.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden divide-y divide-white/5">
            {filteredRoster.length > 0 ? (
              filteredRoster.map((player) => (
                <div key={player.slotNo + player.uid} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-neonGold text-xs">
                      {player.slotNo}
                    </span>
                    {player.status === 'CONFIRMED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen font-orbitron text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neonOrange/10 border border-neonOrange/30 text-neonOrange font-orbitron text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-white">
                    {player.ign}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>UID: {player.uid}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{player.mode}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="font-orbitron text-white text-sm">No match for "{searchTerm}"</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
