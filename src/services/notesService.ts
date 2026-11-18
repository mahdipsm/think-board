import type { Note } from "../types/note";

const API_URL = "https://thinkboard.codewithmmd.ir/api/notes";

interface ApiResponse<T> {
  success: boolean;
  response: T;
}

// دریافت تمام یادداشت‌ها
export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("خطا در دریافت یادداشت‌ها");
  }

  const data: ApiResponse<Note[]> = await response.json();

  if (!data.success) {
    throw new Error("دریافت یادداشت‌ها ناموفق بود");
  }

  return data.response;
};

// ایجاد یادداشت
export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error("خطا در ایجاد یادداشت");
  }

  const data: ApiResponse<Note> = await response.json();

  if (!data.success) {
    throw new Error("ایجاد یادداشت ناموفق بود");
  }

  return data.response;
};

// دریافت جزئیات یک یادداشت
export const getNoteById = async (
  id: string
): Promise<Note> => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("خطا در دریافت جزئیات یادداشت");
  }

  const data: ApiResponse<Note> = await response.json();

  if (!data.success) {
    throw new Error("دریافت جزئیات یادداشت ناموفق بود");
  }

  return data.response;
};

// ویرایش یادداشت
export const updateNote = async (
  id: string,
  title: string,
  content: string
): Promise<Note> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error("خطا در ویرایش یادداشت");
  }

  const data: ApiResponse<Note> = await response.json();

  if (!data.success) {
    throw new Error("ویرایش یادداشت ناموفق بود");
  }

  return data.response;
};

// حذف یادداشت
export const deleteNote = async (
  id: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("خطا در حذف یادداشت");
  }
};
