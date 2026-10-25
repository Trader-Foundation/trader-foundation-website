import { getVideoTaskStatus } from "../_lib/kie.js";

interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const taskId = req.query.taskId;
  if (typeof taskId !== "string" || taskId.trim().length === 0) {
    res.status(400).json({ error: "taskId query parameter is required" });
    return;
  }

  try {
    const status = await getVideoTaskStatus(taskId);
    res.status(200).json(status);
  } catch (error) {
    res.status(502).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch video status",
    });
  }
}
