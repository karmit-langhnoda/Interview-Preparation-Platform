import DailyDsa from '../models/DailyDsa.js';
import { loadProblemsFromCsv } from '../utils/dsaLoader.js';

const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const pickProblemForDate = (list, dateKey) => {
  if (!list.length) return null;
  const seed = dateKey
    .split('-')
    .join('')
    .split('')
    .reduce((sum, ch) => sum + Number(ch), 0);
  const idx = seed % list.length;
  return list[idx];
};

export const createOrUpdateTodayDsa = async () => {
  const date = getDateKey(new Date());

  const easyList = loadProblemsFromCsv('easy');
  const mediumList = loadProblemsFromCsv('medium');
  const hardList = loadProblemsFromCsv('hard');

  const easy = pickProblemForDate(easyList, date);
  const medium = pickProblemForDate(mediumList, date);
  const hard = pickProblemForDate(hardList, date);

  if (!easy || !medium || !hard) {
    throw new Error('Unable to pick daily problems');
  }

  const doc = await DailyDsa.findOneAndUpdate(
    { date },
    { date, easy, medium, hard },
    { new: true, upsert: true }
  );

  return doc;
};

export const getTodayDsa = async () => {
  const date = getDateKey(new Date());

  let doc = await DailyDsa.findOne({ date });

  if (!doc) {
    doc = await createOrUpdateTodayDsa();
  }

  return doc;
};