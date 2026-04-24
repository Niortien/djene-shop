"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { getCategories, adminCreateCategory } from "@/lib/api";
import { ApiCategory } from "@/types";
import { Plus, Loader2, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setCreateError(null);
    try {
      const cat = await adminCreateCategory(token, { name: newName, description: newDesc || undefined });
      setCategories((prev) => [...prev, cat]);
      setNewName("");
      setNewDesc("");
      setShowForm(false);
    } catch (e) {
      setCreateError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-0.5">Categories</h1>
          <p className="text-zinc-500 text-sm">{categories.length} categorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nouvelle categorie
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 max-w-lg"
        >
          <h2 className="text-white font-bold mb-4">Nouvelle categorie</h2>
          {createError && (
            <p className="text-red-400 text-sm mb-3">{createError}</p>
          )}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-1.5">Nom *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                placeholder="Joggings"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-1.5">Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                placeholder="Description de la categorie"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {creating && <Loader2 size={14} className="animate-spin" />}
              Creer
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`bg-zinc-900 border rounded-xl p-5 ${cat.isActive ? "border-zinc-800" : "border-zinc-800/40 opacity-60"}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Tag size={16} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{cat.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{cat.description ?? "—"}</p>
                  <p className="text-zinc-700 text-[10px] mt-1 font-mono">{cat.slug}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${cat.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                  target="_blank"
                >
                  Voir les produits
                </Link>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-600 text-sm">
              Aucune categorie
            </div>
          )}
        </div>
      )}
    </div>
  );
}
