import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { HeroSection } from "./components/HeroSection";
import { ImageCarousel } from "./components/ImageCarousel";
import { Footer } from "./components/Footer";
import { QuizInstructions } from "./components/QuizInstructions";
import { QuizQuestion } from "./components/QuizQuestion";
import { QuizResult } from "./components/QuizResult";

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="App" data-testid="landing-page">
      <HeroSection />
      <ImageCarousel />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizInstructions />} />
        <Route path="/quiz/question/:questionId" element={<QuizQuestion />} />
        <Route path="/quiz/result" element={<QuizResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
