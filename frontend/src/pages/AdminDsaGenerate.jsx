import { useState } from 'react';
import { regenerateDsa } from '../api/adminApi';
import Loading from '../components/Common/Loading';

const AdminDsaGenerate = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await regenerateDsa();
      const doc = res.data.data || res.data;
      setMessage(`Daily DSA for ${doc.date} regenerated.`);
      setDsa(doc);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to regenerate DSA');
    } finally {
      setLoading(false);
    }
  };

  const [dsa, setDsa] = useState(null);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <h1 className="text-2xl font-bold">Admin DSA Regenerator</h1>
        <p className="text-sm text-gray-500 mt-1">Force-generate today's DSA problems.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        {dsa && (
          <div className="mt-3 text-sm">
            <p className="font-semibold">Easy: <a className="text-blue-600" href={dsa.easy.url} target="_blank" rel="noreferrer">{dsa.easy.title}</a></p>
            <p className="font-semibold">Medium: <a className="text-blue-600" href={dsa.medium.url} target="_blank" rel="noreferrer">{dsa.medium.title}</a></p>
            <p className="font-semibold">Hard: <a className="text-blue-600" href={dsa.hard.url} target="_blank" rel="noreferrer">{dsa.hard.title}</a></p>
          </div>
        )}

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? 'Regenerating...' : `Regenerate Today's DSA`}
        </button>
      </div>
    </div>
  );
};

export default AdminDsaGenerate;
