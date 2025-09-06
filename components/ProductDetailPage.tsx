import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useBasket } from '../hooks/useBasket';
import type { Product } from '../types';
import { useCurrency } from '../hooks/useCurrency';
import StarRating from './StarRating';

interface ProductDetailPageProps {
    product: Product;
    onBack: () => void;
}

const ProductActions: React.FC<{ product: Product }> = ({ product }) => {
    const { t } = useTranslations();
    const { basketItems, addToBasket, updateQuantity } = useBasket();
    const itemInBasket = basketItems.find(item => item.id === product.id);

    if (itemInBasket) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={() => updateQuantity(product.id, itemInBasket.quantity - 1)}
                    className="w-10 h-10 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    aria-label={`Decrease quantity of ${product.name}`}
                >
                    -
                </button>
                <span className="font-bold text-xl w-8 text-center" aria-live="polite">
                    {itemInBasket.quantity}
                </span>
                <button
                    onClick={() => updateQuantity(product.id, itemInBasket.quantity + 1)}
                    className="w-10 h-10 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    aria-label={`Increase quantity of ${product.name}`}
                >
                    +
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => addToBasket(product)}
            className="w-full px-6 py-3 bg-turquoise-blue text-white font-semibold rounded-full hover:bg-halal-green transition-colors shadow-lg"
        >
            {t('marketplace.addToBasket')}
        </button>
    );
};

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
    ];
    return colors[Math.abs(hash) % colors.length];
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
    const { t } = useTranslations();
    const { formatPrice } = useCurrency();

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-halal-green font-semibold mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {t('productDetail.backToMarketplace')}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div>
                    <img src={`${product.imageUrl.split('400/400')[0]}800/800`} alt={product.name} className="w-full h-auto object-cover rounded-2xl shadow-xl" />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h1>
                    
                    {product.reviewCount > 0 && (
                        <div className="mt-3 flex items-center gap-2" aria-label={`Average rating: ${product.averageRating.toFixed(1)} out of 5 stars from ${product.reviewCount} reviews.`}>
                            <StarRating rating={product.averageRating} size="large" />
                            <span className="text-lg text-gray-600 font-semibold" aria-hidden="true">
                                {product.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400" aria-hidden="true">
                                ({product.reviewCount} {t('productDetail.reviews')})
                            </span>
                        </div>
                    )}

                    <p className="text-lg text-gray-500 mt-2">{product.producer}</p>
                    <p className="text-4xl font-bold text-halal-green my-6">{formatPrice(product.price)}</p>
                    
                    <p className="text-gray-600 leading-relaxed flex-grow">{product.description}</p>
                    
                    <div className="mt-8 pt-6 border-t">
                        <ProductActions product={product} />
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('productDetail.customerReviews')}</h2>
                {product.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map(review => (
                            <div key={review.id} className="p-6 bg-white rounded-xl shadow-md border flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full ${getAvatarColor(review.author)} text-white flex-shrink-0 flex items-center justify-center`}>
                                    <span className="text-lg font-bold">{review.author.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-800">{review.author}</p>
                                        <StarRating rating={review.rating} size="large"/>
                                    </div>
                                    <p className="text-gray-600 mt-2">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">{t('productDetail.noReviews')}</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;