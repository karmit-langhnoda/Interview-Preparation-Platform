import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getDashboardStats,
  getRecentSolved,
  getTodaySummary
} from '../services/dashboardService.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

export const getRecent = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const recent = await getRecentSolved(req.user.id, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, recent, 'Recent solved problems fetched successfully'));
});

export const getToday = asyncHandler(async (req, res) => {
  const daily = await getTodaySummary();

  if (!daily) {
    throw new ApiError(404, 'Today DSA data not found');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        date: daily.date,
        easy: daily.easy,
        medium: daily.medium,
        hard: daily.hard
      },
      'Today dashboard data fetched successfully'
    )
  );
});