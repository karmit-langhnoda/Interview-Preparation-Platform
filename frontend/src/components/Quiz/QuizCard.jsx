import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();
  const canStart = !!quiz.generated;

  return (
    <div className="card card-body flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📝</span>
          <h3 className="text-[1rem] font-bold text-slate-800 capitalize">{quiz.subject}</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">{quiz.title}</p>
        <p className="text-xs text-slate-400 mt-1">
          {canStart ? (
            <span className="badge badge-blue">v{quiz.version}</span>
          ) : (
            <span className="badge badge-amber">Awaiting generation</span>
          )}
        </p>
      </div>

      <button
        onClick={() => canStart && navigate(`/quiz/${quiz.subject}`)}
        disabled={!canStart}
        className={`mt-4 btn w-full ${canStart ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
      >
        {canStart ? 'Start Quiz' : 'Not Generated'}
      </button>
    </div>
  );
};

export default QuizCard;