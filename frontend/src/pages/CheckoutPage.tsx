import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AddressLines, type Address } from "@/features/addresses";
import {
  AddressStep,
  CheckoutStepper,
  OrderSummary,
  loadDraft,
  useCheckoutQuote,
} from "@/features/checkout";
import { usePanels } from "@/shared/panels";
import { useAuth } from "@/shared/store";

type Step = "address" | "payment";

function CheckoutContent() {
  const [draft] = useState(loadDraft);
  const { quote, error, isLoading, reload } = useCheckoutQuote(draft);
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address | null>(null);

  if (!draft) return <Navigate to="/bag" replace />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <CheckoutStepper current={step} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          {step === "address" && (
            <AddressStep
              initialSelectedId={address?.id ?? null}
              canContinue={Boolean(quote?.canOrder)}
              onContinue={(selected) => {
                setAddress(selected);
                setStep("payment");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

          {step === "payment" && address && (
            <>
              <div className="border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                      Delivering to
                    </h2>
                    <div className="mt-3">
                      <AddressLines address={address} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="shrink-0 text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="border p-6">
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Payment
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Payment options and Place order come in the next step.
                </p>
              </div>
            </>
          )}

          <Link
            to="/bag"
            className="inline-block text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
          >
            Back to bag
          </Link>
        </div>

        <aside className="lg:border-l lg:pl-6">
          {isLoading && !quote && (
            <div className="space-y-4">
              <div className="h-24 animate-pulse bg-gray-100" />
              <div className="h-40 animate-pulse bg-gray-100" />
            </div>
          )}

          {error && (
            <div className="space-y-3 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wide">
                <Link to="/bag" className="underline">
                  Back to bag
                </Link>
                <button type="button" onClick={reload} className="underline">
                  Try again
                </button>
              </div>
            </div>
          )}

          {quote && <OrderSummary quote={quote} />}
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
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
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="h-64 animate-pulse bg-gray-100" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#0a1f44]">Login to continue</h1>
        <p className="mt-3 text-sm text-gray-600">
          Please login or create an account to place your order. Your bag will be waiting.
        </p>
        <button
          type="button"
          onClick={() => openPanel("auth")}
          className="mt-6 bg-[#0a1f44] px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600"
        >
          Login / Sign up
        </button>
        <Link
          to="/bag"
          className="mt-4 text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
        >
          Back to bag
        </Link>
      </main>
    );
  }

  return <CheckoutContent />;
}