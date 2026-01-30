export default function AppShell({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C7B2FF] via-[#FFB6D5] to-[#A9E6FF]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-white/15 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
