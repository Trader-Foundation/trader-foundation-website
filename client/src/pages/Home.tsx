/*
 * Home Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Sections flow: Navigation → Hero → Stats → CTA → Meet Vlad → CTA → Podcast → CTA → Footer
 * CTA frequency modeled after GOAT Academy - after every major section
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MeetVladSection from '@/components/MeetVladSection';
import MasterclassCTA from '@/components/MasterclassCTA';
import PodcastSection from '@/components/PodcastSection';
import Footer from '@/components/Footer';

import EbookPopup from '@/components/EbookPopup';


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />

      {/* CTA after Stats - dark variant, no text, just the button */}
      <MasterclassCTA
        variant="dark"
        headline="See How Busy Professionals Are Learning to Trade"
        subtext="Watch our free masterclass and discover a proven swing trading strategy that fits into your schedule."
      />

      <MeetVladSection />

      {/* CTA after Meet Vlad + TrustPilot reviews - light variant to contrast */}
      <MasterclassCTA
        variant="light"
        headline="Ready to Start Your Trading Journey?"
        subtext="Join 1,200+ professionals who chose mentorship over shortcuts."
      />

      <PodcastSection />

      {/* CTA after Podcast - gold accent, final push before footer */}
      <MasterclassCTA
        variant="dark"
        headline="Your Next Step Starts Here"
        subtext="Watch the masterclass to see if Trader Foundation is the right fit for you."
      />

      <Footer />
      <EbookPopup />

    </div>
  );
}
