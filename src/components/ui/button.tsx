import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center select-none gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ring disabled:pointer-events-none disabled:opacity-80 disabled:select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'outline-primary': 'border border-primary/40 bg-background hover:bg-primary/10 text-primary',
        'outline-destructive': 'border border-destructive/40 bg-background hover:bg-destructive/10 text-destructive',
        ghost: 'hover:bg-accent text-accent-foreground',
        'ghost-primary': 'hover:bg-primary/10 text-primary',
        link: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline !p-0 !h-auto',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        unstyled: '!p-0 !h-auto focus-visible:ring-0 focus-visible:ring-transparent rounded-none',
      },
      size: {
        default: 'h-10 px-4 py-2 [&_svg]:w-4 [&_svg]:h-4',
        sm: 'h-9 rounded-md px-3 [&_svg]:w-3.5 [&_svg]:h-3.5',
        lg: 'h-11 text-base rounded-md px-6 [&_svg]:w-5 [&_svg]:h-5',
        icon: 'h-10 w-10 [&_svg]:w-5 [&_svg]:h-5',
        'icon-sm': 'h-9 w-9 [&_svg]:w-4 [&_svg]:h-4',
        'icon-xs': 'h-8 w-8 [&_svg]:w-4 [&_svg]:h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, loadingText, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (isLoading) {
      return (
        <Comp disabled className={cn(buttonVariants({ variant, size, className }))} ref={ref} type='button' {...props}>
          <Loader className={'animate-spin'} />
          {loadingText || (!size?.startsWith('icon') && 'Submitting...')}
        </Comp>
      )
    }

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} type='button' {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
