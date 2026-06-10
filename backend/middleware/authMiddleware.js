import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const tokenFromCookie = req.cookies?.userToken;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    throw new ApiError(401, 'User token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      throw new ApiError(403, 'Access denied');
    }

    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired user token');
  }
});

export default authMiddleware;