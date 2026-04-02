/*
 * LiveChatWidget - Persistent chat-style lead capture
 * Design: Gold chat bubble in bottom-right, opens to a chat-like panel
 * with a welcome message and the SproutCloud form embedded
 * Same form as the eBook popup - all contacts go to the same funnel
 */

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const scriptLoaded = useRef(false);

  // Load SproutCloud form embed script when widget opens
  useEffect(() => {
    if (!isOpen || scriptLoaded.current) return;

    const existingScript = document.querySelector(
      'script[src="https://link.sproutcloud.co/js/form_embed.js"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://link.sproutcloud.co/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
    scriptLoaded.current = true;
  }, [isOpen]);

  // Stop pulse animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowPulse(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9990] flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="mb-2 w-[360px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl shadow-2xl"
          style={{
            background: '#111111',
            border: '1px solid rgba(199, 171, 119, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(199, 171, 119, 0.05)',
            animation: 'chatSlideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
              borderBottom: '1px solid rgba(199, 171, 119, 0.15)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #c7ab77 0%, #a08a5c 100%)',
                }}
              >
                <span className="text-sm font-bold" style={{ color: '#111' }}>TF</span>
                {/* Online dot */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: '#22c55e',
                    border: '2px solid #111',
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#fff' }}>
                  Trader Foundation
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          </div>

          {/* Chat body */}
          <div className="px-5 py-4" style={{ backgroundColor: '#0d0d0d' }}>
            {/* Welcome message bubble */}
            <div className="mb-4">
              <div
                className="inline-block max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3"
                style={{
                  backgroundColor: 'rgba(199, 171, 119, 0.1)',
                  border: '1px solid rgba(199, 171, 119, 0.12)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Welcome to Trader Foundation! 👋
                </p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Have questions about our programs? Drop your info below and our team will reach out to you.
                </p>
              </div>
              <p className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Trader Foundation Team
              </p>
            </div>

            {/* SproutCloud Form Embed */}
            <div
              className="overflow-hidden rounded-lg"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(199, 171, 119, 0.08)',
              }}
            >
              <iframe
                src="https://link.sproutcloud.co/widget/form/zNekBbMTW3PeN6o7IEY0"
                style={{ width: '100%', height: '408px', border: 'none', borderRadius: '3px' }}
                id="chat-form-zNekBbMTW3PeN6o7IEY0"
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="erin new website form ebook signup"
                data-height="408"
                data-layout-iframe-id="chat-form-zNekBbMTW3PeN6o7IEY0"
                data-form-id="zNekBbMTW3PeN6o7IEY0"
                title="erin new website form ebook signup"
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center gap-2 px-5 py-2.5"
            style={{
              borderTop: '1px solid rgba(199, 171, 119, 0.1)',
              backgroundColor: '#111',
            }}
          >
            <Send className="h-3 w-3" style={{ color: 'rgba(199, 171, 119, 0.4)' }} />
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Powered by Trader Foundation
            </p>
          </div>
        </div>
      )}

      {/* Chat bubble button */}
      <button
        onClick={handleToggle}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #555 0%, #333 100%)'
            : 'linear-gradient(135deg, #c7ab77 0%, #a08a5c 100%)',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(199, 171, 119, 0.3)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: 'chatPulse 2s ease-out infinite',
              backgroundColor: 'rgba(199, 171, 119, 0.3)',
            }}
          />
        )}

        {isOpen ? (
          <X className="h-6 w-6" style={{ color: '#fff' }} />
        ) : (
          <MessageCircle className="h-6 w-6" style={{ color: '#111' }} />
        )}
      </button>

      {/* CSS animations */}
      <style>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes chatPulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
