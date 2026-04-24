import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tighter text-white mb-1">Nouveau produit</h1>
      <p className="text-zinc-500 text-sm mb-8">Remplissez les informations du produit</p>
      <ProductForm />
    </div>
  );
}
