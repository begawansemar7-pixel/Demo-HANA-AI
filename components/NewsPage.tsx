import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useNews } from '../hooks/useNews';

interface NewsPageProps {
    onNewsSelect: (id: number) => void;
}

const categories = ['All', 'Technology', 'Event', 'Education', 'Government'];

const NewsPage: React.FC<NewsPageProps> = ({ onNewsSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useTranslations();
  const { news: allArticles } = useNews();

  const filteredArticles = allArticles.filter(article => 
    activeCategory === 'All' || article.rawCategory === activeCategory
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-halal-green">{t('newsPage.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('newsPage.subtitle')}</p>
      </div>
      
      <div className="flex justify-center space-x-2 overflow-x-auto pb-4 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeCategory === category
                ? 'bg-halal-green text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {t(`home.news.categories.${category.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            onClick={() => onNewsSelect(article.id)}
            className="bg-white rounded-2xl shadow-md overflow-hidden group transition-shadow hover:shadow-xl block cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-turquoise-blue uppercase">{article.category}</p>
              <h3 className="font-bold text-md mt-1 h-12">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-2 h-20 overflow-hidden">{article.summary}</p>
              <p className="text-xs text-gray-400 mt-4">{article.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-white text-halal-green font-bold py-2 px-6 rounded-full shadow hover:bg-gray-50 transition-colors border">
          {t('home.news.loadMore')}
        </button>
      </div>
    </div>
  );
};

export default NewsPage;