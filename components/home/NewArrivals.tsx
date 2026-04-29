import { getProducts } from "@/lib/api";
import { ApiProduct } from "@/types";
import NewArrivalsClient from "./NewArrivalsClient";

export default async function NewArrivals() {
  let products: ApiProduct[] = [];
  try {
    const res = await getProducts({
      limit: 8,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    products = res.data;
  } catch {
    // Backend offline — section is hidden
  }

  if (products.length === 0) return null;

  return <NewArrivalsClient products={products} />;
}
