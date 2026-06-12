import UserQuizAttempt from '../models/UserQuizAttempt.js';
import UserDsaProgress from '../models/UserDsaProgress.js';
import UserActivity from '../models/UserActivity.js';

const dateKey = (d = new Date()) => d.toISOString().split('T')[0];

export const getProfileSummaryData = async (userId) => {
  const quizzes = await UserQuizAttempt.find({ user: userId }).sort({ createdAt: -1 });
  const dsa = await UserDsaProgress.find({ user: userId }).sort({ createdAt: -1 });

  const quizBySubject = {
    oop: quizzes.filter((q) => q.subject === 'oop').length,
    os: quizzes.filter((q) => q.subject === 'os').length,
    dbms: quizzes.filter((q) => q.subject === 'dbms').length,
    cn: quizzes.filter((q) => q.subject === 'cn').length
  };

  const dsaByDifficulty = {
    easy: dsa.filter((x) => x.difficulty === 'easy').length,
    medium: dsa.filter((x) => x.difficulty === 'medium').length,
    hard: dsa.filter((x) => x.difficulty === 'hard').length
  };

  return {
    quiz: {
      total: quizzes.length,
      bySubject: quizBySubject,
      averageScore: quizzes.length
        ? Math.round(quizzes.reduce((s, q) => s + (q.score || 0), 0) / quizzes.length)
        : 0,
      bestScore: quizzes.length ? Math.max(...quizzes.map((q) => q.score || 0)) : 0
    },
    dsa: {
      total: dsa.length,
      byDifficulty: dsaByDifficulty
    }
  };
};

export const upsertActivity = async ({ userId, quizInc = 0, dsaInc = 0, noteInc = 0, date }) => {
  const day = date || dateKey();
  return await UserActivity.findOneAndUpdate(
    { user: userId, date: day },
    {
      $inc: { quizCount: quizInc, dsaCount: dsaInc, noteCount: noteInc }
    },
    { new: true, upsert: true }
  );
};

export const getMonthlyCalendar = async (userId, year, month) => {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const start = dateKey(first);
  const end = dateKey(last);

  const activities = await UserActivity.find({
    user: userId,
    date: { $gte: start, $lte: end }
  }).sort({ date: 1 });

  const days = {};
  activities.forEach((a) => {
    days[a.date] = {
      quizCount: a.quizCount,
      dsaCount: a.dsaCount,
      noteCount: a.noteCount,
      active: true
    };
  });

  const dates = activities.map((a) => a.date).sort();
  let streak = 0;
  let expected = dateKey(new Date());

  for (let i = dates.length - 1; i >= 0; i--) {
    if (dates[i] === expected) {
      streak += 1;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = dateKey(d);
    } else if (dates[i] < expected) {
      break;
    }
  }

  return { year, month, streak, days };
};