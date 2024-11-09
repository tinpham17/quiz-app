import React, { useState } from 'react';
import JoinQuiz from './components/JoinQuiz';
import QuizQuestion from './components/QuizQuestion';
import Scoreboard from './components/Scoreboard';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [quizId, setQuizId] = useState('');
  const [userId, setUserId] = useState('');

  const handleJoin = (joinedQuizId: string, joinedUserId: string) => {
    setQuizId(joinedQuizId);
    setUserId(joinedUserId);
  };

  return (
    <div>
      {userId ? (
        <>
          <QuizQuestion quizId={quizId} userId={userId} />
          <Scoreboard quizId={quizId} userId={userId} />
          <Leaderboard quizId={quizId} />
        </>
      ) : (
        <JoinQuiz onJoin={handleJoin} />
      )}
    </div>
  );
};

export default App;