import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Promotion } from '../types';

interface PromotionDetailModalProps {
  promotion: Promotion;
  isOpen: boolean;
  onClose: () => void;
}

const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({ promotion, isOpen, onClose }) => {
  const { t } = useTranslations();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const { id: promotionId, title, details, terms, expiry, cta, videoUrl } = promotion;

  const handleShare = async () => {
    const shareData = {
      title,
      text: details,
      url: window.location.href,
    };

    try {
      let messageKey = '';
      if (navigator.share) {
        await navigator.share(shareData);
        messageKey = 'promotionModal.shareMessage';
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        messageKey = 'promotionModal.copySuccessMessage';
      }

      if (messageKey) {
        setConfirmationMessage(t(messageKey));
        setTimeout(() => {
          setConfirmationMessage(null);
        }, 2000); // Display message for 2 seconds
      }
    } catch (error) {
      // This will catch sharing cancellations and clipboard errors.
      // We don't show a success message if the user cancels or an error occurs.
      console.log('Share/Copy action was not completed:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadein"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="relative">
          {videoUrl ? (
            <video 
              src={videoUrl}
              className="w-full h-48 object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : (
            <img 
              src={`https://picsum.photos/seed/promo${promotionId}/800/400`} 
              alt={title} 
              className="w-full h-48 object-cover" 
            />
          )}
           <button 
            onClick={onClose} 
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-halal-green mb-3">{title}</h2>
          <p className="text-gray-600 mb-6">{details}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">{t('promotionModal.termsTitle')}</h4>
              <p className="text-sm text-gray-500">{terms}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">{t('promotionModal.validUntilTitle')}</h4>
              <p className="text-sm text-gray-500">{expiry}</p>
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto border-t bg-gray-50">
           <div className="space-y-3">
              <button className="w-full bg-accent-gold text-halal-green font-bold py-3 px-4 rounded-full text-md hover:opacity-90 transition-opacity">
                {cta}
              </button>
              <button 
                onClick={handleShare}
                disabled={!!confirmationMessage}
                className={`w-full font-semibold py-3 px-4 rounded-full text-md transition-all border flex items-center justify-center gap-2 ${
                    confirmationMessage
                    ? 'bg-green-100 text-green-800 border-green-200 cursor-default'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {confirmationMessage ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{confirmationMessage}</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>{t('promotionModal.shareButton')}</span>
                    </>
                )}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailModal;