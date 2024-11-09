import React, { useEffect, useState } from 'react';
import QuizApi from '../api/QuizApi';

interface ScoreboardProps {
  quizId: string;
  userId: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ quizId, userId }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Listen for real-time score updates
    QuizApi.onScoreUpdate((params) => {
      if (params.userId === userId) {
        setScore(params.score);
      }
    });
  }, [userId]);

  return (
    <div>
      <h2>Your Score Board</h2>
      <p>{score}</p>
    </div>
  );
};

export default Scoreboard;
