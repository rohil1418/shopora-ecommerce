import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiError } from "@/shared/api";
import {
  ProductDetail,
  fetchProductById,
  getProduct,
  type Product,
} from "@/features/products";
import NotFoundPage from "./NotFoundPage";

const extractObjectId = (uid: string): string | null => {
  const tail = uid.slice(-24);
  return /^[a-f0-9]{24}$/i.test(tail) ? tail : null;
};

function ProductLoader({ uid }: { uid: string }) {
  const objectId = extractObjectId(uid);
  const [product, setProduct] = useState<Product | undefined>(() => getProduct(uid));
  const [loading, setLoading] = useState<boolean>(() => !getProduct(uid) && objectId !== null);

  useEffect(() => {
    if (!objectId) return;
    let ignore = false;

    fetchProductById(objectId)
      .then((fresh) => {
        if (!ignore) setProduct(fresh);
      })
      .catch((error) => {
        if (!ignore && error instanceof ApiError && error.status === 404) setProduct(undefined);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [objectId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-[3/4] animate-pulse bg-gray-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse bg-gray-100" />
            <div className="h-6 w-1/2 animate-pulse bg-gray-100" />
            <div className="h-12 w-full animate-pulse bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) return <NotFoundPage />;

  return <ProductDetail product={product} />;
}

export default function ProductPage() {
  const { uid } = useParams<{ uid: string }>();
  if (!uid) return <NotFoundPage />;
  return <ProductLoader key={uid} uid={uid} />;
}