import { useState } from "react";
import AppShell from "./components/AppShell";
import HeaderBar from "./components/HeaderBar";
import Toast from "./components/Toast";
import BooksPage from "./pages/BooksPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  // mode: "public" | "user" | "admin"
  const [mode, setMode] = useState("public");
  const [userId, setUserId] = useState("10");

  const [toastState, setToastState] = useState({ msg: "", type: "info" });
  function toast(msg, type = "info") {
    setToastState({ msg, type });
    setTimeout(() => setToastState({ msg: "", type }), 2500);
  }

  return (
    <AppShell>
      <HeaderBar mode={mode} setMode={setMode} userId={userId} setUserId={setUserId} />

      {/* ADMIN MODE => tampilkan admin page */}
      {mode === "admin" ? (
        <AdminPage toast={toast} />
      ) : (
        // PUBLIC / USER => tampilkan list books (dengan tombol pinjam kalau user)
        <BooksPage toast={toast} mode={mode} userId={userId} />
      )}

      <Toast
        msg={toastState.msg}
        type={toastState.type}
        onClose={() => setToastState({ msg: "", type: "info" })}
      />
    </AppShell>
  );
}
