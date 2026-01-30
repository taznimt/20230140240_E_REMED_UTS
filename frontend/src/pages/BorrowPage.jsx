import { useEffect, useState } from "react";
import { api, withHeaders } from "../api/client";
import GradientCard from "../components/GradientCard";
import { getCurrentPosition } from "../utils/geo";

export default function BorrowPage({ toast, userId }) {
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadBooks() {
    const res = await api.get("/api/books");
    setBooks(res.data);
  }

  useEffect(() => {
    loadBooks().catch(() => {});
  }, []);

  async function detectLocation() {
    try {
      setBusy(true);
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      setLat(String(latitude));
      setLon(String(longitude));
      toast("Lokasi terdeteksi ✅", "success");
    } catch (e) {
      toast("Gagal akses lokasi. Aktifkan permission atau isi manual.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function submitBorrow(e) {
    e.preventDefault();
    try {
      if (!userId || Number(userId) <= 0) {
        toast("User ID wajib diisi (di atas).", "error");
        return;
      }

      setBusy(true);
      const payload = { bookId: Number(bookId), latitude: Number(lat), longitude: Number(lon) };

      const res = await api.post("/api/borrow", payload, withHeaders({ role: "user", userId }));
      toast(res.data?.message || "Borrow success ✅", "success");
      await loadBooks();
    } catch (err) {
      const msg = err?.response?.data?.message || "Borrow gagal.";
      toast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <GradientCard
      title="📍 Borrow Book"
      subtitle="POST /api/borrow (butuh: x-user-role=user & x-user-id)"
      right={
        <button
          onClick={detectLocation}
          disabled={busy}
          className="px-4 py-2 rounded-2xl bg-white/50 hover:bg-white/70 text-sm font-medium disabled:opacity-60"
        >
          Detect Location
        </button>
      }
    >
      <form onSubmit={submitBorrow} className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-800/80">User ID (from header bar)</label>
            <input
              value={userId}
              readOnly
              className="mt-1 w-full rounded-2xl bg-white/40 border border-white/50 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-800/80">Book</label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
            >
              <option value="">— pilih buku —</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (stock: {b.stock})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-800/80">Latitude</label>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
              placeholder="-6.2088"
            />
          </div>
          <div>
            <label className="text-sm text-slate-800/80">Longitude</label>
            <input
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
              placeholder="106.8456"
            />
          </div>
        </div>

        <button
          disabled={busy}
          className="w-full rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white font-semibold py-3 disabled:opacity-60"
        >
          {busy ? "Processing…" : "Borrow Now"}
        </button>

        <p className="text-xs text-slate-800/70">
          Tips: Role user harus dipilih di atas. Kalau geolocation ditolak, isi lat/lon manual.
        </p>
      </form>
    </GradientCard>
  );
}
