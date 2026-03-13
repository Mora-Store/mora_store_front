import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { getImageUrl } from '../../utils/whatsapp';

const PRICE_RANGES = [
    { label: 'Todos los precios', min: '', max: '' },
    { label: 'Menos de S/ 50', min: '', max: '50' },
    { label: 'S/ 50 – S/ 150', min: '50', max: '150' },
    { label: 'S/ 150 – S/ 300', min: '150', max: '300' },
    { label: 'Más de S/ 300', min: '300', max: '' },
];

const FILTER_ICONS = {
    mujer: '/icons/mujer.png',
    mujeres: '/icons/mujer.png',
    hombre: '/icons/hombre.png',
    hombres: '/icons/hombre.png',
    mascotas: '/icons/mascotas.png',
    ninos: '/icons/ninos.png',
    niños: '/icons/ninos.png',
    ropa: '/icons/ropa.png'
};

const FilterBar = ({ categories, filters, onFilterChange, onReset }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const selectedCategory = categories.find(c => c._id === filters.category);
    const subcategories = selectedCategory?.subcategories || [];

    const filterContent = (
        <div className="flex flex-col gap-5">
            {/* Search */}
            <div>
                <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 block mb-2">Buscar</label>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={filters.search}
                        onChange={e => onFilterChange('search', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
              placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC]
              text-sm transition-all"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 block mb-2">Categoría</label>
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={() => onFilterChange('category', '')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all
              ${!filters.category
                                ? 'bg-[#E5E5CB] text-neutral-900 dark:bg-[#3A3025] dark:text-[#F5F5DC] font-semibold shadow-sm'
                                : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                            }`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mix-blend-multiply dark:mix-blend-screen">
                            <img src="/icons/todos.png" alt="Todos" className="w-full h-full object-contain dark:invert" />
                        </div> 
                        Todos
                    </button>
                    {categories.map(cat => {
                        const iconSrc = FILTER_ICONS[cat.slug?.toLowerCase()] || (cat.name && FILTER_ICONS[cat.name.toLowerCase()]);
                        return (
                            <button
                                key={cat._id}
                                onClick={() => onFilterChange('category', cat._id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all
                    ${filters.category === cat._id
                                        ? 'bg-[#E5E5CB] text-neutral-900 dark:bg-[#3A3025] dark:text-[#F5F5DC] font-semibold shadow-sm'
                                        : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                                    }`}
                            >
                                {cat.image ? (
                                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mix-blend-multiply dark:mix-blend-screen bg-transparent rounded">
                                        <img src={getImageUrl(cat.image)} alt="icon" className="w-full h-full object-contain dark:invert" />
                                    </div>
                                ) : iconSrc ? (
                                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mix-blend-multiply dark:mix-blend-screen">
                                        <img src={iconSrc} alt="icon" className="w-full h-full object-contain dark:invert" />
                                    </div>
                                ) : (
                                    <span className="w-5 h-5 flex items-center justify-center shrink-0">{cat.icon}</span>
                                )} 
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <div>
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 block mb-2">Subcategoría</label>
                    <div className="flex flex-col gap-1.5">
                        <button
                            onClick={() => onFilterChange('subcategory', '')}
                            className={`px-3 py-2 rounded-xl text-sm text-left transition-all
                ${!filters.subcategory
                                    ? 'bg-[#E5E5CB] text-neutral-900 dark:bg-[#3A3025] dark:text-[#F5F5DC] font-semibold shadow-sm'
                                    : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                                }`}
                        >
                            Todas
                        </button>
                        {subcategories.map(sub => (
                            <button
                                key={sub._id}
                                onClick={() => onFilterChange('subcategory', sub.name)}
                                className={`px-3 py-2 rounded-xl text-sm text-left transition-all
                  ${filters.subcategory === sub.name
                                        ? 'bg-[#E5E5CB] text-neutral-900 dark:bg-[#3A3025] dark:text-[#F5F5DC] font-semibold shadow-sm'
                                        : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                                    }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 block mb-2">Precio</label>
                <div className="flex flex-col gap-1.5">
                    {PRICE_RANGES.map(range => {
                        const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
                        return (
                            <button
                                key={range.label}
                                onClick={() => {
                                    onFilterChange('minPrice', range.min);
                                    onFilterChange('maxPrice', range.max);
                                }}
                                className={`px-3 py-2 rounded-xl text-sm text-left transition-all
                  ${isActive
                                        ? 'bg-[#E5E5CB] text-neutral-900 dark:bg-[#3A3025] dark:text-[#F5F5DC] font-semibold shadow-sm'
                                        : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                                    }`}
                            >
                                {range.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Reset */}
            <Button variant="ghost" onClick={onReset} size="sm" className="w-full border border-neutral-200 dark:border-neutral-800">
                <X size={14} /> Limpiar filtros
            </Button>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-6 bg-[#FFF8F3] dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                    {filterContent}
                </div>
            </aside>

            {/* Mobile filter button */}
            <div className="lg:hidden">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2"
                >
                    <SlidersHorizontal size={16} />
                    Filtrar
                    <ChevronDown size={14} />
                </Button>

                {/* Mobile drawer */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
                        <div className="relative bg-[#FFF8F3] dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto
              animate-[slideUp_0.3s_ease-out]">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filtros</h3>
                                <button onClick={() => setDrawerOpen(false)}>
                                    <X size={22} className="text-neutral-500" />
                                </button>
                            </div>
                            {filterContent}
                            <Button variant="primary" className="w-full mt-5" onClick={() => setDrawerOpen(false)}>
                                Aplicar filtros
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterBar;
