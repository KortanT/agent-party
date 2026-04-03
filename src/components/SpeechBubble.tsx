"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SpeechBubbleProps {
  message: string;
  color: string;
  visible: boolean;
  position?: "above" | "left" | "right";
}

export function SpeechBubble({ message, color, visible, position = "above" }: SpeechBubbleProps) {
  const positionStyles = {
    above: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const tailStyles = {
    above: "top-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
  };

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          className={`absolute ${positionStyles[position]} z-20 pointer-events-none`}
          initial={{ opacity: 0, scale: 0.8, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div
            className="relative max-w-[220px] px-3 py-2 rounded-xl text-[11px] leading-relaxed"
            style={{
              backgroundColor: color + "18",
              border: `1px solid ${color}30`,
              color: "#cbd5e1",
            }}
          >
            {/* Truncate long messages */}
            {message.length > 120 ? message.slice(0, 120) + "..." : message}

            {/* Tail */}
            <div className={`absolute ${tailStyles[position]}`}>
              {position === "above" && (
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `6px solid ${color}30`,
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
