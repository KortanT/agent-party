"use client";

import { CharacterAppearance, AnimationState } from "@/lib/agents/types";

interface CharacterAvatarProps {
  appearance: CharacterAppearance;
  color: string;
  size?: number;
  animState?: AnimationState;
  className?: string;
}

export function CharacterAvatar({
  appearance,
  color,
  size = 80,
  animState = "idle",
  className = "",
}: CharacterAvatarProps) {
  const isWorking = animState === "coding";
  const s = size;
  const headR = s * 0.28;
  const cx = s / 2;
  const headY = s * 0.32;
  const bodyY = headY + headR * 0.85;
  const bodyW = s * 0.32;
  const bodyH = s * 0.28;
  const legY = bodyY + bodyH;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      style={{ filter: isWorking ? `drop-shadow(0 0 8px ${color}50)` : undefined }}
    >
      {/* Animation wrapper for whole character */}
      <g>
        {/* Idle: gentle breathing bounce */}
        {animState === "idle" && (
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0" dur="2.5s" repeatCount="indefinite" />
        )}
        {/* Walking: bob + slight horizontal sway */}
        {animState === "walking" && (
          <animateTransform attributeName="transform" type="translate" values="-2,0;0,-2;2,0;0,-2;-2,0" dur="0.8s" repeatCount="indefinite" />
        )}
        {/* Thinking: slow tilt */}
        {animState === "thinking" && (
          <animateTransform attributeName="transform" type="rotate" values="-2,${cx},${s * 0.5};2,${cx},${s * 0.5};-2,${cx},${s * 0.5}" dur="3s" repeatCount="indefinite" />
        )}
        {/* Coding: fast small bounce */}
        {animState === "coding" && (
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-1;0,0" dur="0.5s" repeatCount="indefinite" />
        )}
        {/* Celebrating: jump */}
        {animState === "celebrating" && (
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="0.6s" repeatCount="indefinite" />
        )}

      {/* Shadow */}
      <ellipse cx={cx} cy={s * 0.92} rx={s * 0.2} ry={s * 0.04} fill="#00000030">
        {animState === "celebrating" && (
          <animate attributeName="rx" values="${s * 0.2};${s * 0.15};${s * 0.2}" dur="0.6s" repeatCount="indefinite" />
        )}
      </ellipse>

      {/* Legs */}
      <rect x={cx - bodyW * 0.35} y={legY} width={s * 0.1} height={s * 0.12} rx={3} fill={color} opacity={0.7} />
      <rect x={cx + bodyW * 0.15} y={legY} width={s * 0.1} height={s * 0.12} rx={3} fill={color} opacity={0.7} />

      {/* Feet */}
      <ellipse cx={cx - bodyW * 0.3} cy={legY + s * 0.13} rx={s * 0.07} ry={s * 0.03} fill={color} opacity={0.5} />
      <ellipse cx={cx + bodyW * 0.2} cy={legY + s * 0.13} rx={s * 0.07} ry={s * 0.03} fill={color} opacity={0.5} />

      {/* Body */}
      <rect
        x={cx - bodyW / 2}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={s * 0.06}
        fill={color}
      />

      {/* Body detail - outfit */}
      {appearance.outfit === "suit" && (
        <line x1={cx} y1={bodyY + 4} x2={cx} y2={bodyY + bodyH - 2} stroke="#00000020" strokeWidth={2} />
      )}
      {appearance.outfit === "armor" && (
        <>
          <line x1={cx - bodyW * 0.3} y1={bodyY + bodyH * 0.5} x2={cx + bodyW * 0.3} y2={bodyY + bodyH * 0.5} stroke="#ffffff20" strokeWidth={1.5} />
          <circle cx={cx} cy={bodyY + bodyH * 0.35} r={s * 0.03} fill="#ffffff20" />
        </>
      )}
      {appearance.outfit === "robe" && (
        <path d={`M${cx - bodyW * 0.4} ${bodyY + bodyH} L${cx} ${bodyY + bodyH + 6} L${cx + bodyW * 0.4} ${bodyY + bodyH}`} fill={color} opacity={0.6} />
      )}
      {appearance.outfit === "lab-coat" && (
        <>
          <rect x={cx - bodyW * 0.15} y={bodyY + bodyH * 0.6} width={s * 0.04} height={s * 0.04} rx={1} fill="#ffffff30" />
        </>
      )}

      {/* Arms */}
      <rect x={cx - bodyW / 2 - s * 0.06} y={bodyY + s * 0.02} width={s * 0.08} height={s * 0.18} rx={4} fill={color} opacity={0.8}>
        {isWorking && (
          <animateTransform attributeName="transform" type="rotate" values="-5,${cx - bodyW / 2},${bodyY + s * 0.02};5,${cx - bodyW / 2},${bodyY + s * 0.02};-5,${cx - bodyW / 2},${bodyY + s * 0.02}" dur="0.8s" repeatCount="indefinite" />
        )}
      </rect>
      <rect x={cx + bodyW / 2 - s * 0.02} y={bodyY + s * 0.02} width={s * 0.08} height={s * 0.18} rx={4} fill={color} opacity={0.8} />

      {/* Head */}
      <circle cx={cx} cy={headY} r={headR} fill={appearance.skinTone} />

      {/* Hair / Head top */}
      <path
        d={`M${cx - headR * 0.9} ${headY - headR * 0.3} Q${cx} ${headY - headR * 1.2} ${cx + headR * 0.9} ${headY - headR * 0.3}`}
        fill={color}
        opacity={0.9}
      />

      {/* Eyes */}
      <Eyes style={appearance.eyeStyle} cx={cx} cy={headY} r={headR} s={s} />

      {/* Mouth */}
      <path
        d={`M${cx - s * 0.03} ${headY + headR * 0.4} Q${cx} ${headY + headR * 0.55} ${cx + s * 0.03} ${headY + headR * 0.4}`}
        stroke="#8B5E3C"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Cheek blush */}
      <circle cx={cx - headR * 0.6} cy={headY + headR * 0.3} r={s * 0.035} fill="#ff9999" opacity={0.3} />
      <circle cx={cx + headR * 0.6} cy={headY + headR * 0.3} r={s * 0.035} fill="#ff9999" opacity={0.3} />

      {/* Accessory */}
      <Accessory type={appearance.accessory} cx={cx} headY={headY} headR={headR} s={s} color={appearance.hatColor} />

      {/* === STATE-SPECIFIC EFFECTS === */}

      {/* Thinking: thought bubbles */}
      {animState === "thinking" && (
        <>
          <circle cx={cx + headR * 0.8} cy={headY - headR * 1.2} r={s * 0.02} fill="#94a3b8" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + headR * 1.1} cy={headY - headR * 1.6} r={s * 0.03} fill="#94a3b8" opacity="0.35">
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + headR * 1.3} cy={headY - headR * 2.1} r={s * 0.045} fill="#94a3b8" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.35;0.1" dur="2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          {/* "?" inside biggest bubble */}
          <text x={cx + headR * 1.3} y={headY - headR * 1.95} textAnchor="middle" fontSize={s * 0.05} fill="#94a3b8" opacity="0.5">?</text>
        </>
      )}

      {/* Coding: sparkles + code symbols */}
      {animState === "coding" && (
        <>
          <circle cx={cx - s * 0.3} cy={headY - s * 0.15} r={2} fill={color}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + s * 0.35} cy={headY} r={1.5} fill={color}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + s * 0.1} cy={headY - s * 0.25} r={2} fill={color}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1s" repeatCount="indefinite" />
          </circle>
          {/* Floating code symbols */}
          <text x={cx - s * 0.25} y={headY - s * 0.05} fontSize={s * 0.06} fill={color} opacity="0.4">
            {"</>"}
            <animate attributeName="y" values={`${headY - s * 0.05};${headY - s * 0.15};${headY - s * 0.05}`} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
          </text>
          <text x={cx + s * 0.2} y={headY + s * 0.05} fontSize={s * 0.05} fill={color} opacity="0.3">
            {"{ }"}
            <animate attributeName="y" values={`${headY + s * 0.05};${headY - s * 0.05};${headY + s * 0.05}`} dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.5s" repeatCount="indefinite" />
          </text>
        </>
      )}

      {/* Celebrating: confetti */}
      {animState === "celebrating" && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={`confetti-${i}`}
              x={cx + (i - 3) * s * 0.1}
              y={headY - headR * 2}
              width={s * 0.025}
              height={s * 0.025}
              rx={1}
              fill={["#f87171", "#fbbf24", "#4ade80", "#60a5fa", "#c084fc", "#fb923c"][i]}
              opacity="0.7"
              transform={`rotate(${i * 30}, ${cx + (i - 3) * s * 0.1}, ${headY - headR * 2})`}
            >
              <animate attributeName="y" values={`${headY - headR * 2.5};${headY + s * 0.1}`} dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" values={`0,${cx},${headY};${360},${cx},${headY}`} dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" />
            </rect>
          ))}
          {/* Star */}
          <text x={cx} y={headY - headR * 2} textAnchor="middle" fontSize={s * 0.1} opacity="0.8">
            &#x2B50;
            <animate attributeName="y" values={`${headY - headR * 2};${headY - headR * 3};${headY - headR * 2}`} dur="1s" repeatCount="indefinite" />
          </text>
        </>
      )}

      {/* Walking: dust puffs at feet */}
      {animState === "walking" && (
        <>
          <circle cx={cx - s * 0.08} cy={s * 0.9} r={s * 0.015} fill="#475569" opacity="0.2">
            <animate attributeName="cx" values={`${cx - s * 0.08};${cx - s * 0.2}`} dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + s * 0.08} cy={s * 0.9} r={s * 0.012} fill="#475569" opacity="0.2">
            <animate attributeName="cx" values={`${cx + s * 0.08};${cx + s * 0.2}`} dur="0.8s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      </g>
    </svg>
  );
}

