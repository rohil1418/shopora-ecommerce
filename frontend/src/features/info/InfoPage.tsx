import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { INFO_PAGES, type InfoPageData } from "./infoPages";

const GROUP_LABELS: Record<string, string> = {
  help: "Help",
  company: "Company",
  legal: "Legal",
};

export default function InfoPage({ page }: { page: InfoPageData }) {
  const navigate = useNavigate();

  const groupKey = page.path.split("/")[1];
  const groupLabel = GROUP_LABELS[groupKey] ?? "Info";
  const siblings = INFO_PAGES.filter((p) => p.path.startsWith(`/${groupKey}/`));

  useEffect(() => {
    document.title = `${page.title} | Shopora`;
  }, [page]);

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <Link to="/" className="hover:text-red-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span>{groupLabel}</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">{page.title}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
              <p className="mt-2 max-w-2xl text-gray-600">{page.intro}</p>
            </div>
            <button
              onClick={goBack}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 hidden text-xs font-semibold uppercase tracking-widest text-gray-500 lg:block">
            {groupLabel}
          </p>
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
            {siblings.map((p) => (
              <li key={p.path} className="shrink-0">
                <NavLink
                  to={p.path}
                  className={({ isActive }) =>
                    [
                      "block whitespace-nowrap rounded-md px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-red-50 font-semibold text-red-600"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")
                  }
                >
                  {p.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        <main className="rounded-xl border bg-white p-6 sm:p-8">
          {page.accordion ? (
            <div className="divide-y">
              {page.sections.map((s) => (
                <details key={s.heading} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                    {s.heading}
                    <span className="ml-4 text-xl text-gray-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-700">
                    {s.paragraphs?.map((p) => (
                      <p key={p} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {s.bullets && (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {s.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {page.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="border-l-4 border-red-600 pl-3 text-lg font-semibold text-gray-900">
                    {s.heading}
                  </h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="mt-3 leading-relaxed text-gray-700">
                      {p}
                    </p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-700">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
            {page.cta && (
              <Link
                to={page.cta.to}
                className="rounded-md bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                {page.cta.label}
              </Link>
            )}
            <Link
              to="/"
              className="rounded-md border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}