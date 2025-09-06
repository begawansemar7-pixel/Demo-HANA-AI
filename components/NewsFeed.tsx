import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useNews } from '../hooks/useNews';

interface NewsFeedProps {
    onNewsSelect: (id: number) => void;
}

const categories = ['All', 'Technology', 'Event', 'Education', 'Government'];
const ARTICLES_TO_LOAD = 4;

const NewsFeed: React.FC<NewsFeedProps> = ({ onNewsSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ARTICLES_TO_LOAD);
  const { t } = useTranslations();
  const { news: allArticles } = useNews();

  const handleCategoryClick = (category: string) => {
    if (category === activeCategory || isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setVisibleCount(ARTICLES_TO_LOAD); // Reset count on category change
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleLoadMore = () => {
      setVisibleCount(prevCount => prevCount + ARTICLES_TO_LOAD);
  };

  const filteredArticles = allArticles.filter(article => 
      activeCategory === 'All' || article.rawCategory === activeCategory
  );
  
  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{t('home.news.title')}</h2>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeCategory === category
                ? 'bg-halal-green text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t(`home.news.categories.${category.toLowerCase()}`)}
          </button>
        ))}
         {activeCategory !== 'All' && !isTransitioning && (
            <button
                onClick={() => handleCategoryClick('All')}
                className="px-4 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors whitespace-nowrap animate-fadein"
            >
                {t('home.news.clearFilter')} &times;
            </button>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {visibleArticles.map(article => (
          <div
            key={article.id}
            onClick={() => onNewsSelect(article.id)}
            className="bg-white rounded-2xl shadow-md overflow-hidden group transition-shadow hover:shadow-xl block cursor-pointer"
          >
            <div className="h-40 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-halal-green uppercase">{article.category}</p>
              <h3 className="font-bold text-md mt-1 h-12">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-2 h-16 overflow-hidden">{article.summary}</p>
              <p className="text-xs text-gray-400 mt-4">{article.date}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredArticles.length && (
        <div className="text-center mt-8">
            <button 
                onClick={handleLoadMore}
                className="bg-white text-halal-green font-bold py-2 px-6 rounded-full shadow hover:bg-gray-50 transition-colors"
            >
            {t('home.news.loadMore')}
            </button>
        </div>
      )}
    </section>
  );
};

export default NewsFeed;