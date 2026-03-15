import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { MessageCircle, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { generateWhatsAppLink, getImageUrl } from '../../utils/whatsapp';
import { useCurrency } from '../../context/CurrencyContext';

const ProductCard = ({ product, whatsappNumber }) => {
    const { _id, name, price, images, featured, available, category, subcategory, discount = 0 } = product;
    const { currency } = useCurrency();
    const imageUrl = images?.[0] ? getImageUrl(images[0]) : null;
    const waLink = generateWhatsAppLink(whatsappNumber || '51999123456', name);

    const hasDiscount = discount > 0;
    const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

    return (
        <div className="product-card group rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col">
            {/* Product Image */}
            <Link to={`/producto/${_id}`} className="block relative overflow-hidden aspect-[3/4]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-900">
                        <span className="text-5xl opacity-40">👜</span>
                    </div>
                )}

                {/* Badges top-left */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5">
                    {featured && (
                        <Badge variant="primary" className="shadow-sm text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1">
                            <Star size={8} className="sm:inline hidden" /> <Star size={7} className="sm:hidden inline" /> Destacado
                        </Badge>
                    )}
                    {!available && (
                        <Badge variant="muted" className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1">No disponible</Badge>
                    )}
                </div>

                {/* Discount badge top-right */}
                {hasDiscount && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold
                            bg-red-500 text-white shadow-lg shadow-red-500/30 tracking-tight">
                            −{discount}%
                        </span>
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
                <div>
                    {subcategory && (
                        <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">{category?.name} · {subcategory}</p>
                    )}
                    <Link to={`/producto/${_id}`}>
                        <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug hover:text-neutral-900 dark:text-[#F5F5DC] transition-colors">
                            {name}
                        </h3>
                    </Link>
                </div>

                {/* Pricing */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                        <p className="font-mono font-bold text-neutral-900 dark:text-[#F5F5DC] text-base sm:text-lg leading-tight">
                            {formatPrice(finalPrice, currency)}
                        </p>
                        {hasDiscount && (
                            <p className="font-mono text-[10px] sm:text-sm text-neutral-500 line-through">
                                {formatPrice(price, currency)}
                            </p>
                        )}
                    </div>
                </div>

                <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp" size="sm" className="w-full mt-1 text-xs sm:text-sm">
                        <MessageCircle size={13} className="sm:hidden" /><MessageCircle size={15} className="hidden sm:block" />
                        Cotizar
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
