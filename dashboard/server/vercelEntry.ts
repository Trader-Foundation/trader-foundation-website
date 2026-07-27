/**
 * Vercel serverless entry: exports the Express app (no listen, no Vite —
 * static assets are served by Vercel's CDN from the build output).
 * Bundled by scripts/build-vercel.sh into .vercel/output/functions/api.func/.
 */
import { createApp } from "./_core/app";

const app = createApp();

export default app;
