/*
 * EbookPopup — Lead capture overlay
 * Design: Dark overlay with gold-accented modal
 * Shows on first visit, can be dismissed, reappears on next session
 * Embeds SproutCloud form for email capture
 */

import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, ArrowRight } from 'lucide-react';

export default function EbookPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const iframeLoaded = useRef(false);

  useEffect(() => {
    // Check if user has already dismissed the popup this session
    const dismissed = sessionStorage.getItem('ebook-popup-dismissed');
    if (dismissed) return;

    // Show popup after a short delay (2 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Load SproutCloud form embed script
  useEffect(() => {
    if (!isVisible || iframeLoaded.current) return;
    
    const existingScript = document.querySelector('script[src="https://link.sproutcloud.co/js/form_embed.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://link.sproutcloud.co/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
    iframeLoaded.current = true;
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('ebook-popup-dismissed', 'true');
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-lg transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal card */}
        <div
          className="overflow-hidden rounded-lg"
          style={{
            background: 'linear-gradient(165deg, #1a1a1a 0%, #111111 50%, #0d0d0d 100%)',
            border: '1px solid rgba(199, 171, 119, 0.25)',
            boxShadow: '0 0 60px rgba(199, 171, 119, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top gold accent line */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #c7ab77, transparent)' }} />

          {/* Content */}
          <div className="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
            {/* Badge */}
            <div className="mb-4 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded"
                style={{ backgroundColor: 'rgba(199, 171, 119, 0.12)' }}
              >
                <BookOpen className="h-4 w-4" style={{ color: '#c7ab77' }} />
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: '#c7ab77' }}
              >
                Free Download
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-2 font-heading text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: '#ffffff' }}
            >
              The 10% Stock Predator
              <span className="block" style={{ color: '#c7ab77' }}>
                Course E-Book
              </span>
            </h2>

            {/* Subtext */}
            <p className="mb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Learn what separates the 10% who profit from the 90% who lose.
              Get Vlad Tayman's complete guide to stock pattern recognition,
              candlestick charts, and options — <strong style={{ color: 'rgba(255,255,255,0.85)' }}>absolutely free.</strong>
            </p>

            {/* What's inside */}
            <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5">
              {['Pattern Recognition', 'Candlestick Charts', 'Options Strategy', 'Trading Psychology'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 flex-shrink-0" style={{ color: '#c7ab77' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SproutCloud Form Embed */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div
              className="overflow-hidden rounded"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(199, 171, 119, 0.1)',
              }}
            >
              <iframe
                src="https://link.sproutcloud.co/widget/form/zNekBbMTW3PeN6o7IEY0"
                style={{ width: '100%', height: '408px', border: 'none', borderRadius: '3px' }}
                id="inline-zNekBbMTW3PeN6o7IEY0"
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="erin new website form ebook signup"
                data-height="408"
                data-layout-iframe-id="inline-zNekBbMTW3PeN6o7IEY0"
                data-form-id="zNekBbMTW3PeN6o7IEY0"
                title="erin new website form ebook signup"
              />
            </div>
          </div>

          {/* Bottom subtle text */}
          <div
            className="border-t px-6 py-3 text-center sm:px-8"
            style={{ borderColor: 'rgba(199, 171, 119, 0.1)' }}
          >
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              By Vlad Tayman · Founder of Trader Foundation · 64 Pages · 5 Modules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
