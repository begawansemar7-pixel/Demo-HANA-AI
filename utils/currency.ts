export const parsePrice = (price: string): number => {
    // For formats like "Rp 75.000" or "Rp 3.500"
    if (price.includes('Rp')) {
        return parseFloat(price.replace(/[^0-9]/g, '')) || 0;
    }
    // For formats like "$12.99" or "2 ر.س"
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
};
