import { useState } from 'react';
import SubjectMultiSelect from './SubjectMultiSelect';

const InterviewSetup = ({ onStart, loading = false }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [subjects, setSubjects] = useState(['oop']);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ difficulty, subjects });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-5 border space-y-4">
      <h2 className="text-xl font-semibold">Start Interview</h2>

      <div>
        <label className="block text-sm mb-2">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-64"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2">Subjects</label>
        <SubjectMultiSelect value={subjects} onChange={setSubjects} />
      </div>

      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
        {loading ? 'Starting...' : 'Start'}
      </button>
    </form>
  );
};

export default InterviewSetup;