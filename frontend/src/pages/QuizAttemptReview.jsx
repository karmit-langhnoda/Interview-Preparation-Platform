import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizAttemptById } from '../api/quizApi';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';
import QuizReview from '../components/Quiz/QuizReview';

const QuizAttemptReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        setLoading(true);
        const res = await getQuizAttemptById(attemptId);
        setAttempt(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quiz attempt');
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [attemptId]);

  if (loading) return <Loading text="Loading quiz review..." />;
  if (error) return <ErrorState message={error} />;
  if (!attempt) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold capitalize">{attempt.quizPaper?.subject} Review</h1>
            <p className="text-sm text-gray-500 mt-1">{attempt.quizPaper?.title}</p>
            <p className="mt-3 text-gray-700">
              Score: {attempt.score}% | Correct: {attempt.correctCount} | Wrong: {attempt.wrongCount}
            </p>
          </div>

          <button onClick={() => navigate('/quizzes')} className="px-4 py-2 rounded-lg border">
            Back
          </button>
        </div>
      </div>

      <QuizReview questions={attempt.review} />
    </div>
  );
};

export default QuizAttemptReview;