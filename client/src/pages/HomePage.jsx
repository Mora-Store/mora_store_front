import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Sun, Moon, Instagram, Facebook, Star, MessageCircle, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, generateWhatsAppLink } from '../utils/whatsapp';
import { getProducts, getSettings, getCategories } from '../services/api';
import WhatsAppFAB from '../components/catalog/WhatsAppFAB';
import CurrencySwitch from '../components/ui/CurrencySwitch';

const TikTok = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const CATEGORY_VISUALS = {
    mujer: { color: 'from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900', label: 'Para Ella', iconSrc: '/icons/mujer.png' },
    mujeres: { color: 'from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900', label: 'Para Ella', iconSrc: '/icons/mujer.png' },
    hombre: { color: 'from-slate-100 to-blue-50 dark:from-slate-900/30 dark:to-blue-900/20', label: 'Para Él', iconSrc: '/icons/hombre.png' },
    hombres: { color: 'from-slate-100 to-blue-50 dark:from-slate-900/30 dark:to-blue-900/20', label: 'Para Él', iconSrc: '/icons/hombre.png' },
    mascotas: { color: 'from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20', label: 'Para tu Peludo', iconSrc: '/icons/mascotas.png' },
    ninos: { color: 'from-[#F5F5DC] to-neutral-50 dark:from-neutral-800 dark:to-neutral-900', label: 'Para los Pequeños', iconSrc: '/icons/ninos.png' },
    niños: { color: 'from-[#F5F5DC] to-neutral-50 dark:from-neutral-800 dark:to-neutral-900', label: 'Para los Pequeños', iconSrc: '/icons/ninos.png' },
    ropa: { color: 'from-purple-100 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20', label: 'Moda y Prendas', iconSrc: '/icons/ropa.png' },
};

