import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import DailyDsa from '../models/DailyDsa.js';
import UserDsaProgress from '../models/UserDsaProgress.js';
import { upsertActivity } from '../services/activityService.js';
import { getTodayDsa } from '../services/dsaService.js';

export const getTodayProblems = asyncHandler(async (req, res) => {
  const daily = await getTodayDsa();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        date: daily.date,
        easy: daily.easy,
        medium: daily.medium,
        hard: daily.hard
      },
      'Today DSA fetched successfully'
    )
  );
});

export const markSolved = asyncHandler(async (req, res) => {
  const { difficulty } = req.body;

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new ApiError(400, 'difficulty must be easy, medium, or hard');
  }

  const daily = await getTodayDsa();
  const problem = daily[difficulty];

  if (!problem) {
    throw new ApiError(404, 'Problem not found for this difficulty');
  }

  const progress = await UserDsaProgress.findOneAndUpdate(
    {
      user: req.user.id,
      date: daily.date,
      difficulty
    },
    {
      user: req.user.id,
      date: daily.date,
      difficulty,
      problemIndex: problem.index,
      title: problem.title,
      solved: true,
      solvedAt: new Date()
    },
    { new: true, upsert: true }
  );

  await upsertActivity({ userId: req.user.id, dsaInc: 1, date: daily.date });

  return res.status(200).json(
    new ApiResponse(200, progress, 'Marked as solved successfully')
  );
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const progress = await UserDsaProgress.find({ user: req.user.id }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, progress, 'User DSA progress fetched successfully')
  );
});

export const getTodayProblemByDifficulty = asyncHandler(async (req, res) => {
  const difficulty = req.params.difficulty?.toLowerCase();

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new ApiError(400, 'Invalid difficulty');
  }

  const daily = await getTodayDsa();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        date: daily.date,
        difficulty,
        problem: daily[difficulty]
      },
      'Today problem fetched successfully'
    )
  );
});