import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { Check, X } from 'lucide-react';

export const QuizQuestion = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const currentQuestionIndex = parseInt(questionId) - 1;
  const [answers, setAnswers] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load previous answers from sessionStorage
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('quizAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    
    // Check if user has a name
    const userName = sessionStorage.getItem('quizUserName');
    if (!userName) {
      navigate('/quiz');
    }
  }, [navigate]);

  // Validate question number
  if (currentQuestionIndex < 0 || currentQuestionIndex >= QUIZ_QUESTIONS.length) {
    navigate('/quiz');
    return null;
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleAnswer = (answer) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answer
    };
    
    setAnswers(newAnswers);
    sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));

    // Navigate after brief animation
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        // Go to next question
        navigate(`/quiz/question/${currentQuestionIndex + 2}`);
      } else {
        // Quiz complete - go to results
        navigate('/quiz/result');
      }
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="quiz-question-page" data-testid="quiz-question-page">
      {/* Progress Bar */}
      <div className="progress-container" data-testid="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
            data-testid="progress-fill"
          />
        </div>
        <span className="progress-text" data-testid="progress-text">
          {currentQuestionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="question-container" data-testid="question-container">
        <span className="question-number">Q{currentQuestionIndex + 1}</span>
        <h2 className="question-text" data-testid="question-text">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answer Buttons - Full width, half screen each */}
      <div className="answer-buttons-container" data-testid="answer-buttons-container">
        <button
          onClick={() => handleAnswer('yes')}
          className={`answer-btn yes-btn ${isAnimating ? 'animating' : ''}`}
          disabled={isAnimating}
          data-testid="yes-btn"
        >
          <Check size={48} strokeWidth={3} />
          <span>HAAN</span>
        </button>
        
        <button
          onClick={() => handleAnswer('no')}
          className={`answer-btn no-btn ${isAnimating ? 'animating' : ''}`}
          disabled={isAnimating}
          data-testid="no-btn"
        >
          <X size={48} strokeWidth={3} />
          <span>NA</span>
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
