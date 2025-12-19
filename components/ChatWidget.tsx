"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hi — ask me anything about InsightEdge AI services." },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: q }]);

    try {
      const r = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json().catch(() => ({}));
      const ans =
        r.ok && data?.answer ? data.answer : "Sorry — something went wrong. Please try again.";

      setMsgs((m) => [...m, { role: "assistant", text: ans }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "Network error — please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      {open && (
        <div className="w-[340px] h-[460px] rounded-2xl shadow-xl border bg-white text-slate-900 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white text-slate-900">
            <div className="font-semibold text-slate-900">InsightEdge AI Chat</div>
            <button
              className="text-sm px-2 py-1 rounded-lg border hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="flex-1 p-3 overflow-auto space-y-2">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-900 border border-slate-200"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white"
              placeholder="Type your question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={busy}
            />
            <button
              className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={send}
              disabled={busy}
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          className="group flex items-center gap-2 rounded-full shadow-xl border border-slate-800 bg-slate-900/90 text-white px-4 py-3 text-sm hover:bg-slate-900"
          onClick={() => setOpen(true)}
          aria-label="Open InsightEdge AI chat"
          title="Chat with InsightEdge AI"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30">
            {/* simple chat icon (no deps) */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
          </span>
          <span className="font-medium">Chat</span>
          <span className="hidden sm:inline text-xs text-slate-300 group-hover:text-slate-200">
            Ask a question
          </span>
        </button>
      )}
    </div>
  );
}
