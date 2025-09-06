import React, { useState, useEffect } from 'react';
import { useBasket } from '../hooks/useBasket';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import type { BasketItem } from '../types';
import { useCurrency } from '../hooks/useCurrency';
import InputField from './InputField';
import TextAreaField from './TextAreaField';


interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose }) => {
  const { basketItems, updateQuantity, removeFromBasket, totalPrice, clearBasket } = useBasket();
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [view, setView] = useState<'basket' | 'checkout' | 'success'>('basket');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset view after closing animation
      const timer = setTimeout(() => {
        setView('basket');
        setIsProcessing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
        clearBasket();
        setView('success');
        setIsProcessing(false);
    }, 1500);
  };

  const BasketView = () => (
    <>
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-halal-green">{t('basket.title')}</h3>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {basketItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('basket.empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {basketItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg"/>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold">+</button>
                </div>
                <button onClick={() => removeFromBasket(item.id)} className="text-gray-400 hover:text-red-500" title={t('basket.remove')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {basketItems.length > 0 && (
        <div className="p-6 mt-auto border-t bg-gray-50">
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>{t('basket.total')}</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <button 
            onClick={() => setView('checkout')}
            className="w-full bg-halal-green text-white font-bold py-3 px-4 rounded-full text-md hover:opacity-90 transition-opacity">
            {t('basket.checkout')}
          </button>
        </div>
      )}
    </>
  );

  const CheckoutView = () => (
      <>
        <div className="p-6 border-b flex items-center gap-4">
            <button onClick={() => setView('basket')} className="text-gray-500 hover:text-gray-800">&larr;</button>
            <h3 className="text-xl font-bold text-halal-green">{t('checkout.title')}</h3>
        </div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('checkout.summary')}</h4>
                <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                    {basketItems.map(item => (
                         <div key={item.id} className="flex justify-between">
                            <span className="pr-2">{item.name} x {item.quantity}</span>
                            <span className="font-medium text-right">{formatPrice(item.price * item.quantity)}</span>
                         </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                        <span>{t('basket.total')}</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                </div>
            </div>
             <InputField
                id="name"
                label={t('auth.fullNameLabel')}
                type="text"
                defaultValue={user?.name}
                placeholder={t('checkout.fullNamePlaceholder')}
                required
            />
            <TextAreaField
                id="address"
                label={t('checkout.shippingAddress')}
                rows={3}
                placeholder={t('checkout.shippingAddressPlaceholder')}
                required
            />
        </div>
        <div className="p-6 mt-auto border-t bg-gray-50">
             <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-full bg-halal-green text-white font-bold py-3 px-4 rounded-full text-md hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
             >
                {isProcessing && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                {isProcessing ? t('checkout.processing') : t('checkout.confirmPurchase')}
             </button>
        </div>
      </>
  );

  const SuccessView = () => (
      <div className="p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-halal-green">{t('success.title')}</h3>
        <p className="text-gray-600 mt-2 mb-8">{t('success.message')}</p>
        <button onClick={onClose} className="w-full max-w-xs bg-halal-green text-white font-bold py-3 px-4 rounded-full text-md hover:opacity-90 transition-opacity">
            {t('success.continueShopping')}
        </button>
      </div>
  );


  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {view === 'basket' && <BasketView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
        
        {view !== 'success' && <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>}
      </div>
    </div>
  );
};

export default BasketModal;