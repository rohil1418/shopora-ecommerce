import { Fragment } from "react";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  { key: "bag", label: "Bag" },
  { key: "address", label: "Address" },
  { key: "payment", label: "Payment" },
] as const;

export type CheckoutStep = (typeof STEPS)[number]["key"];

export default function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b pb-4">
      <span />
      <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] sm:gap-3">
        {STEPS.map((step, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "next";
          const className =
            state === "current"
              ? "border-b-2 border-green-600 pb-1 text-green-700"
              : state === "done"
                ? "text-green-700"
                : "text-gray-400";

          return (
            <Fragment key={step.key}>
              {index > 0 && (
                <li aria-hidden className="w-6 border-t border-dashed border-gray-300 sm:w-12" />
              )}
              <li className={className} aria-current={state === "current" ? "step" : undefined}>
                {step.key === "bag" && state === "done" ? (
                  <Link to="/bag" className="hover:underline">
                    {step.label}
                  </Link>
                ) : (
                  step.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
      <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-600">
        <ShieldCheck size={20} className="text-green-600" />
        <span className="hidden sm:inline">100% Secure</span>
      </span>
    </div>
  );
}