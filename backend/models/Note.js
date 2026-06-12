import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    subject: {
      type: String,
      enum: ['oop', 'os', 'dbms', 'cn', 'dsa', 'general'],
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['quiz', 'dsa', 'general'],
      required: true,
      index: true
    },
    sourceType: {
      type: String,
      enum: ['manual', 'quiz', 'dsa'],
      default: 'manual'
    },
    sourceId: { type: String, default: null },
    problemLink: { type: String, default: null },
    quizAttemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserQuizAttempt', default: null },
    dsaQuestionId: { type: String, default: null }
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, subject: 1, category: 1 });

export default mongoose.model('Note', noteSchema);