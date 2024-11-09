import { io, Socket } from 'socket.io-client';
import { Question } from '../types/Question';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const socket: Socket = io(API_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

const QuizApi = {
  joinQuiz: (quizId: string, username: string, callback: (response: any) => void) => {
    socket.emit('join-quiz', { quizId, username }, callback);
  },
  submitAnswer: (userId: string, quizId: string, answer: string) => {
    socket.emit('submit-answer', { userId, quizId, answer });
  },
  onNewQuestion: (callback: ({ userId, question }: { userId: string, question: Question }) => void) => {
    socket.on('new-question', callback);
  },
  onScoreUpdate: (callback: ({ userId, score }: { userId: string, score: number }) => void) => {
    socket.on('score-update', callback);
  },
  onLeaderboardUpdate: (callback: (leaderboard: any[]) => void) => {
    socket.on('leaderboard-update', callback);
  },
  disconnect: () => {
    console.log('disconnect');
    socket.disconnect();
  },
};

export default QuizApi;
