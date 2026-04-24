import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white",
        secondary: "bg-zinc-800 text-zinc-300",
        new: "bg-emerald-500 text-white",
        sale: "bg-red-500 text-white",
        outline: "border border-zinc-700 text-zinc-300 bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
