#!/usr/bin/env node
// Standalone CLI to generate a video via Kie.ai without going through the
// deployed API routes. Usage:
//   KIE_API_KEY=... node scripts/generate-video.mjs "a dog surfing at sunset"
//   node --env-file=.env scripts/generate-video.mjs "..." --aspect 9:16

const KIE_API_BASE_URL = process.env.KIE_API_BASE_URL ?? "https://api.kie.ai";
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

function parseArgs(argv) {
  const args = { prompt: undefined, aspectRatio: "16:9", model: "veo3_fast" };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--aspect") {
      args.aspectRatio = argv[++i];
    } else if (arg === "--model") {
      args.model = argv[++i];
    } else {
      positional.push(arg);
    }
  }
  args.prompt = positional.join(" ");
  return args;
}

function requireApiKey() {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    console.error("Error: KIE_API_KEY environment variable is not set.");
    process.exit(1);
  }
  return apiKey;
}

async function kieRequest(path, init = {}) {
  const response = await fetch(`${KIE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await response.json();
  if (!response.ok || body.code >= 400) {
    throw new Error(
      body.msg || `Kie.ai request failed with status ${response.status}`
    );
  }
  return body.data;
}

async function main() {
  const { prompt, aspectRatio, model } = parseArgs(process.argv.slice(2));
  if (!prompt) {
    console.error(
      'Usage: node scripts/generate-video.mjs "<prompt>" [--aspect 16:9|9:16] [--model veo3_fast|veo3|veo3_lite]'
    );
    process.exit(1);
  }

  console.log(`Submitting video generation task ("${prompt}")...`);
  const { taskId } = await kieRequest("/api/v1/veo/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, model, aspect_ratio: aspectRatio }),
  });
  console.log(`Task created: ${taskId}`);

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    const data = await kieRequest(
      `/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`
    );

    const resultUrls =
      data.response?.resultUrls ??
      (typeof data.resultJson === "string"
        ? JSON.parse(data.resultJson).resultUrls
        : data.resultJson?.resultUrls);

    if (data.successFlag === 1 || data.state === "success") {
      console.log("Video ready:", resultUrls?.[0]);
      return;
    }
    if (
      data.successFlag === 2 ||
      data.successFlag === 3 ||
      data.state === "fail"
    ) {
      console.error(
        "Generation failed:",
        data.errorMessage ?? data.failMsg ?? "unknown error"
      );
      process.exit(1);
    }
    console.log("Still processing...");
  }

  console.error("Timed out waiting for video generation to complete.");
  process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
