import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, RefreshCw, Home, Share2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const QuizResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const submitQuiz = async () => {
      try {
        const userName = sessionStorage.getItem('quizUserName');
        const answersStr = sessionStorage.getItem('quizAnswers');
        
        if (!userName || !answersStr) {
          navigate('/quiz');
          return;
        }

        const answers = JSON.parse(answersStr);
        const yesCount = answers.filter(a => a?.answer === 'yes').length;
        const noCount = answers.filter(a => a?.answer === 'no').length;

        // Submit to backend
        const response = await axios.post(`${API}/quiz/submit`, {
          user_name: userName,
          yes_count: yesCount,
          no_count: noCount,
          answers: answers
        });

        setResult(response.data);
        
        // Clear session storage after successful submission
        sessionStorage.removeItem('quizAnswers');
        
      } catch (err) {
        console.error('Error submitting quiz:', err);
        setError('Oops! Kuch gadbad ho gayi. Dobara try karo!');
      } finally {
        setLoading(false);
      }
    };

    submitQuiz();
  }, [navigate]);

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem('quizUserName');
    sessionStorage.removeItem('quizAnswers');
    navigate('/quiz');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('quizUserName');
    sessionStorage.removeItem('quizAnswers');
    navigate('/');
  };

  const getRatingEmoji = (rating) => {
    if (rating.includes('DEVTA')) return '🙏✨';
    if (rating.includes('MAHARAJ')) return '👑💎';
    if (rating.includes('ACCHE')) return '💪❤️';
    if (rating.includes('THEEK')) return '😐👌';
    if (rating.includes('KAAM')) return '🤷😬';
    return '😅🔧';
  };

  const getRatingColor = (percentage) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="quiz-result-page loading" data-testid="result-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Result calculate ho raha hai...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-result-page error" data-testid="result-error">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRetakeQuiz} className="retry-btn">
            <RefreshCw size={20} />
            <span>Dobara Try Karo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-result-page" data-testid="quiz-result-page">
      <div className="result-container">
        {/* Trophy Icon */}
        <div className="trophy-container" data-testid="trophy-container">
          <Trophy size={60} className="trophy-icon" />
        </div>

        {/* User Name */}
        <h2 className="result-greeting" data-testid="result-greeting">
          {result?.user_name}, tumhare pati ka score hai...
        </h2>

        {/* Score Circle */}
        <div className="score-circle" data-testid="score-circle">
          <span className={`score-percentage ${getRatingColor(result?.score_percentage)}`}>
            {Math.round(result?.score_percentage)}%
          </span>
        </div>

        {/* Rating Badge */}
        <div className="rating-badge" data-testid="rating-badge">
          <span className="rating-text">{result?.pati_rating}</span>
          <span className="rating-emoji">{getRatingEmoji(result?.pati_rating)}</span>
        </div>

        {/* Stats */}
        <div className="stats-container" data-testid="stats-container">
          <div className="stat-item yes-stat">
            <span className="stat-label">HAAN</span>
            <span className="stat-value">{result?.yes_count}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item no-stat">
            <span className="stat-label">NA</span>
            <span className="stat-value">{result?.no_count}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions" data-testid="result-actions">
          <button 
            onClick={handleRetakeQuiz} 
            className="action-btn retake-btn"
            data-testid="retake-btn"
          >
            <RefreshCw size={20} />
            <span>Dobara Khelo</span>
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

        {/* Fun Message */}
        <p className="fun-message" data-testid="fun-message">
          {result?.score_percentage >= 75 
            ? "Waah! Tumhara pati sach mein devta hai! 🎉" 
            : result?.score_percentage >= 50 
              ? "Theek hai, improvement ki gunjaish hai! 😄"
              : "Pati ko ye quiz dikhao aur sudhaaro! 😅"}
        </p>
      </div>
    </div>
  );
};

export default QuizResult;
