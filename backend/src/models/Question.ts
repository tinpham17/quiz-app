import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questionText: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  options: { type: [String], required: true }
});

export default mongoose.model('Question', questionSchema);
