import {
  createVideoTask,
  type KieAspectRatio,
  type KieVideoModel,
} from "../_lib/kie.js";

interface VercelRequest {
  method?: string;
  body?: any;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

const VALID_MODELS: KieVideoModel[] = ["veo3_fast", "veo3", "veo3_lite"];
const VALID_ASPECT_RATIOS: KieAspectRatio[] = ["16:9", "9:16"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt, model, aspectRatio, imageUrls, watermark } = req.body ?? {};

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }
  if (model !== undefined && !VALID_MODELS.includes(model)) {
    res
      .status(400)
      .json({ error: `model must be one of ${VALID_MODELS.join(", ")}` });
    return;
  }
  if (aspectRatio !== undefined && !VALID_ASPECT_RATIOS.includes(aspectRatio)) {
    res.status(400).json({
      error: `aspectRatio must be one of ${VALID_ASPECT_RATIOS.join(", ")}`,
    });
    return;
  }

  try {
    const taskId = await createVideoTask({
      prompt,
      model,
      aspectRatio,
      imageUrls,
      watermark,
    });
    res.status(200).json({ taskId });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : "Video generation failed",
    });
  }
}
