import User from '../models/User.js';
import Admin from '../models/Admin.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import InterviewSession from '../models/InterviewSession.js';
const ADMIN_EMAIL = 'admin2005@gmail.com';

const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

export const userSignup = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  if (email.toLowerCase().trim() === ADMIN_EMAIL) {
    throw new ApiError(403, 'This email is reserved for admin');
  }

  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase().trim() },
      { username: username.toLowerCase().trim() }
    ]
  });

  if (existingUser) {
    throw new ApiError(409, 'User already exists');
  }

  const user = await User.create({
    username: username.toLowerCase().trim(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password
  });

  const token = user.generateAccessToken();
  const userData = await User.findById(user._id).select('-password');

  return res
    .cookie('userToken', token, userCookieOptions)
    .status(201)
    .json(new ApiResponse(201, { user: userData, token }, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail === ADMIN_EMAIL) {
    const admin = await Admin.findOne({ email: ADMIN_EMAIL }).select('+password');

    if (!admin) {
      throw new ApiError(404, 'Admin account not found');
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = admin.generateAccessToken();
    const adminData = await Admin.findById(admin._id).select('-password');

    return res
      .cookie('adminToken', token, adminCookieOptions)
      .status(200)
      .json(new ApiResponse(200, { admin: adminData, token, role: 'admin' }, 'Admin logged in successfully'));
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = user.generateAccessToken();
  const userData = await User.findById(user._id).select('-password');

  return res
    .cookie('userToken', token, userCookieOptions)
    .status(200)
    .json(new ApiResponse(200, { user: userData, token, role: 'user' }, 'User logged in successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    await InterviewSession.deleteMany({ user: req.user.id, status: 'active' });
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});