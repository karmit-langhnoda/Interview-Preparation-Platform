import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: 'Each question must have exactly 4 options'
      },
      required: true
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    explanation: { type: String }
  },
  { _id: false }
);

const quizPaperSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: ['oop', 'os', 'dbms', 'cn'],
      required: true,
      unique: true
    },
    title: {
      type: String,
      default: 'Daily Subject Quiz'
    },
    questions: {
      type: [quizQuestionSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 15,
        message: 'Quiz must have exactly 15 questions'
      },
      required: true
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model('QuizPaper', quizPaperSchema);