/*
 * Home Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Sections flow: Navigation → Hero → Stats → About → Programs → Results → CTA → Footer
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MeetVladSection from '@/components/MeetVladSection';
import ProgramsSection from '@/components/ProgramsSection';
import ResultsSection from '@/components/ResultsSection';
import PodcastSection from '@/components/PodcastSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <MeetVladSection />
      <ProgramsSection />
      <ResultsSection />
      <PodcastSection />
      <CTASection />
      <Footer />
    </div>
  );
}
