import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RadioPlayer } from "@/components/home/RadioPlayer";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestNews } from "@/components/home/LatestNews";
import { RegionalNews } from "@/components/home/RegionalNews";
import { YouTubeEmbed } from "@/components/home/YouTubeEmbed";
import { CommunicatorsPreview } from "@/components/home/CommunicatorsPreview";
import { AdBanner } from "@/components/home/AdBanner";
import { SingleBanner } from "@/components/home/SingleBanner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Radio Player - Sticky at top */}
        <RadioPlayer />
        
        {/* Hero with Featured News */}
        <HeroSection />
        
        {/* Ad Banners - Above Latest News */}
        <AdBanner position="above_news" />
        
        {/* Latest News Grid */}
        <LatestNews />
        
        {/* Single Banner - Above Regional News */}
        <SingleBanner position="above_regional" />
        
        {/* Regional News */}
        <RegionalNews />

        {/* Ad Banners - Above Communicators */}
        <AdBanner position="above_communicators" />

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