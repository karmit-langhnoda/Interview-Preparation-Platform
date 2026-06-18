const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{note.title}</h3>
          <p className="text-sm text-gray-500 mt-1 capitalize">
            Subject: {note.subject} | Category: {note.category}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="px-3 py-1 rounded-lg border text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-4 text-gray-700 whitespace-pre-line">{note.description}</p>

      {note.problemLink && (
        <a
          href={note.problemLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-blue-600 text-sm"
        >
          Open Problem Link
        </a>
      )}
    </div>
  );
};

export default NoteCard;