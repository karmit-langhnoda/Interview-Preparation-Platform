const QuizReview = ({ questions }) => {
  return (
    <div className="space-y-4">
      {questions?.map((q) => (
        <div key={q.index} className="bg-white rounded-2xl shadow p-5 border">
          <h4 className="font-semibold mb-3">
            {q.index + 1}. {q.question}
          </h4>

          <div className="space-y-2 text-sm">
            {q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  idx === q.correctIndex
                    ? 'bg-green-100 text-green-700'
                    : idx === q.selectedIndex && !q.isCorrect
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-50'
                }`}
              >
                {opt}
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm">
            <span className="font-medium">Correct:</span> {q.options[q.correctIndex]}
          </p>
          <p className="text-sm">
            <span className="font-medium">Your answer:</span>{' '}
            {q.selectedIndex !== null ? q.options[q.selectedIndex] : 'Not answered'}
          </p>
          {q.explanation && (
            <p className="text-sm mt-2 text-gray-600">{q.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizReview;