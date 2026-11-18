import { useEffect } from "react";

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(onClose, 3500);

    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`toast toast-${toast.type}`}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <span>{toast.message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="بستن پیام"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
