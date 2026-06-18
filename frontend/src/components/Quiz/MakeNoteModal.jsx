import { useEffect, useState } from 'react';

const MakeNoteModal = ({ open, onClose, defaultSubject, defaultCategory, onSave, extra = {} }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: defaultSubject || 'general',
    category: defaultCategory || 'general'
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: '',
        description: '',
        subject: defaultSubject || 'general',
        category: defaultCategory || 'general'
      });
    }
  }, [open, defaultSubject, defaultCategory]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, ...extra });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4">Add Note</h3>

        <div className="mb-3">
          <label className="block text-sm mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 min-h-28"
            required
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeNoteModal;