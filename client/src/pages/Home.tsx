/*
 * Home Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Sections flow: Navigation → Hero → Stats → Meet Vlad → Results → Podcast → Footer
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MeetVladSection from '@/components/MeetVladSection';
import PodcastSection from '@/components/PodcastSection';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import EbookPopup from '@/components/EbookPopup';


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <MeetVladSection />
      <PodcastSection />
      <ContactSection />
      <Footer />
      <EbookPopup />

    </div>
  );
}
