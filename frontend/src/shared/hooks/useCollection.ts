import { useCallback, useEffect, useState } from "react";
import { ApiError, getErrorMessage } from "@/shared/api";
import { fetchCollection, type CollectionData } from "@/features/products/api";
import type { ProductFilter } from "@/features/products/types";

type Status = "loading" | "ready" | "notfound" | "error";

export function useCollection(slug: string, filter: ProductFilter) {
  const [data, setData] = useState<CollectionData | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const category = filter === "all" ? undefined : filter;

  useEffect(() => {
    let ignore = false;
    setIsFetching(true);

    fetchCollection(slug, { category, page: 1 })
      .then((result) => {
        if (ignore) return;
        setData(result);
        setStatus("ready");
        setError("");
      })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 404) {
          setStatus("notfound");
        } else {
          setStatus("error");
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!ignore) setIsFetching(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug, category, reloadKey]);

  const loadMore = useCallback(async () => {
    if (!data || loadingMore || data.page >= data.totalPages) return;
    setLoadingMore(true);
    try {
      const next = await fetchCollection(slug, { category, page: data.page + 1 });
      setData((prev) =>
        prev ? { ...next, products: [...prev.products, ...next.products] } : next
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }, [data, loadingMore, slug, category]);

  const reload = useCallback(() => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  }, []);

  return { data, status, error, isFetching, loadingMore, loadMore, reload };
}