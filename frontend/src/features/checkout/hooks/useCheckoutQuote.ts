import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/shared/api";
import { fetchQuote } from "@/features/checkout/api";
import type { CheckoutDraft, Quote } from "@/features/checkout/types";

export function useCheckoutQuote(draft: CheckoutDraft | null) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(draft !== null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!draft) return;
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchQuote(draft)
      .then((result) => {
        if (!ignore) setQuote(result);
      })
      .catch((err) => {
        if (!ignore) {
          setQuote(null);
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [draft, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { quote, error, isLoading, reload };
}