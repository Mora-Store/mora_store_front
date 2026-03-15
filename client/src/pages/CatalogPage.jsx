import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sun, Moon, ChevronLeft, Search } from 'lucide-react';
import ProductCard from '../components/catalog/ProductCard';
import FilterBar from '../components/catalog/FilterBar';
import EmptyState from '../components/catalog/EmptyState';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { useTheme } from '../context/ThemeContext';
import { getProducts, getCategories, getSettings } from '../services/api';
import { useFilters } from '../hooks/useFilters';
import WhatsAppFAB from '../components/catalog/WhatsAppFAB';
import CurrencySwitch from '../components/ui/CurrencySwitch';

const CatalogPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [searchParams] = useSearchParams();
    const { filters, updateFilter, resetFilters, apiParams } = useFilters({
        category: searchParams.get('category') || '',
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState(null);
    // loading = true ONLY on the very first render (shows SkeletonGrid)
    // After that, products update silently — NO intermediate opacity/skeleton flash
    const [loading, setLoading] = useState(true);
    // fetchId lets us discard stale responses when filters change rapidly
    const fetchId = useRef(0);

    // Fetch categories and settings once
    useEffect(() => {
        Promise.all([getCategories(), getSettings()]).then(([cats, sets]) => {
            setCategories(cats.data);
            setSettings(sets.data);
        }).catch(console.error);
    }, []);

    // Fetch products when filters change — NO intermediate loading state after first load
    const fetchProducts = useCallback(async () => {
        const id = ++fetchId.current; // increment, capture for this call
        try {
            const res = await getProducts(apiParams);
            // Ignore response if a newer fetch has started
            if (id !== fetchId.current) return;

            let data = res.data;
            // Client-side price filtering
            if (filters.minPrice) data = data.filter(p => p.price >= Number(filters.minPrice));
            if (filters.maxPrice) data = data.filter(p => p.price <= Number(filters.maxPrice));
            setProducts(data);
        } catch (e) {
            if (id === fetchId.current) console.error(e);
        } finally {
            if (id === fetchId.current) setLoading(false);
        }
    }, [apiParams, filters.minPrice, filters.maxPrice]); // eslint-disable-line

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const hasFilters = !!(filters.category || filters.subcategory || filters.search || filters.minPrice || filters.maxPrice);
    const waNumber = settings?.whatsappNumber;
    const businessName = settings?.businessName || 'Catálogo';

    return (
        <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 transition-colors duration-300">
            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-[#FFF8F3]/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-24 sm:h-28 flex items-center gap-4">
                    <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                        <ChevronLeft size={20} className="text-neutral-900 dark:text-neutral-100" />
                    </Link>
                    <Link to="/" className="group flex items-center gap-3">
                        <img src="/images/logo%20mora.png" alt="MORA Store" className="h-16 w-auto mix-blend-multiply dark:mix-blend-screen transition-transform duration-300 group-hover:scale-105" />
                        <span className="font-display font-bold text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#B59E81] via-[#B59E81] to-[#B59E81] dark:from-[#EAEAC8] dark:via-[#EAEAC8] dark:to-[#EAEAC8] bg-[length:200%_auto] transition-all duration-300 group-hover:from-[#B59E81] group-hover:via-[#5C4D3C] group-hover:to-[#B59E81] dark:group-hover:from-[#EAEAC8] dark:group-hover:via-[#FFFFFF] dark:group-hover:to-[#EAEAC8] group-hover:animate-shine-fast">
                            MORA Store
                        </span>
                    </Link>

                    {/* Search on desktop */}
                    <div className="relative hidden md:flex flex-1 max-w-sm ml-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.search}
                            onChange={e => updateFilter('search', e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800
                bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
                placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <CurrencySwitch />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-[#3A3025] hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-900/50 transition-all cursor-pointer"
                        >
                            {isDark ? <Sun size={18} className="text-neutral-900 dark:text-[#F5F5DC]" /> : <Moon size={18} className="text-neutral-500" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Mobile search + filter bar */}
                <div className="md:hidden flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.search}
                            onChange={e => updateFilter('search', e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
              placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                        />
                    </div>
                    <FilterBar
                        categories={categories}
                        filters={filters}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                    />
                </div>

                <div className="flex gap-8">
                    {/* Sidebar filter — desktop only */}
                    <div className="hidden md:block">
                        <FilterBar
                            categories={categories}
                            filters={filters}
                            onFilterChange={updateFilter}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Product grid */}
                    <main className="flex-1 min-w-0">
                        {/* Desktop search */}
                        <div className="relative hidden md:flex mb-6">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={filters.search}
                                onChange={e => updateFilter('search', e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
                  placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                            />
                        </div>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {filters.category
                                        ? categories.find(c => c._id === filters.category)?.name || 'Catálogo'
                                        : 'Todo el Catálogo'
                                    }
                                </h1>
                                {!loading && (
                                    <p className="text-sm text-neutral-500 mt-1">{products.length} producto(s)</p>
                                )}
                            </div>
                        </div>

                        {/* Products — skeleton only on very first load, then silent atomic swap */}
                        {loading ? (
                            <SkeletonGrid count={8} />
                        ) : products.length === 0 ? (
                            <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {products.map(p => (
                                    <ProductCard key={p._id} product={p} whatsappNumber={waNumber} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* WhatsApp Floating Button */}
            <WhatsAppFAB phoneNumber={waNumber} />
        </div>
    );
};

export default CatalogPage;
