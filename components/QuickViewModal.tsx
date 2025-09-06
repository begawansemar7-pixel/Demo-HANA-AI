import React from 'react';
import type { Product } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useCurrency } from '../hooks/useCurrency';
import StarRating from './StarRating';
import { useBasket } from '../hooks/useBasket';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDetail: (id: number) => void;
}

const QuickViewProductActions: React.FC<{ product: Product }> = ({ product }) => {
    const { t } = useTranslations();
    const { basketItems, addToBasket, updateQuantity } = useBasket();
    const itemInBasket = basketItems.find(item => item.id === product.id);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    if (itemInBasket) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => handleAction(e, () => updateQuantity(product.id, itemInBasket.quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    aria-label={`Decrease quantity of ${product.name}`}
                >
                    -
                </button>
                <span className="font-bold text-xl w-8 text-center" aria-live="polite">
                    {itemInBasket.quantity}
                </span>
                <button
                    onClick={(e) => handleAction(e, () => updateQuantity(product.id, itemInBasket.quantity + 1))}
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
            onClick={(e) => handleAction(e, () => addToBasket(product))}
            className="w-full px-6 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-lg"
        >
            {t('marketplace.addToBasket')}
        </button>
    );
};


const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onNavigateToDetail }) => {
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadein"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col sm:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          &times;
        </button>
        
        {/* Image Section */}
        <div className="sm:w-1/2 relative">
          <img
            src={`${product.imageUrl.split('400/400')[0]}800/800`}
            alt={product.name}
            className="w-full h-64 sm:h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="sm:w-1/2 p-6 flex flex-col">
          <h2 id="quick-view-title" className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-md text-gray-500 mt-1">{product.producer}</p>
          
          {product.reviewCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={product.averageRating} size="large" />
              <span className="text-lg text-gray-600 font-semibold">{product.averageRating.toFixed(1)}</span>
            </div>
          )}
          
          <p className="text-3xl font-bold text-halal-green my-4">{formatPrice(product.price)}</p>

          <p className="text-gray-600 leading-relaxed text-sm mb-4 h-24 overflow-y-auto">
            {product.description}
          </p>

          <div className="mt-auto pt-4 border-t space-y-3">
            <QuickViewProductActions product={product} />
            <button 
                onClick={() => onNavigateToDetail(product.id)}
                className="w-full text-center text-halal-green font-semibold hover:text-green-700 text-sm"
            >
                {t('marketplace.viewFullDetails')} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;