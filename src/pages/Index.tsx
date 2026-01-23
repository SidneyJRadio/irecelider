import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RadioPlayer } from "@/components/home/RadioPlayer";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestNews } from "@/components/home/LatestNews";
import { RegionalNews } from "@/components/home/RegionalNews";
import { YouTubeEmbed } from "@/components/home/YouTubeEmbed";
import { CommunicatorsPreview } from "@/components/home/CommunicatorsPreview";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Radio Player - Sticky at top */}
        <RadioPlayer />
        
        {/* Hero with Featured News */}
        <HeroSection />
        
        {/* Latest News Grid */}
        <LatestNews />
        
        {/* Regional News */}
        <RegionalNews />

        {/* Communicators Preview */}
        <CommunicatorsPreview />
        
        {/* YouTube Embed */}
        <YouTubeEmbed />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