function Eyes({ style, cx, cy, r, s }: { style: string; cx: number; cy: number; r: number; s: number }) {
  const eyeY = cy - r * 0.05;
  const eyeSpacing = r * 0.4;
  const eyeR = s * 0.035;

  switch (style) {
    case "happy":
      return (
        <>
          <path d={`M${cx - eyeSpacing - eyeR} ${eyeY} Q${cx - eyeSpacing} ${eyeY - eyeR * 1.5} ${cx - eyeSpacing + eyeR} ${eyeY}`} stroke="#4a3728" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <path d={`M${cx + eyeSpacing - eyeR} ${eyeY} Q${cx + eyeSpacing} ${eyeY - eyeR * 1.5} ${cx + eyeSpacing + eyeR} ${eyeY}`} stroke="#4a3728" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </>
      );
    case "angry":
      return (
        <>
          <circle cx={cx - eyeSpacing} cy={eyeY} r={eyeR} fill="#4a3728" />
          <circle cx={cx + eyeSpacing} cy={eyeY} r={eyeR} fill="#4a3728" />
          <line x1={cx - eyeSpacing - eyeR} y1={eyeY - eyeR * 1.5} x2={cx - eyeSpacing + eyeR * 0.5} y2={eyeY - eyeR * 0.8} stroke="#4a3728" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={cx + eyeSpacing + eyeR} y1={eyeY - eyeR * 1.5} x2={cx + eyeSpacing - eyeR * 0.5} y2={eyeY - eyeR * 0.8} stroke="#4a3728" strokeWidth={1.5} strokeLinecap="round" />
        </>
      );
    case "cool":
      return (
        <>
          <line x1={cx - eyeSpacing - eyeR * 1.2} y1={eyeY} x2={cx - eyeSpacing + eyeR * 1.2} y2={eyeY} stroke="#4a3728" strokeWidth={2} strokeLinecap="round" />
          <line x1={cx + eyeSpacing - eyeR * 1.2} y1={eyeY} x2={cx + eyeSpacing + eyeR * 1.2} y2={eyeY} stroke="#4a3728" strokeWidth={2} strokeLinecap="round" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path d={`M${cx - eyeSpacing - eyeR} ${eyeY} Q${cx - eyeSpacing} ${eyeY + eyeR} ${cx - eyeSpacing + eyeR} ${eyeY}`} stroke="#4a3728" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <path d={`M${cx + eyeSpacing - eyeR} ${eyeY} Q${cx + eyeSpacing} ${eyeY + eyeR} ${cx + eyeSpacing + eyeR} ${eyeY}`} stroke="#4a3728" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </>
      );
    default: // normal
      return (
        <>
          <circle cx={cx - eyeSpacing} cy={eyeY} r={eyeR} fill="#4a3728" />
          <circle cx={cx + eyeSpacing} cy={eyeY} r={eyeR} fill="#4a3728" />
          {/* Eye shine */}
          <circle cx={cx - eyeSpacing + 1} cy={eyeY - 1} r={eyeR * 0.35} fill="white" />
          <circle cx={cx + eyeSpacing + 1} cy={eyeY - 1} r={eyeR * 0.35} fill="white" />
        </>
      );
  }
}

