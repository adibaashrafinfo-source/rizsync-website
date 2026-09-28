import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button variants — DESIGN.md §4.5.
 *
 * The primary CTA is navy-on-gold, never white-on-gold: white on #C9A24D
 * fails WCAG AA.
 *
 * The hover "shine" is a ::before pseudo-element rather than an extra child
 * node, because `asChild` renders through Radix `Slot`, which forwards props
 * to a single child — an extra sibling would be silently dropped.
 */
const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-btn font-semibold whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: [
          'bg-gold-500 text-navy-900 shadow-soft hover:bg-gold-600 hover:shadow-lift',
          'before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3',
          'before:-translate-x-[120%] before:bg-white/35 before:blur-[6px] before:content-[""]',
          'hover:before:animate-[rz-shine_0.9s_ease-out]',
        ],
        secondaryDark:
          'border-[1.5px] border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10',
        secondaryLight:
          'border-[1.5px] border-navy-900/25 bg-transparent text-navy-900 hover:border-navy-900/60 hover:bg-navy-900/5',
        navy: 'bg-navy-900 text-white shadow-soft hover:bg-navy-700 hover:shadow-lift',
        whatsapp: 'bg-whatsapp text-white shadow-soft hover:brightness-95 hover:shadow-lift',
        ghost: 'text-navy-900 hover:bg-navy-900/5',
      },
      size: {
        md: 'h-12 px-6 text-[15px]',
        sm: 'h-10 px-4 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
