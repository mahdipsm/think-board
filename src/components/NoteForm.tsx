import { useState } from "react";
import type { FormEvent } from "react";

interface NoteFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
}

const NoteForm = ({
  onSubmit,
  onCancel,
  initialTitle = "",
  initialContent = "",
  isEditing = false,
}: NoteFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError("عنوان و متن یادداشت را وارد کن.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await onSubmit(trimmedTitle, trimmedContent);
      onCancel();
    } catch {
      setFormError("عملیات انجام نشد. دوباره تلاش کن.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="note-form"
    >
      <h2>
        {isEditing ? "ویرایش یادداشت" : "یادداشت جدید"}
      </h2>

      <input
        type="text"
        placeholder="عنوان یادداشت"
        aria-label="عنوان یادداشت"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <textarea
        placeholder="متن یادداشت..."
        aria-label="متن یادداشت"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "در حال ذخیره..."
          : isEditing
            ? "ذخیره تغییرات"
            : "ثبت یادداشت"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        انصراف
      </button>
    </form>
  );
};

export default NoteForm;
