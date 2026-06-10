import mongoose from 'mongoose';

const userDsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    problemIndex: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    solved: {
      type: Boolean,
      default: true
    },
    solvedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

userDsaProgressSchema.index({ user: 1, date: 1, difficulty: 1 }, { unique: true });

export default mongoose.model('UserDsaProgress', userDsaProgressSchema);