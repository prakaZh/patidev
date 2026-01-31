import React from 'react';
import { Heart } from 'lucide-react';

const FloatingHeart = ({ style, delay }) => (
  <div 
    className="floating-heart animate-float-heart"
    style={{ 
      ...style, 
      animationDelay: `${delay}s`,
      color: '#D90429'
    }}
  >
    <Heart fill="currentColor" size={24} />
  </div>
);

export const HeroSection = ({ onCtaClick }) => {
  const hearts = [
    { top: '10%', left: '5%', delay: 0 },
    { top: '20%', right: '8%', delay: 0.5 },
    { top: '60%', left: '10%', delay: 1 },
    { top: '70%', right: '5%', delay: 1.5 },
    { top: '40%', left: '3%', delay: 2 },
    { top: '30%', right: '12%', delay: 2.5 },
  ];

  return (
    <section className="hero-section" data-testid="hero-section">
      {/* Floating Hearts */}
      {hearts.map((heart, index) => (
        <FloatingHeart 
          key={index} 
          style={{ 
            top: heart.top, 
            left: heart.left, 
            right: heart.right 
          }} 
          delay={heart.delay} 
        />
      ))}
      
      {/* Main Headline */}
      <h1 className="hero-headline" data-testid="hero-headline">
        KYA AAPKA PATI DEVTA HAI?
      </h1>
      
      {/* CTA Button with heartbeat animation */}
      <button 
        className="cta-button animate-heartbeat animate-pulse-glow"
        onClick={onCtaClick}
        data-testid="cta-button"
      >
        LETS FIND OUT
      </button>
    </section>
  );
};

export default HeroSection;
