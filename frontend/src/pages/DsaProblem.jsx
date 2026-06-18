import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';
import { getDsaProgress, getTodayDsa, markDsaSolved } from '../api/dsaApi';

const DsaProblem = () => {
  const { difficulty } = useParams();
  const [today, setToday] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [solving, setSolving] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [todayRes, progressRes] = await Promise.all([getTodayDsa(), getDsaProgress()]);
      const todayData = todayRes.data.data;
      const allProgress = progressRes.data.data || [];

      // Only consider progress entries for today's date; past progress shouldn't mark today's problems as solved
      const todayProgress = allProgress.filter((p) => p.date === todayData.date);

      setToday(todayData);
      setProgress(todayProgress);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load DSA problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Poll periodically so users see regenerations performed by admins.
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 15000); // 15s

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const solvedByDifficulty = useMemo(() => {
    return progress.reduce((acc, item) => {
      acc[item.difficulty] = item;
      return acc;
    }, {});
  }, [progress]);

  const handleSolve = async (problemDifficulty) => {
    try {
      setSolving(problemDifficulty);
      await markDsaSolved(problemDifficulty);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark problem solved');
    } finally {
      setSolving('');
    }
  };

  if (loading) return <Loading text="Loading today's DSA..." />;
  if (error) return <ErrorState message={error} />;
  if (!today) return null;

  const problems = [
    { key: 'easy', label: 'Easy', problem: today.easy },
    { key: 'medium', label: 'Medium', problem: today.medium },
    { key: 'hard', label: 'Hard', problem: today.hard }
  ];

  const visibleProblems = difficulty ? problems.filter((item) => item.key === difficulty) : problems;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Today's DSA</h1>
            <p className="text-sm text-gray-500 mt-1">Solve the daily problems and track your progress.</p>
          </div>
          <div className="text-sm text-gray-500">Date: {today.date}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {visibleProblems.map(({ key, label, problem }) => {
          const solved = !!solvedByDifficulty[key];

          return (
            <div key={key} className="bg-white rounded-2xl shadow p-5 border flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold capitalize">{label}</h2>
                  <p className="text-sm text-gray-500">Problem #{problem.index}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${solved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {solved ? 'Solved' : 'Pending'}
                </span>
              </div>

              <p className="font-medium leading-6">{problem.title}</p>

              <div className="flex flex-wrap gap-3 mt-auto">
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg border"
                >
                  Open Problem
                </a>
                <button
                  onClick={() => handleSolve(key)}
                  disabled={solving === key || solved}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
                >
                  {solving === key ? 'Saving...' : solved ? 'Already Solved' : 'Mark Solved'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border">
        <h3 className="text-lg font-semibold mb-4">Recent DSA Progress</h3>
        {progress.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progress.map((item) => (
              <div key={item._id} className="rounded-xl bg-gray-50 border p-4">
                <p className="font-medium capitalize">{item.difficulty} | {item.title}</p>
                <p className="text-sm text-gray-500">Solved on {item.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No DSA progress yet.</p>
        )}
      </div>
    </div>
  );
};

export default DsaProblem;