import React, { useState, useEffect } from 'react';
import QuizApi from '../api/QuizApi';
import { Question } from '../types/Question';

interface QuizQuestionProps {
  quizId: string;
  userId: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ quizId, userId }) => {
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    QuizApi.onNewQuestion(params => {
      if (params.userId === userId) {
        setQuestion(params.question)
      }
    });
    QuizApi.onScoreUpdate(params => {
      if (params.userId === userId) {
        setScore(params.score)
      }
    });
  }, [userId]);

  const handleSubmitAnswer = () => {
    QuizApi.submitAnswer(userId, quizId, answer);
    setAnswer('');
  };

  return (
    <div>
      <h3>Current Score: {score}</h3>
      <p>{question?.questionText}</p>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your Answer" />
      <button onClick={handleSubmitAnswer}>Submit Answer</button>
    </div>
  );
};

export default QuizQuestion;
