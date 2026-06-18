const QuestionCard = ({ question, selectedIndex, onSelect }) => {
  return (
    <div className="card card-body">
      <h3 className="font-semibold text-slate-800 text-[1rem] mb-5 leading-relaxed">
        <span className="text-blue-600 mr-2">Q{question.index + 1}.</span>
        {question.question}
      </h3>

      <div className="space-y-2.5">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              selectedIndex === idx
                ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-xs font-bold text-slate-500 mr-3">
              {String.fromCharCode(65 + idx)}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;