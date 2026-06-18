import { useEffect, useState } from 'react';
import { getProfileSummary } from '../api/profileApi';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfileSummary();
        setData(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loading text="Loading profile..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-5 border">
          <h3 className="font-semibold mb-3">Quiz Stats</h3>
          <p>Total: {data?.quiz?.total || 0}</p>
          <p>Best Score: {data?.quiz?.bestScore || 0}%</p>
          <p>Average Score: {data?.quiz?.averageScore || 0}%</p>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>OOP: {data?.quiz?.bySubject?.oop || 0}</p>
            <p>OS: {data?.quiz?.bySubject?.os || 0}</p>
            <p>DBMS: {data?.quiz?.bySubject?.dbms || 0}</p>
            <p>CN: {data?.quiz?.bySubject?.cn || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 border">
          <h3 className="font-semibold mb-3">DSA Stats</h3>
          <p>Total Solved: {data?.dsa?.total || 0}</p>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>Easy: {data?.dsa?.byDifficulty?.easy || 0}</p>
            <p>Medium: {data?.dsa?.byDifficulty?.medium || 0}</p>
            <p>Hard: {data?.dsa?.byDifficulty?.hard || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;