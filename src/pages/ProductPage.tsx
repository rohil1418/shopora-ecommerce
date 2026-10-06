import { useParams } from "react-router-dom";
import { ProductDetail, getProduct } from "@/features/products";
import NotFoundPage from "./NotFoundPage";

export default function ProductPage() {
  const { uid } = useParams<{ uid: string }>();
  const product = getProduct(uid);

  if (!product) return <NotFoundPage />;

  return <ProductDetail key={uid} product={product} />;
}