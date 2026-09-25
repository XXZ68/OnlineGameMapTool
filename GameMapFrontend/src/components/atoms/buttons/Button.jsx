

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-4 text-base',
  lg: 'px-6 py-8 text-lg',
};

const VARIANTS = {
  primary: 'bg-accent-special hover:bg-accent-complementary text-white border-transparent',
  secondary: 'bg-transparent border-bg-accent hover:text-white hover:bg-accent-special hover:border-accent-special',
  danger: 'bg-red-500 border-transparent hover:bg-red-700',
};

const Button = ({ 
  type = 'button', 
  onClick, 
  disabled = false, 
  size = 'md',
  variant = 'primary',
  className = '',
  children, 
  ...props 
}) => {
  
  const baseClasses = 'w-auto border transition-colors rounded-md font-medium inline-flex items-center justify-center';
  const sizeClasses = SIZES[size] || SIZES.md;
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;

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
  );
};

export default Button;
