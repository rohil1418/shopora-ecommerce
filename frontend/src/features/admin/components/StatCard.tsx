import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
  to?: string;
};

export default function StatCard({ label, value, hint, icon: Icon, tone = "default", to }: Props) {
  const iconClass = tone === "warning" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </>
  );

  const className = "block rounded-2xl bg-white p-5 shadow-sm";

  return to ? (
    <Link to={to} className={`${className} transition hover:-translate-y-0.5 hover:shadow-md`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}