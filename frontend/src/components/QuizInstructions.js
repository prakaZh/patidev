import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, AlertCircle } from 'lucide-react';

export const QuizInstructions = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showError, setShowError] = useState(false);

  const handleStartQuiz = () => {
    if (!userName.trim()) {
      setShowError(true);
      return;
    }
    // Store username in sessionStorage for later use
    sessionStorage.setItem('quizUserName', userName.trim());
    navigate('/quiz/question/1');
  };

  return (
    <div className="quiz-instructions-page" data-testid="quiz-instructions-page">
      <div className="instructions-container">
        {/* Header */}
        <div className="instructions-header">
          <Heart className="heart-icon" fill="currentColor" size={40} />
          <h1 className="instructions-title" data-testid="instructions-title">
            QUIZ TIME!
          </h1>
        </div>

        {/* Instructions Card */}
        <div className="instructions-card" data-testid="instructions-card">
          <h2 className="instructions-subtitle">Kaise Khelna Hai?</h2>
          
          <ul className="instructions-list">
            <li>
              <span className="instruction-number">1</span>
              <span>15 sawaal honge - sirf <strong>HAAN</strong> ya <strong>NA</strong></span>
            </li>
            <li>
              <span className="instruction-number">2</span>
              <span>Jo pehle mann mein aaye wo jawaab do</span>
            </li>
            <li>
              <span className="instruction-number">3</span>
              <span>Zyada sochna nahi - <strong>jaldi jawab do!</strong></span>
            </li>
            <li>
              <span className="instruction-number">4</span>
              <span>Honest rehna - result tabhi sahi aayega 😉</span>
            </li>
          </ul>

          {/* Name Input */}
          <div className="name-input-container">
            <label htmlFor="userName" className="name-label">Apna Naam Daalo:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setShowError(false);
              }}
              placeholder="e.g., Priya"
              className={`name-input ${showError ? 'error' : ''}`}
              data-testid="user-name-input"
            />
            {showError && (
              <div className="error-message" data-testid="error-message">
                <AlertCircle size={16} />
                <span>Pehle apna naam daalo!</span>
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartQuiz}
          className="start-quiz-btn"
          data-testid="start-quiz-btn"
        >
          <Play size={24} fill="currentColor" />
          <span>SHURU KARO</span>
        </button>

        {/* Fun Note */}
        <p className="fun-note" data-testid="fun-note">
          Dekhte hain tumhara pati kitna devta hai! 😂
        </p>
      </div>
    </div>
  );
};

export default QuizInstructions;
