/*
 * Home Page — Trader Foundation Academy
 * Design: "The Academy" — Ivy League Digital Campus
 * Sections flow: Navigation → Hero → Stats → About → Programs → Results → CTA → Footer
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';
import ResultsSection from '@/components/ResultsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProgramsSection />
      <ResultsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
