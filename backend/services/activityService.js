import UserActivity from '../models/UserActivity.js';
import { getLocalDateKey } from '../utils/dateKey.js';

export const upsertActivity = async ({ userId, quizInc = 0, dsaInc = 0, noteInc = 0, date }) => {
  const day = date || getLocalDateKey();
  return await UserActivity.findOneAndUpdate(
    { user: userId, date: day },
    { $inc: { quizCount: quizInc, dsaCount: dsaInc, noteCount: noteInc } },
    { new: true, upsert: true }
  );
};

export const getCalendarData = async (userId, year, month) => {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);

  const start = getLocalDateKey(first);
  const end = getLocalDateKey(last);

  const rows = await UserActivity.find({
    user: userId,
    date: { $gte: start, $lte: end }
  }).sort({ date: 1 });

  const days = {};
  for (const row of rows) {
    days[row.date] = {
      quizCount: row.quizCount,
      dsaCount: row.dsaCount,
      noteCount: row.noteCount
    };
  }

  return days;
};