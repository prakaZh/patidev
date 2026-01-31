import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const FloatingHeart = ({ style, delay, size = 20 }) => (
  <div 
    className="floating-heart animate-float-heart"
    style={{ 
      ...style, 
      animationDelay: `${delay}s`
    }}
  >
    <Heart fill="currentColor" size={size} />
  </div>
);

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const hearts = [
    { top: '8%', left: '5%', delay: 0, size: 18 },
    { top: '15%', right: '10%', delay: 0.5, size: 24 },
    { top: '65%', left: '8%', delay: 1, size: 16 },
    { top: '75%', right: '6%', delay: 1.5, size: 20 },
    { top: '35%', left: '3%', delay: 2, size: 14 },
    { top: '25%', right: '4%', delay: 2.5, size: 22 },
    { top: '50%', right: '12%', delay: 0.8, size: 16 },
    { top: '85%', left: '15%', delay: 1.2, size: 18 },
  ];

  const handleCtaClick = () => {
    navigate('/quiz');
  };

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
          size={heart.size}
        />
      ))}
      
      {/* Main Headline - Bold and fills top half */}
      <h1 className="hero-headline" data-testid="hero-headline">
        KYA AAPKA PATI DEVTA HAI?
      </h1>
      
      {/* CTA Button with animations */}
      <button 
        className="cta-button animate-heartbeat animate-pulse-glow"
        onClick={handleCtaClick}
        data-testid="cta-button"
      >
        LETS FIND OUT
      </button>
    </section>
  );
};

export default HeroSection;
