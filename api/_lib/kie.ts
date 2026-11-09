const KIE_API_BASE_URL = process.env.KIE_API_BASE_URL ?? "https://api.kie.ai";

interface KieEnvelope<T> {
  code: number;
  msg: string;
  data: T;
}

export type KieVideoModel = "veo3_fast" | "veo3" | "veo3_lite";
export type KieAspectRatio = "16:9" | "9:16";

export interface GenerateVideoParams {
  prompt: string;
  model?: KieVideoModel;
  aspectRatio?: KieAspectRatio;
  imageUrls?: string[];
  watermark?: string;
  callBackUrl?: string;
}

export type VideoTaskState = "pending" | "processing" | "completed" | "failed";

export interface VideoTaskStatus {
  taskId: string;
  status: VideoTaskState;
  videoUrl?: string;
  error?: string;
}

function requireApiKey(): string {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    throw new Error("KIE_API_KEY environment variable is not set");
  }
  return apiKey;
}

async function kieRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${KIE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = (await response.json()) as KieEnvelope<T>;
  if (!response.ok || body.code >= 400) {
    throw new Error(
      body.msg || `Kie.ai request failed with status ${response.status}`
    );
  }
  return body.data;
}

export async function createVideoTask(
  params: GenerateVideoParams
): Promise<string> {
  const data = await kieRequest<{ taskId: string }>("/api/v1/veo/generate", {
    method: "POST",
    body: JSON.stringify({
      prompt: params.prompt,
      model: params.model ?? "veo3_fast",
      aspect_ratio: params.aspectRatio ?? "16:9",
      imageUrls: params.imageUrls,
      watermark: params.watermark,
      callBackUrl: params.callBackUrl,
    }),
  });
  return data.taskId;
}

// Kie.ai's status payload shape isn't fully confirmed against live docs in this
// environment (see PR description), so this reads defensively across the field
// names seen in current and historical API responses.
export async function getVideoTaskStatus(
  taskId: string
): Promise<VideoTaskStatus> {
  const data = await kieRequest<Record<string, any>>(
    `/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`,
    { method: "GET" }
  );

  const resultUrls: string[] | undefined =
    data.response?.resultUrls ??
    (typeof data.resultJson === "string"
      ? JSON.parse(data.resultJson).resultUrls
      : data.resultJson?.resultUrls);

  const isSuccess = data.successFlag === 1 || data.state === "success";
  const isFailure =
    data.successFlag === 2 || data.successFlag === 3 || data.state === "fail";

  if (isSuccess) {
    return { taskId, status: "completed", videoUrl: resultUrls?.[0] };
  }
  if (isFailure) {
    return {
      taskId,
      status: "failed",
      error: data.errorMessage ?? data.failMsg ?? "Video generation failed",
    };
  }
  if (data.state === "waiting") {
    return { taskId, status: "pending" };
  }
  return { taskId, status: "processing" };
}
