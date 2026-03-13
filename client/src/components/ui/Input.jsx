import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', type = 'text', ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`
          w-full px-4 py-2.5 rounded-xl border
          bg-white dark:bg-neutral-900
          text-neutral-900 dark:text-neutral-100
          border-neutral-200 dark:border-neutral-800
          placeholder-[#9E8B7D]
          focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
