import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Modal from "@/shared/components/Modal";

type Mode = "login" | "signup";
type AuthModalProps = { isOpen: boolean; onClose: () => void };

const inputClass =
  "w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0a1f44]";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isLogin = mode === "login";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? "Login" : "Sign Up"}>
      <div className="mb-6 mt-2 flex border-b">
        {(["login", "signup"] as Mode[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
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
          <input type="text" required placeholder="Full name" className={inputClass} />
        )}
        <input type="email" required placeholder="Email address" className={inputClass} />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Password"
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

        {isLogin && (
          <a href="#" className="block text-right text-xs text-red-600 hover:underline">
            Forgot password?
          </a>
        )}

        <button
          type="submit"
          className="w-full bg-[#0a1f44] py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-600"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "New to Shopora?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "signup" : "login")}
          className="font-medium text-red-600 hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </Modal>
  );
}