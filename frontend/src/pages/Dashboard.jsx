import { useEffect, useState } from 'react';
import { getDashboardRecent, getDashboardStats, getStreakCalendar } from '../api/dashboardApi';
import { getProfileSummary } from '../api/profileApi';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';
import StatsCards from '../components/Dashboard/StatsCards';
import StreakCalendar from '../components/Dashboard/StreakCalendar';
import ProfileSummary from '../components/Dashboard/ProfileSummary';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const [statsRes, calendarRes, profileRes] = await Promise.all([
        getDashboardStats(),
        getStreakCalendar(now.getFullYear(), now.getMonth() + 1),
        getProfileSummary()
      ]);

      setStats(statsRes.data.data);
      setCalendar(calendarRes.data.data);
      setProfile(profileRes.data.data);

      const recentRes = await getDashboardRecent(5);
      setRecent(recentRes.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your daily preparation overview at a glance.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StreakCalendar
          year={calendar?.year}
          month={calendar?.month}
          days={calendar?.days?.days || {}}
          streak={calendar?.days?.streak || 0}
        />
        <ProfileSummary profile={profile} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Quiz Attempts */}
        <div className="card card-body">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">📝</span>
            <h3 className="section-title">Recent Quiz Attempts</h3>
          </div>
          <div className="space-y-3">
            {recent?.quiz?.length ? (
              recent.quiz.map((attempt) => (
                <div key={attempt._id} className="rounded-xl bg-slate-50 border border-slate-100 p-4 transition hover:bg-blue-50/40 hover:border-blue-100">
                  <p className="font-semibold text-slate-800 capitalize text-[.875rem]">{attempt.subject} <span className="text-blue-600">· {attempt.score}%</span></p>
                  <p className="text-xs text-slate-400 mt-1">{attempt.quizPaper?.title || 'Quiz'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recent quiz activity.</p>
            )}
          </div>
        </div>

        {/* Recent DSA Solves */}
        <div className="card card-body">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">💻</span>
            <h3 className="section-title">Recent DSA Solves</h3>
          </div>
          <div className="space-y-3">
            {recent?.dsa?.length ? (
              recent.dsa.map((item) => (
                <div key={item._id} className="rounded-xl bg-slate-50 border border-slate-100 p-4 transition hover:bg-emerald-50/40 hover:border-emerald-100">
                  <p className="font-semibold text-slate-800 capitalize text-[.875rem]">{item.difficulty} <span className="text-emerald-600">· {item.title}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Solved on {item.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recent DSA activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;