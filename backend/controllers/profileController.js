import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getProfileSummaryData } from '../services/profileService.js';

export const getProfileSummary = asyncHandler(async (req, res) => {
  const data = await getProfileSummaryData(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Profile summary fetched successfully'));
});