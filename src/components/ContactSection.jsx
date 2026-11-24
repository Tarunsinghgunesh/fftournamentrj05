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
  CheckCircle2,
  UserCheck,
  Crown,
  ExternalLink,
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';
import { playClick, playHover, playSuccess, playError } from '../utils/audio';

export default function ContactSection() {
  const [copiedUid, setCopiedUid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    likes: '4,400+',
    score: '5,829',
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
          {/* LEFT: FULL ANIRUDH PHOTO & VERIFIED HOST IDENTITY CARD */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Full High-Profile Portrait Card */}
            <div className="glass-panel-glow border-beam rounded-3xl p-6 border border-white/10 relative overflow-hidden">
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-obsidian mb-5">
                <img
                  src={organizer.photo}
                  alt={organizer.name}
                  className="w-full h-80 sm:h-96 object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                
                {/* Online Host Verification Pill */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian/90 border border-neonGreen/50 text-neonGreen text-[11px] font-orbitron font-bold backdrop-blur-md shadow-glow-green/20">
                  <span className="w-2 h-2 rounded-full bg-neonGreen animate-ping" />
                  <span>Verified Host Online</span>
                </div>

                {/* Bottom Card Title Overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-orbitron uppercase tracking-widest text-neonGold font-bold block mb-0.5">
                    Tournament Director & Chief Host
                  </span>
                  <h3 className="text-2xl font-black font-orbitron text-white tracking-wide">
                    {organizer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mt-0.5">
                    <span>RJ05 Esports</span> • <span className="text-neonCyan">Host UID: {organizer.uid}</span>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Channels */}
              <div className="space-y-2.5 text-xs font-poppins">
                
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${organizer.phoneRaw}?text=Hi%20Anirudh,%20I%20have%20a%20query%20about%20RJ05%20Esports%20Season%201%20Tournament`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover()}
                  className="bg-obsidian/85 hover:bg-neonGreen/10 border border-white/10 hover:border-neonGreen/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-neonGreen transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neonGreen/10 text-neonGreen">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">WhatsApp Direct Broadcast</span>
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
                  className="bg-obsidian/85 hover:bg-neonOrange/10 border border-white/10 hover:border-neonOrange/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-neonOrange transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neonOrange/10 text-neonOrange">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">Official Support Email</span>
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
                  className="bg-obsidian/85 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 rounded-xl p-3 flex items-center justify-between text-slate-200 hover:text-pink-400 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-orbitron text-slate-400 block">Instagram Community</span>
                      <span className="text-sm font-semibold">{organizer.instagram}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-orbitron text-pink-400 font-bold flex items-center gap-1">
                    Follow <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: REAL FREE FIRE MAX IN-GAME SCREENSHOT & QUERY FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real Free Fire MAX Profile Screenshot Showcase */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-neonGold" />
                  <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
                    Official Free Fire MAX In-Game Profile
                  </span>
                </div>
                
                <button
                  onClick={handleCopyHostUid}
                  className="px-3 py-1 rounded-lg bg-surfaceLight hover:bg-neonCyan/20 text-slate-300 hover:text-neonCyan font-orbitron text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedUid ? <Check className="w-3 h-3 text-neonGreen" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUid ? 'Copied UID!' : 'Copy 3029117867'}</span>
                </button>
              </div>

              {/* Full HD In-Game Screenshot with Click-to-Zoom */}
              <div 
                onClick={() => setLightboxOpen(true)}
                className="relative rounded-2xl overflow-hidden border border-white/15 cursor-zoom-in group shadow-2xl"
                title="Click to view full HD screenshot"
              >
                <img
                  src={organizer.ffProfile}
                  alt="Anirudh Free Fire MAX Profile"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 border border-white/20 text-white text-[10px] font-orbitron font-bold flex items-center gap-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  <span>Click to Expand</span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white font-orbitron font-bold bg-obsidian/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <span>IGN: <strong className="text-neonGold font-mono">{organizer.ign}</strong></span>
                  <span className="text-neonCyan">Level {organizer.level} • {organizer.guild}</span>
                </div>
              </div>

              {/* In-Game Stats Strip */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Guild</span>
                  <span className="font-bold text-white font-mono text-[11px]">{organizer.guild}</span>
                </div>
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">BR Score</span>
                  <span className="font-bold text-neonGold font-orbitron text-[11px]">{organizer.score}</span>
                </div>
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Profile Likes</span>
                  <span className="font-bold text-neonGreen font-orbitron text-[11px]">{organizer.likes}</span>
                </div>
                <div className="bg-obsidian/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Level</span>
                  <span className="font-bold text-neonCyan font-orbitron text-[11px]">Lv. {organizer.level}</span>
                </div>
              </div>
            </div>

            {/* Interactive Support Query Form */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-neonOrange" />
                <h4 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white">
                  Submit Support / UTR Dispute Ticket
                </h4>
              </div>

              {submitted ? (
                <div className="p-6 text-center bg-obsidian/80 rounded-2xl border border-neonGreen/40 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-neonGreen/10 border border-neonGreen text-neonGreen mx-auto flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-white">Ticket Logged to Sheet</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{queryForm.name}</strong>. Your message is recorded in Anirudh's Google Sheet. He will reply on WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setQueryForm({ name: '', uid: '', contact: '', issueType: 'Payment & UTR Verification', message: '' });
                    }}
                    className="mt-4 px-4 py-1.5 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-xs font-orbitron font-bold text-slate-300 cursor-pointer"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-orbitron text-slate-300 mb-1 uppercase">
                        Full Name <span className="text-neonOrange">*</span>
                      </label>
                      <input
                        type="text"
                        value={queryForm.name}
                        onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                        placeholder="Your name"
                        className={`w-full px-3 py-2 rounded-xl bg-obsidian border text-white text-xs outline-none ${
                          errors.name ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-orbitron text-slate-300 mb-1 uppercase">
                        Free Fire UID (If any)
                      </label>
                      <input
                        type="text"
                        value={queryForm.uid}
                        onChange={(e) => setQueryForm({ ...queryForm, uid: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 3029117867"
                        className="w-full px-3 py-2 rounded-xl bg-obsidian border border-white/10 focus:border-neonOrange text-white text-xs font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-orbitron text-slate-300 mb-1 uppercase">
                        WhatsApp or Email <span className="text-neonOrange">*</span>
                      </label>
                      <input
                        type="text"
                        value={queryForm.contact}
                        onChange={(e) => setQueryForm({ ...queryForm, contact: e.target.value })}
                        placeholder="+91 or email"
                        className={`w-full px-3 py-2 rounded-xl bg-obsidian border text-white text-xs outline-none ${
                          errors.contact ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-orbitron text-slate-300 mb-1 uppercase">
                        Category <span className="text-neonOrange">*</span>
                      </label>
                      <select
                        value={queryForm.issueType}
                        onChange={(e) => setQueryForm({ ...queryForm, issueType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-obsidian border border-white/10 focus:border-neonOrange text-white text-xs outline-none"
                      >
                        <option value="Payment & UTR Verification">Payment & 12-Digit UTR Issue</option>
                        <option value="UID Correction">UID Correction / Squad Change</option>
                        <option value="Room Credentials">Room ID & Password Delivery</option>
                        <option value="General Rules">General Tournament Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-orbitron text-slate-300 mb-1 uppercase">
                      Detailed Message <span className="text-neonOrange">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={queryForm.message}
                      onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                      placeholder="Type details or UTR reference..."
                      className={`w-full p-3 rounded-xl bg-obsidian border text-white text-xs outline-none resize-none ${
                        errors.message ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-neonOrange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Transmitting to Sheet...' : 'Submit to Anirudh Singh'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* FULL-SCREEN HD LIGHTBOX MODAL FOR FREE FIRE MAX PROFILE SCREENSHOT */}
      {lightboxOpen && (
        <div 
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
            <img
              src={organizer.ffProfile}
              alt="Anirudh Free Fire MAX Profile HD"
              className="w-full h-auto rounded-2xl border-2 border-neonOrange shadow-glow-orange max-h-[85vh] object-contain mx-auto"
            />
            <div className="mt-3 text-center text-xs font-orbitron text-slate-300">
              Host: <strong className="text-white">Anirudh Singh</strong> | In-Game: <strong className="text-neonGold">ANIRUDH•RJ05</strong> | UID: <strong className="text-neonCyan font-mono">3029117867</strong> | Level 61
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
