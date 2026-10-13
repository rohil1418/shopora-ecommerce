import { useState, type FormEvent } from "react";
import { Link, Outlet } from "react-router-dom";
import { getErrorMessage } from "@/shared/api";
import { useAuth } from "@/shared/store";

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shopora Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your store</p>
        </div>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <Link to="/" className="block text-center text-sm text-slate-500 hover:text-slate-900">
          Back to store
        </Link>
      </form>
    </div>
  );
}

export default function AdminGuard() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-500">
          This account does not have admin access.
        </p>
        <div className="flex gap-3">
          <Link to="/" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Back to store
          </Link>
          <button
            onClick={() => void logout()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}