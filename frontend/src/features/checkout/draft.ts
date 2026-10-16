import type { CheckoutDraft } from "@/features/checkout/types";

const STORAGE_KEY = "shopora-checkout-draft";

export function saveDraft(draft: CheckoutDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
  }
}

export function loadDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CheckoutDraft>;
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) return null;

    const valid = parsed.items.every(
      (item) => typeof item?.uid === "string" && typeof item?.qty === "number"
    );
    if (!valid) return null;

    return {
      items: parsed.items,
      couponCode: typeof parsed.couponCode === "string" ? parsed.couponCode : null,
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}