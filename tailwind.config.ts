import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#080816", deep: "#0D0D22", surface: "#12122E", elevated: "#1A1A3E",
        violet: { 900:"#2D0B6B", 700:"#5B2D8E", 500:"#7B2FBE", 400:"#9D4EDD", 200:"#C77DFF" },
        gold: { deep:"#8B6200", DEFAULT:"#FFB800", light:"#FFD60A" },
        danger:"#FF3366", success:"#00FF88", ink:"#E8E0FF", muted:"#9B8EC4", dim:"#5C5080",
      },
      fontFamily: {
        display: ["Space Grotesk","sans-serif"],
        body: ["Inter","sans-serif"],
        mono: ["JetBrains Mono","monospace"],
      },
      boxShadow: {
        violet:"0 0 30px rgba(123,47,190,0.35)",
        gold:"0 0 30px rgba(255,184,0,0.25)",
      },
      animation: { pulse2:"pulse 2s cubic-bezier(0.4,0,0.6,1) infinite", blink:"blink 1s step-end infinite" },
      keyframes: { blink: { "0%,100%":{opacity:"1"}, "50%":{opacity:"0"} } },
    },
  },
  plugins: [],
};
export default config;
