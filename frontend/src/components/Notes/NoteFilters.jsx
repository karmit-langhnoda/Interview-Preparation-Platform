const subjectOptions = [
  { value: '', label: 'All Subjects' },
  { value: 'general', label: 'General' },
  { value: 'os', label: 'OS' },
  { value: 'oop', label: 'OOPS' },
  { value: 'dbms', label: 'DBMS' },
  { value: 'cn', label: 'CN' },
  { value: 'dsa', label: 'DSA' }
];

const NoteFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border flex flex-col md:flex-row gap-3">
      <input
        type="text"
        placeholder="Search notes..."
        value={filters.search}
        onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
        className="border rounded-lg px-3 py-2 flex-1"
      />

      <select
        value={filters.subject}
        onChange={(e) => setFilters((p) => ({ ...p, subject: e.target.value }))}
        className="border rounded-lg px-3 py-2"
      >
        {subjectOptions.map((option) => (
          <option key={option.value || 'all'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NoteFilters;