import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, CheckCircle, MessageCircle, Sun, Moon } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import WhatsAppFAB from '../components/catalog/WhatsAppFAB';
import { getImageUrl, generateWhatsAppLink } from '../utils/whatsapp';
import { formatPrice } from '../utils/formatPrice';
import { getProduct, getSettings } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { isDark, toggleTheme } = useTheme();
    const { currency } = useCurrency();
    const [product, setProduct] = useState(null);
    const [settings, setSettings] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        Promise.all([getProduct(id), getSettings()])
            .then(([prod, sets]) => {
                setProduct(prod.data);
                setSettings(sets.data);
                setSelectedImage(0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-900 dark:border-[#F5F5DC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-500">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 flex flex-col items-center justify-center gap-4">
                <p className="text-2xl">😕</p>
                <p className="text-neutral-900 dark:text-neutral-100">Producto no encontrado.</p>
                <Link to="/catalogo" className="text-neutral-900 dark:text-[#F5F5DC] hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    const waNumber = settings?.whatsappNumber;
    const businessName = settings?.businessName || 'Catálogo';
    const waLink = generateWhatsAppLink(waNumber, product.name);
    const images = product.images?.length > 0 ? product.images : [];

    const hasDiscount = product.discount > 0;
    const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

    const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 pb-24">
            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-[#FFF8F3]/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/catalogo" className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                        <ChevronLeft size={20} className="text-neutral-900 dark:text-neutral-100" />
                    </Link>
                    <span className="font-display font-bold text-xl text-neutral-900 dark:text-[#F5F5DC]">{businessName}</span>
                    <button
                        onClick={toggleTheme}
                        className="ml-auto p-2 rounded-xl hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors"
                    >
                        {isDark ? <Sun size={18} className="text-neutral-900 dark:text-[#F5F5DC]" /> : <Moon size={18} className="text-neutral-500" />}
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                    {/* eBay style Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
                        {images.length > 1 && (
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 md:max-h-[500px] shrink-0 pb-2 md:pb-0 scrollbar-hide py-1 px-1">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`shrink-0 w-16 h-16 md:w-full md:h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i
                                            ? 'border-neutral-900 dark:border-[#F5F5DC] shadow-md scale-105'
                                            : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                            }`}
                                    >
                                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-900" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-900 group border border-neutral-200 dark:border-neutral-800">
                            {images[selectedImage] ? (
                                <img
                                    src={getImageUrl(images[selectedImage])}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">
                                    👜
                                </div>
                            )}

                            {/* Image Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 shadow-lg flex items-center justify-center text-neutral-900 dark:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 shadow-lg flex items-center justify-center text-neutral-900 dark:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <ChevronLeft size={24} className="rotate-180" />
                                    </button>
                                </>
                            )}

                            {/* Badges on image */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.featured && (
                                    <Badge variant="primary" className="shadow-md">
                                        <Star size={12} fill="currentColor" /> Destacado
                                    </Badge>
                                )}
                                {hasDiscount && (
                                    <Badge className="bg-red-500 text-white border-0 shadow-md shadow-red-500/30 font-bold px-3">
                                        −{product.discount}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-5">
                        {/* Category breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <span>{product.category?.icon}</span>
                            <span>{product.category?.name}</span>
                            {product.subcategory && <><span>·</span><span>{product.subcategory}</span></>}
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {product.available ? (
                                <Badge variant="success"><CheckCircle size={11} /> Disponible</Badge>
                            ) : (
                                <Badge variant="muted">No disponible</Badge>
                            )}
                        </div>

                        {/* Price Block */}
                        <div className="flex flex-col gap-1 mt-2">
                            {hasDiscount && (
                                <span className="text-lg text-neutral-500 line-through font-mono">
                                    {formatPrice(product.price, currency)}
                                </span>
                            )}
                            <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-[#F5F5DC]">
                                {formatPrice(finalPrice, currency)}
                            </p>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* WhatsApp CTA */}
                        <div className="pt-4 flex flex-col gap-3">
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="whatsapp" size="lg" className="w-full text-base">
                                    <MessageCircle size={20} />
                                    Cotízalo por WhatsApp
                                </Button>
                            </a>
                            <Link to="/catalogo">
                                <Button variant="ghost" size="md" className="w-full border border-neutral-200 dark:border-neutral-800">
                                    <ChevronLeft size={16} /> Ver más productos
                                </Button>
                            </Link>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-neutral-500 italic pt-2">
                            * Los precios son de referencia. Contáctanos para disponibilidad y confirmación de precio.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile WhatsApp FAB */}
            <WhatsAppFAB productName={product.name} whatsappNumber={waNumber} />
        </div>
    );
};

export default ProductDetailPage;
