import { useState, useEffect } from 'react';
import { useTranslations } from './useTranslations';
import type { NewsArticle } from '../types';
import { NEWS_ARTICLE_IDS } from '../constants';

export const useNews = (): { news: NewsArticle[], loading: boolean } => {
    const { t } = useTranslations();
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        // This is synchronous but mimics an async hook like useProducts
        const fetchedNews: NewsArticle[] = NEWS_ARTICLE_IDS.map(id => {
            const rawCategory = t(`home.news.articles.${id}.category`); // This gets the English key like "Government"
            return {
                id,
                title: t(`home.news.articles.${id}.title`),
                summary: t(`home.news.articles.${id}.summary`),
                content: t(`home.news.articles.${id}.content`),
                imageUrl: `https://picsum.photos/seed/news${id}/400/300`,
                category: t(`home.news.categories.${rawCategory.toLowerCase()}`), // Translated display name
                rawCategory: rawCategory, // English key for filtering
                date: t(`home.news.articles.${id}.date`),
                url: t(`home.news.articles.${id}.url`),
            };
        });
        setNews(fetchedNews);
        setLoading(false);
    }, [t]);

    return { news, loading };
};