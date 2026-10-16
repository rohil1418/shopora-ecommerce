import { useState } from "react";
import { getErrorMessage } from "@/shared/api";
import { useAuth } from "@/shared/store";
import {
  AddressCard,
  AddressForm,
  useAddresses,
  type Address,
  type AddressValues,
} from "@/features/addresses";

type Mode = { kind: "list" } | { kind: "new" } | { kind: "edit"; id: string };

type Props = {
  initialSelectedId: string | null;
  canContinue: boolean;
  onContinue: (address: Address) => void;
};

const MAX_ADDRESSES = 10;

export default function AddressStep({ initialSelectedId, canContinue, onContinue }: Props) {
  const { user } = useAuth();
  const { addresses, isLoading, error, reload, add, update, remove, makeDefault } = useAddresses();
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [actionError, setActionError] = useState("");

  const selected =
    addresses.find((address) => address.id === selectedId) ??
    addresses.find((address) => address.isDefault) ??
    addresses[0];

  const defaults = user ? { fullName: user.name, phone: user.phone } : undefined;
  const hasNone = !isLoading && !error && addresses.length === 0;
  const showNewForm = mode.kind === "new" || hasNone;
  const busyWithForm = showNewForm || mode.kind === "edit";

  async function handleCreate(values: AddressValues) {
    const created = await add(values);
    setSelectedId(created.id);
    setMode({ kind: "list" });
  }

  async function handleUpdate(id: string, values: AddressValues) {
    await update(id, values);
    setMode({ kind: "list" });
  }

  async function guarded(action: () => Promise<void>) {
    setActionError("");
    try {
      await action();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">
        Select delivery address
      </h2>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-28 animate-pulse bg-gray-100" />
          <div className="h-28 animate-pulse bg-gray-100" />
        </div>
      )}

      {error && (
        <div className="space-y-3 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={reload}
            className="text-xs font-bold uppercase tracking-wide underline"
          >
            Try again
          </button>
        </div>
      )}

      {actionError && (
        <p role="alert" className="bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {addresses.length > 0 && (
        <ul className="space-y-3">
          {addresses.map((address) =>
            mode.kind === "edit" && mode.id === address.id ? (
              <li key={address.id} className="border border-[#0a1f44] p-4">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-800">
                  Edit address
                </h3>
                <AddressForm
                  initial={address}
                  submitLabel="Save changes"
                  onSubmit={(values) => handleUpdate(address.id, values)}
                  onCancel={() => setMode({ kind: "list" })}
                />
              </li>
            ) : (
              <AddressCard
                key={address.id}
                address={address}
                selected={selected?.id === address.id}
                onSelect={() => setSelectedId(address.id)}
                onEdit={() => {
                  setActionError("");
                  setMode({ kind: "edit", id: address.id });
                }}
                onDelete={() =>
                  guarded(async () => {
                    await remove(address.id);
                    if (selectedId === address.id) setSelectedId(null);
                  })
                }
                onMakeDefault={() =>
                  guarded(async () => {
                    await makeDefault(address.id);
                    setSelectedId(address.id);
                  })
                }
              />
            )
          )}
        </ul>
      )}

      {showNewForm ? (
        <div className="border border-[#0a1f44] p-4">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-800">
            Add new address
          </h3>
          <AddressForm
            defaults={defaults}
            submitLabel="Save address"
            onSubmit={handleCreate}
            onCancel={hasNone ? undefined : () => setMode({ kind: "list" })}
          />
        </div>
      ) : (
        mode.kind === "list" &&
        addresses.length > 0 &&
        (addresses.length < MAX_ADDRESSES ? (
          <button
            type="button"
            onClick={() => {
              setActionError("");
              setMode({ kind: "new" });
            }}
            className="w-full border border-dashed border-gray-300 px-4 py-4 text-sm font-bold uppercase tracking-wide text-red-600 transition-colors hover:border-red-600"
          >
            + Add new address
          </button>
        ) : (
          <p className="text-xs text-gray-500">
            You have saved the maximum of {MAX_ADDRESSES} addresses. Delete one to add another.
          </p>
        ))
      )}

      {selected && (
        <button
          type="button"
          disabled={busyWithForm || !canContinue}
          onClick={() => onContinue(selected)}
          className="w-full bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Deliver to this address
        </button>
      )}
    </section>
  );
}