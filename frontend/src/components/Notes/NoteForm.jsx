import { useEffect, useState } from 'react';

const subjectOptions = [
  { value: 'general', label: 'General' },
  { value: 'os', label: 'OS' },
  { value: 'oop', label: 'OOPS' },
  { value: 'dbms', label: 'DBMS' },
  { value: 'cn', label: 'CN' },
  { value: 'dsa', label: 'DSA' }
];

const getDefaultForm = (initialData) => ({
  title: initialData?.title || '',
  description: initialData?.description || '',
  subject: initialData?.subject || 'general',
  category: initialData?.category || 'general'
});

const NoteForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => getDefaultForm(initialData));

  useEffect(() => {
    setForm(getDefaultForm(initialData));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!initialData) {
      setForm({ title: '', description: '', subject: 'general', category: 'general' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-5 border">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Update Note' : 'Add Note'}
      </h3>

      <div className="grid gap-4">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />

        <textarea
          className="border rounded-lg px-3 py-2 min-h-28"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Save
        </button>
      </div>
    </form>
  );
};

export default NoteForm;