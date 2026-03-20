"use client";
export default function Footer() {
  return (
    <footer className="border-t border-violet-500/15 bg-void py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] tracking-[0.15em] text-dim">
          © 2026 PSYPROFILER // KUNAYA LAB
        </span>
        <div className="flex items-center gap-6">
          {["PROTOCOL", "REDACTED", "COORDINATES"].map((link) => (
            <a key={link} href="#"
               className="font-mono text-[10px] tracking-[0.18em] text-dim hover:text-muted transition-colors">
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse2" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-success">
            SECURE_CHANNEL_ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}