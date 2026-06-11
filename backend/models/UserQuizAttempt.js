import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    selectedIndex: { type: Number, min: 0, max: 3 },
    correctIndex: { type: Number, min: 0, max: 3, required: true },
    isCorrect: { type: Boolean, default: false }
  },
  { _id: false }
);

const userQuizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quizPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizPaper',
      required: true
    },
    subject: {
      type: String,
      enum: ['oop', 'os', 'dbms', 'cn'],
      required: true
    },
    date: {
      type: String,
      required: true
    },
    answers: {
      type: [answerSchema],
      default: []
    },
    score: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctCount: {
      type: Number,
      default: 0
    },
    wrongCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userQuizAttemptSchema.index({ user: 1, quizPaper: 1 }, { unique: true });

export default mongoose.model('UserQuizAttempt', userQuizAttemptSchema);