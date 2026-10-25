import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express, { type Express } from "express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";
import { registerOAuthRoutes } from "./oauth";
import { sdk } from "./sdk";

/**
 * Builds the Express app with all API routes (OAuth, streaming chat, tRPC).
 * Used by the self-hosted server (server/_core/index.ts, which adds Vite/static
 * serving and listens) and by the Vercel serverless entry (server/vercelEntry.ts).
 */
export function createApp(): Express {
  const app = express();
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Streaming chatbot endpoint (bypasses tRPC for SSE)
  app.post("/api/chat/stream", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user && ENV.oAuthServerUrl) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    } catch {
      // No OAuth server configured → open local mode (matches createContext).
      if (ENV.oAuthServerUrl) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message required" });
      return;
    }

    const { buildChatMessages } = await import("../routers");
    const messages = buildChatMessages(message, history || []);

    const startStream = () => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();
    };
    const sendChunk = (content: string) =>
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    const endStream = () => {
      res.write("data: [DONE]\n\n");
      res.end();
    };

    const anthropicKey = process.env.ANTHROPIC_API_KEY ?? "";
    const hasForge = Boolean(ENV.forgeApiKey);

    // No LLM provider configured → stream a friendly notice instead of erroring.
    if (!anthropicKey && !hasForge) {
      startStream();
      sendChunk(
        "AI chat is currently disabled — no LLM provider is configured on the server. " +
          "Set the ANTHROPIC_API_KEY environment variable to enable it. " +
          "All market data features of the terminal work without it."
      );
      endStream();
      return;
    }

    let upstream: Response;
    let parseDelta: (data: string) => string | null;

    if (anthropicKey) {
      // Anthropic Messages API streaming
      const systemText = messages
        .filter((m: any) => m.role === "system")
        .map((m: any) => m.content)
        .join("\n\n");
      const chatMessages = messages
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .map((m: any) => ({ role: m.role, content: m.content }));

      upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 4096,
          system: systemText || undefined,
          messages: chatMessages,
          stream: true,
        }),
      });
      parseDelta = data => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            return parsed.delta.text ?? null;
          }
        } catch {}
        return null;
      };
    } else {
      // Manus Forge (OpenAI-compatible) streaming
      const apiUrl = ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
        ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
        : "https://forge.manus.im/v1/chat/completions";

      upstream = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${ENV.forgeApiKey}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages,
          max_tokens: 4096,
          thinking: { budget_tokens: 128 },
          stream: true,
        }),
      });
      parseDelta = data => {
        try {
          const parsed = JSON.parse(data);
          return parsed.choices?.[0]?.delta?.content ?? null;
        } catch {}
        return null;
      };
    }

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("[Chat Stream] LLM error:", upstream.status, errText);
      res.status(500).json({ error: "LLM error" });
      return;
    }

    startStream();

    const reader = (upstream.body as any).getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;
          const content = parseDelta(data);
          if (content) sendChunk(content);
        }
      }
    } catch (err) {
      console.error("[Chat Stream] Read error:", err);
    }

    endStream();
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
