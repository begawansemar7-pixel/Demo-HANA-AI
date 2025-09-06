import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Story } from '../types';

interface StoryDetailPageProps {
    story: Story;
    onBack: () => void;
}

const StoryDetailPage: React.FC<StoryDetailPageProps> = ({ story, onBack }) => {
    const { t } = useTranslations();

    // Split content into paragraphs for better readability
    const paragraphs = story.content.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-halal-green font-semibold mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {t('storyDetail.backToHome')}
            </button>

            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <img src={`${story.imageUrl.replace('/400/500', '/1000/600')}`} alt={story.title} className="w-full h-64 md:h-80 object-cover" />
                <div className="p-6 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        {story.title}
                    </h1>
                     <p className="text-md text-gray-500 mt-2 font-semibold">{story.user}</p>
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

export default StoryDetailPage;