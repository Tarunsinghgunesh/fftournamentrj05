import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Flame, 
  Trophy, 
  Zap, 
  Calendar, 
  MapPin, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { playClick, playHover, playSuccess, playError } from '../utils/audio';

export default function LiveRosterAndSearch({ externalSearch = '', onRegisterClick }) {
  const [searchTerm, setSearchTerm] = useState(externalSearch);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [copiedUid, setCopiedUid] = useState(null);

  // Live Stats State - 100% REAL from Google Sheet
  const [stats, setStats] = useState({
    confirmedPlayers: 0,
    remainingPlayers: 48,
    confirmedSquads: 0,
    maxCapacity: 48,
    maxSquads: 12,
    isFull: false
  });

  // Confirmed Roster State - 100% REAL from Google Sheet (ZERO FAKE TEAMS)
  const [roster, setRoster] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  // Sync external search prop from Navbar quick button
  useEffect(() => {
    if (externalSearch) {
      setSearchTerm(externalSearch);
    }
  }, [externalSearch]);

  const fetchLiveData = async () => {
    if (!scriptUrl) {
      // If no script URL is set in .env yet, display 0 real data rather than fake data
      setStats({
        confirmedPlayers: 0,
        remainingPlayers: 48,
        confirmedSquads: 0,
        maxCapacity: 48,
        maxSquads: 12,
        isFull: false
      });
      setRoster([]);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch stats
      const statsRes = await fetch(`${scriptUrl}?action=stats`);
      const statsData = await statsRes.json();
      if (statsData && statsData.success) {
        setStats({
          confirmedPlayers: statsData.confirmedPlayers || 0,
          remainingPlayers: typeof statsData.remainingPlayers === 'number' ? statsData.remainingPlayers : 48,
          confirmedSquads: statsData.confirmedSquads || 0,
          maxCapacity: statsData.maxCapacity || 48,
          maxSquads: statsData.maxSquads || 12,
          isFull: statsData.isFull || false
        });
      }

      // 2. Fetch confirmed list
      const listRes = await fetch(`${scriptUrl}?action=list`);
      const listData = await listRes.json();
      if (listData && listData.success && Array.isArray(listData.roster)) {
        setRoster(listData.roster);
      }
      playSuccess();
    } catch (err) {
      console.warn('Live Google Sheet sync error:', err);
      setFetchError('Could not reach Google Apps Script. Check network or deployment URL.');
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchLiveData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, [scriptUrl]);

  const handleCopyUid = (uid) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    playSuccess();
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Real-time search filter across all fields
  const filteredRoster = useMemo(() => {
    if (!searchTerm.trim()) return roster;
    const q = searchTerm.trim().toLowerCase();
    return roster.filter((item) => {
      return (
        item.slotNo?.toLowerCase().includes(q) ||
        item.teamName?.toLowerCase().includes(q) ||
        item.orderId?.toLowerCase().includes(q) ||
        item.utr?.toLowerCase().includes(q) ||
        item.player1?.toLowerCase().includes(q) ||
        item.player2?.toLowerCase().includes(q) ||
        item.player3?.toLowerCase().includes(q) ||
        item.player4?.toLowerCase().includes(q)
      );
    });
  }, [roster, searchTerm]);

  return (
    <section id="roster" className="relative py-24 bg-surface/40 border-t border-white/5 cyber-grid-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-xs font-semibold tracking-wider font-orbitron mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>100% LIVE DATABASE • ZERO FAKE ENTRIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            LIVE ROSTER & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonGreen">SLOT TELEMETRY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light">
            Direct real-time sync with Google Sheets. Reads every online registration & organizer manual entry for <strong className="text-white font-medium">Sunday, 29 November 2026 (Bermuda)</strong>.
          </p>
        </div>

        {/* ========================================================= */}
        {/* REAL-TIME TELEMETRY STATS BAR */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
          
          {/* Stat 1: Confirmed Players */}
          <div className="glass-panel-glow p-5 rounded-2xl border-l-4 border-l-neonGreen">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-1">
              <span>Confirmed Players</span>
              <CheckCircle2 className="w-4 h-4 text-neonGreen" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-orbitron text-white">
              {stats.confirmedPlayers} <span className="text-xs text-slate-500 font-normal">/ {stats.maxCapacity}</span>
            </div>
            <div className="w-full h-1.5 bg-obsidian rounded-full overflow-hidden mt-2 border border-white/10">
              <div 
                className="h-full bg-neonGreen transition-all duration-500" 
                style={{ width: `${Math.min(100, (stats.confirmedPlayers / stats.maxCapacity) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Stat 2: Remaining Slots */}
          <div className="glass-panel-glow p-5 rounded-2xl border-l-4 border-l-neonOrange">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-1">
              <span>Slots Remaining</span>
              <Flame className="w-4 h-4 text-neonOrange" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-orbitron text-neonOrange">
              {stats.remainingPlayers} <span className="text-xs text-slate-400 font-normal">Seats Left</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {stats.remainingPlayers === 0 ? 'Lobby 100% Full!' : 'Open for registration'}
            </p>
          </div>

          {/* Stat 3: Squads Equivalent Filled */}
          <div className="glass-panel-glow p-5 rounded-2xl border-l-4 border-l-neonCyan">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-1">
              <span>Squads Filled</span>
              <Users className="w-4 h-4 text-neonCyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-orbitron text-white">
              {stats.confirmedSquads} <span className="text-xs text-slate-500 font-normal">/ {stats.maxSquads} Squads</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Max 12 Squads = 48
            </p>
          </div>

          {/* Stat 4: Match & Map Details */}
          <div className="glass-panel-glow p-5 rounded-2xl border-l-4 border-l-neonGold flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-1">
                <span>Match Date & Map</span>
                <MapPin className="w-4 h-4 text-neonGold" />
              </div>
              <div className="text-sm font-bold text-white font-orbitron">
                Bermuda Only
              </div>
              <p className="text-[11px] text-neonGold font-medium mt-0.5">
                Sun, 29 Nov 2026
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
              <span>1st Prize: <strong className="text-neonGold font-orbitron">₹600</strong></span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SEARCH BAR & LIVE REFRESH CONTROLS */}
        {/* ========================================================= */}
        <div className="glass-panel-glow rounded-2xl p-4 sm:p-5 mb-8 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neonCyan" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Free Fire UID, Squad Name, Slot No (e.g. SQUAD-SLOT-01), or UTR..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-obsidian/90 border border-white/10 focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white text-xs placeholder:text-slate-500 font-poppins outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/10 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => { playClick(); fetchLiveData(); }}
                disabled={loading}
                className="px-4 py-3 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 hover:border-neonCyan/40 text-slate-200 hover:text-neonCyan text-xs font-orbitron font-semibold flex items-center gap-2 transition-all cursor-pointer"
                title="Sync directly with Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-neonCyan' : ''}`} />
                <span>{loading ? 'Syncing...' : 'Refresh Live Slots'}</span>
              </button>

              <a
                href="#booking"
                onClick={() => { playClick(); if (onRegisterClick) onRegisterClick(); }}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-neonOrange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange cursor-pointer"
              >
                Book Now
              </a>
            </div>

          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono">
            <span>Official Sheet Sync: {scriptUrl ? 'Live Apps Script Connected' : 'Ready (Awaiting VITE_GOOGLE_SCRIPT_URL in .env)'}</span>
            <span>Last Checked: {lastUpdated || 'Just now'}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONFIRMED ROSTER DIRECTORY TABLE / CARDS */}
        {/* ========================================================= */}
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          
          {filteredRoster.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-obsidian/90 text-slate-400 font-orbitron uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Slot</th>
                      <th className="py-3.5 px-4">Squad / Player</th>
                      <th className="py-3.5 px-4">Format</th>
                      <th className="py-3.5 px-4">Registered UIDs</th>
                      <th className="py-3.5 px-4">12-Digit UTR</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-poppins">
                    {filteredRoster.map((entry, idx) => (
                      <tr 
                        key={entry.orderId || idx}
                        className="hover:bg-white/[0.02] transition-colors group"
                        onMouseEnter={() => playHover()}
                      >
                        <td className="py-3.5 px-4 font-orbitron font-bold text-neonGold whitespace-nowrap">
                          {entry.slotNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white group-hover:text-neonCyan transition-colors">
                            {entry.teamName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Leader: {entry.player1}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold ${
                            entry.bookingType === 'Squad' ? 'bg-neonGold/10 text-neonGold border border-neonGold/30' : 'bg-neonCyan/10 text-neonCyan border border-neonCyan/30'
                          }`}>
                            {entry.bookingType || 'Squad'} ({entry.playersCount || 4}P)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                          <div className="space-y-0.5">
                            {entry.player2 && entry.player2 !== 'N/A' && <div>• {entry.player2}</div>}
                            {entry.player3 && entry.player3 !== 'N/A' && <div>• {entry.player3}</div>}
                            {entry.player4 && entry.player4 !== 'N/A' && <div>• {entry.player4}</div>}
                            {(!entry.player2 || entry.player2 === 'N/A') && <div>• Registered via Leader UID</div>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {entry.utr && entry.utr !== 'N/A' ? entry.utr.slice(0, 4) + '••••' + entry.utr.slice(8) : 'Manual Verified'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen font-orbitron text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            CONFIRMED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-white/5">
                {filteredRoster.map((entry, idx) => (
                  <div key={entry.orderId || idx} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-orbitron font-bold text-neonGold text-xs">
                        {entry.slotNo}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen font-orbitron text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{entry.teamName}</h4>
                      <p className="text-xs text-slate-400">Leader: {entry.player1}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-obsidian/70 border border-white/5 text-xs font-mono text-slate-300">
                      <div className="text-[10px] uppercase font-orbitron text-slate-500 mb-1">Squad UIDs:</div>
                      {entry.player2 && entry.player2 !== 'N/A' && <div>{entry.player2}</div>}
                      {entry.player3 && entry.player3 !== 'N/A' && <div>{entry.player3}</div>}
                      {entry.player4 && entry.player4 !== 'N/A' && <div>{entry.player4}</div>}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>UTR: {entry.utr && entry.utr !== 'N/A' ? entry.utr.slice(0, 4) + '••••' + entry.utr.slice(8) : 'Manual'}</span>
                      <span className="text-neonGold font-orbitron">{entry.bookingType} (₹{entry.amount})</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ========================================================= */
            /* ZERO FAKE DATA EMPTY STATE */
            /* ========================================================= */
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-surfaceLight border border-neonOrange/30 flex items-center justify-center text-neonOrange mb-4 shadow-glow-orange/20">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">
                {searchTerm ? `No Confirmed Squad Found for "${searchTerm}"` : '0 / 48 Slots Filled — Roster Open!'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed font-light">
                {searchTerm 
                  ? 'Check your Free Fire UID, Squad Name, or 12-Digit UTR number. Make sure your registration has been submitted.'
                  : 'Be the first squad or solo warrior to claim Slot 1 for the Bermuda Championship on Sunday, 29 November 2026.'}
              </p>
              
              <div className="mt-6">
                <a
                  href="#booking"
                  onClick={() => playClick()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neonOrange to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange hover:scale-105 transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Claim Slot 01 Now</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
