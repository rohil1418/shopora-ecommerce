import { useState, type FormEvent, type ReactNode } from "react";
import { getErrorMessage } from "@/shared/api";
import { INDIAN_STATES, LABEL_TEXT } from "../constants";
import { ADDRESS_LABELS, type Address, type AddressValues } from "../types";

type Props = {
  initial?: Address;
  defaults?: { fullName: string; phone: string };
  submitLabel: string;
  onSubmit: (values: AddressValues) => Promise<void>;
  onCancel?: () => void;
};

const inputClass =
  "w-full border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0a1f44]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function validate(form: AddressValues): string {
  if (form.fullName.trim().length < 2) return "Enter your full name";
  if (!/^\d{10}$/.test(form.phone)) return "Enter a 10-digit mobile number";
  if (form.addressLine1.trim().length < 5) {
    return "Enter your house number, building and street (at least 5 characters)";
  }
  if (form.city.trim().length < 2) return "Enter your city";
  if (!form.state) return "Select your state";
  if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit pincode";
  return "";
}

export default function AddressForm({ initial, defaults, submitLabel, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<AddressValues>({
    label: initial?.label ?? "home",
    fullName: initial?.fullName ?? defaults?.fullName ?? "",
    phone: initial?.phone ?? (defaults?.phone ?? "").replace(/\D/g, "").slice(0, 10),
    addressLine1: initial?.addressLine1 ?? "",
    addressLine2: initial?.addressLine2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    pincode: initial?.pincode ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof AddressValues>(key: K, value: AddressValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const states =
    form.state && !INDIAN_STATES.includes(form.state) ? [...INDIAN_STATES, form.state] : INDIAN_STATES;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const message = validate(form);
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        fullName: form.fullName.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            className={inputClass}
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Mobile number">
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
      </div>

      <Field label="Address (house no., building, street)">
        <input
          className={inputClass}
          autoComplete="address-line1"
          value={form.addressLine1}
          onChange={(e) => set("addressLine1", e.target.value)}
        />
      </Field>

      <Field label="Landmark, area (optional)">
        <input
          className={inputClass}
          autoComplete="address-line2"
          value={form.addressLine2}
          onChange={(e) => set("addressLine2", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City">
          <input
            className={inputClass}
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field label="State">
          <select
            className={inputClass}
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pincode">
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            value={form.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
          Save address as
        </span>
        <div className="flex gap-2">
          {ADDRESS_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={form.label === label}
              onClick={() => set("label", label)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                form.label === label
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-gray-300 text-gray-700 hover:border-red-600"
              }`}
            >
              {LABEL_TEXT[label]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 accent-red-600"
          checked={form.isDefault}
          disabled={initial?.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
        />
        Make this my default address
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-red-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}