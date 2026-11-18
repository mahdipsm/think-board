import { useEffect, useState } from "react";
import type { Note } from "../types/note";
import { getNoteById } from "../services/notesService";

interface NoteDetailsProps {
  noteId: string;
  onClose: () => void;
}

const NoteDetails = ({
  noteId,
  onClose,
}: NoteDetailsProps) => {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError("");
      setNote(null);

      try {
        const data = await getNoteById(noteId);

        if (isActive) {
          setNote(data);
        }
      } catch {
        if (isActive) {
          setError("دریافت جزئیات یادداشت ناموفق بود.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetails();

    return () => {
      isActive = false;
    };
  }, [noteId]);

  return (
    <div
      className="details-overlay"
      onClick={onClose}
    >
      <div
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="بستن جزئیات"
        >
          ×
        </button>

        {isLoading ? (
          <p>در حال دریافت اطلاعات...</p>
        ) : error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : note ? (
          <>
            <h2 id="details-title">
              {note.title}
            </h2>

            <p className="note-date">
              تاریخ ایجاد:{" "}
              {new Date(note.createdAt).toLocaleDateString("fa-IR")}
            </p>

            <div className="details-content">
              {note.content}
            </div>

            <p className="note-date">
              آخرین ویرایش:{" "}
              {new Date(note.updatedAt).toLocaleDateString("fa-IR")}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default NoteDetails;
