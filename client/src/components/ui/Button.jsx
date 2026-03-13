import { forwardRef } from 'react';

const variants = {
    primary: 'bg-[#F5F5DC] text-neutral-900 hover:bg-[#E5E5CB] hover:text-neutral-950 shadow-sm hover:shadow-md',
    secondary: 'bg-transparent border-2 border-neutral-900 dark:border-[#F5F5DC] text-neutral-900 dark:text-[#F5F5DC] hover:bg-[#F5F5DC] text-neutral-900 hover:text-white',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    whatsapp: 'bg-[#25D366] hover:bg-[#1aab52] text-white wa-pulse shadow-lg',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled}
            className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
