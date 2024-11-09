import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  score: { type: Number, default: 0 },
});

export default mongoose.model('User', userSchema);
