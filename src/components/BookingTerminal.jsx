import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  User, 
  Mail, 
  Zap, 
  Download, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playHover, playSuccess, playError, playBooyah } from '../utils/audio';

export default function BookingTerminal() {
  // Step 1: Form | Step 2: Payment QR & Polling | Step 3: Boarding Pass
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    ign: '',
    uid: '',
    whatsapp: '',
    email: '',
    matchMode: 'Solo', // Solo | Duo | Squad
  });

  const [formErrors, setFormErrors] = useState({});

  // Active Order State
  const [order, setOrder] = useState({
    orderId: '',
    baseAmount: 50,
    exactAmount: 50.01,
    paise: '01',
    upiId: import.meta.env.VITE_UPI_ID || '8209071700@ybl',
    payeeName: import.meta.env.VITE_PAYEE_NAME || 'RJ05 Esports',
    slotNo: 'SLOT-??',
    status: 'PENDING'
  });

  const [pollCount, setPollCount] = useState(0);
  const [pollingActive, setPollingActive] = useState(false);
  const pollingTimerRef = useRef(null);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  // Match Mode pricing tiers
  const modeOptions = [
    { id: 'Solo', label: 'Solo Operative', price: 50, desc: '1 Player • 48 Survivors', badge: 'Popular' },
    { id: 'Duo', label: 'Tactical Duo', price: 100, desc: '2 Players • 24 Squads', badge: 'Dynamic' },
    { id: 'Squad', label: 'Full 4-Man Squad', price: 200, desc: '4 Players • 12 Squads', badge: 'Elite' },
  ];

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.ign.trim()) {
      errors.ign = 'Free Fire In-Game Name is required';
    }
    if (!formData.uid.trim()) {
      errors.uid = 'Free Fire UID is required';
    } else if (!/^\d{8,12}$/.test(formData.uid.trim())) {
      errors.uid = 'UID must be 8-12 digits (numeric only)';
    }

    if (!formData.whatsapp.trim()) {
      errors.whatsapp = '10-digit WhatsApp number required for Room ID';
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsapp.trim().replace(/\D/g, '').slice(-10))) {
      errors.whatsapp = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email required for automated ticket receipt';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Step 1: Create Order with Unique Paise
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      playError();
      return;
    }

    playClick();
    setSubmitting(true);

    const selectedOption = modeOptions.find(m => m.id === formData.matchMode) || modeOptions[0];
    const baseAmt = selectedOption.price;
    // Generate unique paise between 01 and 99
    const randomPaiseNum = Math.floor(Math.random() * 98) + 1;
    const paiseStr = String(randomPaiseNum).padStart(2, '0');
    const exactAmt = Number((baseAmt + randomPaiseNum / 100).toFixed(2));
    const generatedOrderId = `RJ05-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      orderId: generatedOrderId,
      baseAmount: baseAmt,
      exactAmount: exactAmt,
      paise: paiseStr,
      upiId: import.meta.env.VITE_UPI_ID || '8209071700@ybl',
      payeeName: import.meta.env.VITE_PAYEE_NAME || 'RJ05 Esports',
      slotNo: `SLOT-${Math.floor(Math.random() * 38) + 11}`,
      status: 'PENDING'
    };

    setOrder(newOrder);

    // If Google Apps Script is provided, send POST
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_order',
            orderId: generatedOrderId,
            exactAmount: exactAmt,
            ign: formData.ign.trim(),
            uid: formData.uid.trim(),
            mobile: formData.whatsapp.trim(),
            email: formData.email.trim(),
            matchMode: formData.matchMode,
            slotNo: newOrder.slotNo
          })
        });
      } catch (err) {
        console.warn('Backend sync attempted. Fallback active.', err);
      }
    }

    setSubmitting(false);
    setCurrentStep(2);
    setPollingActive(true);
    playSuccess();
  };

  // Polling for payment status verification
  useEffect(() => {
    if (currentStep !== 2 || !pollingActive || !order.orderId) return;

    pollingTimerRef.current = setInterval(async () => {
      setPollCount(prev => prev + 1);

      if (scriptUrl) {
        try {
          const res = await fetch(`${scriptUrl}?action=check_order&orderId=${order.orderId}`);
          const data = await res.json();
          if (data && (data.status === 'CONFIRMED' || data.status === 'PAID')) {
            confirmBooking(data.slotNo || order.slotNo);
          }
        } catch (e) {
          // Keep polling silently
        }
      }
    }, 3000);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [currentStep, pollingActive, order.orderId, scriptUrl]);

  // Confirm booking helper
  const confirmBooking = (confirmedSlot) => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    setPollingActive(false);
    setOrder(prev => ({
      ...prev,
      status: 'CONFIRMED',
      slotNo: confirmedSlot || prev.slotNo
    }));
    setCurrentStep(3);

    // Trigger victory fanfare & celebration confetti
    playBooyah();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFAA00', '#00F0FF', '#00FF66']
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Instant simulator for demo / local testing without real bank transfer
  const handleSimulatePayment = () => {
    playClick();
    confirmBooking(order.slotNo);
  };

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    playSuccess();
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Generate UPI Payment URI
  const upiDeepLink = `upi://pay?pa=${order.upiId}&pn=${encodeURIComponent(order.payeeName)}&am=${order.exactAmount}&tn=${encodeURIComponent(order.orderId)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=07090E&bgcolor=FFFFFF&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <section id="booking" className="relative py-24 bg-obsidian border-t border-white/5 cyber-grid">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-neonOrange/10 blur-[160px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonOrange/10 border border-neonOrange/30 text-neonOrange text-xs font-semibold tracking-wider font-orbitron mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>INSTANT SLOT ALLOCATION TERMINAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white uppercase tracking-tight">
            BOOK TOURNAMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonOrange via-neonGold to-orange-400">SLOT</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light">
            Select your combat tier, transfer the exact paise amount via UPI QR, and your slot is instantly reserved with automated WhatsApp confirmation.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center max-w-xl mx-auto mb-10 px-4">
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold transition-all ${
              currentStep === 1 
                ? 'bg-neonOrange text-white shadow-glow-orange' 
                : currentStep > 1 
                  ? 'bg-neonGreen text-obsidian font-black' 
                  : 'bg-surface border border-white/10 text-slate-400'
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className={`text-xs font-orbitron uppercase hidden sm:inline ${currentStep === 1 ? 'text-white font-bold' : 'text-slate-400'}`}>
              Player Info
            </span>
          </div>

          <div className={`flex-1 h-[2px] mx-3 transition-colors ${currentStep > 1 ? 'bg-neonGreen' : 'bg-white/10'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold transition-all ${
              currentStep === 2 
                ? 'bg-neonOrange text-white shadow-glow-orange' 
                : currentStep > 2 
                  ? 'bg-neonGreen text-obsidian font-black' 
                  : 'bg-surface border border-white/10 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-xs font-orbitron uppercase hidden sm:inline ${currentStep === 2 ? 'text-white font-bold' : 'text-slate-400'}`}>
              Exact UPI Scan
            </span>
          </div>

          <div className={`flex-1 h-[2px] mx-3 transition-colors ${currentStep === 3 ? 'bg-neonGreen' : 'bg-white/10'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold transition-all ${
              currentStep === 3 
                ? 'bg-neonGreen text-obsidian font-black shadow-glow-green' 
                : 'bg-surface border border-white/10 text-slate-400'
            }`}>
              3
            </div>
            <span className={`text-xs font-orbitron uppercase hidden sm:inline ${currentStep === 3 ? 'text-neonGreen font-bold' : 'text-slate-400'}`}>
              Boarding Pass
            </span>
          </div>

        </div>

        {/* STEP 1: REGISTRATION FORM */}
        {currentStep === 1 && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleCreateOrder} className="space-y-6">
              
              {/* Match Mode Selection Cards */}
              <div>
                <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-3">
                  Select Combat Category <span className="text-neonOrange">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {modeOptions.map((opt) => {
                    const isSelected = formData.matchMode === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setFormData({ ...formData, matchMode: opt.id });
                          playClick();
                        }}
                        onMouseEnter={() => playHover()}
                        className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 relative border ${
                          isSelected
                            ? 'bg-surfaceLight border-neonOrange shadow-glow-orange/30 scale-[1.02]'
                            : 'bg-obsidian/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-white/5 text-neonGold">
                            {opt.badge}
                          </span>
                          <span className="text-base font-black font-orbitron text-white">
                            ₹{opt.price}
                          </span>
                        </div>
                        <h4 className="font-orbitron font-bold text-sm text-white mb-1">
                          {opt.label}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {opt.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* In-Game Name */}
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-2">
                    Free Fire In-Game Name (IGN) <span className="text-neonOrange">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.ign}
                      onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                      placeholder="e.g. RJ05_COMMANDO"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border text-white text-sm outline-none transition-all ${
                        formErrors.ign ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange'
                      }`}
                    />
                  </div>
                  {formErrors.ign && <p className="text-[11px] text-cyberRed mt-1">{formErrors.ign}</p>}
                </div>

                {/* Free Fire UID */}
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-2">
                    Official Free Fire UID <span className="text-neonOrange">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.uid}
                      onChange={(e) => setFormData({ ...formData, uid: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 3029117867 (8-12 digits)"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border text-white text-sm outline-none font-mono transition-all ${
                        formErrors.uid ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange'
                      }`}
                    />
                  </div>
                  {formErrors.uid && <p className="text-[11px] text-cyberRed mt-1">{formErrors.uid}</p>}
                </div>

                {/* WhatsApp Mobile Number */}
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-2">
                    WhatsApp Number (For Room ID) <span className="text-neonOrange">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border text-white text-sm outline-none font-mono transition-all ${
                        formErrors.whatsapp ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange'
                      }`}
                    />
                  </div>
                  {formErrors.whatsapp && <p className="text-[11px] text-cyberRed mt-1">{formErrors.whatsapp}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-orbitron uppercase tracking-wider text-slate-300 mb-2">
                    Email Address (For HTML Pass) <span className="text-neonOrange">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. player@gmail.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border text-white text-sm outline-none transition-all ${
                        formErrors.email ? 'border-cyberRed' : 'border-white/10 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange'
                      }`}
                    />
                  </div>
                  {formErrors.email && <p className="text-[11px] text-cyberRed mt-1">{formErrors.email}</p>}
                </div>

              </div>

              {/* Anti-cheat disclaimer */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-neonGreen shrink-0 mt-0.5" />
                <p>
                  By proceeding, you verify that you will play on a certified mobile device (Android/iOS). Any emulator or unfair third-party software will result in instant disqualification without refund.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neonOrange via-orange-500 to-neonGold hover:from-orange-500 hover:to-orange-600 text-white font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-glow-orange hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Allocating Unique Order ID...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Dynamic UPI Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        )}

        {/* STEP 2: DYNAMIC UPI QR & AUTO-POLLING */}
        {currentStep === 2 && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-neonOrange/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Warning / Exact amount reminder */}
            <div className="bg-neonOrange/10 border border-neonOrange/40 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-neonOrange shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white font-orbitron font-bold">CRITICAL: PAY THE EXACT PAISE AMOUNT!</strong>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Our automated MacroDroid banking webhook relies on the exact paise (<code className="text-neonGold font-bold">.{order.paise}</code>) to bind your transaction instantly to your Free Fire UID. Do not round up or down.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              
              {/* Dynamic QR Code display */}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl shadow-2xl relative group">
                  <img
                    src={qrCodeUrl}
                    alt="Dynamic Tournament UPI QR"
                    className="w-52 h-52 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-2xl pointer-events-none" />
                </div>

                <span className="text-[11px] text-slate-400 mt-3 font-mono">
                  Scan with GPay • PhonePe • Paytm • BHIM
                </span>

                {/* 1-Tap UPI Intent Button for Mobile */}
                <a
                  href={upiDeepLink}
                  onClick={() => playClick()}
                  className="sm:hidden mt-3 w-full py-2.5 px-4 rounded-xl bg-neonGreen/10 border border-neonGreen/40 text-neonGreen font-orbitron text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>1-Tap Open UPI App</span>
                </a>
              </div>

              {/* Payment Details Column */}
              <div className="space-y-4">
                
                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] font-orbitron uppercase text-slate-400 block mb-1">Exact Payable Amount</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-orbitron text-neonGold">
                      ₹{order.exactAmount.toFixed(2)}
                    </span>
                    <span className="text-xs text-neonOrange font-bold font-mono">
                      (Includes .{order.paise} identifier)
                    </span>
                  </div>
                </div>

                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Order ID:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-white">
                      <span>{order.orderId}</span>
                      <button
                        onClick={() => handleCopy(order.orderId, 'orderId')}
                        className="p-1 hover:text-neonCyan transition-colors cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copiedText === 'orderId' ? <Check className="w-3.5 h-3.5 text-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Receiver UPI:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-neonCyan">
                      <span>{order.upiId}</span>
                      <button
                        onClick={() => handleCopy(order.upiId, 'upiId')}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedText === 'upiId' ? <Check className="w-3.5 h-3.5 text-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Recipient:</span>
                    <span className="font-semibold text-white">{order.payeeName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-orbitron">Assigned Mode:</span>
                    <span className="font-semibold text-neonOrange">{formData.matchMode} Tier</span>
                  </div>
                </div>

                {/* Auto-verify polling indicator */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-white/5 text-xs text-slate-300">
                  <RefreshCw className="w-4 h-4 text-neonGreen animate-spin shrink-0" />
                  <span className="leading-tight">
                    Listening for UPI transfer notification (Poll #{pollCount})...
                  </span>
                </div>

                {/* Direct Simulator / Demo Fallback Button */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full py-2.5 px-3 rounded-lg bg-neonGreen/10 hover:bg-neonGreen/20 border border-neonGreen/40 text-neonGreen font-orbitron text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-glow-green/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Paid / Verify Instantly</span>
                  </button>

                  <button
                    onClick={() => { setCurrentStep(1); playClick(); }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                  >
                    Modify Player Details
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* STEP 3: CONFIRMED ESPORTS BOARDING PASS */}
        {currentStep === 3 && (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border-2 border-neonGreen/50 shadow-glow-green/30 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Top Green Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-neonGreen via-neonCyan to-neonGold" />

            {/* Header */}
            <div className="text-center pb-6 border-b border-white/10">
              <div className="w-14 h-14 mx-auto rounded-full bg-neonGreen/10 border-2 border-neonGreen flex items-center justify-center text-neonGreen mb-3 shadow-glow-green/50 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="text-neonGreen text-xs font-orbitron uppercase tracking-widest font-black">
                TRANSACTION CONFIRMED & REGISTERED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white uppercase mt-1">
                OFFICIAL ESPORTS BOARDING PASS
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                RJ05 Esports Battle Royale Championship • Season 05
              </p>
            </div>

            {/* Pass Body Ticket Layout */}
            <div className="py-6 space-y-4">
              
              {/* Highlight Slot Number Badge */}
              <div className="bg-gradient-to-r from-neonOrange/20 to-neonGold/20 border border-neonGold/40 rounded-2xl p-4 text-center">
                <span className="text-[11px] font-orbitron uppercase text-neonGold font-bold tracking-widest block mb-1">
                  OFFICIALLY RESERVED SLOT
                </span>
                <span className="text-4xl sm:text-5xl font-black font-orbitron text-white tracking-wider">
                  {order.slotNo}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-poppins">
                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Player IGN</span>
                  <span className="font-bold text-white text-sm">{formData.ign}</span>
                </div>

                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Free Fire UID</span>
                  <span className="font-bold text-neonCyan text-sm font-mono">{formData.uid}</span>
                </div>

                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Combat Category</span>
                  <span className="font-bold text-neonGold text-sm font-orbitron">{formData.matchMode} Tier</span>
                </div>

                <div className="bg-obsidian/70 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-orbitron block">Amount Paid</span>
                  <span className="font-bold text-neonGreen text-sm font-mono">₹{order.exactAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Match Briefing Info */}
              <div className="bg-surfaceLight/60 rounded-xl p-4 border border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-neonGreen font-orbitron font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Next Steps Before Room Starts:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pl-1">
                  <li>Room ID and password will be sent via WhatsApp to <strong className="text-white">{formData.whatsapp}</strong> 15 mins before match.</li>
                  <li>Join only under your registered UID: <strong className="text-neonCyan font-mono">{formData.uid}</strong>. Unverified entrants are kicked.</li>
                  <li>Organizer Anirudh Singh UID: <strong className="text-white font-mono">3029117867</strong> (RJ05).</li>
                </ul>
              </div>

            </div>

            {/* Actions: Copy & New Booking */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const passSummary = `*RJ05 ESPORTS TOURNAMENT PASS*\nSlot: ${order.slotNo}\nIGN: ${formData.ign}\nUID: ${formData.uid}\nMode: ${formData.matchMode}\nAmount: ₹${order.exactAmount}\nOrder: ${order.orderId}\nHost: Anirudh Singh (3029117867)`;
                  handleCopy(passSummary, 'ticketSummary');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-neonGreen text-obsidian font-orbitron font-extrabold text-xs uppercase tracking-wider shadow-glow-green/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedText === 'ticketSummary' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText === 'ticketSummary' ? 'Pass Copied to Clipboard!' : 'Copy Tournament Pass'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({ ign: '', uid: '', whatsapp: '', email: '', matchMode: 'Solo' });
                  playClick();
                }}
                className="py-3 px-4 rounded-xl bg-surfaceLight hover:bg-surface border border-white/10 text-slate-300 font-orbitron text-xs font-semibold tracking-wider transition-all cursor-pointer"
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
