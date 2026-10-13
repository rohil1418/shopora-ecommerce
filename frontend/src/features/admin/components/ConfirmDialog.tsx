import { useEffect } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  busyLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  busyLabel = "Working...",
  tone = "default",
  busy = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [busy, onCancel]);

  const confirmClass =
    tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !busy && onCancel()} />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${confirmClass}`}
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}