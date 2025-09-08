import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslations();

  const proseStyles = {
    h2: "text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2",
    p: "mb-4",
    ul: "list-disc list-inside space-y-2 mb-4 pl-4",
  };
  
  const renderList = (key: string) => {
    const listItems = t(key);
    if (Array.isArray(listItems)) {
      return (
        <ul className={proseStyles.ul}>
          {listItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg border">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-halal-green">{t('privacyPolicyPage.title')}</h1>
          <p className="text-lg text-gray-500 mt-2">{t('privacyPolicyPage.subtitle')}</p>
        </div>

        <div className="text-gray-700 leading-relaxed text-base">
          <h2 className={proseStyles.h2}>{t('privacyPolicyPage.content.section1Title')}</h2>
          <p className={proseStyles.p}>{t('privacyPolicyPage.content.section1Paragraph1')}</p>
          {renderList('privacyPolicyPage.content.section1List')}

          <h2 className={proseStyles.h2}>{t('privacyPolicyPage.content.section2Title')}</h2>
          <p className={proseStyles.p}>{t('privacyPolicyPage.content.section2Paragraph1')}</p>
          {renderList('privacyPolicyPage.content.section2List')}

          <h2 className={proseStyles.h2}>{t('privacyPolicyPage.content.section3Title')}</h2>
          <p className={proseStyles.p}>{t('privacyPolicyPage.content.section3Paragraph1')}</p>
          {renderList('privacyPolicyPage.content.section3List')}

          <h2 className={proseStyles.h2}>{t('privacyPolicyPage.content.section4Title')}</h2>
          <p className={proseStyles.p}>{t('privacyPolicyPage.content.section4Paragraph1')}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;