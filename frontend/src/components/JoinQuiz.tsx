import React, { useState } from 'react';
import QuizApi from '../api/QuizApi'


const JoinQuiz: React.FC<{ onJoin: (quizId: string, userId: string) => void }> = ({ onJoin }) => {
  const [quizId, setQuizId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    QuizApi.joinQuiz(quizId, username, (response) => {
      if (response.success) {
        onJoin(quizId, response.userId);
      } else {
        console.error("Failed to join quiz:", response.message);
      }
    });
  };

  return (
    <div>
      <h2>Join Quiz</h2>
      <input value={quizId} onChange={(e) => setQuizId(e.target.value)} placeholder="Quiz ID" />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default JoinQuiz;
