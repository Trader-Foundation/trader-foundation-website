import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Target,
  BookOpen,
  ChevronDown,
  Star,
  Users,
  Award,
  ArrowRight,
  Lock,
} from "lucide-react";

/* ─── Design: Art Deco Luxury Finance ───
   Black (#0A0A0A) canvas, Gold (#C9A84C) accents
   Cormorant Garamond for headlines (matching TF website), DM Sans for body
   Italic gold accent words, gold dividers, editorial scroll
─────────────────────────────────────────── */

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/GJkBSPF6kRYmJr8kzP9WTR/hero-bg-DJdLoHVYkPCKMDcScRyQVH.webp";
const BOOK_MOCKUP =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/GJkBSPF6kRYmJr8kzP9WTR/book-mockup-WokRcBHSKaSALgN6nESwKw.png";
const BULL_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/GJkBSPF6kRYmJr8kzP9WTR/bull-market-czzKDhvsTX565WP4LbGgwu.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
} as const;

function TFLogo({ className = "" }: { className?: string }) {
  return (
    <a href="https://trader.foundation" className={`flex flex-col leading-none ${className}`}>
      <span className="text-[#C9A84C] text-[10px] tracking-[0.35em] font-sans font-medium">TRADER</span>
      <span className="text-white text-[16px] tracking-[0.12em] font-sans font-bold">FOUNDATION</span>
    </a>
  );
}

