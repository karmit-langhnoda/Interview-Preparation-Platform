import NoteCard from './NoteCard';

const NoteList = ({ notes, onEdit, onDelete }) => {
  if (!notes?.length) {
    return <div className="text-gray-500">No notes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteList;