import mongoose, { Schema } from 'mongoose';

const quizSchema = new Schema({
  name: { type: String, required: true },
  currentQuestion: { type: Schema.Types.ObjectId, ref: 'Question' },
});

export default mongoose.model('Quiz', quizSchema);