function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#C9A84C]/60" />
      <div className="w-2 h-2 rotate-45 border border-[#C9A84C]/60" />
      <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#C9A84C]/60" />
    </div>
  );
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ number, label, icon: Icon }: { number: string; label: string; icon: any }) {
  return (
    <motion.div
      variants={fadeUp}
      className="text-center p-6 border border-[#C9A84C]/20 bg-[#0F0F0F] rounded-sm"
    >
      <Icon className="w-6 h-6 text-[#C9A84C] mx-auto mb-3" />
      <div className="font-serif text-3xl md:text-4xl font-bold text-[#C9A84C] mb-1">{number}</div>
      <div className="text-sm text-[#999] uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

function RuleCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex gap-5 p-5 border border-[#C9A84C]/15 bg-[#0C0C0C] rounded-sm hover:border-[#C9A84C]/40 transition-colors duration-300"
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-[#C9A84C]/40 text-[#C9A84C] font-serif text-lg font-bold rounded-sm">
        {number}
      </div>
      <div>
        <h3 className="font-serif text-lg text-white mb-1">{title}</h3>
        <p className="text-[#999] text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function StockRulebook() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.sproutcloud.co/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#CCCCCC] overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#C9A84C]/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <TFLogo />
          <button
            onClick={scrollToForm}
            className="px-5 py-2 bg-[#C9A84C] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#D4B05C] transition-colors rounded-sm"
          >
            GET THE RULE BOOK
          </button>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >

              <motion.h1
                variants={fadeUp}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                The Stock{" "}
                <span className="text-[#C9A84C] italic">Investing 101</span>{" "}
                Rule Book
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-[#AAAAAA] leading-relaxed mb-4 max-w-lg"
              >
                The exact system that took me from zero to{" "}
                <span className="text-white font-medium">CoastFIRE at 32</span>.
                No fluff. No jargon. Just the rules.
              </motion.p>

              <motion.div variants={fadeUp} className="mb-2">
                <p className="text-[#CCCCCC] font-medium">
                  By Erin Chawla | Trader Foundation Coach
                </p>
                <p className="text-[#888] text-sm mt-1">
                  Built on the teachings and methods of Vlad Tayman, Founder of Trader Foundation
                </p>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-[#777] text-sm mb-8 max-w-lg"
              >
                10 years in corporate finance. Over 1,200 students coached.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="group px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] font-bold text-base tracking-wide hover:bg-[#D4B05C] transition-all rounded-sm flex items-center justify-center gap-2"
                >
                  DOWNLOAD NOW
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

              </motion.div>
            </motion.div>

            {/* Right: Book Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-8 bg-[#C9A84C]/5 blur-3xl rounded-full" />
                <img
                  src={BOOK_MOCKUP}
                  alt="Stock Investing 101 Rule Book"
                  className="relative w-64 sm:w-72 md:w-80 lg:w-96 drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-[#C9A84C]/50 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 border-y border-[#C9A84C]/10">
        <AnimatedSection className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard number="32" label="CoastFIRE Age" icon={Award} />
          <StatCard number="1,200+" label="Students Coached" icon={Users} />
          <StatCard number="10" label="Years in Finance" icon={TrendingUp} />
          <StatCard number="8" label="Rules to Wealth" icon={BookOpen} />
        </AnimatedSection>
      </section>

      {/* ─── WHAT YOU'LL LEARN ─── */}
      <section className="py-20 md:py-28">
        <AnimatedSection className="max-w-5xl mx-auto px-4">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium">Inside the Rule Book</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              What You Will <span className="text-[#C9A84C] italic">Learn</span>
            </h2>
            <GoldDivider className="mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="p-8 border border-[#C9A84C]/15 bg-[#0C0C0C] rounded-sm">
              <Shield className="w-8 h-8 text-[#C9A84C] mb-4" />
              <h3 className="font-serif text-xl text-white">SPY Is Your Land</h3>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 border border-[#C9A84C]/15 bg-[#0C0C0C] rounded-sm">
              <Target className="w-8 h-8 text-[#C9A84C] mb-4" />
              <h3 className="font-serif text-xl text-white">The 10% Rule</h3>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 border border-[#C9A84C]/15 bg-[#0C0C0C] rounded-sm">
              <TrendingUp className="w-8 h-8 text-[#C9A84C] mb-4" />
              <h3 className="font-serif text-xl text-white">The Magnificent 7 Strategy</h3>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 border border-[#C9A84C]/15 bg-[#0C0C0C] rounded-sm">
              <Star className="w-8 h-8 text-[#C9A84C] mb-4" />
              <h3 className="font-serif text-xl text-white">The CoastFIRE Path</h3>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── THE PSYCHOLOGY SECTION ─── */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0">
          <img src={BULL_IMG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]/80" />
        </div>

        <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div variants={fadeUp}>
            <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium">The Truth Nobody Talks About</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-8">
              The Strategy Is Simple.<br />
              <span className="text-[#C9A84C] italic">The Mental Game Is Everything.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-6 text-lg text-[#BBBBBB] leading-relaxed">
            <p>
              Imagine your portfolio just dropped 25%. Your $100,000 is now $75,000. Every headline
              screams recession. Your spouse asks if you should sell. Your coworker already moved to cash.
              Social media is flooded with doom.
            </p>
            <p>
              And in that exact moment, the CoastFIRE Path says you should be <span className="text-white font-medium">buying more</span>.
            </p>
            <p>
              Can you do it? Can you look at a sea of red and click "buy" when every instinct screams sell?
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 p-6 border-l-2 border-[#C9A84C] bg-[#0F0F0F]/80"
          >
            <p className="text-[#C9A84C] font-serif text-xl italic">
              "This is where 95% of investors fail. Not because they do not know the strategy.
              But because the emotional pressure of watching your money disappear is one of the most
              psychologically difficult experiences a person can face."
            </p>
            <p className="text-[#888] mt-3 text-sm">
              Based on the teachings of Vlad Tayman, Founder of Trader Foundation
            </p>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ─── THE 8 RULES ─── */}
      <section className="py-20 md:py-28">
        <AnimatedSection className="max-w-3xl mx-auto px-4">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium">Your Blueprint</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              The 8 <span className="text-[#C9A84C] italic">Rules</span>
            </h2>
            <GoldDivider className="mt-6" />
          </motion.div>

          <div className="space-y-4">
            <RuleCard number="01" title="SPY Is Your Land" description="" />
          </div>

          {/* Blurred rules 2-8 with download overlay */}
          <div className="relative mt-4">
            <div className="space-y-4 blur-[6px] select-none pointer-events-none">
              <RuleCard number="02" title="Buy Every 10% Drop" description="" />
              <RuleCard number="03" title="Target the Mag 7 at 20 to 30% Off" description="" />
              <RuleCard number="04" title="Never Sell in a Panic" description="" />
              <RuleCard number="05" title="Let Compounding Work" description="" />
              <RuleCard number="06" title="Avoid Shortcuts" description="" />
              <RuleCard number="07" title="Follow the CoastFIRE Path" description="" />
              <RuleCard number="08" title="Get a Coach" description="" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
              <Lock className="w-10 h-10 text-[#C9A84C] mb-4" />
              <p className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 text-center">Want all 8 rules?</p>
              <p className="text-[#999] mb-6 text-center max-w-md">Download the free Rule Book to unlock the complete system</p>
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-[#C9A84C] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#D4AF37] transition-colors"
              >
                UNLOCK ALL 8 RULES
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── ABOUT ERIN ─── */}
      <section className="py-20 md:py-28 border-y border-[#C9A84C]/10">
        <AnimatedSection className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            <motion.div variants={fadeUp} className="md:col-span-3">
              <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium">About the Author</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-3 mb-6">
                From Corporate Finance to CoastFIRE at <span className="text-[#C9A84C] italic">32</span>
              </h2>
              <div className="space-y-4 text-[#BBBBBB] leading-relaxed">
                <p>
                  I did not come from money. What I did have was 10 years of experience in corporate
                  finance and a deep understanding of how numbers really work.
                </p>
                <p>
                  I was doing well on my own, but I was leaving money on the table. I had no idea about
                  charting. Then I found Trader Foundation and Vlad Tayman. The discipline, the charting, the structured
                  approach to the market supercharged everything. After 2020, it essentially 10x'd my growth.
                </p>
                <p>
                  Now I coach others through Trader Foundation because I have lived both sides. I know what
                  it is like to invest on gut feeling alone, and I know what it is like to invest with real
                  skill, discipline, and structure behind every decision.
                </p>
              </div>
              <p className="text-[#C9A84C] font-serif text-sm italic mt-6">
                Erin Chawla | Trader Foundation Coach
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="md:col-span-2 flex flex-col gap-4">
              <div className="p-5 border border-[#C9A84C]/20 bg-[#0C0C0C] rounded-sm text-center">
                <div className="font-serif text-2xl font-bold text-[#C9A84C]">CoastFIRE</div>
                <div className="text-sm text-[#888] mt-1">Reached at age 32</div>
              </div>
              <div className="p-5 border border-[#C9A84C]/20 bg-[#0C0C0C] rounded-sm text-center">
                <div className="font-serif text-2xl font-bold text-[#C9A84C]">10 Years</div>
                <div className="text-sm text-[#888] mt-1">Corporate Finance</div>
              </div>
              <div className="p-5 border border-[#C9A84C]/20 bg-[#0C0C0C] rounded-sm text-center">
                <div className="font-serif text-2xl font-bold text-[#C9A84C]">1,200+</div>
                <div className="text-sm text-[#888] mt-1">Students Coached</div>
              </div>

            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── EMAIL CAPTURE / SPROUT CLOUD FORM ─── */}
      <section ref={formRef} className="py-20 md:py-28 relative" id="get-the-book">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0D08] to-[#0A0A0A]" />

        <AnimatedSection className="relative z-10 max-w-2xl mx-auto px-4">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium">Pay Nothing</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Get Your <span className="text-[#C9A84C] italic">Copy</span> Now
            </h2>
            <p className="text-[#999] text-lg max-w-md mx-auto">
              Enter your email below and get the Stock Investing 101 Rule Book delivered straight to your inbox.
            </p>
            <GoldDivider className="mt-6" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border-2 border-[#C9A84C]/30 bg-[#0C0C0C] p-6 md:p-8 rounded-sm"
          >
            <iframe
              src="https://link.sproutcloud.co/widget/form/s97iDTPWvz2JFmgMrgRY"
              style={{ width: "100%", height: "412px", border: "none", borderRadius: "3px" }}
              id="inline-s97iDTPWvz2JFmgMrgRY"
              data-layout='{"id":"INLINE"}'
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="erin ebook youtube"
              data-height="412"
              data-layout-iframe-id="inline-s97iDTPWvz2JFmgMrgRY"
              data-form-id="s97iDTPWvz2JFmgMrgRY"
              title="Stock Investing 101 Rule Book"
            />
          </motion.div>

          <motion.p variants={fadeUp} className="text-center text-[#666] text-xs mt-4">
            Your information is secure. We respect your privacy.
          </motion.p>
        </AnimatedSection>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 border-t border-[#C9A84C]/10">
        <AnimatedSection className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Real <span className="text-[#C9A84C] italic">Wealth</span>?
            </h2>
            <p className="text-[#999] text-lg mb-8 max-w-xl mx-auto">
              The rule book gives you the playbook. Trader Foundation gives you the coaching,
              the charting skills, and the discipline to execute when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="group px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] font-bold text-base tracking-wide hover:bg-[#D4B05C] transition-all rounded-sm flex items-center justify-center gap-2"
              >
                GET THE RULE BOOK
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://trader.foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-[#C9A84C]/40 text-[#C9A84C] font-semibold text-base tracking-wide hover:bg-[#C9A84C]/10 transition-all rounded-sm"
              >
                VISIT TRADER FOUNDATION
              </a>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-[#C9A84C]/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <TFLogo />
            <div className="flex gap-6">
              <a href="https://trader.foundation" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#C9A84C] text-sm transition-colors">
                Website
              </a>
              <a href="https://youtube.com/@TheTraderFoundation" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#C9A84C] text-sm transition-colors">
                YouTube
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#C9A84C]/10 text-center">
            <p className="text-[#555] text-xs leading-relaxed max-w-2xl mx-auto">
              Disclaimer: This material is for educational purposes only and does not constitute financial advice.
              All investments carry risk, including the potential loss of principal. Past performance does not
              guarantee future results. Always consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
