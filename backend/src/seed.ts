import mongoose from 'mongoose';
import Redis from 'ioredis';
import Quiz from './models/Quiz';
import Question from './models/Question';
import User from './models/User';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});


mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected')
    seedData();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  });

async function seedData() {
  try {
    console.log('Clearing existing DB data')
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});

    console.log('Removing existing Redis data')
    await redis.flushall();

    console.log('Adding sample quiz')
    const quiz = await Quiz.create({
      name: 'General Knowledge Quiz',
    });

    const questions = await Question.insertMany([
      { 
        quizId: quiz._id, 
        questionText: 'What is the largest planet in our solar system?', 
        correctAnswer: 'Jupiter', 
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      },
      { 
        quizId: quiz._id, 
        questionText: 'In what year did World War II end?', 
        correctAnswer: '1945', 
        options: ['1939', '1941', '1945', '1948'] 
      },
      { 
        quizId: quiz._id, 
        questionText: 'Who painted the Mona Lisa?', 
        correctAnswer: 'Leonardo da Vinci', 
        options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet'] 
      },
      { 
        quizId: quiz._id, 
        questionText: 'What is the chemical symbol for water?', 
        correctAnswer: 'H2O', 
        options: ['CO2', 'H2O', 'NaCl', 'O2'] 
      },
      { 
        quizId: quiz._id, 
        questionText: 'Which country is known as the Land of the Rising Sun?', 
        correctAnswer: 'Japan', 
        options: ['China', 'Japan', 'Thailand', 'South Korea'] 
      },
    ]);

    quiz.currentQuestion = questions[0]._id
    quiz.save()
    console.log(`Added sample quiz with id: ${quiz._id}`)

    console.log(`Adding sample users`)

    const users = await User.insertMany([
      { username: 'Alice', quizId: quiz._id, score: 30 },
      { username: 'Bob', quizId: quiz._id, score: 20 },
      { username: 'Charlie', quizId: quiz._id, score: 10 },
    ]);

    console.log(`Adding the users to Redis`)

    for (const user of users) {
      await redis.zadd(`quiz:${quiz._id}:leaderboard`, user.score, user.username);
    }

    console.log('Data seeding completed');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
    redis.disconnect();
  }
}
