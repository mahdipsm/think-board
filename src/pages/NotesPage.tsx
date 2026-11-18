import { useCallback, useMemo, useState } from "react";
import type { Note } from "../types/note";
import { useNotes } from "../hooks/useNotes";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import NoteDetails from "../components/NoteDetails";
import NoteSkeleton from "../components/NoteSkeleton";
import Toast from "../components/Toast";
import type { ToastMessage } from "../components/Toast";

type SortOption = "newest" | "oldest" | "title";

const NotesPage = () => {
  const {
    notes,
    isLoading,
    error,
    addNote,
    editNote,
    removeNote,
    fetchNotes,
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // بستن پیام
  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // جستجو و مرتب‌سازی
  const filteredNotes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = notes.filter((note) =>
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );

    return [...result].sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sortOption === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      return a.title.localeCompare(b.title, "fa");
    });
  }, [notes, searchTerm, sortOption]);

  // باز کردن فرم ایجاد
  const handleAddClick = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  // باز کردن فرم ویرایش
  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  // ثبت یا ویرایش یادداشت
  const handleFormSubmit = async (
    title: string,
    content: string
  ) => {
    try {
      if (editingNote) {
        await editNote(editingNote.id, title, content);

        setToast({
          message: "یادداشت با موفقیت ویرایش شد.",
          type: "success",
        });
      } else {
        await addNote(title, content);

        setToast({
          message: "یادداشت جدید با موفقیت ایجاد شد.",
          type: "success",
        });
      }
    } catch (err) {
      setToast({
        message: "عملیات انجام نشد. دوباره تلاش کن.",
        type: "error",
      });

      throw err;
    }
  };

  // بستن فرم
  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  // حذف یادداشت
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "آیا از حذف این یادداشت مطمئنی؟"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setDeleteError("");

    try {
      await removeNote(id);

      setToast({
        message: "یادداشت با موفقیت حذف شد.",
        type: "success",
      });
    } catch {
      setDeleteError("حذف یادداشت ناموفق بود. دوباره تلاش کن.");

      setToast({
        message: "حذف یادداشت انجام نشد.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="page-container">
      <header className="page-header">
        <h1>Think Board</h1>
        <p>یادداشت‌هایت را ساده و منظم مدیریت کن.</p>
      </header>

      <section className="notes-section">
        <div className="section-header">
          <h2>یادداشت‌های من</h2>

          <button
            type="button"
            onClick={handleAddClick}
          >
            + یادداشت جدید
          </button>
        </div>

        <div className="notes-toolbar">
          <div className="search-box">
            <input
              type="search"
              placeholder="جستجو در یادداشت‌ها..."
              aria-label="جستجو در یادداشت‌ها"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="sort-box">
            <label htmlFor="note-sort">مرتب‌سازی:</label>

            <select
              id="note-sort"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="title">عنوان</option>
            </select>
          </div>
        </div>

        {showForm && (
          <NoteForm
            key={editingNote?.id ?? "new"}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            initialTitle={editingNote?.title}
            initialContent={editingNote?.content}
            isEditing={editingNote !== null}
          />
        )}

        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}

        {isLoading ? (
          <NoteSkeleton />
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void fetchNotes()}
            >
              تلاش مجدد
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <h3>هنوز یادداشتی نداری!</h3>
            <p>اولین یادداشتت رو ایجاد کن.</p>

            <button
              type="button"
              onClick={handleAddClick}
            >
              ایجاد اولین یادداشت
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <p className="empty-search">
            یادداشتی با این عبارت پیدا نشد.
          </p>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onView={setSelectedNoteId}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                isDeleting={deletingId === note.id}
              />
            ))}
          </div>
        )}
      </section>

      {selectedNoteId && (
        <NoteDetails
          noteId={selectedNoteId}
          onClose={() => setSelectedNoteId(null)}
        />
      )}

      <Toast
        toast={toast}
        onClose={closeToast}
      />
    </main>
  );
};

export default NotesPage;
