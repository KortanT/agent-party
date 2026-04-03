"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { ChatMessage } from "./ChatMessage";

export function ChatArea() {
  const messages = useGameStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-grid">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111827] border border-[#1e293b] flex items-center justify-center">
            <span className="text-3xl">&#x1f3ae;</span>
          </div>
          <div>
            <p className="text-sm text-[#94a3b8] mb-1">Partine hosgeldin!</p>
            <p className="text-xs text-[#475569] max-w-xs">
              Sol taraftan bir ajan sec ve ona gorev ver.<br />
              Veya tum ekibe ayni anda sor.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            {["&#x1f9d9;", "&#x2694;&#xfe0f;", "&#x1f98a;", "&#x1f52e;"].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1e293b] flex items-center justify-center text-sm animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                dangerouslySetInnerHTML={{ __html: emoji }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-grid">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
