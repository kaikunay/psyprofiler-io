"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot   = useRef<HTMLDivElement>(null);
  const ring  = useRef<HTMLDivElement>(null);
  const pos   = useRef({ x: 0, y: 0 });
  const rPos  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform =
          `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const lerp = () => {
      rPos.current.x += (pos.current.x - rPos.current.x) * 0.12;
      rPos.current.y += (pos.current.y - rPos.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.transform =
          `translate(${rPos.current.x - 20}px, ${rPos.current.y - 20}px)`;
      }
      requestAnimationFrame(lerp);
    };

    const enter = () => ring.current?.classList.add("scale-[2.5]", "border-gold");
    const leave = () => ring.current?.classList.remove("scale-[2.5]", "border-gold");

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,input,[data-cursor]")
      .forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    const id = requestAnimationFrame(lerp);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(id); };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dot}
        className="fixed top-0 left-0 w-2 h-2 bg-violet-400 rounded-full z-[9999] pointer-events-none mix-blend-difference"
        style={{ transition: "none" }}
      />
      {/* Ring */}
      <div
        ref={ring}
        className="fixed top-0 left-0 w-10 h-10 border border-violet-500/60 rounded-full z-[9998] pointer-events-none transition-all duration-300"
      />
    </>
  );
}
