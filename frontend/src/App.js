import React from "react";
import "@/App.css";
import { HeroSection } from "./components/HeroSection";
import { ImageCarousel } from "./components/ImageCarousel";
import { Footer } from "./components/Footer";

function App() {
  const handleCtaClick = () => {
    // Placeholder for future quiz navigation
    console.log("CTA clicked - Quiz coming soon!");
  };

  return (
    <div className="App" data-testid="app-container">
      {/* Hero Section - Top half with bold headline and CTA */}
      <HeroSection onCtaClick={handleCtaClick} />
      
      {/* Image Carousel Section - Transparent background */}
      <ImageCarousel />
      
      {/* Footer with credits and social links */}
      <Footer />
    </div>
  );
}

export default App;
