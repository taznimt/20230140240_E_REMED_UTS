export default function HeaderBar({ mode, setMode, userId, setUserId }) {
  const label =
    mode === "public" ? "Public (Lihat Saja)" : mode === "user" ? "User (Bisa Pinjam)" : "Admin (CRUD)";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Library Geo ✨</h1>
        <p className="text-slate-800/80 text-sm mt-1">Role tanpa login • Backend tetap validasi header</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="rounded-2xl bg-white/30 border border-white/40 px-3 py-2 flex items-center gap-2">
          <span className="text-sm text-slate-700/80">Masuk Sebagai:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold text-slate-900"
            title={label}
          >
            <option value="public">Public (Lihat Saja)</option>
            <option value="user">User (Bisa Pinjam)</option>
            <option value="admin">Admin (CRUD)</option>
          </select>
        </div>

        {mode === "user" && (
          <div className="rounded-2xl bg-white/30 border border-white/40 px-3 py-2 flex items-center gap-2">
            <span className="text-sm text-slate-700/80">User ID:</span>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-24 bg-transparent outline-none text-sm font-semibold text-slate-900"
              placeholder="10"
            />
          </div>
        )}
      </div>
    </div>
  );
}
