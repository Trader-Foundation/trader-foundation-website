// ============================================================
// Terminal Chatbot — Streaming AI assistant (Bloomberg terminal style)
// Uses SSE streaming for instant word-by-word responses
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "What is a PE ratio?",
  "Explain SSL sweep",
  "Compare NVDA vs MSFT",
  "What are LEAPs?",
  "What is DCA strategy?",
  "Is AAPL a good buy?",
];

export function TerminalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

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
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.content,
                  };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: "Connection error. Please try again.",
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-[60] w-[380px] max-w-[calc(100vw-40px)] h-[520px] max-h-[calc(100vh-120px)] rounded-lg border border-[#D4AF37]/30 bg-[#0A0A0A] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-[#050505] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-wider">
                  TF AI ASSISTANT
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#555]">
                  TF ELITE EXCLUSIVE
                </span>
                <button
                  onClick={() => setMessages([])}
                  className="text-[9px] font-mono text-[#555] hover:text-[#D4AF37] transition-colors px-1.5 py-0.5 border border-[#222] rounded hover:border-[#D4AF37]/30"
                >
                  CLEAR
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">◆</div>
                    <p className="text-xs font-mono text-[#888]">
                      Ask me anything about trading
                    </p>
                    <p className="text-[10px] font-mono text-[#555] max-w-[260px]">
                      Educational concepts, stock analysis, comparisons, or Trader Foundation methodology
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-[340px]">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="px-2.5 py-1.5 text-[10px] font-mono text-[#888] bg-[#111] border border-[#222] rounded hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E8E0D0]"
                          : "bg-[#111] border border-[#222] text-[#CCC]"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="text-xs leading-relaxed prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_strong]:text-[#D4AF37]">
                          <Streamdown>{msg.content}</Streamdown>
                        </div>
                      ) : (
                        <p className="text-xs font-mono">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Streaming indicator — only show when assistant message is still empty */}
              {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start">
                  <div className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 flex items-center gap-2">
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30" />
                    </motion.div>
                    <span className="text-[10px] font-mono text-[#555]">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-3 py-2.5 border-t border-[#D4AF37]/20 bg-[#050505] flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about PE, SSL, compare stocks..."
                disabled={isStreaming}
                className="flex-1 bg-[#111] border border-[#222] rounded px-3 py-2 text-xs font-mono text-[#E8E0D0] placeholder-[#444] focus:outline-none focus:border-[#D4AF37]/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="px-3 py-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded text-xs font-mono text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ▶
              </button>
            </form>

            {/* Footer */}
            <div className="px-3 py-1 bg-[#030303] border-t border-[#111] text-center">
              <span className="text-[8px] font-mono text-[#333]">
                FOR EDUCATIONAL PURPOSES ONLY — NOT FINANCIAL ADVICE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
