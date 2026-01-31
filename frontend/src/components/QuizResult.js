import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw, Home, Heart, ChevronDown, Instagram, Linkedin } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { CATEGORIES } from '../data/quizQuestions';
import { RESULT_DATA, CATEGORY_TRAITS, RADAR_LABELS } from '../data/resultData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Heart Rating Component
const HeartRating = ({ score }) => {
  return (
    <div className="heart-rating" data-testid="heart-rating">
      {[...Array(10)].map((_, index) => (
        <Heart
          key={index}
          size={24}
          fill={index < score ? '#FD297B' : 'transparent'}
          stroke={index < score ? '#FD297B' : 'rgba(255,255,255,0.3)'}
          className={`heart-icon-rating ${index < score ? 'animate-heart-pop' : ''}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Scroll Indicator Component
const ScrollIndicator = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="scroll-indicator" data-testid="scroll-indicator">
      <p className="scroll-text">Scroll for more</p>
      <ChevronDown className="scroll-arrow" size={24} />
    </div>
  );
};

// Social Nudge Component
const SocialNudge = () => {
  return (
    <div className="social-nudge" data-testid="social-nudge">
      <p className="nudge-text">Enjoyed the quiz? Let's connect!</p>
      <div className="social-nudge-links">
        <a 
          href="https://instagram.com/prakazhkumar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-nudge-link instagram"
          data-testid="nudge-instagram"
        >
          <Instagram size={20} />
          <span>Follow on Instagram</span>
        </a>
        <a 
          href="https://www.linkedin.com/in/prakash-kumar-prasad-a9467b95" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-nudge-link linkedin"
          data-testid="nudge-linkedin"
        >
          <Linkedin size={20} />
          <span>Connect on LinkedIn</span>
        </a>
      </div>
    </div>
  );
};

// Footer Component
const ResultFooter = () => {
  return (
    <footer className="result-footer" data-testid="result-footer">
      <p className="footer-signature">Created by Prakash</p>
      <div className="footer-social-links">
        <a 
          href="https://instagram.com/prakazhkumar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-social-link"
          aria-label="Follow on Instagram"
        >
          <Instagram size={22} />
        </a>
        <a 
          href="https://www.linkedin.com/in/prakash-kumar-prasad-a9467b95" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-social-link"
          aria-label="Connect on LinkedIn"
        >
          <Linkedin size={22} />
        </a>
      </div>
    </footer>
  );
};

// Reveal Animation Component
const RevealAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Analyzing responses...');

  useEffect(() => {
    const texts = [
      'Analyzing responses...',
      'Calculating emotional quotient...',
      'Measuring empathy levels...',
      'Evaluating conflict resolution...',
      'Assessing domestic contribution...',
      'Computing final score...'
    ];

    let currentText = 0;
    const textInterval = setInterval(() => {
      currentText = (currentText + 1) % texts.length;
      setText(texts[currentText]);
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="reveal-animation" data-testid="reveal-animation">
      <div className="reveal-container">
        <div className="reveal-spinner"></div>
        <p className="reveal-text">{text}</p>
        <div className="reveal-progress-bar">
          <div 
            className="reveal-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="reveal-percentage">{progress}%</p>
      </div>
    </div>
  );
};

export const QuizResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReveal, setShowReveal] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Handle scroll to hide indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const submitQuiz = async () => {
      try {
        const answersStr = sessionStorage.getItem('quizAnswers');
        
        if (!answersStr) {
          navigate('/quiz');
          return;
        }

        const answers = JSON.parse(answersStr);
        const yesCount = answers.filter(a => a?.answer === 'yes').length;
        const noCount = answers.filter(a => a?.answer === 'no').length;

        // Calculate category scores
        const categoryScores = {};
        Object.keys(CATEGORIES).forEach(categoryKey => {
          const categoryAnswers = answers.filter(a => a?.category === categoryKey);
          const categoryYes = categoryAnswers.filter(a => a?.answer === 'yes').length;
          categoryScores[categoryKey] = {
            name: CATEGORIES[categoryKey].name,
            yes_count: categoryYes,
            total: categoryAnswers.length,
            percentage: categoryAnswers.length > 0 ? (categoryYes / categoryAnswers.length) * 100 : 0
          };
        });

        // Submit to backend
        const response = await axios.post(`${API}/quiz/submit`, {
          user_name: "Anonymous",
          yes_count: yesCount,
          no_count: noCount,
          answers: answers,
          category_scores: categoryScores
        });

        setResult({
          ...response.data,
          categoryScores
        });
        
        // Clear session storage after successful submission
        sessionStorage.removeItem('quizAnswers');
        
      } catch (err) {
        console.error('Error submitting quiz:', err);
        setError('Oops! Something went wrong. Please try again!');
        setShowReveal(false);
      } finally {
        setLoading(false);
      }
    };

    submitQuiz();
  }, [navigate]);

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem('quizAnswers');
    navigate('/quiz');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('quizAnswers');
    navigate('/');
  };

  // Get top 3 positive and negative traits based on category scores
  const getTraits = () => {
    if (!result?.categoryScores) return { positive: [], negative: [] };

    const sortedCategories = Object.entries(result.categoryScores)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => b.yes_count - a.yes_count);

    const positive = sortedCategories
      .slice(0, 3)
      .filter(c => c.yes_count > 0)
      .map(c => CATEGORY_TRAITS[c.key]?.positive)
      .filter(Boolean);

    const negative = sortedCategories
      .slice(-3)
      .reverse()
      .filter(c => c.yes_count < c.total)
      .map(c => CATEGORY_TRAITS[c.key]?.negative)
      .filter(Boolean);

    return { positive, negative };
  };

  // Prepare radar chart data
  const getRadarData = () => {
    if (!result?.categoryScores) return [];

    return Object.entries(result.categoryScores).map(([key, value]) => ({
      category: RADAR_LABELS[key] || key,
      score: value.yes_count,
      fullMark: 3
    }));
  };

  const resultData = result?.score_1_to_10 ? RESULT_DATA[result.score_1_to_10] : null;
  const traits = getTraits();
  const radarData = getRadarData();

  if (loading && showReveal) {
    return <RevealAnimation onComplete={() => setShowReveal(false)} />;
  }

  if (showReveal && result) {
    return <RevealAnimation onComplete={() => setShowReveal(false)} />;
  }

  if (error) {
    return (
      <div className="quiz-result-page error" data-testid="result-error">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRetakeQuiz} className="retry-btn">
            <RefreshCw size={20} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-result-page analytics" data-testid="quiz-result-page">
      <div className="result-scroll-container">
        {/* Character Image Card */}
        <div className="result-card main-card animate-fade-in-up" data-testid="main-result-card">
          <img 
            src={resultData?.image} 
            alt={resultData?.title}
            className="result-character-image"
            data-testid="result-character-image"
          />
          <h2 className="result-title" data-testid="result-title">
            {resultData?.title}
          </h2>
        </div>

        {/* Trait Cards */}
        <div className="trait-cards" data-testid="trait-cards">
          {resultData?.traits.map((trait, index) => (
            <div 
              key={index} 
              className="trait-card animate-fade-in-up" 
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              data-testid={`trait-card-${index}`}
            >
              {trait}
            </div>
          ))}
        </div>

        {/* Heart Rating */}
        <div className="rating-section animate-fade-in-up" style={{ animationDelay: '0.4s' }} data-testid="rating-section">
          <h3 className="section-title">Husband Rating</h3>
          <HeartRating score={result?.score_1_to_10 || 0} />
          <p className="score-label">{result?.score_1_to_10}/10</p>
        </div>

        {/* Percentile */}
        <div className="percentile-section animate-fade-in-up" style={{ animationDelay: '0.5s' }} data-testid="percentile-section">
          <p className="percentile-text">
            Your husband is better than <strong>{result?.percentile}%</strong> of husbands
          </p>
          <p className="percentile-note">*Based on other users taking this quiz</p>
        </div>

        {/* Radar Chart */}
        <div className="radar-section animate-fade-in-up" style={{ animationDelay: '0.6s' }} data-testid="radar-section">
          <h3 className="section-title">Category Breakdown</h3>
          <div className="radar-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#fff', fontSize: 10 }}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 3]} 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  tickCount={4}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#FFD700"
                  fill="#FFD700"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Positive & Negative Traits */}
        <div className="characteristics-section animate-fade-in-up" style={{ animationDelay: '0.7s' }} data-testid="characteristics-section">
          {traits.positive.length > 0 && (
            <div className="characteristics-card positive">
              <h4 className="characteristics-title">✨ Positive Traits</h4>
              <ul className="characteristics-list">
                {traits.positive.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
          )}
          
          {traits.negative.length > 0 && (
            <div className="characteristics-card negative">
              <h4 className="characteristics-title">⚠️ Areas to Improve</h4>
              <ul className="characteristics-list">
                {traits.negative.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="result-actions animate-fade-in-up" style={{ animationDelay: '0.8s' }} data-testid="result-actions">
          <button 
            onClick={handleRetakeQuiz} 
            className="action-btn retake-btn"
            data-testid="retake-btn"
          >
            <RefreshCw size={20} />
            <span>Retake Quiz</span>
          </button>
          
          <button 
            onClick={handleGoHome} 
            className="action-btn home-btn"
            data-testid="home-btn"
          >
            <Home size={20} />
            <span>Home</span>
          </button>
        </div>

        {/* Social Nudge */}
        <SocialNudge />

        {/* Footer */}
        <ResultFooter />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator show={showScrollIndicator} />
    </div>
  );
};

export default QuizResult;
