import { useState } from "react";
import { LABEL_TEXT } from "../constants";
import type { Address } from "../types";
import AddressLines from "./AddressLines";

type Props = {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onMakeDefault: () => Promise<void>;
};

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onMakeDefault,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <li
      className={`border p-4 transition ${
        selected ? "border-[#0a1f44] bg-blue-50/30" : "border-gray-200"
      }`}
    >
      <div className="flex gap-3">
        <input
          type="radio"
          name="delivery-address"
          checked={selected}
          onChange={onSelect}
          aria-label={`Deliver to ${address.fullName}`}
          className="mt-1 h-4 w-4 accent-red-600"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-gray-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              {LABEL_TEXT[address.label]}
            </span>
            {address.isDefault && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-700">
                Default
              </span>
            )}
          </div>

          <button type="button" onClick={onSelect} className="block text-left">
            <AddressLines address={address} />
          </button>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wide">
            {confirming ? (
              <>
                <span className="normal-case tracking-normal text-gray-700">
                  Delete this address?
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(onDelete)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {busy ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                  className="text-gray-600 hover:underline"
                >
                  No
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onEdit} className="text-gray-700 hover:text-red-600">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="text-gray-700 hover:text-red-600"
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void run(onMakeDefault)}
                    className="text-gray-700 hover:text-red-600 disabled:opacity-50"
                  >
                    Set as default
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}