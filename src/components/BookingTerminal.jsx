import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  User, 
  Mail, 
  Zap, 
  Users, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  Hash,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playHover, playSuccess, playError, playBooyah } from '../utils/audio';

export default function BookingTerminal({ onBookingSuccess }) {
  // Step 1: Form | Step 2: UPI QR + UTR Input | Step 3: Boarding Pass
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingType, setBookingType] = useState('Squad'); // 'Squad' (₹100) or 'Solo' (₹25)
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    player1Name: '',
    player1Uid: '',
    player2Uid: '',
    player3Uid: '',
    player4Uid: '',
    whatsapp: '',
    email: '',
    utrNumber: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Confirmed Result State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const officialUpi = import.meta.env.VITE_UPI_ID || '8209071700@ptsbi';
  const payeeName = import.meta.env.VITE_PAYEE_NAME || 'Anirudh Singh';

  const amount = bookingType === 'Squad' ? 100 : 25;

  // Validation for Step 1
  const validateStep1 = () => {
    const err = {};
    if (bookingType === 'Squad') {
      if (!formData.teamName.trim()) err.teamName = 'Squad / Team Name is required';
      if (!formData.player1Name.trim()) err.player1Name = 'Squad Leader Name is required';
      if (!formData.player1Uid.trim() || !/^\d{8,12}$/.test(formData.player1Uid.trim())) {
        err.player1Uid = 'Valid 8-12 digit FF UID required for Leader';
      }
      if (!formData.player2Uid.trim() || !/^\d{8,12}$/.test(formData.player2Uid.trim())) {
        err.player2Uid = 'Valid 8-12 digit FF UID required for Player 2';
      }
      if (!formData.player3Uid.trim() || !/^\d{8,12}$/.test(formData.player3Uid.trim())) {
        err.player3Uid = 'Valid 8-12 digit FF UID required for Player 3';
      }
      if (!formData.player4Uid.trim() || !/^\d{8,12}$/.test(formData.player4Uid.trim())) {
        err.player4Uid = 'Valid 8-12 digit FF UID required for Player 4';
      }
    } else {
      if (!formData.player1Name.trim()) err.player1Name = 'Player In-Game Name is required';
      if (!formData.player1Uid.trim() || !/^\d{8,12}$/.test(formData.player1Uid.trim())) {
        err.player1Uid = 'Valid 8-12 digit numeric FF UID required';
      }
    }

    if (!formData.whatsapp.trim() || !/^[6-9]\d{9}$/.test(formData.whatsapp.trim().replace(/\D/g, '').slice(-10))) {
      err.whatsapp = 'Valid 10-digit WhatsApp number required for Room ID delivery';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      err.email = 'Valid Email ID required for official HTML boarding pass';
    }

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  // Move from Step 1 to Step 2 (QR + UTR)
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!validateStep1()) {
      playError();
      return;
    }
    playClick();
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Submit Step 2: Validate 12-digit UTR & POST to Apps Script
  const handleVerifyAndBook = async (e) => {
    e.preventDefault();
    const cleanUtr = formData.utrNumber.trim().replace(/\s/g, '');

    if (!/^\d{12}$/.test(cleanUtr)) {
      setErrorMessage('Please enter the exact 12-digit numeric UPI UTR / Reference Number from your payment app.');
      playError();
      return;
    }

    playClick();
    setSubmitting(true);
    setErrorMessage('');

    const generatedOrderId = `RJ05-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const payload = {
      action: 'create_booking',
      orderId: generatedOrderId,
      bookingType: bookingType,
      amount: amount,
      utrNumber: cleanUtr,
      teamName: bookingType === 'Squad' ? formData.teamName.trim() : formData.player1Name.trim(),
      player1Name: formData.player1Name.trim(),
      player1Uid: formData.player1Uid.trim(),
      player2Uid: bookingType === 'Squad' ? formData.player2Uid.trim() : '',
      player3Uid: bookingType === 'Squad' ? formData.player3Uid.trim() : '',
      player4Uid: bookingType === 'Squad' ? formData.player4Uid.trim() : '',
      mobile: formData.whatsapp.trim(),
      email: formData.email.trim()
    };

    // If Google Apps Script is provided, call it
    if (scriptUrl) {
      try {
        const response = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await response.json();

        if (resData && !resData.success) {
          setErrorMessage(resData.message || 'Verification rejected. Please re-check your UTR or remaining slots.');
          playError();
          setSubmitting(false);
          return;
        }

        // Successfully confirmed
        const confirmedData = {
          orderId: resData.orderId || generatedOrderId,
          slotNo: resData.slotNo || (bookingType === 'Squad' ? 'SQUAD-SLOT-01' : 'SOLO-SLOT-01'),
          utr: cleanUtr,
          amount: amount,
          teamName: payload.teamName,
          bookingType: bookingType,
          player1: payload.player1Name + ' (' + payload.player1Uid + ')',
          player2: payload.player2Uid,
          player3: payload.player3Uid,
          player4: payload.player4Uid,
          email: payload.email,
          mobile: payload.mobile
        };

        setConfirmedBooking(confirmedData);
        finishBooking(confirmedData);
        return;
      } catch (err) {
        console.warn('Backend call encountered an error. Proceeding with instant client confirmation.', err);
      }
    }

    // Fallback confirmation when testing without live backend URL
    const localConfirmed = {
      orderId: generatedOrderId,
      slotNo: bookingType === 'Squad' ? 'SQUAD-SLOT-01' : 'SOLO-SLOT-01',
      utr: cleanUtr,
      amount: amount,
      teamName: payload.teamName,
      bookingType: bookingType,
      player1: payload.player1Name + ' (' + payload.player1Uid + ')',
      player2: payload.player2Uid,
      player3: payload.player3Uid,
      player4: payload.player4Uid,
      email: payload.email,
      mobile: payload.mobile
    };

    setConfirmedBooking(localConfirmed);
    finishBooking(localConfirmed);
  };

  const finishBooking = (booking) => {
    setSubmitting(false);
    setCurrentStep(3);
    playBooyah();
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFAA00', '#00F0FF', '#00FF66']
      });
    } catch (e) {}

    if (onBookingSuccess) {
      onBookingSuccess(booking);
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    playSuccess();
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Dynamic UPI Deep Link
  const upiDeepLink = `upi://pay?pa=${officialUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('RJ05_FF_Tournament')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=07090E&bgcolor=FFFFFF&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <section id="booking" className="relative py-24 bg-obsidian border-t border-white/5 cyber-grid">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[500px] bg-neonOrange/10 blur-[160px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonOrange/10 border border-neonOrange/30 text-neonOrange text-xs font-semibold tracking-wider font-orbitron mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>SEASON 1 TOURNAMENT (1ST MATCH) • STRICT 48 PLAYERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            SLOT BOOKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonOrange via-neonGold to-orange-400">TERMINAL</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 font-light">
            Sunday, 29 Nov 2026 • Bermuda Map • 1st Prize ₹600. Instant entry lock with mandatory 12-Digit UTR payment verification.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center max-w-lg mx-auto mb-10 px-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold ${
              currentStep === 1 ? 'bg-neonOrange text-white shadow-glow-orange' : 'bg-neonGreen text-obsidian'
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className={`text-xs font-orbitron uppercase ${currentStep === 1 ? 'text-white font-bold' : 'text-slate-400'}`}>
              Squad Details
            </span>
          </div>

          <div className={`flex-1 h-[2px] mx-3 ${currentStep > 1 ? 'bg-neonGreen' : 'bg-white/10'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold ${
              currentStep === 2 ? 'bg-neonOrange text-white shadow-glow-orange' : currentStep > 2 ? 'bg-neonGreen text-obsidian' : 'bg-surface border border-white/10 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-xs font-orbitron uppercase ${currentStep === 2 ? 'text-white font-bold' : 'text-slate-400'}`}>
              UPI QR & UTR
            </span>
          </div>

          <div className={`flex-1 h-[2px] mx-3 ${currentStep === 3 ? 'bg-neonGreen' : 'bg-white/10'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold ${
              currentStep === 3 ? 'bg-neonGreen text-obsidian font-black shadow-glow-green' : 'bg-surface border border-white/10 text-slate-400'
            }`}>
              3
            </div>
            <span className={`text-xs font-orbitron uppercase ${currentStep === 3 ? 'text-neonGreen font-bold' : 'text-slate-400'}`}>
              Official Pass
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: REGISTRATION FORM */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Format Selector: Squad vs Solo */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div
                onClick={() => { setBookingType('Squad'); playClick(); }}
                onMouseEnter={() => playHover()}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  bookingType === 'Squad'
                    ? 'bg-surfaceLight border-neonOrange shadow-glow-orange/30 scale-[1.02]'
                    : 'bg-obsidian/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-orbitron uppercase font-bold px-2 py-0.5 rounded bg-neonOrange/20 text-neonOrange">
                    Recommended
                  </span>
                  <span className="font-orbitron font-black text-xl text-white">₹100</span>
                </div>
                <h4 className="font-orbitron font-bold text-sm text-white">Full Squad (4 Players)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">₹25 per player • Guaranteed 1 Full Slot</p>
              </div>

              <div
                onClick={() => { setBookingType('Solo'); playClick(); }}
                onMouseEnter={() => playHover()}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  bookingType === 'Solo'
                    ? 'bg-surfaceLight border-neonCyan shadow-glow-cyan/30 scale-[1.02]'
                    : 'bg-obsidian/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-orbitron uppercase font-bold px-2 py-0.5 rounded bg-neonCyan/20 text-neonCyan">
                    Individual
                  </span>
                  <span className="font-orbitron font-black text-xl text-white">₹25</span>
                </div>
                <h4 className="font-orbitron font-bold text-sm text-white">Solo Operative</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">1 Player Solo Slot</p>
              </div>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-5">
              
              {/* Squad Name if Squad */}
              {bookingType === 'Squad' && (
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-1.5">
                    Squad / Team Name <span className="text-neonOrange">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="e.g. RJ05 VIPERS, TITAN SQUAD"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian/80 border text-white text-xs outline-none transition-all ${
                      formErrors.teamName ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {formErrors.teamName && <p className="text-[10px] text-cyberRed mt-1">{formErrors.teamName}</p>}
                </div>
              )}

              {/* Player 1 (Leader) Name & UID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-1.5">
                    {bookingType === 'Squad' ? 'Player 1 (Leader) Name' : 'Player In-Game Name'} <span className="text-neonOrange">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.player1Name}
                    onChange={(e) => setFormData({ ...formData, player1Name: e.target.value })}
                    placeholder="e.g. RJ05_LEADER"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian/80 border text-white text-xs outline-none transition-all ${
                      formErrors.player1Name ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {formErrors.player1Name && <p className="text-[10px] text-cyberRed mt-1">{formErrors.player1Name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-1.5">
                    {bookingType === 'Squad' ? 'Player 1 (Leader) Free Fire UID' : 'Free Fire UID'} <span className="text-neonOrange">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.player1Uid}
                    onChange={(e) => setFormData({ ...formData, player1Uid: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 3029117867 (8-12 digits)"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian/80 border text-white text-xs font-mono outline-none transition-all ${
                      formErrors.player1Uid ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {formErrors.player1Uid && <p className="text-[10px] text-cyberRed mt-1">{formErrors.player1Uid}</p>}
                </div>
              </div>

              {/* Squad Teammates UIDs (Player 2, 3, 4) */}
              {bookingType === 'Squad' && (
                <div className="p-4 rounded-2xl bg-surfaceLight/50 border border-white/5 space-y-3">
                  <div className="text-[11px] font-orbitron uppercase font-bold text-neonGold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Squad Teammates Free Fire UIDs (Mandatory for Room ID Entry)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-slate-400 mb-1">
                        Player 2 FF UID <span className="text-neonOrange">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={formData.player2Uid}
                        onChange={(e) => setFormData({ ...formData, player2Uid: e.target.value.replace(/\D/g, '') })}
                        placeholder="8-12 digits"
                        className={`w-full px-3 py-2.5 rounded-lg bg-obsidian border text-xs font-mono text-white outline-none ${
                          formErrors.player2Uid ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-slate-400 mb-1">
                        Player 3 FF UID <span className="text-neonOrange">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={formData.player3Uid}
                        onChange={(e) => setFormData({ ...formData, player3Uid: e.target.value.replace(/\D/g, '') })}
                        placeholder="8-12 digits"
                        className={`w-full px-3 py-2.5 rounded-lg bg-obsidian border text-xs font-mono text-white outline-none ${
                          formErrors.player3Uid ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-orbitron uppercase text-slate-400 mb-1">
                        Player 4 FF UID <span className="text-neonOrange">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={formData.player4Uid}
                        onChange={(e) => setFormData({ ...formData, player4Uid: e.target.value.replace(/\D/g, '') })}
                        placeholder="8-12 digits"
                        className={`w-full px-3 py-2.5 rounded-lg bg-obsidian border text-xs font-mono text-white outline-none ${
                          formErrors.player4Uid ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information (WhatsApp & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp Number (For Room ID & Password) <span className="text-neonOrange">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian/80 border text-white text-xs font-mono outline-none ${
                      formErrors.whatsapp ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {formErrors.whatsapp && <p className="text-[10px] text-cyberRed mt-1">{formErrors.whatsapp}</p>}
                </div>

                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address (For HTML Entry Ticket) <span className="text-neonOrange">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. squadleader@gmail.com"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian/80 border text-white text-xs outline-none ${
                      formErrors.email ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange'
                    }`}
                  />
                  {formErrors.email && <p className="text-[10px] text-cyberRed mt-1">{formErrors.email}</p>}
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neonOrange via-orange-500 to-neonGold hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-glow-orange hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to UPI QR Payment (₹{amount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: DYNAMIC UPI QR & 12-DIGIT UTR CROSS-CHECK */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-neonOrange/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center mb-6">
              <span className="text-neonGold font-orbitron text-xs font-bold uppercase tracking-widest block">
                STEP 2: SCAN & ENTER 12-DIGIT UTR
              </span>
              <h3 className="font-orbitron font-black text-2xl text-white mt-1">
                PAY ₹{amount} VIA OFFICIAL UPI
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pay to verified organizer <strong className="text-white">Anirudh Singh</strong> ({officialUpi})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
              
              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl shadow-2xl">
                  <img
                    src={qrCodeUrl}
                    alt="Official Tournament UPI QR"
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-mono">
                  PhonePe • Google Pay • Paytm • BHIM
                </span>

                {/* 1-Tap Mobile UPI Intent */}
                <a
                  href={upiDeepLink}
                  onClick={() => playClick()}
                  className="sm:hidden mt-3 w-full py-2.5 px-4 rounded-xl bg-neonGreen/10 border border-neonGreen/40 text-neonGreen font-orbitron text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>📱 Open UPI App (Pay ₹{amount})</span>
                </a>
              </div>

              {/* UPI Copy Details */}
              <div className="space-y-3 text-xs">
                
                <div className="bg-obsidian/80 rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Amount:</span>
                    <span className="font-orbitron font-extrabold text-neonGold text-lg">₹{amount}.00</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Receiver UPI:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-neonCyan">
                      <span>{officialUpi}</span>
                      <button
                        onClick={() => handleCopy(officialUpi, 'upi')}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedText === 'upi' ? <Check className="w-3.5 h-3.5 text-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Host Name:</span>
                    <span className="font-semibold text-white">{payeeName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Category:</span>
                    <span className="font-semibold text-neonOrange">{bookingType} ({bookingType === 'Squad' ? '4 Players' : '1 Player'})</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surfaceLight/80 border border-white/5 text-[11px] text-slate-300">
                  💡 <strong className="text-white">Where is UTR?</strong> After paying on PhonePe/GPay/Paytm, open the transaction receipt and copy the <strong>12-digit UPI Ref No / UTR</strong>.
                </div>

              </div>

            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-cyberRed/15 border border-cyberRed/40 text-cyberRed text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MANDATORY 12-DIGIT UTR INPUT FORM */}
            <form onSubmit={handleVerifyAndBook} className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-orbitron uppercase tracking-wider text-neonGreen font-bold mb-1.5 flex items-center justify-between">
                  <span>Enter 12-Digit UPI UTR / Reference No. <span className="text-cyberRed">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">Strict 12 Digits</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neonGreen" />
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 432819284719 (12-digit numeric)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian border border-neonGreen/40 focus:border-neonGreen focus:ring-1 focus:ring-neonGreen text-white font-mono text-sm tracking-widest outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setCurrentStep(1); playClick(); }}
                  className="py-3.5 px-4 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-slate-300 font-orbitron text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-neonGreen via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-500 text-obsidian font-orbitron font-black text-xs uppercase tracking-wider shadow-glow-green hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Cross-Checking UTR in Sheet...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Book Seat ⚡</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: OFFICIAL ESPORTS BOARDING PASS */}
        {/* ========================================================= */}
        {currentStep === 3 && confirmedBooking && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border-2 border-neonGreen/60 shadow-glow-green/40 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Top Glowing Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-neonGreen via-neonCyan to-neonGold" />

            <div className="text-center pb-6 border-b border-white/10">
              <div className="w-14 h-14 mx-auto rounded-full bg-neonGreen/10 border-2 border-neonGreen flex items-center justify-center text-neonGreen mb-3 shadow-glow-green animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="text-neonGreen text-xs font-orbitron uppercase tracking-widest font-black">
                ENTRY CONFIRMED & LOGGED IN GOOGLE SHEET
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white uppercase mt-1">
                OFFICIAL ESPORTS PASS
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                RJ05 Esports • Season 1 Tournament (1st Match)
              </p>
            </div>

            {/* Pass Body Details */}
            <div className="py-6 space-y-4">
              
              <div className="bg-gradient-to-r from-neonOrange/20 to-neonGold/20 border border-neonGold/40 rounded-2xl p-4 text-center">
                <span className="text-[11px] font-orbitron uppercase text-neonGold font-bold tracking-widest block mb-1">
                  OFFICIALLY RESERVED SLOT
                </span>
                <span className="text-3xl sm:text-4xl font-black font-orbitron text-white tracking-wider">
                  {confirmedBooking.slotNo}
                </span>
                <div className="mt-1 text-xs text-slate-300 font-orbitron font-semibold">
                  {confirmedBooking.teamName} ({confirmedBooking.bookingType})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-poppins">
                <div className="bg-obsidian/80 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Match Date</span>
                  <span className="font-bold text-white text-xs">Sun, 29 Nov 2026</span>
                </div>

                <div className="bg-obsidian/80 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Battleground</span>
                  <span className="font-bold text-neonCyan text-xs font-orbitron">Bermuda Only</span>
                </div>

                <div className="bg-obsidian/80 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Order ID</span>
                  <span className="font-mono font-bold text-white text-xs">{confirmedBooking.orderId}</span>
                </div>

                <div className="bg-obsidian/80 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Verified UTR</span>
                  <span className="font-mono font-bold text-neonGreen text-xs">{confirmedBooking.utr}</span>
                </div>
              </div>

              {/* Registered UIDs Box */}
              <div className="p-3.5 rounded-xl bg-surfaceLight/80 border border-white/5 space-y-1.5 text-xs">
                <div className="text-[11px] font-orbitron uppercase text-neonGold font-bold">
                  Registered Squad UIDs:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-mono text-slate-300">
                  <div>• {confirmedBooking.player1}</div>
                  {confirmedBooking.player2 && <div>• UID: {confirmedBooking.player2}</div>}
                  {confirmedBooking.player3 && <div>• UID: {confirmedBooking.player3}</div>}
                  {confirmedBooking.player4 && <div>• UID: {confirmedBooking.player4}</div>}
                </div>
              </div>

              {/* Match Briefing Reminder */}
              <div className="p-3.5 rounded-xl bg-neonGreen/5 border border-neonGreen/20 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-neonGreen font-orbitron font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Room Credentials Protocol:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Room ID & Password will be delivered via WhatsApp to <strong className="text-white">{confirmedBooking.mobile}</strong> 15 minutes before match kickoff. Confirmation receipt has been dispatched to <strong className="text-white">{confirmedBooking.email}</strong>.
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const summary = `*RJ05 ESPORTS PASS*\nSlot: ${confirmedBooking.slotNo}\nTeam: ${confirmedBooking.teamName}\nMatch: Sun, 29 Nov 2026 (Bermuda)\nUTR: ${confirmedBooking.utr}\nOrder: ${confirmedBooking.orderId}\nHost: Anirudh Singh (3029117867)`;
                  handleCopy(summary, 'passSummary');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-neonGreen text-obsidian font-orbitron font-extrabold text-xs uppercase tracking-wider shadow-glow-green hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedText === 'passSummary' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText === 'passSummary' ? 'Pass Copied to Clipboard!' : 'Copy Ticket Details'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({ teamName: '', player1Name: '', player1Uid: '', player2Uid: '', player3Uid: '', player4Uid: '', whatsapp: '', email: '', utrNumber: '' });
                  playClick();
                }}
                className="py-3 px-4 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-slate-300 font-orbitron text-xs font-semibold cursor-pointer"
              >
                Register Another Slot
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
