import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    index: Number,
    title: String,
    url: String
  },
  { _id: false }
);

const dailyDsaSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true
    },
    easy: {
      type: problemSchema,
      required: true
    },
    medium: {
      type: problemSchema,
      required: true
    },
    hard: {
      type: problemSchema,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('DailyDsa', dailyDsaSchema);