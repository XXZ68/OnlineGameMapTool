import type { ButtonHTMLAttributes, ReactNode } from 'react'

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-4 text-base',
  lg: 'px-6 py-8 text-lg',
} as const

const VARIANTS = {
  primary:
    'bg-accent-special hover:bg-accent-complementary text-white border-transparent',
  secondary:
    'bg-transparent border-bg-accent hover:text-white hover:bg-accent-special hover:border-accent-special',
  danger:
    'bg-red-500 border-transparent hover:bg-red-700',
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof SIZES
  variant?: keyof typeof VARIANTS
  children?: ReactNode
}

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    'w-auto border transition-colors rounded-md font-medium inline-flex items-center justify-center'

  const sizeClasses = SIZES[size]
  const variantClasses = VARIANTS[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
