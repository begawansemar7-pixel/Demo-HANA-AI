import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface ListeningModalProps {
  isOpen: boolean;
  onStop: () => void;
}

const ListeningModal: React.FC<ListeningModalProps> = ({ isOpen, onStop }) => {
  const { t } = useTranslations();

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4 animate-fadein"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listening-title"
    >
      <div className="text-center text-white">
        <div 
          className="relative w-40 h-40 bg-halal-green/50 rounded-full flex items-center justify-center animate-pulse"
        >
            <div className="absolute inset-0 bg-halal-green rounded-full animate-ping opacity-30"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        </div>
        <h2 id="listening-title" className="text-2xl font-bold mt-8">{t('hana.listeningPlaceholder')}</h2>
        <p className="mt-2 text-white/80">{t('hana.speakNow')}</p>
        <button 
          onClick={onStop} 
          className="mt-12 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
        >
          {t('hana.stopListeningLabel')}
        </button>
      </div>
    </div>
  );
};

export default ListeningModal;