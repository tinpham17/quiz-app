import React, { useEffect, useState } from 'react';
import QuizApi from '../api/QuizApi';

const Leaderboard: React.FC<{ quizId: string }> = ({ quizId }) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    QuizApi.onLeaderboardUpdate(setLeaderboard);

    // return () => {
    //   QuizApi.disconnect();
    // };
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user: any, index: number) => (
          <li key={user._id}>
            {index + 1}. {user.username} - {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
