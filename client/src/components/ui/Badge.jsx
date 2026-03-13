const variants = {
    primary: 'bg-[#F5F5DC] text-neutral-900 dark:text-neutral-100',
    light: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#F5F5DC]',
    dark: 'bg-neutral-900 text-white',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-yellow-100 text-yellow-700',
    muted: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500',
};

const Badge = ({ children, variant = 'primary', className = '' }) => {
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
