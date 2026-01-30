export default function GradientCard({ title, subtitle, right, children }) {
  return (
    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5">
      <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
        <div>
          {title && <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-700/80 mt-1">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">{children}</div>
    </div>
  );
}
