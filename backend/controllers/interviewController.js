import InterviewSession from '../models/InterviewSession.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { getInterviewIntro, getInterviewReply } from '../services/groqInterviewService.js';

const buildSystemPrompt = (difficulty, subjects) =>
  `You are a technical interview bot.
Difficulty: ${difficulty}.
Subjects: ${subjects.join(', ')}.
Ask one question at a time.
Use prior context.
Ask the next question based on the user's last answer.
Keep it focused and realistic.`;

export const startInterview = asyncHandler(async (req, res) => {
  const { difficulty, subjects } = req.body;

  if (!difficulty || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
    throw new ApiError(400, 'Difficulty and at least one subject are required');
  }

  const session = await InterviewSession.create({
    user: req.user.id,
    difficulty,
    subjects,
    messages: [
      {
        role: 'system',
        content: buildSystemPrompt(difficulty, subjects)
      }
    ]
  });

  const reply = await getInterviewIntro(subjects, difficulty);
  session.messages.push(reply);
  await session.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        sessionId: session._id,
        reply
      },
      'Interview started successfully'
    )
  );
});

export const sendInterviewMessage = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  if (!message) throw new ApiError(400, 'Message is required');

  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user.id,
    status: 'active'
  });

  if (!session) throw new ApiError(404, 'Active interview session not found');

  session.messages.push({ role: 'user', content: message });

  const reply = await getInterviewReply(session.messages);
  session.messages.push(reply);
  await session.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { sessionId: session._id, reply },
      'Interview message processed successfully'
    )
  );
});

export const endInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user.id,
    status: 'active'
  });

  if (!session) throw new ApiError(404, 'Active interview session not found');

  await InterviewSession.deleteOne({ _id: session._id });

  return res.status(200).json(new ApiResponse(200, null, 'Interview ended and deleted'));
});

export const deleteActiveInterviewsOnLogout = asyncHandler(async (req, res) => {
  await InterviewSession.deleteMany({ user: req.user.id, status: 'active' });
  return res.status(200).json(new ApiResponse(200, null, 'Active interviews cleared'));
});

export const clearActiveInterviewSessions = asyncHandler(async (req, res) => {
  await InterviewSession.deleteMany({ user: req.user.id, status: 'active' });
  return res.status(200).json(new ApiResponse(200, null, 'Active interview sessions cleared'));
});