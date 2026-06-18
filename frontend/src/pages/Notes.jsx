import { useEffect, useState } from 'react';
import { createNote, getNotes, updateNote, deleteNote } from '../api/noteApi';
import NoteFilters from '../components/Notes/NoteFilters';
import NoteForm from '../components/Notes/NoteForm';
import NoteList from '../components/Notes/NoteList';
import Loading from '../components/Common/Loading';
import ErrorState from '../components/Common/ErrorState';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filters, setFilters] = useState({ search: '', subject: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;

      const res = await getNotes(params);
      setNotes(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [filters.subject]);

  const handleSearch = async () => {
    await fetchNotes();
  };

  const handleCreate = async (payload) => {
    await createNote(payload);
    await fetchNotes();
  };

  const handleUpdate = async (payload) => {
    await updateNote(editingNote._id, payload);
    setEditingNote(null);
    await fetchNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    await fetchNotes();
  };

  if (loading) return <Loading text="Loading notes..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notes</h1>

      <NoteFilters filters={filters} setFilters={setFilters} />
      <div className="flex gap-3">
        <button onClick={handleSearch} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Search
        </button>
        <button onClick={() => setFilters({ search: '', subject: '' })} className="px-4 py-2 rounded-lg border">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NoteForm
          initialData={editingNote}
          onSubmit={editingNote ? handleUpdate : handleCreate}
          onCancel={editingNote ? () => setEditingNote(null) : null}
        />

        <NoteList notes={notes} onEdit={setEditingNote} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Notes;