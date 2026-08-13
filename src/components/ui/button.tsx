import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        solid:
          "bg-sage text-sage-fg shadow-[var(--shadow-card)] hover:bg-ink",
        sheet:
          "bg-sheet text-ink shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        ghost: "bg-transparent text-ink hover:bg-paper-deep",
        clay: "bg-clay text-clay-fg shadow-[var(--shadow-card)] hover:bg-ink",
      },
      size: {
        md: "h-12 rounded-[var(--radius-sm)] px-5 text-base",
        lg: "h-16 rounded-[var(--radius-md)] px-7 text-lg",
        icon: "size-16 rounded-full",
        tile: "size-20 rounded-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
