import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const AboutPage: React.FC = () => {
  const { t } = useTranslations();

  // Simple style object for prose content to maintain consistency.
  const proseStyles = {
    h2: "text-2xl font-bold text-gray-800 mt-10 mb-4 border-b pb-2",
    p: "mb-4"
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg border">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-halal-green">{t('aboutPage.title')}</h1>
          <p className="text-lg text-gray-500 mt-2">{t('aboutPage.subtitle')}</p>
        </div>

        <div className="text-gray-700 leading-relaxed text-lg">
          <p className={proseStyles.p}>{t('aboutPage.paragraph1')}</p>
          <p className={proseStyles.p}>{t('aboutPage.paragraph2')}</p>

          <h2 className={proseStyles.h2}>{t('aboutPage.bpjphTitle')}</h2>
          <p className={proseStyles.p}>{t('aboutPage.bpjphParagraph1')}</p>
          <p className={proseStyles.p}>{t('aboutPage.bpjphParagraph2')}</p>

          <h2 className={proseStyles.h2}>{t('aboutPage.techTitle')}</h2>
          <p className={proseStyles.p}>{t('aboutPage.techParagraph1')}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
