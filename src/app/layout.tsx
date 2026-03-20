import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets:["latin"], variable:"--font-display", weight:["400","600","700"] });
const inter = Inter({ subsets:["latin"], variable:"--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets:["latin"], variable:"--font-mono", weight:["400","500","700"] });

export const metadata: Metadata = {
  title: "PSYPROFILER — Know Who They Really Are",
  description: "Psychological intelligence at machine speed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-void text-ink font-body antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
