"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getCategories, adminCreateProduct, adminUpdateProduct, adminUploadProductImages } from "@/lib/api";
import { ApiProduct, ApiCategory } from "@/types";
import { Loader2, X, Plus, ImagePlus } from "lucide-react";

interface ProductFormProps {
  product?: ApiProduct;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { token } = useAuthStore();
  const router = useRouter();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [salePrice, setSalePrice] = useState(String(product?.salePrice ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? ""));
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [sizesInput, setSizesInput] = useState("");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colorsInput, setColorsInput] = useState("");
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageWarning, setImageWarning] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function addTag(value: string, list: string[], setList: (v: string[]) => void) {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
  }

  function removeTag(value: string, list: string[], setList: (v: string[]) => void) {
    setList(list.filter((v) => v !== value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    setError(null);

    const data = {
      name,
      description: description || undefined,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      categoryId: categoryId || undefined,
      sku: sku || undefined,
      isFeatured,
      sizes: sizes.length > 0 ? sizes : undefined,
      colors: colors.length > 0 ? colors : undefined,
      ...(product ? { isActive } : {}),
    };

    try {
      let productId: string;
      if (product) {
        await adminUpdateProduct(token, product.id, data);
        productId = product.id;
      } else {
        const created = await adminCreateProduct(token, data);
        productId = created.id;
      }

      if (imageFiles.length > 0) {
        try {
          await adminUploadProductImages(token, productId, imageFiles);
        } catch (imgErr) {
          // Product saved — only image upload failed (likely Cloudinary not configured)
          setImageWarning(
            `Produit enregistré, mais l'upload d'image a échoué : ${
              (imgErr as Error).message
            }. Vérifiez la configuration Cloudinary dans le backend.`
          );
          setIsLoading(false);
          return;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {imageWarning && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-400 text-sm">
          ⚠️ {imageWarning}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="text-xs underline hover:no-underline"
            >
              Continuer sans image
            </button>
          </div>
        </div>
      )}

      {/* Nom */}
      <Field label="Nom *">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputCls}
          placeholder="Jogging Premium Streetwear"
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputCls}
          placeholder="Description du produit..."
        />
      </Field>

      {/* Prix */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prix (FCFA) *">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            className={inputCls}
            placeholder="25000"
          />
        </Field>
        <Field label="Prix promo (FCFA)">
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            min={0}
            className={inputCls}
            placeholder="20000"
          />
        </Field>
      </div>

      {/* Stock + SKU */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock *">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min={0}
            className={inputCls}
            placeholder="50"
          />
        </Field>
        <Field label="SKU">
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className={inputCls}
            placeholder="SKU-001"
          />
        </Field>
      </div>

      {/* Categorie */}
      <Field label="Categorie">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
          <option value="">— Aucune categorie —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      {/* Tailles */}
      <Field label="Tailles">
        <div className="flex gap-2 mb-2 flex-wrap">
          {sizes.map((s) => (
            <Tag key={s} label={s} onRemove={() => removeTag(s, sizes, setSizes)} />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(sizesInput, sizes, setSizes);
                setSizesInput("");
              }
            }}
            className={inputCls}
            placeholder="Ex: S, M, L, XL (Entree pour ajouter)"
          />
          <button
            type="button"
            onClick={() => { addTag(sizesInput, sizes, setSizes); setSizesInput(""); }}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-sm text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </Field>

      {/* Couleurs */}
      <Field label="Couleurs">
        <div className="flex gap-2 mb-2 flex-wrap">
          {colors.map((c) => (
            <Tag key={c} label={c} onRemove={() => removeTag(c, colors, setColors)} />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(colorsInput, colors, setColors);
                setColorsInput("");
              }
            }}
            className={inputCls}
            placeholder="Ex: Noir, Blanc (Entree pour ajouter)"
          />
          <button
            type="button"
            onClick={() => { addTag(colorsInput, colors, setColors); setColorsInput(""); }}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-sm text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </Field>

      {/* Images */}
      <Field label="Images">
        {/* Existing images (edit mode) */}
        {product && product.images && product.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={typeof img === "string" ? img : (img as { url: string }).url}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ))}
          </div>
        )}
        {/* New images previews */}
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt={`Aperçu ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-zinc-600" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors">
          <ImagePlus size={16} />
          Ajouter des images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </Field>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-zinc-300">Produit vedette</span>
        </label>
        {product && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm text-zinc-300">Actif</span>
          </label>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {product ? "Enregistrer" : "Creer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-sm">
      {label}
      <button type="button" onClick={onRemove} className="text-zinc-500 hover:text-red-400 transition-colors">
        <X size={12} />
      </button>
    </span>
  );
}

const inputCls =
  "w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600";
