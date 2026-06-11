import QuizPaper from '../models/QuizPaper.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateQuizWithGroq } from '../services/groqQuizService.js';

const getDateKey = (date = new Date()) => date.toISOString().split('T')[0];

export const generateOrRegenerateQuiz = asyncHandler(async (req, res) => {
  const { subject } = req.body;

  if (!['oop', 'os', 'dbms', 'cn'].includes(subject)) {
    throw new ApiError(400, 'subject must be one of: oop, os, dbms, cn');
  }

  const questions = await generateQuizWithGroq(subject);

  const formattedQuestions = questions.map((q) => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    difficulty: q.difficulty,
    explanation: q.explanation
  }));

  const existing = await QuizPaper.findOne({ subject });

  let version = 1;
  if (existing) {
    version = existing.version + 1;
  }

  const quiz = await QuizPaper.findOneAndUpdate(
    { subject },
    {
      subject,
      title: `${subject.toUpperCase()} Quiz - ${getDateKey()}`,
      questions: formattedQuestions,
      generatedAt: new Date(),
      generatedBy: req.admin.id,
      version
    },
    { new: true, upsert: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, 'Quiz generated successfully'));
});