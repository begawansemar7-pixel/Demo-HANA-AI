import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import PromotionDetailModal from './PromotionDetailModal';
import type { Promotion } from '../types';

const promotionPageIds = [1, 2, 3, 4, 5, 6];

interface PromotionCardProps {
    id: number;
    onClick: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ id, onClick }) => {
    const { t } = useTranslations();
    // Note: Using a different key namespace for page-specific promotions
    const title = t(`promotionsPage.items.${id}.title`);
    const description = t(`promotionsPage.items.${id}.description`);
    const cta = t(`promotionsPage.items.${id}.cta`);

    return (
        <div onClick={onClick} className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer transition-shadow hover:shadow-xl flex flex-col">
            <div className="h-40 overflow-hidden">
                <img 
                    src={`https://picsum.photos/seed/promo${id}/600/400`} 
                    alt={title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-md mt-1 h-12">{title}</h3>
                <p className="text-sm text-gray-600 mt-2 h-16 overflow-hidden flex-grow">{description}</p>
                <div className="mt-4">
                    <button className="w-full bg-accent-gold text-halal-green font-bold py-2 px-4 rounded-full text-sm hover:opacity-90 transition-opacity pointer-events-none">
                        {cta}
                    </button>
                </div>
            </div>
        </div>
    );
};


const PromotionsPage: React.FC = () => {
    const { t } = useTranslations();
    const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

    const handleOpenModal = (id: number) => {
        const videoUrlKey = `promotionsPage.items.${id}.videoUrl`;
        const videoUrlValue = t(videoUrlKey);

        const promoDetails: Promotion = {
            id,
            title: t(`promotionsPage.items.${id}.title`),
            description: t(`promotionsPage.items.${id}.description`),
            details: t(`promotionsPage.items.${id}.details`),
            terms: t(`promotionsPage.items.${id}.terms`),
            expiry: t(`promotionsPage.items.${id}.expiry`),
            cta: t(`promotionsPage.items.${id}.cta`),
        };
        
        if (videoUrlValue && videoUrlValue.startsWith('http')) {
            promoDetails.videoUrl = videoUrlValue;
        }

        setSelectedPromo(promoDetails);
    };

    const handleCloseModal = () => {
        setSelectedPromo(null);
    };
    
    return (
        <>
            <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-halal-green">{t('home.promotions.title')}</h1>
                    <p className="text-lg text-gray-500 mt-2">{t('promotionsPage.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotionPageIds.map(id => (
                        <PromotionCard key={id} id={id} onClick={() => handleOpenModal(id)} />
                    ))}
                </div>
            </div>
            {selectedPromo && (
                <PromotionDetailModal
                    promotion={selectedPromo}
                    isOpen={!!selectedPromo}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default PromotionsPage;