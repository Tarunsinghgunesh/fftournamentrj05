import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroArena from './components/HeroArena';
import AboutAndCharacterCards from './components/AboutAndCharacterCards';
import LiveSearchAndRoster from './components/LiveSearchAndRoster';
import BookingTerminal from './components/BookingTerminal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Flame, Trophy } from 'lucide-react';
import { playClick } from './utils/audio';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenSearch = () => {
    // When Navbar search button is clicked
    setSearchQuery('3029117867');
  };

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-poppins relative selection:bg-neonOrange selection:text-white">
      {/* Top sticky navbar */}
      <Navbar onOpenSearch={handleOpenSearch} />

      {/* Main gaming portal content */}
      <main className="flex-1">
        {/* Hero Section with Live Countdown, Host UID, Prize Pool */}
        <HeroArena />

        {/* Immersive Gaming Experience: Fair Play, Alok/Chrono/Kelly/Wukong cards, Maps */}
        <AboutAndCharacterCards />

        {/* Live Search & Verified Player Lookup */}
        <LiveSearchAndRoster externalSearchQuery={searchQuery} />

        {/* 3-Step Automated Slot Booking & Dynamic UPI QR System */}
        <BookingTerminal />

        {/* Organizer Headquarters & Support Query Form */}
        <ContactSection />
      </main>

      {/* Official Footer with Rules & Agency Credit */}
      <Footer />

      {/* Floating Quick Action CTA for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <a
          href="#booking"
          onClick={() => playClick()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-neonOrange to-orange-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-orange border border-white/20"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>Book Slot</span>
        </a>
      </div>
    </div>
  );
}
