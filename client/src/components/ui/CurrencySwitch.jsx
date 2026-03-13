import { useCurrency } from '../../context/CurrencyContext';

const CurrencySwitch = () => {
    const { currency, toggleCurrency } = useCurrency();

    return (
        <button
            onClick={toggleCurrency}
            className="relative flex items-center p-1 w-16 h-8 bg-neutral-200 dark:bg-neutral-800 dark:bg-neutral-800 rounded-full transition-colors cursor-pointer"
            aria-label={`Cambiar Moneda, seleccionada ${currency}`}
            title="Soles / Dólares"
        >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-neutral-950 rounded-full shadow-sm flex items-center justify-center transition-transform duration-300 z-10 ${currency === 'USD' ? 'translate-x-8' : 'translate-x-0'}`}>
                <span className="text-xs font-bold text-neutral-900 dark:text-[#F5F5DC] leading-none">
                    {currency === 'USD' ? '$' : 'S/'}
                </span>
            </div>
            <div className="w-full flex justify-between px-2 text-[10px] font-bold text-neutral-500 dark:text-neutral-500 select-none">
                <span>PEN</span>
                <span>USD</span>
            </div>
        </button>
    );
};

export default CurrencySwitch;
