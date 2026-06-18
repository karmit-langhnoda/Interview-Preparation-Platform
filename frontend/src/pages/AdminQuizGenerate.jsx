import { useMemo, useState } from 'react';
import { generateQuiz } from '../api/adminApi';
import Loading from '../components/Common/Loading';

const subjects = ['oop', 'os', 'dbms', 'cn'];

const AdminQuizGenerate = () => {
  const [subject, setSubject] = useState('oop');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const subjectLabel = useMemo(() => subject.toUpperCase(), [subject]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await generateQuiz({ subject });
      const quiz = res.data.data || res.data;
      setMessage(`${quiz.title || subjectLabel} generated successfully.`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <h1 className="text-2xl font-bold">Admin Quiz Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Regenerate the backend quiz paper for a subject.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow p-5 border space-y-4">
        <div>
          <label className="block text-sm mb-2">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full md:w-72 border rounded-lg px-3 py-2"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? 'Generating...' : `Generate ${subjectLabel} Quiz`}
        </button>
      </form>
    </div>
  );
};

export default AdminQuizGenerate;