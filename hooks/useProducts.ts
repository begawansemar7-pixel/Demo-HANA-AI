import { useState, useEffect } from 'react';
import { useTranslations } from './useTranslations';
import type { Product, Review } from '../types';
import { parsePrice } from '../utils/currency';

const productIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const useProducts = (): { products: Product[], loading: boolean } => {
    const { t } = useTranslations();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        // Simulate an API call
        const timer = setTimeout(() => {
            const fetchedProducts: Product[] = productIds.map(id => {
                const reviewData = t(`marketplace.products.${id}.reviews`);
                const reviews: Review[] = reviewData && typeof reviewData === 'object' 
                    ? Object.keys(reviewData).map(reviewKey => ({
                        id: parseInt(reviewKey),
                        author: t(`marketplace.products.${id}.reviews.${reviewKey}.author`),
                        rating: parseInt(t(`marketplace.products.${id}.reviews.${reviewKey}.rating`)),
                        comment: t(`marketplace.products.${id}.reviews.${reviewKey}.comment`),
                    }))
                    : [];
                
                const reviewCount = reviews.length;
                const averageRating = reviewCount > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                    : 0;
                
                const priceString = t(`marketplace.products.${id}.price`);

                return {
                    id,
                    name: t(`marketplace.products.${id}.name`),
                    producer: t(`marketplace.products.${id}.producer`),
                    price: parsePrice(priceString),
                    category: t(`marketplace.products.${id}.category`),
                    imageUrl: `https://picsum.photos/seed/product${id}/400/400`,
                    description: t(`marketplace.products.${id}.description`),
                    reviews,
                    averageRating,
                    reviewCount,
                };
            });
            setProducts(fetchedProducts);
            setLoading(false);
        }, 1000); // 1 second delay to simulate network latency

        return () => clearTimeout(timer);
    }, [t]); // Re-fetch if language changes

    return { products, loading };
};