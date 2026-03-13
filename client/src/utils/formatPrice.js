const USD_RATE = 3.7; // 1 USD ≈ 3.70 PEN (approximate, update as needed)

export const formatPrice = (price, currency = 'PEN') => {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price / USD_RATE);
    }

    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};
