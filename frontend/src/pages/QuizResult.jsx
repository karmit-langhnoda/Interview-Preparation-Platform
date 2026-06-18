import { useLocation, useNavigate } from 'react-router-dom';
import QuizReview from '../components/Quiz/QuizReview';
import MakeNoteModal from '../components/Quiz/MakeNoteModal';
import { useState } from 'react';
import { createNote } from '../api/noteApi';

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showNote, setShowNote] = useState(false);

  if (!state?.result) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 border">
        <p>No quiz result found.</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const { result, subject } = state;

  const handleMakeNote = async (payload) => {
    await createNote({
      ...payload,
      subject,
      category: subject === 'dsa' ? 'dsa' : 'quiz',
      sourceType: 'quiz',
      sourceId: String(result.attemptId),
      quizAttemptId: result.attemptId
    });
    setShowNote(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5 border">
        <h1 className="text-2xl font-bold capitalize mb-2">{subject} Result</h1>
        <p className="text-gray-600">
          Score: {result.score}% | Correct: {result.correctCount} | Wrong: {result.wrongCount}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowNote(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Add Note
          </button>

          <button
            onClick={() => navigate('/notes')}
            className="px-4 py-2 rounded-lg border"
          >
            Go to Notes
          </button>
        </div>
      </div>

      <QuizReview questions={result.questions} />

      <MakeNoteModal
        open={showNote}
        onClose={() => setShowNote(false)}
        defaultSubject={subject}
        defaultCategory={subject === 'dsa' ? 'dsa' : 'quiz'}
        extra={{
          sourceType: 'quiz',
          sourceId: String(result.attemptId),
          quizAttemptId: result.attemptId
        }}
        onSave={handleMakeNote}
      />
    </div>
  );
};

export default QuizResult;