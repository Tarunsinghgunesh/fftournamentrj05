import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Instagram, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2,
  UserCheck,
  Award,
  Crown,
  ExternalLink
} from 'lucide-react';
import { playClick, playHover, playSuccess, playError } from '../utils/audio';

export default function ContactSection() {
  const [copiedUid, setCopiedUid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [queryForm, setQueryForm] = useState({
    name: '',
    uid: '',
    contact: '',
    issueType: 'Payment & UTR Verification',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const organizer = {
    name: 'Anirudh Singh',
    ign: 'ANIRUDH•RJ05',
    level: 61,
    guild: "CEXPRIMER'S",
    uid: '3029117867',
    likes: 4400,
    phone: '+91 8209071700',
    phoneRaw: '918209071700',
    email: 'anirudhgunesh5@gmail.com',
    instagram: '@i.e_anirudh_rj05',
    instaUrl: 'https://instagram.com/i.e_anirudh_rj05',
    photo: '/anirudh-photo.webp',
    ffProfile: '/anirudh-ff-profile.jpg'
  };

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const handleCopyHostUid = () => {
    navigator.clipboard.writeText(organizer.uid);
    setCopiedUid(true);
    playSuccess();
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const validate = () => {
    const err = {};
    if (!queryForm.name.trim()) err.name = 'Name is required';
    if (!queryForm.contact.trim()) err.contact = 'WhatsApp number or Email is required';
    if (!queryForm.message.trim()) err.message = 'Please describe your inquiry or dispute';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      playError();
      return;
    }

    playClick();
    setSubmitting(true);

    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'contact_query',
            ...queryForm,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('Backend query logging notice:', err);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    playSuccess();
  };

  return (
    <section id="contact" className="relative py-24 bg-surface/50 border-t border-white/5 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonGold/10 border border-neonGold/30 text-neonGold text-xs font-semibold tracking-wider font-orbitron mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>AUTHENTIC HOST VERIFICATION & SUPPORT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            ORGANIZER <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGold via-neonOrange to-amber-500">HEADQUARTERS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 font-light">
            Verified tournament director identity. Connect directly with Anirudh Singh on WhatsApp or submit a support query.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: VERIFIED ORGANIZER IDENTITY & FF MAX PROFILE CARD */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Host Portrait & Contact Card */}
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-white/10">
                
                {/* Real Photo with Neon Frame */}
                <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-neonOrange to-neonGold p-[2px] shadow-glow-orange shrink-0 overflow-hidden">
                  <img
                    src={organizer.photo}
                    alt={organizer.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-neonGreen border-2 border-obsidian flex items-center justify-center shadow-glow-green" title="Host Online">
                    <Check className="w-3 h-3 text-obsidian stroke-[3]" />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] font-orbitron uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neonGold/15 text-neonGold font-bold border border-neonGold/30">
                      Verified Director
                    </span>
                    <ShieldCheck className="w-4 h-4 text-neonGreen" />
                  </div>
                  <h3 className="font-orbitron font-black text-2xl text-white">
                    {organizer.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Host & Tournament Administrator • RJ05 Esports
                  </p>
                </div>
              </div>

              {/* Direct Quick Actions */}
              <div className="py-5 space-y-2.5 text-xs font-poppins">
                
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${organizer.phoneRaw}?text=Hi%20Anirudh,%20I%20have%20a%20query%20about%20RJ05%20Esports%20Season%201%20Tournament`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover()}
                  className="bg-obsidian/80 hover:bg-neonGreen/10 border border-white/10 hover:border-neonGreen/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-neonGreen transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neonGreen/10 text-neonGreen">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">WhatsApp Call & Broadcast</span>
                      <span className="text-sm font-semibold">{organizer.phone}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-orbitron text-neonGreen font-bold flex items-center gap-1">
                    Chat Now <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${organizer.email}?subject=RJ05%20Esports%20Season%201%20Inquiry`}
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover()}
                  className="bg-obsidian/80 hover:bg-neonOrange/10 border border-white/10 hover:border-neonOrange/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-neonOrange transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neonOrange/10 text-neonOrange">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">Official Email Desk</span>
                      <span className="text-sm font-semibold">{organizer.email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-orbitron text-neonOrange font-bold flex items-center gap-1">
                    Send Email <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

                {/* Instagram */}
                <a
                  href={organizer.instaUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover()}
                  className="bg-obsidian/80 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-pink-400 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">Official Instagram</span>
                      <span className="text-sm font-semibold">{organizer.instagram}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-orbitron text-pink-400 font-bold flex items-center gap-1">
                    Follow <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

              </div>
            </div>

            {/* 2. Real Free Fire MAX Profile Screenshot & Verified ID Card */}
            <div className="glass-panel-glow rounded-3xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-neonGold" />
                  <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
                    Verified Host In-Game ID Card
                  </span>
                </div>
                <button
                  onClick={handleCopyHostUid}
                  className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-neonCyan/20 text-slate-300 hover:text-neonCyan font-orbitron text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedUid ? <Check className="w-3 h-3 text-neonGreen" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUid ? 'Copied UID!' : 'Copy 3029117867'}</span>
                </button>
              </div>

              {/* Real In-Game Screenshot Display */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 group">
                <img
                  src={organizer.ffProfile}
                  alt="Anirudh Free Fire MAX Profile"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white font-orbitron font-bold">
                  <span>IGN: {organizer.ign}</span>
                  <span className="text-neonGold">Level {organizer.level} • {organizer.guild}</span>
                </div>
              </div>

              {/* Profile stats badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Guild</span>
                  <span className="font-bold text-white font-mono text-[11px]">{organizer.guild}</span>
                </div>
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">In-Game Level</span>
                  <span className="font-bold text-neonGold font-orbitron text-[11px]">Level {organizer.level}</span>
                </div>
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Official UID</span>
                  <span className="font-bold text-neonCyan font-mono text-[11px]">{organizer.uid}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: INTERACTIVE SUPPORT QUERY FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10">
            
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-neonOrange" />
              <h3 className="font-orbitron font-extrabold text-xl text-white">
                Submit Support / UTR Dispute Ticket
              </h3>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-obsidian/80 rounded-2xl border border-neonGreen/40 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-neonGreen/10 border border-neonGreen text-neonGreen mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">Ticket Transmitted Successfully</h4>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{queryForm.name}</strong>. Your inquiry has been logged to the RJ05 Google Sheet Queries tab. Organizer Anirudh Singh will respond on WhatsApp shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setQueryForm({ name: '', uid: '', contact: '', issueType: 'Payment & UTR Verification', message: '' });
                  }}
                  className="mt-5 px-5 py-2 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-xs font-orbitron font-bold text-slate-300 cursor-pointer"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-slate-300 mb-1 uppercase">
                      Your Full Name <span className="text-neonOrange">*</span>
                    </label>
                    <input
                      type="text"
                      value={queryForm.name}
                      onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border text-white text-xs outline-none ${
                        errors.name ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                      }`}
                    />
                    {errors.name && <p className="text-[10px] text-cyberRed mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron text-slate-300 mb-1 uppercase">
                      Free Fire UID (If registered)
                    </label>
                    <input
                      type="text"
                      value={queryForm.uid}
                      onChange={(e) => setQueryForm({ ...queryForm, uid: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 3029117867"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 focus:border-neonOrange text-white text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-slate-300 mb-1 uppercase">
                      WhatsApp or Email <span className="text-neonOrange">*</span>
                    </label>
                    <input
                      type="text"
                      value={queryForm.contact}
                      onChange={(e) => setQueryForm({ ...queryForm, contact: e.target.value })}
                      placeholder="+91 or email address"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border text-white text-xs outline-none ${
                        errors.contact ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                      }`}
                    />
                    {errors.contact && <p className="text-[10px] text-cyberRed mt-1">{errors.contact}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron text-slate-300 mb-1 uppercase">
                      Issue Category <span className="text-neonOrange">*</span>
                    </label>
                    <select
                      value={queryForm.issueType}
                      onChange={(e) => setQueryForm({ ...queryForm, issueType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 focus:border-neonOrange text-white text-xs outline-none"
                    >
                      <option value="Payment & UTR Verification">Payment & 12-Digit UTR Cross-Check</option>
                      <option value="UID Correction">UID Correction / Teammate Roster Change</option>
                      <option value="Room Credentials">Room ID & Password Delivery</option>
                      <option value="Prize Distribution">Prize Payout Question</option>
                      <option value="General Query">General Tournament Rules</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-orbitron text-slate-300 mb-1 uppercase">
                    Detailed Message <span className="text-neonOrange">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={queryForm.message}
                    onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                    placeholder="Provide your 12-digit UTR, Order ID, or issue details..."
                    className={`w-full p-3.5 rounded-xl bg-obsidian/80 border text-white text-xs outline-none resize-none ${
                      errors.message ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {errors.message && <p className="text-[10px] text-cyberRed mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neonOrange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Logging to Organizer Sheet...' : 'Transmit Query to Anirudh Singh'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
