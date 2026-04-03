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

      {/* CTA after Stats, dark variant, no text, just the button */}
      <MasterclassCTA
        variant="dark"
        headline="See How Busy Professionals Are Learning to Trade"
        subtext="Watch our free masterclass and discover a proven swing trading strategy that fits into your schedule."
      />

      <MeetVladSection />

      {/* CTA after Meet Vlad + TrustPilot reviews, light variant to contrast */}
      <MasterclassCTA
        variant="light"
        headline="Ready to Start Your Trading Journey?"
        subtext="Join 1,200+ professionals who chose mentorship over shortcuts."
      />

      <PodcastSection />

      {/* Final CTA - Book a Call */}
      <section className="py-16 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Your Next Step
          </p>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Ready to Talk? Book a Strategy Call
          </h2>
          <p
            className="text-white/60 text-base leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No pressure, no sales pitch. Just a transparent conversation with one of our team members to see if Trader Foundation is the right fit for you.
          </p>
          <a
            href="https://www.traderfoundation.co/trade"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a Free Strategy Call
          </a>
        </div>
      </section>

      <Footer />
      <EbookPopup />

    </div>
  );
}
