import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizList, getMyQuizAttempts } from '../api/quizApi';
import QuizCard from '../components/Quiz/QuizCard';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const [quizzesRes, attemptsRes] = await Promise.all([getQuizList(), getMyQuizAttempts()]);
        setQuizzes(quizzesRes.data.data || []);
        setAttempts(attemptsRes.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <Loading text="Loading quizzes..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">Pick a subject and review your recent attempts.</p>
        </div>

        <button
          onClick={() => navigate('/dsa')}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white"
        >
          Go to DSA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.quizId || quiz.subject} quiz={quiz} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Attempts</h2>
            <p className="text-sm text-gray-500">Review completed quizzes and open the full explanation.</p>
          </div>
        </div>

        {attempts.length ? (
          <div className="grid grid-cols-1 gap-3">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border bg-gray-50 p-4"
              >
                <div>
                  <p className="font-semibold capitalize">{attempt.subject} Quiz</p>
                  <p className="text-sm text-gray-600">
                    Score {attempt.score}% | Correct {attempt.correctCount}/{attempt.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {attempt.quizPaper?.title || 'Quiz'} |{' '}
                    {attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : attempt.date}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/quiz-history/${attempt._id}`)}
                  className="px-4 py-2 rounded-lg border bg-white"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No quiz attempts yet.</p>
        )}
      </div>
    </div>
  );
};

export default QuizList;