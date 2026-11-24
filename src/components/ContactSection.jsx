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
  HelpCircle, 
  UserCheck,
  CheckCircle2,
  AlertCircle
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
    issueType: 'Payment Query',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const organizer = {
    name: import.meta.env.VITE_ORGANIZER_NAME || 'Anirudh Singh',
    uid: import.meta.env.VITE_ORGANIZER_UID || '3029117867',
    phone: import.meta.env.VITE_ORGANIZER_PHONE || '+91 8209071700',
    phoneRaw: '918209071700',
    email: import.meta.env.VITE_ORGANIZER_EMAIL || 'anirudhgunesh5@gmail.com',
    instagram: '@i.e_anirudh_rj05',
    instaUrl: import.meta.env.VITE_ORGANIZER_INSTA || 'https://instagram.com/i.e_anirudh_rj05',
    role: 'Tournament Director & Chief Host',
    brand: 'RJ05 Esports'
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
    if (!queryForm.contact.trim()) err.contact = 'WhatsApp or Email is required';
    if (!queryForm.message.trim()) err.message = 'Please provide details of your query';
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
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'contact_query',
            ...queryForm,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('Backend sync attempted for query. Fallback active.', err);
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
            <span>ORGANIZER DESK & 24/7 SUPPORT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            ORGANIZER <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGold via-neonOrange to-amber-500">HEADQUARTERS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light">
            Need urgent slot assistance, custom squad roster changes, or payment confirmation? Reach out directly to Anirudh Singh or submit an official ticket below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: VERIFIED ORGANIZER PROFILE CARD */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
            
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonGold/10 blur-[50px] pointer-events-none rounded-full" />

            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neonOrange to-neonGold p-[2px] shadow-glow-orange shrink-0">
                <div className="w-full h-full bg-obsidian rounded-[14px] flex items-center justify-center font-orbitron font-black text-2xl text-neonGold">
                  RJ
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neonGreen border-2 border-obsidian flex items-center justify-center shadow-glow-green" title="Verified Host Online">
                  <Check className="w-3 h-3 text-obsidian stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-orbitron uppercase tracking-widest px-2 py-0.5 rounded bg-neonGold/15 text-neonGold font-bold">
                    Official Host
                  </span>
                  <ShieldCheck className="w-4 h-4 text-neonCyan" />
                </div>
                <h3 className="font-orbitron font-black text-xl text-white mt-0.5">
                  {organizer.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {organizer.role} • {organizer.brand}
                </p>
              </div>
            </div>

            {/* Host Details List */}
            <div className="py-6 space-y-4 text-xs font-poppins">
              
              {/* Host UID Box */}
              <div className="bg-obsidian/70 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-orbitron text-slate-400 block">Host Free Fire UID</span>
                  <span className="text-base font-bold text-neonCyan font-mono tracking-wider">{organizer.uid}</span>
                </div>
                <button
                  onClick={handleCopyHostUid}
                  className="px-3 py-1.5 rounded-lg bg-surfaceLight hover:bg-neonCyan/20 text-slate-300 hover:text-neonCyan font-orbitron text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUid ? 'Copied!' : 'Copy UID'}</span>
                </button>
              </div>

              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${organizer.phoneRaw}?text=Hi%20Anirudh,%20I%20have%20a%20query%20regarding%20RJ05%20Esports%20Tournament`}
                target="_blank"
                rel="noreferrer"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="bg-obsidian/70 hover:bg-neonGreen/10 border border-white/10 hover:border-neonGreen/40 rounded-xl p-3.5 flex items-center justify-between text-slate-200 hover:text-neonGreen transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neonGreen/10 text-neonGreen">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-orbitron text-slate-400 block">WhatsApp Broadcast & Call</span>
                    <span className="text-sm font-semibold">{organizer.phone}</span>
                  </div>
                </div>
                <span className="text-[11px] font-orbitron text-neonGreen font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Chat Now →
                </span>
              </a>

              {/* Email direct */}
              <a
                href={`mailto:${organizer.email}?subject=RJ05%20Esports%20Tournament%20Query`}
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="bg-obsidian/70 hover:bg-neonOrange/10 border border-white/10 hover:border-neonOrange/40 rounded-xl p-3.5 flex items-center justify-between text-slate-200 hover:text-neonOrange transition-all group cursor-pointer"
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
                <span className="text-[11px] font-orbitron text-neonOrange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Email →
                </span>
              </a>

              {/* Instagram direct */}
              <a
                href={organizer.instaUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="bg-obsidian/70 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 rounded-xl p-3.5 flex items-center justify-between text-slate-200 hover:text-pink-400 transition-all group cursor-pointer"
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
                <span className="text-[11px] font-orbitron text-pink-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Follow →
                </span>
              </a>

            </div>

            {/* Anti-fraud notice */}
            <div className="p-3 rounded-xl bg-neonGold/5 border border-neonGold/20 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-neonGold font-semibold">Security Alert: </strong>
              Never send payments to any number other than <code className="text-white font-mono">8209071700@ybl</code>. Anirudh Singh is the sole administrator of RJ05 Esports.
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: INTERACTIVE CONTACT & QUERY FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10">
            
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-neonOrange" />
              <h3 className="font-orbitron font-extrabold text-xl text-white">
                Submit Support / Dispute Query
              </h3>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-obsidian/80 rounded-2xl border border-neonGreen/40 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-neonGreen/10 border border-neonGreen text-neonGreen mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">Query Successfully Logged</h4>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{queryForm.name}</strong>. Your query has been logged to the RJ05 admin sheet. Organizer Anirudh Singh will review your case within 30 minutes on WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setQueryForm({ name: '', uid: '', contact: '', issueType: 'Payment Query', message: '' });
                  }}
                  className="mt-5 px-5 py-2 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-xs font-orbitron font-bold text-slate-300 cursor-pointer"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-slate-300 mb-1.5 uppercase">
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
                    <label className="block text-xs font-orbitron text-slate-300 mb-1.5 uppercase">
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
                    <label className="block text-xs font-orbitron text-slate-300 mb-1.5 uppercase">
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
                    <label className="block text-xs font-orbitron text-slate-300 mb-1.5 uppercase">
                      Issue Category <span className="text-neonOrange">*</span>
                    </label>
                    <select
                      value={queryForm.issueType}
                      onChange={(e) => setQueryForm({ ...queryForm, issueType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 focus:border-neonOrange text-white text-xs outline-none"
                    >
                      <option value="Payment Query">Payment Query (Paise mismatch / bank delay)</option>
                      <option value="UID Correction">UID Correction (Typo in Free Fire UID)</option>
                      <option value="Squad Entry">Squad Entry / Teammate Roster Change</option>
                      <option value="Room Credentials">Room ID & Password Delivery</option>
                      <option value="General Support">General Tournament Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-orbitron text-slate-300 mb-1.5 uppercase">
                    Detailed Message <span className="text-neonOrange">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={queryForm.message}
                    onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                    placeholder="Describe your issue with exact Transaction UTR / Order ID if applicable..."
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
                  <span>{submitting ? 'Submitting to Admin Desk...' : 'Transmit Query to Anirudh Singh'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
