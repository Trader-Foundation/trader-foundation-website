/*
 * Funnel tracking, scoped to the pages that opt in.
 *
 * Mirrors the tags the GoHighLevel funnel runs (GTM, Meta Pixel, Hyros) plus
 * Wistia player events pushed to the dataLayer, so video engagement is visible
 * in GA4/Meta instead of only inside Wistia.
 *
 * Rules this module follows, so a tracker can never take the page down:
 *  - every entry point is wrapped in try/catch and fails silently
 *  - each loader is idempotent, guarded on both a module flag and the DOM
 *  - nothing is removed on unmount, injecting twice is what would break things
 *  - no tracker is on the render path, the page paints with or without them
 */

const GTM_ID = 'GTM-MWWTB5DB';
const META_PIXEL_ID = '2170715166407053';
const HYROS_BASE = 'https://215935.t.hyros.com/v1/lst/universal-script';
const HYROS_KEY = 'ca9173df4485447e9b7db3bba27c9ccc2c7d49e82c26310da3d6b9f29b09ec9c';

/* Percentages reported once per video, per page view */
const MILESTONES = [25, 50, 75];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; push?: unknown; loaded?: boolean; version?: string };
    _fbq?: unknown;
    _wq?: unknown[];
  }
}

let gtmLoaded = false;
let pixelLoaded = false;
let hyrosLoaded = false;
let wistiaBound = false;

function safely(label: string, fn: () => void) {
  try {
    fn();
  } catch (error) {
    // A broken tag must never surface to the visitor.
    console.warn(`[tracking] ${label} failed`, error);
  }
}

export function pushDataLayer(payload: Record<string, unknown>) {
  safely('dataLayer push', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  });
}

function loadGtm() {
  if (gtmLoaded) return;
  gtmLoaded = true;

  const src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  if (document.querySelector(`script[src^="${src}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadMetaPixel() {
  if (pixelLoaded) return;
  pixelLoaded = true;

  if (!window.fbq) {
    const fbq: any = function (...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  window.fbq?.('init', META_PIXEL_ID);
  window.fbq?.('track', 'PageView');
}

function loadHyros() {
  if (hyrosLoaded) return;
  hyrosLoaded = true;

  if (document.querySelector(`script[src^="${HYROS_BASE}"]`)) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `${HYROS_BASE}?ph=${HYROS_KEY}&tag=!clicked&ref_url=${encodeURI(document.URL)}`;
  document.head.appendChild(script);
}

/*
 * Wistia hands every player on the page to this callback as it initialises.
 * Milestones are tracked per player so a rewatch does not double-count, and
 * the page path rides along on each event, which is what separates this page
 * from the GoHighLevel funnel sharing the same media IDs.
 */
function bindWistiaEvents() {
  if (wistiaBound) return;
  wistiaBound = true;

  window._wq = window._wq || [];
  window._wq.push({
    id: '_all',
    onReady: (video: any) => {
      safely('wistia bind', () => {
        const base = () => ({
          video_id: video.hashedId?.(),
          video_name: video.name?.(),
          video_duration: Math.round(video.duration?.() ?? 0),
          page_path: window.location.pathname,
        });

        const reached = new Set<number>();

        video.bind('play', () => {
          pushDataLayer({ event: 'wistia_play', ...base() });
        });

        video.bind('percentwatchedchanged', (percent: number) => {
          const watched = Math.floor(percent * 100);
          MILESTONES.forEach((milestone) => {
            if (watched >= milestone && !reached.has(milestone)) {
              reached.add(milestone);
              pushDataLayer({ event: `wistia_progress_${milestone}`, video_percent: milestone, ...base() });
            }
          });
        });

        video.bind('end', () => {
          pushDataLayer({ event: 'wistia_complete', video_percent: 100, ...base() });
        });
      });
    },
  });
}

/* Call once, from a page that wants the funnel tags. */
export function initFunnelTracking() {
  safely('gtm', loadGtm);
  safely('meta pixel', loadMetaPixel);
  safely('hyros', loadHyros);
  safely('wistia events', bindWistiaEvents);
}
