import { formatPrice } from "@/shared/utils/format";

type Day = { date: string; sales: number; orders: number };

const weekday = (date: string): string =>
  new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "Asia/Kolkata",
  });

export default function SalesChart({ days }: { days: Day[] }) {
  const max = Math.max(0, ...days.map((day) => day.sales));
  const totalSales = days.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = days.reduce((sum, day) => sum + day.orders, 0);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Sales, last 7 days</h2>
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{formatPrice(totalSales)}</span> from{" "}
          {totalOrders} {totalOrders === 1 ? "order" : "orders"}
        </p>
      </div>

      {max === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">No sales in the last 7 days yet.</p>
      ) : (
        <div className="mt-6 flex h-52 items-stretch gap-3">
          {days.map((day) => {
            const height = day.sales > 0 ? Math.max(6, Math.round((day.sales / max) * 100)) : 0;
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.orders} orders, ${formatPrice(day.sales)}`}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="hidden h-4 text-[10px] font-medium text-slate-500 sm:block">
                  {day.sales > 0 ? formatPrice(day.sales) : ""}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-slate-900 transition-all"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{weekday(day.date)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}