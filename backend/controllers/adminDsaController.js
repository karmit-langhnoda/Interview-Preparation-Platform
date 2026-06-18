import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import UserDsaProgress from '../models/UserDsaProgress.js';
import { regenerateTodayDsa as regenerateService } from '../services/dsaService.js';

export const regenerateTodayDsa = asyncHandler(async (req, res) => {
  const doc = await regenerateService();
  // Clear user DSA progress for that date so users see the new problems as unsolved.
  try {
    if (doc?.date) {
      await UserDsaProgress.deleteMany({ date: doc.date });
    }
  } catch (err) {
    // Non-fatal: log and continue
    console.error('Failed to clear user DSA progress after regeneration:', err.message || err);
  }

  return res.status(200).json(new ApiResponse(200, doc, 'Daily DSA regenerated'));
});
