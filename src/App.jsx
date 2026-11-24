import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroArena from './components/HeroArena';
import AboutAndCharacterCards from './components/AboutAndCharacterCards';
import LiveRosterAndSearch from './components/LiveRosterAndSearch';
import BookingTerminal from './components/BookingTerminal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Flame } from 'lucide-react';
import { playClick } from './utils/audio';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenSearch = () => {
    // When Search button in Navbar is clicked
    setSearchQuery('3029117867');
  };

  const handleBookingSuccess = () => {
    // Smooth scroll down to roster to see updated slot
    const rosterEl = document.getElementById('roster');
    if (rosterEl) {
      rosterEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-poppins relative selection:bg-neonOrange selection:text-white">
      {/* Sticky Glassmorphic Navbar */}
      <Navbar onOpenSearch={handleOpenSearch} />

      {/* Main Gaming Portal Content */}
      <main className="flex-1">
        {/* Hero Section with Season 1 Info, Bermuda Map, Countdown, Prize Pool */}
        <HeroArena />

        {/* 3D Character Meta Powers & Bermuda Only Map Showcase */}
        <AboutAndCharacterCards />

        {/* 100% Real-Time Live Telemetry Bar & Confirmed Roster (Zero Fake Data) */}
        <LiveRosterAndSearch externalSearch={searchQuery} />

        {/* Squad / Solo Booking Terminal with Dynamic UPI QR & Mandatory 12-Digit UTR Check */}
        <BookingTerminal onBookingSuccess={handleBookingSuccess} />

        {/* Organizer Desk with Real Photos, Free Fire MAX Profile, & Support Tickets */}
        <ContactSection />
      </main>

      {/* Official Rulebook & Mandatory "Made by TK Web Solutions" Footer Badge */}
      <Footer />

      {/* Floating Quick Action CTA for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <a
          href="#booking"
          onClick={() => playClick()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-neonOrange to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange border border-white/20 cursor-pointer"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>Book Slot</span>
        </a>
      </div>
    </div>
  );
}
