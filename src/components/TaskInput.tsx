"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/lib/store";

interface TaskInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function TaskInput({ onSend, disabled }: TaskInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = useGameStore((s) => s.isStreaming);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir gorev ver veya soru sor..."
          disabled={isStreaming || disabled}
          rows={1}
          className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 pr-3 text-[13px] text-[#e2e8f0] placeholder:text-[#334155] focus:outline-none focus:border-[#334155] focus:bg-[#0f172a] resize-none disabled:opacity-40 transition-all"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || isStreaming || disabled}
        className="h-[42px] px-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold tracking-wider text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {isStreaming ? (
          <span className="flex items-center gap-1">
            <span className="dot-1 inline-block w-1 h-1 rounded-full bg-white" />
            <span className="dot-2 inline-block w-1 h-1 rounded-full bg-white" />
            <span className="dot-3 inline-block w-1 h-1 rounded-full bg-white" />
          </span>
        ) : (
          "GONDER"
        )}
      </button>
    </div>
  );
}
