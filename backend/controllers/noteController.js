import Note from '../models/Note.js';
import { upsertActivity } from '../services/activityService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createNote = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subject,
    category,
    sourceType = 'manual',
    sourceId = null,
    problemLink = null,
    quizAttemptId = null,
    dsaQuestionId = null
  } = req.body;

  if (!title || !description || !subject || !category) {
    throw new ApiError(400, 'Title, description, subject and category are required');
  }

  const note = await Note.create({
    user: req.user.id,
    title,
    description,
    subject,
    category,
    sourceType,
    sourceId,
    problemLink,
    quizAttemptId,
    dsaQuestionId
  });

  await upsertActivity({ userId: req.user.id, noteInc: 1 });

  return res.status(201).json(new ApiResponse(201, note, 'Note created successfully'));
});

export const getNotes = asyncHandler(async (req, res) => {
  const { subject, category, search } = req.query;
  const query = { user: req.user.id };

  if (subject) query.subject = subject;
  if (category) query.category = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const notes = await Note.find(query).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, notes, 'Notes fetched successfully'));
});

export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const note = await Note.findById(id);
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (note.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  Object.assign(note, updates);
  await note.save();

  return res.status(200).json(new ApiResponse(200, note, 'Note updated successfully'));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (note.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  await note.deleteOne();
  await upsertActivity({ userId: req.user.id, noteInc: -1 });

  return res.status(200).json(new ApiResponse(200, null, 'Note deleted successfully'));
});