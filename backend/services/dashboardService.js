import UserDsaProgress from '../models/UserDsaProgress.js';
import UserQuizAttempt from '../models/UserQuizAttempt.js';
import { getLocalDateKey } from '../utils/dateKey.js';
import { getTodayDsa } from './dsaService.js';

const computeStreak = (progressDocs) => {
  const solvedDates = [...new Set(progressDocs.map((doc) => doc.date))].sort().reverse();

  let streak = 0;
  let expectedDate = getLocalDateKey(new Date());

  for (const date of solvedDates) {
    if (date === expectedDate) {
      streak += 1;
      const d = new Date(expectedDate);
      d.setDate(d.getDate() - 1);
      expectedDate = getLocalDateKey(d);
    } else {
      break;
    }
  }

  return streak;
};

export const getDashboardStats = async (userId) => {
  const today = getLocalDateKey(new Date());

  const allDsaProgress = await UserDsaProgress.find({ user: userId }).sort({ createdAt: -1 });
  const todayDsaProgress = await UserDsaProgress.find({ user: userId, date: today });

  const allQuizAttempts = await UserQuizAttempt.find({ user: userId }).sort({ createdAt: -1 });
  const todayQuizAttempts = await UserQuizAttempt.find({ user: userId, date: today });

  const totalSolvedDsa = allDsaProgress.length;
  const solvedDsaToday = todayDsaProgress.length;
  const dsaStreak = computeStreak(allDsaProgress);

  const totalQuizAttempts = allQuizAttempts.length;
  const quizAttemptsToday = todayQuizAttempts.length;

  const quizBySubject = {
    oop: allQuizAttempts.filter((a) => a.subject === 'oop').length,
    os: allQuizAttempts.filter((a) => a.subject === 'os').length,
    dbms: allQuizAttempts.filter((a) => a.subject === 'dbms').length,
    cn: allQuizAttempts.filter((a) => a.subject === 'cn').length
  };

  const totalQuizScore = allQuizAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const averageQuizScore =
    totalQuizAttempts > 0 ? Math.round(totalQuizScore / totalQuizAttempts) : 0;

  return {
    dsa: {
      totalSolved: totalSolvedDsa,
      solvedToday: solvedDsaToday,
      streak: dsaStreak
    },
    quiz: {
      totalAttempts: totalQuizAttempts,
      attemptsToday: quizAttemptsToday,
      averageScore: averageQuizScore,
      bySubject: quizBySubject
    }
  };
};

export const getRecentSolved = async (userId, limit = 10) => {
  const recentDsa = await UserDsaProgress.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  const recentQuiz = await UserQuizAttempt.find({ user: userId })
    .populate('quizPaper', 'subject title version')
    .sort({ createdAt: -1 })
    .limit(limit);

  return {
    dsa: recentDsa,
    quiz: recentQuiz
  };
};

export const getTodaySummary = async () => {
  return await getTodayDsa();
};