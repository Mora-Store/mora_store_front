/**
 * Generate a WhatsApp click-to-chat URL
 * @param {string} phoneNumber - international format without + (e.g. 5219991234567)
 * @param {string} productName
 */
export const generateWhatsAppLink = (phoneNumber, productName) => {
    const text = encodeURIComponent(
        `Hola! Me interesa el producto: ${productName}. ¿Me podrías dar más información?`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
};

/**
 * Get the full URL for a product image served by the backend
 */
export const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    if (filename.startsWith('/uploads/')) return filename;
    return `/uploads/${filename}`;
};
