import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { NewsArticle } from '../types';

interface NewsDetailPageProps {
    article: NewsArticle;
    onBack: () => void;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ article, onBack }) => {
    const { t } = useTranslations();
    const [shareConfirmation, setShareConfirmation] = useState('');

    // Split content into paragraphs for better readability
    const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: article.summary,
            url: article.url || window.location.href, // Fallback to current page URL
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareData.url);
                setShareConfirmation(t('newsDetail.copySuccess'));
                setTimeout(() => setShareConfirmation(''), 2000); // Hide after 2 seconds
            }
        } catch (error) {
            console.error('Error sharing article:', error);
        }
    };
    
    // Show share button only if Web Share or Clipboard API is available
    const canShare = typeof window !== 'undefined' && (navigator.share || navigator.clipboard);


    return (
        <div className="container mx-auto px-4 py-8 animate-fadein">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-halal-green font-semibold mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {t('newsDetail.backToNews')}
            </button>

            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <img src={`${article.imageUrl.replace('/400/300', '/800/400')}`} alt={article.title} className="w-full h-64 md:h-80 object-cover" />
                <div className="p-6 md:p-10">
                    <div className="flex justify-between items-start text-sm mb-4">
                        <div>
                            <span className="font-bold text-turquoise-blue uppercase">{article.category}</span>
                            <span className="text-gray-500 block sm:inline sm:ml-4">{article.date}</span>
                        </div>
                        {canShare && (
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-halal-green hover:text-white transition-colors text-sm font-semibold"
                                    aria-label={t('newsDetail.shareArticle')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('newsDetail.shareArticle')}</span>
                                </button>
                                {shareConfirmation && (
                                    <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs font-semibold py-1.5 px-3 rounded-md animate-fadein shadow-lg">
                                        {shareConfirmation}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        {article.title}
                    </h1>
                    <div className="mt-8 text-gray-700 leading-relaxed space-y-4 text-lg">
                        {paragraphs.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetailPage;