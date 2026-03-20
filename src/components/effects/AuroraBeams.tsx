"use client";
import { useEffect, useRef } from "react";

export default function AuroraBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary violet aurora */}
      <div
        className="absolute -top-40 -left-20 w-[800px] h-[600px] opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, #7B2FBE 0%, transparent 70%)",
          animation: "aurora1 12s ease-in-out infinite",
        }}
      />
      {/* Gold aurora */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[400px] opacity-10"
        style={{
          background: "radial-gradient(ellipse at center, #FFB800 0%, transparent 70%)",
          animation: "aurora2 15s ease-in-out infinite",
        }}
      />
      {/* Beam 1 */}
      <div
        className="absolute top-0 left-1/4 w-px h-full opacity-20"
        style={{
          background: "linear-gradient(to bottom, transparent, #7B2FBE, #C77DFF, transparent)",
          animation: "beam1 8s ease-in-out infinite",
        }}
      />
      {/* Beam 2 */}
      <div
        className="absolute top-0 left-2/3 w-px h-full opacity-15"
        style={{
          background: "linear-gradient(to bottom, transparent, #FFB800, transparent)",
          animation: "beam2 11s ease-in-out infinite 2s",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#7B2FBE 1px, transparent 1px),
                           linear-gradient(90deg, #7B2FBE 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <style>{`
        @keyframes aurora1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(120px,-80px) scale(1.15); }
          66%      { transform: translate(-60px,60px) scale(0.9); }
        }
        @keyframes aurora2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-100px,50px) scale(1.2); }
        }
        @keyframes beam1 {
          0%,100% { opacity:0.15; transform:scaleX(1); }
          50%      { opacity:0.35; transform:scaleX(2); }
        }
        @keyframes beam2 {
          0%,100% { opacity:0.08; }
          50%      { opacity:0.22; }
        }
      `}</style>
    </div>
  );
}