// ── Featured Carousel (smooth CSS slide, arrows fully outside the cards) ──────
const FeaturedCarousel = ({ products, waNumber }) => {
    const { currency } = useCurrency();
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [dir, setDir] = useState(1); // 1 = right, -1 = left
    // displayed keeps the "old" set visible during the exit animation
    const [displayed, setDisplayed] = useState(0);
    const timerRef = useRef(null);
    const total = products.length;
    const perPage = 3; // desktop shows 3 cards

    const startSlide = useCallback((next, direction) => {
        if (sliding || next === current || total < 2) return;
        clearInterval(timerRef.current);
        setDir(direction);
        setSliding(true);
        // After exit animation, swap and start enter
        setTimeout(() => {
            setDisplayed(next);
            setCurrent(next);
            setSliding(false);
        }, 380);
    }, [sliding, current, total]);

    const goNext = useCallback(() => startSlide((current + 1) % total, 1), [startSlide, current, total]);
    const goPrev = useCallback(() => startSlide((current - 1 + total) % total, -1), [startSlide, current, total]);

    // Auto-advance
    useEffect(() => {
        if (total < 2) return;
        timerRef.current = setInterval(goNext, 4500);
        return () => clearInterval(timerRef.current);
    }, [goNext, total]);

    if (!products.length) return (
        <p className="text-center text-neutral-500 py-12">No hay productos destacados aún.</p>
    );

    const getCards = (start) => {
        const out = [];
        for (let i = 0; i < Math.min(perPage, total); i++) {
            out.push(products[(start + i) % total]);
        }
        return out;
    };

    // Exit class: slide out in the direction of travel
    const exitClass = sliding ? `opacity-0 ${dir > 0 ? '-translate-x-8' : 'translate-x-8'}` : 'opacity-100 translate-x-0';

    return (
        <div>
            {/* Arrow + cards + arrow row */}
            <div className="flex items-center gap-0 md:gap-4 relative">
                {/* Left arrow — visible on desktop */}
                <button
                    onClick={goPrev}
                    disabled={total < 2}
                    className="hidden md:flex shrink-0 w-11 h-11 rounded-full bg-white dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-800 shadow-md
                        items-center justify-center
                        hover:bg-neutral-100 dark:bg-neutral-800 hover:border-neutral-900 dark:hover:border-[#F5F5DC]
                        transition-all duration-200 disabled:opacity-30"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={20} className="text-neutral-900 dark:text-neutral-100" />
                </button>

                {/* Cards viewport — overflow hidden clips the slide */}
                <div className="overflow-hidden flex-1 w-full">
                    <div
                        className={`grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                            transition-all duration-[380ms] ease-in-out ${exitClass}`}
                    >
                        {getCards(displayed).map((p, i) => {
                            if (!p) return null;
                            const img = p.images?.[0] ? getImageUrl(p.images[0]) : null;
                            const waLink = generateWhatsAppLink(waNumber || '51999123456', p.name);
                            const disc = p.discount || 0;
                            const finalP = disc > 0 ? p.price * (1 - disc / 100) : p.price;
                            return (
                                <div
                                    key={`${p._id}-${i}`}
                                    className="group rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800
                                        bg-white dark:bg-neutral-900 flex flex-col shadow-sm hover:shadow-md
                                        transition-shadow duration-200"
                                >
                                    {/* Image */}
                                    <Link to={`/producto/${p._id}`} className="relative aspect-[4/5] sm:aspect-[3/4] block overflow-hidden">
                                        {img ? (
                                            <img src={img} alt={p.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-5xl opacity-40">
                                                👜
                                            </div>
                                        )}
                                        {/* Featured badge */}
                                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1
                                            bg-[#F5F5DC] text-neutral-900 dark:text-neutral-900 text-[10px] sm:text-xs font-medium rounded-full shadow-sm">
                                            <Star size={8} sm:size={10} fill="currentColor" /> Destacado
                                        </span>
                                        {/* Discount badge */}
                                        {disc > 0 && (
                                            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1
                                                bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                                                −{disc}%
                                            </span>
                                        )}
                                    </Link>

                                    {/* Info */}
                                    <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
                                        <p className="text-[10px] sm:text-xs text-neutral-500">{p.category?.name}{p.subcategory && ` · ${p.subcategory}`}</p>
                                        <Link to={`/producto/${p._id}`}>
                                            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 line-clamp-2 hover:text-neutral-900 dark:hover:text-[#F5F5DC] transition-colors">
                                                {p.name}
                                            </h3>
                                        </Link>
                                        <div className="mt-auto">
                                            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                                                <span className="font-mono font-bold text-neutral-900 dark:text-[#F5F5DC] text-base sm:text-lg">{formatPrice(finalP, currency)}</span>
                                                {disc > 0 && <span className="font-mono text-xs sm:text-sm text-neutral-500 line-through">{formatPrice(p.price, currency)}</span>}
                                            </div>
                                        </div>
                                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#1aab52]
                                                text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-xl transition-colors mt-2">
                                            <MessageCircle size={13} className="sm:hidden" /><MessageCircle size={15} className="hidden sm:block" /> Cotizar
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right arrow — visible on desktop */}
                <button
                    onClick={goNext}
                    disabled={total < 2}
                    className="hidden md:flex shrink-0 w-11 h-11 rounded-full bg-white dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-800 shadow-md
                        items-center justify-center
                        hover:bg-neutral-100 dark:bg-neutral-800 hover:border-neutral-900 dark:hover:border-[#F5F5DC]
                        transition-all duration-200 disabled:opacity-30"
                    aria-label="Siguiente"
                >
                    <ChevronRight size={20} className="text-neutral-900 dark:text-neutral-100" />
                </button>
            </div>

            {/* Mobile Navigation Arrows (Bottom) */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-6">
                <button
                    onClick={goPrev}
                    disabled={total < 2}
                    className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-800 shadow-sm
                        flex items-center justify-center
                        active:scale-95 transition-all duration-200 disabled:opacity-30"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={22} className="text-neutral-900 dark:text-neutral-100" />
                </button>
                <button
                    onClick={goNext}
                    disabled={total < 2}
                    className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-800 shadow-sm
                        flex items-center justify-center
                        active:scale-95 transition-all duration-200 disabled:opacity-30"
                    aria-label="Siguiente"
                >
                    <ChevronRight size={22} className="text-neutral-900 dark:text-neutral-100" />
                </button>
            </div>

            {/* Dot indicators — centered below */}
            {total > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => startSlide(i, i > current ? 1 : -1)}
                            aria-label={`Ir al producto ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === current
                                ? 'w-7 h-2.5 bg-[#F5F5DC] text-neutral-900'
                                : 'w-2.5 h-2.5 bg-neutral-200 dark:bg-neutral-800 dark:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main HomePage ─────────────────────────────────────────────────────────────
const HomePage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getProducts({ featured: 'true' }),
            getCategories(),
            getSettings(),
        ]).then(([products, cats, sets]) => {
            setFeaturedProducts(products.data);
            setCategories(cats.data);
            setSettings(sets.data);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const waNumber = settings?.whatsappNumber;
    const businessName = settings?.businessName || 'Catálogo';

    return (
        <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 transition-colors duration-300">

            {/* ── Navbar ──────────────────────────────────────────────────── */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-[#FFF8F3]/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                    <Link to="/" className="group flex items-center gap-3">
                        <img src="/images/logo%20mora.png" alt="MORA Store" className="h-16 w-auto mix-blend-multiply dark:mix-blend-screen transition-transform duration-300 group-hover:scale-105" />
                        <span className="font-display font-bold text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#B59E81] via-[#B59E81] to-[#B59E81] dark:from-[#EAEAC8] dark:via-[#EAEAC8] dark:to-[#EAEAC8] bg-[length:200%_auto] transition-all duration-300 group-hover:from-[#B59E81] group-hover:via-[#5C4D3C] group-hover:to-[#B59E81] dark:group-hover:from-[#EAEAC8] dark:group-hover:via-[#FFFFFF] dark:group-hover:to-[#EAEAC8] group-hover:animate-shine-fast">
                            MORA Store
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="relative text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-900 dark:text-[#F5F5DC] transition-colors group py-2">
                            <span className="relative z-10">Inicio</span>
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#F5F5DC] text-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                        </Link>
                        <Link to="/catalogo" className="relative text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-900 dark:text-[#F5F5DC] transition-colors group py-2">
                            <span className="relative z-10">Catálogo</span>
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#F5F5DC] text-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <CurrencySwitch />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-[#3A3025] hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-900/50 transition-all cursor-pointer"
                            aria-label="Cambiar tema"
                        >
                            {isDark ? <Sun size={18} className="text-neutral-900 dark:text-[#F5F5DC]" /> : <Moon size={18} className="text-neutral-500" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Hero Section ─────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-neutral-950 transition-colors duration-500" />
                
                {/* Background Image (Static) */}
                <img 
                    src="/images/hero-bg.png"
                    alt="Colección de Accesorios"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
                />
                
                {/* Animated Background Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F5F5DC]/50 dark:bg-neutral-800/20 blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E5E5CB]/50 dark:bg-neutral-900/30 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#FCFCF0]/60 dark:bg-neutral-900/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-16">
                    <p className="text-sm font-medium tracking-widest text-neutral-900 dark:text-[#F5F5DC] uppercase mb-4">
                        ✨ Nueva colección disponible
                    </p>
                    <h1 className="font-display text-5xl md:text-7xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
                        Accesorios que{' '}
                        <span className="text-neutral-900 dark:text-[#F5F5DC] italic">cuentan</span>{' '}
                        tu historia
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Descubre nuestra colección de accesorios de moda, diseñados con calidez y elegancia para expresar quien eres.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/catalogo"
                            className="bg-[#F5F5DC] text-neutral-900 hover:bg-[#E5E5CB] hover:text-neutral-950 font-medium px-8 py-4 rounded-2xl text-lg
                                transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
                        >
                            Ver Catálogo <ChevronRight size={20} />
                        </Link>
                        {waNumber && (
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800
                                    text-neutral-900 dark:text-neutral-100 font-medium px-8 py-4 rounded-2xl text-lg
                                    transition-all duration-200 hover:border-neutral-900 dark:border-[#F5F5DC] inline-flex items-center gap-2"
                            >
                                <MessageCircle size={20} className="text-[#25D366]" /> Contáctanos
                            </a>
                        )}
                    </div>

                    {/* Discount badge teaser */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Tag size={14} className="text-red-500" />
                        <p className="text-sm text-neutral-500">Encuentra productos con hasta <span className="text-red-500 font-semibold">30% de descuento</span></p>
                    </div>
                </div>
            </section>

            {/* ── Featured Products Carousel ───────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <p className="text-sm font-medium tracking-widest text-neutral-900 dark:text-[#F5F5DC] uppercase mb-3">
                        Selección especial
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-400 to-neutral-900 dark:from-neutral-100 dark:via-neutral-500 dark:to-neutral-100 bg-[length:200%_auto] animate-shine">
                        DESTACADO
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center gap-4">
                        <div className="w-11" />
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                                    <div className="skeleton aspect-[3/4] w-full" />
                                    <div className="p-4 space-y-2">
                                        <div className="skeleton h-4 w-3/4 rounded" />
                                        <div className="skeleton h-3 w-1/2 rounded" />
                                        <div className="skeleton h-8 w-full rounded-xl mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-11" />
                    </div>
                ) : (
                    <FeaturedCarousel products={featuredProducts} waNumber={waNumber} />
                )}

                <div className="text-center mt-10">
                    <Link to="/catalogo"
                        className="inline-flex items-center gap-2 text-neutral-900 dark:text-[#F5F5DC] font-medium hover:text-neutral-900 dark:text-[#F5F5DC] dark:hover:text-[#E5E5CB] transition-colors">
                        Ver todo el catálogo <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ── Category Grid ─────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="text-center mb-12">
                    <p className="text-sm font-medium tracking-widest text-neutral-900 dark:text-[#F5F5DC] uppercase mb-3">
                        Explorar por sección
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                        Encuentra tu estilo
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map(cat => {
                        const visual = CATEGORY_VISUALS[cat.slug] || {
                            color: 'from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-900/20',
                            label: cat.name,
                        };
                        return (
                            <Link
                                key={cat._id}
                                to={`/catalogo?category=${cat._id}`}
                                className={`group relative rounded-2xl p-6 bg-gradient-to-br ${visual.color}
                                    border border-neutral-200 dark:border-neutral-800
                                    hover:border-neutral-900 dark:border-[#F5F5DC] hover:-translate-y-1
                                    transition-all duration-300 flex flex-col items-center gap-3 text-center`}
                            >
                                <div className="h-12 w-12 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center mix-blend-multiply dark:mix-blend-screen bg-transparent rounded-xl">
                                    {cat.image ? (
                                        <img src={getImageUrl(cat.image)} alt={cat.name} className="h-full w-full object-contain dark:invert" />
                                    ) : visual.iconSrc ? (
                                        <img src={visual.iconSrc} alt={cat.name} className="h-full w-full object-contain dark:invert" />
                                    ) : (
                                        <span className="text-4xl">{cat.icon}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{cat.name}</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">{visual.label}</p>
                                </div>
                                <ChevronRight size={14} className="text-neutral-900 dark:text-[#F5F5DC] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 py-12 border-t border-neutral-200 dark:border-transparent">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-display text-2xl font-bold text-neutral-900 dark:text-[#F5F5DC] mb-1">MORA Store</p>
                            <p className="text-sm">Accesorios con calidez y estilo</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="#" className="p-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors" aria-label="Instagram">
                                <Instagram size={20} className="text-neutral-900 dark:text-[#F5F5DC]" />
                            </a>
                            <a href="#" className="p-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors" aria-label="Facebook">
                                <Facebook size={20} className="text-neutral-900 dark:text-[#F5F5DC]" />
                            </a>
                            <a href="#" className="p-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors" aria-label="TikTok">
                                <TikTok size={20} className="text-neutral-900 dark:text-[#F5F5DC]" />
                            </a>
                        </div>
                        <Link to="/adminpanel" className="text-neutral-500 hover:text-neutral-900 dark:text-[#F5F5DC] transition-colors text-xs">
                            Panel Admin
                        </Link>
                    </div>
                    <div className="border-t border-neutral-200 dark:border-neutral-900 mt-8 pt-8 text-center text-xs">
                        © {new Date().getFullYear()} MORA Store. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Action Button */}
            <WhatsAppFAB phoneNumber={waNumber} />
        </div>
    );
};

export default HomePage;
