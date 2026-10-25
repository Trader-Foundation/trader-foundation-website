#!/usr/bin/env node
/**
 * kie.ai video generation test harness.
 *
 * Submits a text-to-video job to the kie.ai unified jobs API, polls until the
 * task finishes, and downloads the resulting mp4.
 *
 * Usage:
 *   export KIE_API_KEY=...            # never commit this
 *   node scripts/kie-video-test.mjs --prompt "a golden retriever surfing"
 *
 * Options:
 *   --prompt <text>     Prompt to render.       (default: a short test clip)
 *   --model <id>        kie.ai model id.        (default: kling-3.0/video)
 *   --duration <sec>    Clip length in seconds. (default: 5)
 *   --aspect <ratio>    16:9 | 9:16 | 1:1       (default: 16:9)
 *   --mode <mode>       std | pro               (default: std)
 *   --out <path>        Output file.            (default: ./kie-test-<taskId>.mp4)
 *   --no-sound          Disable generated audio.
 *
 * Docs: https://docs.kie.ai/market/kling/kling-3-0
 */

const BASE_URL = process.env.KIE_API_BASE_URL || 'https://api.kie.ai/api/v1';
const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 15 * 60_000;

function parseArgs(argv) {
  const opts = {
    prompt:
      'A slow cinematic push-in on a single cup of coffee on a wooden desk beside a laptop, warm morning light, shallow depth of field.',
    model: 'kling-3.0/video',
    duration: '5',
    aspect: '16:9',
    mode: 'std',
    out: null,
    sound: true,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--no-sound') {
      opts.sound = false;
      continue;
    }
    const key = arg.replace(/^--/, '');
    if (!(key in opts)) throw new Error(`Unknown option: ${arg}`);
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    opts[key] = value;
  }

  return opts;
}

async function callKie(apiKey, path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${response.status} from ${path}: ${text.slice(0, 500)}`);
  }

  // kie.ai returns a non-200 `code` in the body even when the HTTP status is 200.
  if (!response.ok || (payload.code !== undefined && payload.code !== 200)) {
    throw new Error(
      `kie.ai ${path} failed (http ${response.status}, code ${payload.code}): ${payload.msg || text.slice(0, 500)}`,
    );
  }

  return payload.data;
}

async function createTask(apiKey, opts) {
  const data = await callKie(apiKey, '/jobs/createTask', {
    method: 'POST',
    body: {
      model: opts.model,
      input: {
        prompt: opts.prompt,
        duration: String(opts.duration),
        aspect_ratio: opts.aspect,
        mode: opts.mode,
        sound: opts.sound,
      },
    },
  });

  if (!data?.taskId) throw new Error(`No taskId in create response: ${JSON.stringify(data)}`);
  return data.taskId;
}

/** resultJson arrives as a JSON-encoded string; pull the first result URL out of it. */
function extractResultUrl(record) {
  const raw = record.resultJson;
  if (!raw) return null;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return parsed?.resultUrls?.[0] ?? null;
}

async function pollUntilDone(apiKey, taskId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let lastState = null;

  while (Date.now() < deadline) {
    const record = await callKie(apiKey, `/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`);
    const state = record?.state;

    if (state !== lastState) {
      console.log(`  state: ${state}`);
      lastState = state;
    }

    if (state === 'success') return record;
    if (state === 'fail') throw new Error(`Generation failed: ${record.failMsg || 'no failMsg'}`);

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`Timed out after ${POLL_TIMEOUT_MS / 60_000} minutes waiting on task ${taskId}`);
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);

  const { writeFile } = await import('node:fs/promises');
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function main() {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    console.error('KIE_API_KEY is not set. Run: export KIE_API_KEY=your-key');
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));

  console.log(`Model:    ${opts.model}`);
  console.log(`Duration: ${opts.duration}s @ ${opts.aspect} (${opts.mode})`);
  console.log(`Prompt:   ${opts.prompt}\n`);

  const taskId = await createTask(apiKey, opts);
  console.log(`Task created: ${taskId}\nPolling every ${POLL_INTERVAL_MS / 1000}s...`);

  const record = await pollUntilDone(apiKey, taskId);
  const resultUrl = extractResultUrl(record);
  if (!resultUrl) throw new Error(`Task succeeded but no result URL: ${JSON.stringify(record)}`);

  console.log(`\nDone. Result URL (expires ~24h):\n  ${resultUrl}`);

  const destination = opts.out || `./kie-test-${taskId}.mp4`;
  await download(resultUrl, destination);
  console.log(`Saved to ${destination}`);
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
