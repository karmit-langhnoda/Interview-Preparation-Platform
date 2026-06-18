import mongoose from 'mongoose';
import DailyDsa from '../models/DailyDsa.js';
import { loadProblemsFromCsv } from '../utils/dsaLoader.js';
import { getDailyDsaTimeZone, getLocalDateKey } from '../utils/dateKey.js';

let inMemoryToday = null;

const getDateOrdinal = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);

  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};

const getDifficultyOffset = (difficulty) => {
  switch (difficulty) {
    case 'medium':
      return 1;
    case 'hard':
      return 2;
    default:
      return 0;
  }
};

const pickProblemForDate = (list, dateKey, difficulty) => {
  if (!list.length) return null;

  const dayIndex = getDateOrdinal(dateKey);
  const idx = (dayIndex + getDifficultyOffset(difficulty)) % list.length;

  return list[idx];
};

export const createOrUpdateTodayDsa = async () => {
  const timeZone = getDailyDsaTimeZone();
  const date = getLocalDateKey(new Date(), timeZone);

  const easyList = loadProblemsFromCsv('easy');
  const mediumList = loadProblemsFromCsv('medium');
  const hardList = loadProblemsFromCsv('hard');

  const easy = pickProblemForDate(easyList, date, 'easy');
  const medium = pickProblemForDate(mediumList, date, 'medium');
  const hard = pickProblemForDate(hardList, date, 'hard');

  if (!easy || !medium || !hard) {
    throw new Error('Unable to pick daily problems');
  }

  // If Mongo isn't connected (e.g., running locally without DB), don't hang —
  // just return the computed object so callers still see today's rotated problems.
  if (!mongoose || mongoose.connection?.readyState !== 1) {
    return { date, easy, medium, hard };
  }

  const doc = await DailyDsa.findOneAndUpdate(
    { date },
    { date, easy, medium, hard },
    { new: true, upsert: true }
  );

  return doc;
};

export const getTodayDsa = async () => {
  const timeZone = getDailyDsaTimeZone();
  const date = getLocalDateKey(new Date(), timeZone);

  // If Mongo isn't connected, prefer any in-memory regenerated doc so admin
  // regenerations are visible to users in local/dev environments.
  if (!mongoose || mongoose.connection?.readyState !== 1) {
    if (inMemoryToday && inMemoryToday.date === date) return inMemoryToday;
    return createOrUpdateTodayDsa();
  }

  // When DB is available, return the stored document if it exists to avoid
  // overwriting an admin-regenerated set with deterministic picks.
  let doc = await DailyDsa.findOne({ date });
  if (doc) return doc;
  return await createOrUpdateTodayDsa();
};


export const regenerateTodayDsa = async (options = {}) => {
  const timeZone = getDailyDsaTimeZone();
  const date = getLocalDateKey(new Date(), timeZone);

  const easyList = loadProblemsFromCsv('easy');
  const mediumList = loadProblemsFromCsv('medium');
  const hardList = loadProblemsFromCsv('hard');

  const randIndex = (list) => Math.floor(Math.random() * list.length);

  const easy = easyList[randIndex(easyList)];
  const medium = mediumList[randIndex(mediumList)];
  const hard = hardList[randIndex(hardList)];

  if (!easy || !medium || !hard) {
    throw new Error('Unable to pick daily problems');
  }

  if (!mongoose || mongoose.connection?.readyState !== 1) {
    inMemoryToday = { date, easy, medium, hard };
    return inMemoryToday;
  }

  const doc = await DailyDsa.findOneAndUpdate(
    { date },
    { date, easy, medium, hard, regeneratedAt: new Date() },
    { new: true, upsert: true }
  );

  // Clear in-memory cache when DB used
  inMemoryToday = null;

  return doc;
};