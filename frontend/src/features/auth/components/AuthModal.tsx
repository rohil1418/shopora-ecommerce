import { useState, type ChangeEvent, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import Modal from "@/shared/components/Modal";
import { useAuth } from "@/shared/store";

type Mode = "login" | "signup";
type AuthModalProps = { isOpen: boolean; onClose: () => void };

const EMPTY_FORM = { name: "", email: "", phone: "", password: "" };

const inputClass =
  "w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0a1f44]";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isLogin = mode === "login";

  const update =
    (field: keyof typeof EMPTY_FORM, transform?: (value: string) => string) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = transform ? transform(event.target.value) : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (error) setError("");
    };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? "Login" : "Sign Up"}>
      <div className="mb-6 mt-2 flex border-b">
        {(["login", "signup"] as Mode[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchMode(tab)}
            className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wide transition ${
              mode === tab ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"
            }`}
          >
            {tab === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Full name"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        )}

        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          value={form.email}
          onChange={update("email")}
          className={inputClass}
        />

        {!isLogin && (
          <input
            type="tel"
            required
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={update("phone", (value) => value.replace(/\D/g, ""))}
            className={inputClass}
          />
        )}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "Password" : "Password (at least 8 characters)"}
            value={form.password}
            onChange={update("password")}
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0a1f44] py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "New to Shopora?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(isLogin ? "signup" : "login")}
          className="font-medium text-red-600 hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </Modal>
  );
}