import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onView: (id: string) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const NoteCard = ({
  note,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: NoteCardProps) => {
  const formattedDate = new Date(
    note.createdAt
  ).toLocaleDateString("fa-IR");

  return (
    <article className="note-card">
      <h3>{note.title}</h3>

      <p className="note-date">
        {formattedDate}
      </p>

      <p className="note-content">
        {note.content}
      </p>

      <div className="note-actions">
        <button
          type="button"
          onClick={() => onView(note.id)}
        >
          جزئیات
        </button>

        <button
          type="button"
          onClick={() => onEdit(note)}
        >
          ویرایش
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "در حال حذف..." : "حذف"}
        </button>
      </div>
    </article>
  );
};

export default NoteCard;
