import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "12px",
        background: isSuccess ? "#f0fdf4" : isError ? "#fef2f2" : "#fff0f6",
        border: `1px solid ${isSuccess ? "#bbf7d0" : isError ? "#fecaca" : "#f5dce8"}`,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        color: isSuccess ? "#166534" : isError ? "#991b1b" : "#c83c77",
        maxWidth: "420px",
        animation: "fadeIn 0.25s ease-out"
      }}
    >
      {isSuccess && <CheckCircle2 size={20} color="#16a34a" />}
      {isError && <AlertCircle size={20} color="#dc2626" />}
      {!isSuccess && !isError && <Info size={20} color="#df5790" />}

      <div style={{ flex: 1, fontSize: "14px", lineHeight: 1.4 }}>
        {toast.message}
      </div>

      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          color: "inherit",
          opacity: 0.7
        }}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
