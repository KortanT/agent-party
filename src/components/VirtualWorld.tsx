"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { WorldBackground } from "./WorldBackground";
import { Agent, AnimationState, GameNotification } from "@/lib/agents/types";
import { motion, AnimatePresence } from "framer-motion";

function getAnimState(agent: Agent): AnimationState {
  if (agent.status === "working" && agent.isStreamingResponse) return "coding";
  if (agent.status === "working") return "thinking";
  if (agent.status === "leveled_up") return "celebrating";
  if (agent.zone === "waiting-room") return "walking";
  if (agent.status === "tired") return "idle";
  return "idle";
}

// Floating notification popup
function NotificationPopup({ notification, agent }: { notification: GameNotification; agent?: Agent }) {
  const removeNotification = useGameStore((s) => s.removeNotification);

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 2500);
    return () => clearTimeout(timer);
  }, [notification.id, removeNotification]);

  if (!agent) return null;

  const colorMap = {
    xp: "#fbbf24",
    levelup: "#c084fc",
    hp: "#f87171",
    "task-done": "#4ade80",
  };

  return (
    <motion.div
      className="absolute z-30 pointer-events-none font-bold text-sm"
      style={{
        left: `${agent.worldPosition.x}%`,
        top: `${agent.worldPosition.y - 15}%`,
        transform: "translate(-50%, -50%)",
        color: colorMap[notification.type],
        textShadow: `0 0 10px ${colorMap[notification.type]}50`,
      }}
      initial={{ opacity: 1, y: 0, scale: 1.2 }}
      animate={{ opacity: 0, y: -30, scale: 0.8 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      {notification.type === "levelup" && "&#x2B50; "}
      {notification.text}
      {notification.type === "task-done" && " &#x2714;"}
    </motion.div>
  );
}

// Live task badge under character
function TaskBadge({ task, color }: { task: string; color: string }) {
  return (
    <motion.div
      className="mt-0.5 max-w-[140px] text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div
        className="text-[7px] px-2 py-0.5 rounded-md truncate"
        style={{ backgroundColor: color + "15", color: color + "cc", border: `1px solid ${color}20` }}
      >
        {task}
      </div>
    </motion.div>
  );
}

// Speech bubble that shows latest message content
function LiveBubble({ content, color, isStreaming }: { content: string; color: string; isStreaming: boolean }) {
  if (!content) return null;

  // Show last ~100 chars for readability
  const displayText = content.length > 100 ? "..." + content.slice(-100) : content;

  return (
    <motion.div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div
        className="max-w-[200px] px-2.5 py-1.5 rounded-xl text-[9px] leading-relaxed"
        style={{
          backgroundColor: color + "15",
          border: `1px solid ${color}25`,
          color: "#cbd5e1",
        }}
      >
        {displayText}
        {isStreaming && (
          <span className="inline-flex ml-1 gap-0.5">
            <span className="dot-1 inline-block w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
            <span className="dot-2 inline-block w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
            <span className="dot-3 inline-block w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
          </span>
        )}
      </div>
      <div className="flex justify-center">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `5px solid ${color}25`,
          }}
        />
      </div>
    </motion.div>
  );
}

function AgentInWorld({ agent }: { agent: Agent }) {
  const messages = useGameStore((s) => s.messages);
  const animState = getAnimState(agent);

  // Get latest message for this agent
  const latestMsg = [...messages].reverse().find(
    (m) => m.agentId === agent.id && m.content && (Date.now() - m.timestamp < 60000)
  );

  const showBubble = agent.status === "working" || (latestMsg && Date.now() - latestMsg.timestamp < 15000);

  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer group"
      animate={{
        left: `${agent.worldPosition.x}%`,
        top: `${agent.worldPosition.y}%`,
      }}
      transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
      style={{ transform: "translate(-50%, -50%)" }}
      onClick={() => useGameStore.getState().openCustomizer(agent.id)}
      whileHover={{ scale: 1.05 }}
    >
      {/* Live speech bubble */}
      <AnimatePresence>
        {showBubble && latestMsg && (
          <LiveBubble
            content={latestMsg.content}
            color={agent.color}
            isStreaming={agent.isStreamingResponse}
          />
        )}
      </AnimatePresence>

      {/* Character */}
      <div className="relative">
        <CharacterAvatar
          appearance={agent.appearance}
          color={agent.color}
          size={agent.role === "ceo" ? 85 : 70}
          animState={animState}
        />

        {/* Working pulse */}
        {agent.status === "working" && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: agent.color }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Waiting room ZZZ */}
        {agent.zone === "waiting-room" && agent.status !== "working" && (
          <motion.div
            className="absolute -top-2 -right-2 text-[10px] text-[#475569]"
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            z
          </motion.div>
        )}
      </div>

      {/* Name + status */}
      <div className="mt-0.5 flex flex-col items-center">
        <span className="text-[9px] font-bold tracking-wider" style={{ color: agent.color }}>
          {agent.name}
        </span>

        {/* HP mini bar */}
        <div className="w-10 h-[2px] bg-[#1e293b] rounded-full mt-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: agent.stats.hp < 20 ? "#f87171" : agent.color }}
            animate={{ width: `${(agent.stats.hp / agent.stats.maxHp) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Current task badge */}
        <AnimatePresence>
          {agent.currentTask && agent.status === "working" && (
            <TaskBadge task={agent.currentTask} color={agent.color} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function VirtualWorld() {
  const agents = useGameStore((s) => s.agents);
  const notifications = useGameStore((s) => s.notifications);
  const messages = useGameStore((s) => s.messages);

  return (
    <div className="flex-1 relative overflow-hidden">
      <WorldBackground />

      {/* Waiting room label */}
      {agents.some((a) => a.zone === "waiting-room") && (
        <div className="absolute bottom-2 left-4 text-[8px] text-[#334155] tracking-wider">
          BEKLEME ODASI
        </div>
      )}

      {/* Agent characters with spring animation positions */}
      {agents.map((agent) => (
        <AgentInWorld key={agent.id} agent={agent} />
      ))}

      {/* Floating notifications */}
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationPopup
            key={n.id}
            notification={n}
            agent={agents.find((a) => a.id === n.agentId)}
          />
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center animate-fade-up">
          <p className="text-[11px] text-[#334155] bg-[#0a0e17]/80 rounded-full px-4 py-2 backdrop-blur-sm border border-[#1e293b]/50">
            &#x2b50; Yukaridaki bara prompt gir — Komutan ekibine gorev dagitacak
          </p>
        </div>
      )}
    </div>
  );
}
