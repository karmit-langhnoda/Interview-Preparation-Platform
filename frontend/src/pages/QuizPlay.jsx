import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizBySubject, submitQuiz } from '../api/quizApi';
import QuestionCard from '../components/Quiz/QuestionCard';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';

const QuizPlay = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await getQuizBySubject(subject);
        setQuiz(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [subject]);

  const handleSelect = (index) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: index
    }));
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = {
        answers: Object.entries(answers).map(([questionIndex, selectedIndex]) => ({
          questionIndex: Number(questionIndex),
          selectedIndex
        }))
      };

      const res = await submitQuiz(quiz.quizId, payload);
      navigate(`/quiz/${subject}/result`, {
        state: {
          result: res.data.data,
          subject
        }
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading quiz..." />;
  if (error) return <ErrorState message={error} />;
  if (!quiz) return null;

  const question = quiz.questions[current];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold capitalize">{quiz.subject} Quiz</h1>
            <p className="text-sm text-gray-500">
              {quiz.title} | Version {quiz.version}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>
            Question {current + 1} of {quiz.questions.length}
          </span>
          <span>
            Answered {Object.keys(answers).length} of {quiz.questions.length}
          </span>
        </div>
      </div>

      <QuestionCard
        question={question}
        selectedIndex={answers[current]}
        onSelect={handleSelect}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={current === quiz.questions.length - 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizPlay;