import { useState, useEffect } from 'react';
import { useTranslations } from './useTranslations';
import type { Story } from '../types';
import { STORY_IDS } from '../constants';

export const useStories = (): { stories: Story[] } => {
    const { t } = useTranslations();
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        const fetchedStories: Story[] = STORY_IDS.map(id => ({
            id,
            title: t(`home.stories.items.${id}.title`),
            user: t(`home.stories.items.${id}.user`),
            content: t(`home.stories.items.${id}.content`),
            imageUrl: `https://picsum.photos/seed/story${id}/400/500`,
        }));
        setStories(fetchedStories);
    }, [t]);

    return { stories };
};