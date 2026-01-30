import { useEffect, useState } from "react";
import { api, withHeaders } from "../api/client";
import GradientCard from "../components/GradientCard";
import { getCurrentPosition } from "../utils/geo";

export default function BooksPage({ toast, mode, userId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  async function fetchBooks() {
    setLoading(true);
    try {
      const res = await api.get("/api/books");
      setBooks(res.data);
    } catch (e) {
      toast("Gagal load books. Pastikan backend jalan.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function borrowHere(book) {
    if (mode !== "user") return;

    if (!userId || Number(userId) <= 0) {
      toast("User ID wajib diisi.", "error");
      return;
    }

    if (book.stock <= 0) {
      toast("Stok buku habis.", "error");
      return;
    }

    setBusyId(book.id);
    try {
      let latitude = -6.2088;
      let longitude = 106.8456;

      try {
        const pos = await getCurrentPosition();
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } catch {
        // fallback: pakai default, biar tugas tetap bisa demo walau permission ditolak
      }

      const payload = { bookId: book.id, latitude, longitude };
      const res = await api.post("/api/borrow", payload, withHeaders({ role: "user", userId }));

      toast(res.data?.message || "Borrow success ✅", "success");
      await fetchBooks();
    } catch (err) {
      toast(err?.response?.data?.message || "Borrow gagal.", "error");
    } finally {
      setBusyId(null);
    }
  }

  const roleText =
    mode === "public" ? "Public (lihat saja)" : mode === "user" ? "User (bisa pinjam)" : "Admin (CRUD)";

  return (
    <GradientCard
      title="📚 Library System"
      subtitle={`Mode: ${roleText} • Endpoint: GET /api/books`}
      right={
        <button
          onClick={fetchBooks}
          className="px-4 py-2 rounded-2xl bg-white/50 hover:bg-white/70 text-sm font-medium"
        >
          Refresh
        </button>
      }
    >
      {loading ? (
        <div className="text-slate-800/80">Loading…</div>
      ) : books.length === 0 ? (
        <div className="text-slate-800/80">Belum ada buku.</div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-white/40 bg-white/25">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/70 text-white">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Judul</th>
                <th className="text-left px-4 py-3 font-semibold">Penulis</th>
                <th className="text-left px-4 py-3 font-semibold">Stok</th>
                {mode === "user" && <th className="text-left px-4 py-3 font-semibold">Aksi</th>}
              </tr>
            </thead>
            <tbody className="bg-white/30">
              {books.map((b) => (
                <tr key={b.id} className="border-t border-white/40">
                  <td className="px-4 py-3">{b.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{b.title}</td>
                  <td className="px-4 py-3 text-slate-800/90">{b.author}</td>
                  <td className="px-4 py-3">{b.stock}</td>

                  {mode === "user" && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => borrowHere(b)}
                        disabled={busyId === b.id}
                        className="px-3 py-2 rounded-xl bg-emerald-600/85 hover:bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60"
                      >
                        {busyId === b.id ? "Processing…" : "📍 Pinjam Disini"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mode === "user" && (
        <p className="text-xs text-slate-800/70 mt-3">
          *Pinjam Disini akan mencoba geolocation. Jika permission ditolak, sistem pakai koordinat default untuk demo.
        </p>
      )}
    </GradientCard>
  );
}
