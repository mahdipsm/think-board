import { useCallback, useEffect, useState } from "react";
import type { Note } from "../types/note";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notesService";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دریافت یادداشت‌ها
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "دریافت یادداشت‌ها ناموفق بود"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  // ایجاد یادداشت
  const addNote = async (title: string, content: string) => {
    const newNote = await createNote(title, content);
    setNotes((prev) => [newNote, ...prev]);
  };

  // ویرایش یادداشت
  const editNote = async (
    id: string,
    title: string,
    content: string
  ) => {
    const updatedNote = await updateNote(id, title, content);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? updatedNote : note
      )
    );
  };

  // حذف یادداشت
  const removeNote = async (id: string) => {
    await deleteNote(id);

    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );
  };

  return {
    notes,
    isLoading,
    error,
    addNote,
    editNote,
    removeNote,
    fetchNotes,
  };
};
