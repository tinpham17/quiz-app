import express from "express";
import http from "http"
import { Server } from 'socket.io'
import mongoose from "mongoose"

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

mongoose.connect(MONGO_URI);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

import Redis from 'ioredis';
import Quiz from "./models/Quiz";
import User from "./models/User";
import Question from "./models/Question";

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: 'ok' })
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
});
console.log('Connected to Redis');

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('join-quiz', async ({ quizId, username }: { quizId: string; username: string }, callback: (response: any) => void) => {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return callback({ success: false, message: 'Quiz not found' });
      }

      socket.join(quizId);

      let user = await User.findOne({ username, quizId });
      if (!user) {
        user = await User.create({ username, quizId, score: 0 });
      }

      // Add user to Redis leaderboard
      await redis.zadd(`quiz:${quizId}:leaderboard`, user.score, user.username);

      callback({ success: true, userId: user._id });

      updateLeaderboard(quizId);

      const question = await Question.findById(quiz.currentQuestion).lean()
      const { correctAnswer, __v, ...rest } = { ...question }
      socket.emit('new-question', {
        userId: user._id,
        question: rest,
      });

      io.to(socket.id).emit('score-update', {
        userId: user._id,
        score: user.score
      });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: 'Server error' });
    }
  });

  socket.on('submit-answer', async ({ userId, quizId, answer }: { userId: string; quizId: string; answer: string }) => {
    try {
      const quiz = await Quiz.findById(quizId).populate('currentQuestion');
      if (!quiz) return;

      console.log(quiz, socket.id)
      const correctAnswer = (quiz.currentQuestion as any).correctAnswer;
      const user = await User.findOne({ quizId, _id: userId });
      if (!user) return;

      console.log('Jupiter')

      if (answer === correctAnswer) {
        user.score += 10;
        await user.save();

        // Update score in Redis
        await redis.zincrby(`quiz:${quizId}:leaderboard`, 10, user.username);

        io.to(socket.id).emit('score-update', {
          userId: user._id,
          score: user.score
        });

        updateLeaderboard(quizId);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

async function updateLeaderboard(quizId: string) {
  try {
    const leaderboard = await redis.zrevrange(`quiz:${quizId}:leaderboard`, 0, -1, 'WITHSCORES');
    const formattedLeaderboard = leaderboard.reduce((acc: any[], value: string, index: number) => {
      if (index % 2 === 0) {
        acc.push({ username: value, score: Number(leaderboard[index + 1]) });
      }
      return acc;
    }, []);
    io.to(quizId).emit('leaderboard-update', formattedLeaderboard);
  } catch (error) {
    console.error('Failed to update leaderboard:', error);
  }
}
