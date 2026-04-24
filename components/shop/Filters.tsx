"use client";

import { ApiCategory } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "default", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix decroissant" },
  { value: "new", label: "Nouveautes" },
];

interface FiltersProps {
  activeCategory: string;
  activeSort: string;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: string) => void;
  total: number;
  categories: ApiCategory[];
}

export default function Filters({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  total,
  categories,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={cn(
            "px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full border transition-all duration-200",
            activeCategory === "all"
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-white/15 text-zinc-500 hover:border-white/40 hover:text-zinc-200"
          )}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full border transition-all duration-200",
              activeCategory === cat.slug
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-white/15 text-zinc-500 hover:border-white/40 hover:text-zinc-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-xs text-zinc-600 hidden sm:block">
          {total} article{total > 1 ? "s" : ""}
        </span>
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-zinc-900 border border-white/10 text-zinc-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
