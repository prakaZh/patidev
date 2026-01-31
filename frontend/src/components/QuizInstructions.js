import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';

export const QuizInstructions = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Clear any previous quiz data
    sessionStorage.removeItem('quizAnswers');
    navigate('/quiz/question/1');
  };

  return (
    <div className="quiz-instructions-page" data-testid="quiz-instructions-page">
      <div className="instructions-container">
        {/* Header - Heart only, no Quiz Time label */}
        <div className="instructions-header">
          <Heart className="heart-icon" fill="currentColor" size={48} />
        </div>

        {/* Instructions List */}
        <div className="instructions-list-container" data-testid="instructions-card">
          <h2 className="instructions-subtitle">How to Play</h2>
          
          <ul className="instructions-list">
            <li>
              <span className="instruction-number">1</span>
              <span>Answer 15 questions with <strong>YES</strong> or <strong>NO</strong></span>
            </li>
            <li>
              <span className="instruction-number">2</span>
              <span>Go with the <strong>first answer</strong> that comes to mind</span>
            </li>
            <li>
              <span className="instruction-number">3</span>
              <span>Don't overthink — <strong>answer quickly!</strong></span>
            </li>
            <li>
              <span className="instruction-number">4</span>
              <span>Be honest for the <strong>most accurate result</strong></span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartQuiz}
          className="start-quiz-btn"
          data-testid="start-quiz-btn"
        >
          <span>START QUIZ</span>
          <ChevronRight size={24} />
        </button>

        {/* Fun Note */}
        <p className="fun-note" data-testid="fun-note">
          Let's find out if your husband is truly a Devta! 💕
        </p>
      </div>
    </div>
  );
};

export default QuizInstructions;
