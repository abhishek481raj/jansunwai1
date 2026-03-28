import React, { useState } from 'react';
import TricolorStrip from '../components/TricolorStrip';
import GovIdentityBar from '../components/GovIdentityBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchCard from '../components/SearchCard';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import DepartmentsSection from '../components/DepartmentsSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTABanner from '../components/CTABanner';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function LandingPage() {
  const [textSize, setTextSize] = useState(100);
  const [showAccessModal, setShowAccessModal] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: 'smooth' }}>
      <TricolorStrip />
      <GovIdentityBar
        textSize={textSize}
        onTextSizeChange={setTextSize}
        onScreenReaderClick={() => setShowAccessModal(true)}
      />
      <Navbar />
      <main>
        <HeroSection />
        <SearchCard />
        <StatsSection />
        <HowItWorks />
        <DepartmentsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTABanner />
        <FAQSection />
      </main>
      <Footer />
      <ScrollToTop />

      {showAccessModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowAccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0C2340]">Accessibility Features</h2>
              <button
                onClick={() => setShowAccessModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li>Compatible with JAWS, NVDA, VoiceOver screen readers</li>
              <li>Use Tab key to navigate interactive elements</li>
              <li>Use Enter/Space to activate buttons</li>
              <li>A- A A+ buttons to resize text</li>
              <li>Keyboard-only navigation supported</li>
              <li>High contrast colors for readability</li>
            </ul>
            <button
              onClick={() => setShowAccessModal(false)}
              className="mt-6 bg-[#FF9933] text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-[#E8870D] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
