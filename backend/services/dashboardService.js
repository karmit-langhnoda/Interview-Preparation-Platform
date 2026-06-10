import UserDsaProgress from '../models/UserDsaProgress.js';
import DailyDsa from '../models/DailyDsa.js';

const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const getNDaysAgoKey = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return getDateKey(date);
};

const computeStreak = (progressDocs) => {
  const solvedDates = [...new Set(progressDocs.map((doc) => doc.date))].sort().reverse();

  let streak = 0;
  let expectedDate = getDateKey(new Date());

  for (const date of solvedDates) {
    if (date === expectedDate) {
      streak += 1;
      const d = new Date(expectedDate);
      d.setDate(d.getDate() - 1);
      expectedDate = getDateKey(d);
    } else {
      break;
    }
  }

  return streak;
};

export const getDashboardStats = async (userId) => {
  const today = getDateKey(new Date());

  const allProgress = await UserDsaProgress.find({ user: userId }).sort({ createdAt: -1 });
  const todayProgress = await UserDsaProgress.find({ user: userId, date: today });

  const totalSolved = allProgress.length;
  const solvedToday = todayProgress.length;
  const streak = computeStreak(allProgress);

  return {
    totalSolved,
    solvedToday,
    streak
  };
};

export const getRecentSolved = async (userId, limit = 10) => {
  const recent = await UserDsaProgress.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return recent;
};

export const getTodaySummary = async () => {
  const today = getDateKey(new Date());
  const daily = await DailyDsa.findOne({ date: today });

  return daily;
};