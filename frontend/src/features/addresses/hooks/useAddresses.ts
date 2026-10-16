import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/shared/api";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "../api";
import type { Address, AddressValues } from "../types";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setError("");

    fetchAddresses()
      .then((items) => {
        if (!ignore) setAddresses(items);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const refresh = useCallback(async () => {
    setAddresses(await fetchAddresses());
  }, []);

  const reload = useCallback(() => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  const add = useCallback(
    async (values: AddressValues) => {
      const created = await createAddress(values);
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, values: AddressValues) => {
      await updateAddress(id, values);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAddress(id);
      await refresh();
    },
    [refresh]
  );

  const makeDefault = useCallback(
    async (id: string) => {
      await setDefaultAddress(id);
      await refresh();
    },
    [refresh]
  );

  return { addresses, isLoading, error, reload, add, update, remove, makeDefault };
}