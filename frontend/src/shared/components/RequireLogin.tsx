import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { usePanels } from "@/shared/panels";
import { useAuth } from "@/shared/store";

type Props = { title: string; message: string; children: ReactNode };

export default function RequireLogin({ title, message, children }: Props) {
  const { user, isLoading } = useAuth();
  const { openPanel } = usePanels();
  const prompted = useRef(false);

  useEffect(() => {
    if (isLoading || user || prompted.current) return;
    prompted.current = true;
    openPanel("auth");
  }, [isLoading, user, openPanel]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-64 animate-pulse bg-gray-100" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#0a1f44]">{title}</h1>
        <p className="mt-3 text-sm text-gray-600">{message}</p>
        <button
          type="button"
          onClick={() => openPanel("auth")}
          className="mt-6 bg-[#0a1f44] px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600"
        >
          Login / Sign up
        </button>
        <Link
          to="/"
          className="mt-4 text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
        >
          Back to home
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}