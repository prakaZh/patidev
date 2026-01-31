import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Visitor Counter Component
const VisitorCounter = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const incrementVisitor = async () => {
      try {
        const response = await axios.post(`${API}/visitor/increment`);
        setCount(response.data.count);
      } catch (err) {
        console.error('Error incrementing visitor count:', err);
        // Try to get existing count
        try {
          const getResponse = await axios.get(`${API}/visitor/count`);
          setCount(getResponse.data.count);
        } catch {
          setCount(0);
        }
      } finally {
        setLoading(false);
      }
    };

    incrementVisitor();
  }, []);

  if (loading) return null;

  return (
    <div className="visitor-counter" data-testid="visitor-counter">
      <Users size={16} />
      <span>{count?.toLocaleString() || 0} visitors</span>
    </div>
  );
};

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
      {/* Visitor Counter */}
      <VisitorCounter />

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
