import { useEffect, useState } from "react";
import { api, withHeaders } from "../api/client";
import GradientCard from "../components/GradientCard";

export default function AdminPage({ toast }) {
  const [books, setBooks] = useState([]);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ title: "", author: "", stock: 0 });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await api.get("/api/books");
    setBooks(res.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  function onChange(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      setBusy(true);
      const payload = {
        title: form.title,
        author: form.author,
        stock: Number(form.stock),
      };

      if (!editingId) {
        await api.post("/api/books", payload, withHeaders({ role: "admin" }));
        toast("Book created ✅", "success");
      } else {
        await api.put(`/api/books/${editingId}`, payload, withHeaders({ role: "admin" }));
        toast("Book updated ✅", "success");
      }

      setForm({ title: "", author: "", stock: 0 });
      setEditingId(null);
      await load();
    } catch (err) {
      toast(err?.response?.data?.message || "Gagal simpan.", "error");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(b) {
    setEditingId(b.id);
    setForm({ title: b.title, author: b.author, stock: b.stock });
  }

  async function del(id) {
    try {
      setBusy(true);
      await api.delete(`/api/books/${id}`, withHeaders({ role: "admin" }));
      toast("Deleted ✅", "success");
      await load();
    } catch (err) {
      toast(err?.response?.data?.message || "Delete gagal.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <GradientCard title="➕ Tambah Buku Baru" subtitle="Mode Admin (CRUD) • Header: x-user-role=admin">
        <form onSubmit={submit} className="grid sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-1">
            <label className="text-sm text-slate-800/80">Judul</label>
            <input
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
              placeholder="Judul Buku"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm text-slate-800/80">Penulis</label>
            <input
              value={form.author}
              onChange={(e) => onChange("author", e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
              placeholder="Penulis"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm text-slate-800/80">Stok</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => onChange("stock", e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/50 border border-white/50 px-4 py-3 outline-none focus:bg-white/70"
              placeholder="0"
            />
          </div>

          <div className="sm:col-span-1 flex gap-2">
            <button
              disabled={busy}
              className="w-full rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white font-semibold py-3 disabled:opacity-60"
            >
              {editingId ? "Update Buku" : "Simpan Buku"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", author: "", stock: 0 });
                }}
                className="w-full rounded-2xl bg-white/55 hover:bg-white/75 text-slate-900 font-semibold py-3"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </GradientCard>

      <GradientCard title="📋 Daftar Buku" subtitle="Klik Edit / Hapus">
        {books.length === 0 ? (
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
                  <th className="text-left px-4 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white/30">
                {books.map((b) => (
                  <tr key={b.id} className="border-t border-white/40">
                    <td className="px-4 py-3">{b.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{b.title}</td>
                    <td className="px-4 py-3 text-slate-800/90">{b.author}</td>
                    <td className="px-4 py-3">{b.stock}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => startEdit(b)}
                        disabled={busy}
                        className="px-3 py-2 rounded-xl bg-white/60 hover:bg-white/80 text-slate-900 text-xs font-semibold disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(b.id)}
                        disabled={busy}
                        className="px-3 py-2 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white text-xs font-semibold disabled:opacity-60"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GradientCard>
    </div>
  );
}