function Accessory({ type, cx, headY, headR, s, color }: { type: string; cx: number; headY: number; headR: number; s: number; color: string }) {
  switch (type) {
    case "crown":
      return (
        <g>
          <path
            d={`M${cx - headR * 0.6} ${headY - headR * 0.8} L${cx - headR * 0.4} ${headY - headR * 1.3} L${cx - headR * 0.1} ${headY - headR * 1} L${cx} ${headY - headR * 1.45} L${cx + headR * 0.1} ${headY - headR * 1} L${cx + headR * 0.4} ${headY - headR * 1.3} L${cx + headR * 0.6} ${headY - headR * 0.8} Z`}
            fill={color}
          />
          <circle cx={cx} cy={headY - headR * 1.25} r={s * 0.02} fill="#ef4444" />
        </g>
      );
    case "wizard-hat":
      return (
        <g>
          <path
            d={`M${cx - headR * 0.8} ${headY - headR * 0.65} L${cx} ${headY - headR * 1.8} L${cx + headR * 0.8} ${headY - headR * 0.65} Z`}
            fill={color}
          />
          <ellipse cx={cx} cy={headY - headR * 0.65} rx={headR * 1} ry={headR * 0.15} fill={color} opacity={0.7} />
          <circle cx={cx} cy={headY - headR * 1.7} r={s * 0.025} fill="#fbbf24">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      );
    case "helmet":
      return (
        <g>
          <path
            d={`M${cx - headR * 0.85} ${headY - headR * 0.2} Q${cx - headR * 0.85} ${headY - headR * 1.1} ${cx} ${headY - headR * 1.2} Q${cx + headR * 0.85} ${headY - headR * 1.1} ${cx + headR * 0.85} ${headY - headR * 0.2}`}
            fill={color}
          />
          <rect x={cx - headR * 0.08} y={headY - headR * 1.2} width={headR * 0.16} height={headR * 0.5} rx={2} fill={color} opacity={0.8} />
          {/* Visor */}
          <rect x={cx - headR * 0.7} y={headY - headR * 0.3} width={headR * 1.4} height={headR * 0.15} rx={1} fill="#00000020" />
        </g>
      );
    case "bow":
      return (
        <g>
          <circle cx={cx + headR * 0.5} cy={headY - headR * 0.7} r={s * 0.025} fill={color} />
          <path d={`M${cx + headR * 0.3} ${headY - headR * 0.7} Q${cx + headR * 0.5} ${headY - headR * 1.1} ${cx + headR * 0.7} ${headY - headR * 0.7}`} fill={color} opacity={0.8} />
          <path d={`M${cx + headR * 0.3} ${headY - headR * 0.7} Q${cx + headR * 0.5} ${headY - headR * 0.3} ${cx + headR * 0.7} ${headY - headR * 0.7}`} fill={color} opacity={0.8} />
        </g>
      );
    case "crystal":
      return (
        <g>
          <path
            d={`M${cx} ${headY - headR * 1.4} L${cx - s * 0.04} ${headY - headR * 0.9} L${cx + s * 0.04} ${headY - headR * 0.9} Z`}
            fill={color}
            opacity={0.8}
          >
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
          </path>
        </g>
      );
    case "headset":
      return (
        <g>
          <path
            d={`M${cx - headR * 0.85} ${headY - headR * 0.1} Q${cx - headR * 0.95} ${headY - headR * 0.9} ${cx} ${headY - headR * 1} Q${cx + headR * 0.95} ${headY - headR * 0.9} ${cx + headR * 0.85} ${headY - headR * 0.1}`}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
          <circle cx={cx - headR * 0.9} cy={headY + headR * 0.1} r={s * 0.04} fill={color} />
          <circle cx={cx + headR * 0.9} cy={headY + headR * 0.1} r={s * 0.04} fill={color} />
        </g>
      );
    default:
      return null;
  }
}
