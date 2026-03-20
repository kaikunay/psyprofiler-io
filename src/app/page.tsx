import Navbar         from "@/components/Navbar";
import Hero           from "@/components/Hero";
import StatsBar       from "@/components/StatsBar";
import SampleReport   from "@/components/SampleReport";
import Capabilities   from "@/components/Capabilities";
import Agents         from "@/components/Agents";
import Sachi          from "@/components/Sachi";
import FoundingMember from "@/components/FoundingMember";
import Pricing        from "@/components/Pricing";
import Footer         from "@/components/Footer";
import SmoothScroll   from "@/components/effects/SmoothScroll";
import CustomCursor   from "@/components/effects/CustomCursor";
import NoiseOverlay   from "@/components/effects/NoiseOverlay";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <main className="min-h-screen bg-void">
        <Navbar />
        <Hero />
        <StatsBar />
        <SampleReport />
        <Capabilities />
        <Agents />
        <Sachi />
        <FoundingMember />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
