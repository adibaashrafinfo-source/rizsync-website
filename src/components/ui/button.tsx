import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button variants — HOME_REDESIGN.md §2.4.
 *
 * Coloured backgrounds always carry navy text: white on gold/teal/orange
 * fails WCAG AA. The v1 variant names (`primary`, `secondaryDark`,
 * `secondaryLight`) are kept as aliases so inner pages keep compiling.
 */
const gold =
  'bg-gold text-navy font-bold shadow-gold hover:bg-[#d4ae5c] hover:shadow-[0_20px_40px_-14px_rgb(201_162_77/0.9)]';
const outlineLight =
  'border-[1.5px] border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/[0.06]';
const outlineDark =
  'border-[1.5px] border-navy bg-transparent text-navy hover:bg-navy hover:text-white';

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-btn font-semibold whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gold,
        navy: 'bg-navy text-white font-bold hover:bg-navy-700',
        'outline-light': outlineLight,
        'outline-dark': outlineDark,
        whatsapp: outlineLight,
        ghost: 'text-navy hover:bg-navy/5',
        // v1 aliases
        primary: gold,
        secondaryDark: outlineLight,
        secondaryLight: outlineDark,
      },
      size: {
        sm: 'h-11 px-4 text-sm',
        md: 'h-12 px-6 text-[15px]',
        lg: 'h-[60px] px-7 text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: { variant: 'gold', size: 'md' },
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
