export default function Toast({ msg, type = "info", onClose }) {
  if (!msg) return null;
  const cls =
    type === "error"
      ? "bg-rose-500/90"
      : type === "success"
      ? "bg-emerald-500/90"
      : "bg-slate-800/80";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-3 rounded-2xl text-white shadow-lg ${cls} backdrop-blur`}>
        <div className="flex items-center gap-3">
          <span className="text-sm">{msg}</span>
          <button onClick={onClose} className="text-white/90 hover:text-white text-sm">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
