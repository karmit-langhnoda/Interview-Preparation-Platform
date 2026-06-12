import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    quizCount: { type: Number, default: 0 },
    dsaCount: { type: Number, default: 0 },
    noteCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userActivitySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('UserActivity', userActivitySchema);