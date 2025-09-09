import React, { useState, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import HanaChat from './HanaChat';

interface FAQItem {
  q: string;
  a: string;
}

const FAQPage: React.FC = () => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [isHanaChatOpen, setIsHanaChatOpen] = useState(false);

  const faqs: FAQItem[] = useMemo(() => {
    const questionsData = t('faqPage.questions');
    if (Array.isArray(questionsData)) {
      return questionsData.map((item: any) => ({
        q: item.q || '',
        a: item.a || '',
      }));
    }
    return [];
  }, [t]);
  
  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqs;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(lowercasedSearchTerm) ||
        faq.a.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, faqs]);

  const toggleQuestion = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-halal-green">{t('faqPage.title')}</h1>
          <p className="text-lg text-gray-500 mt-2">{t('faqPage.subtitle')}</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('faqPage.searchPlaceholder')}
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green transition-shadow shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b last:border-b-0">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex justify-between items-center text-left py-4"
                    aria-expanded={openQuestionIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{faq.q}</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-halal-green flex-shrink-0 transition-transform duration-300 ${openQuestionIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openQuestionIndex === index ? 'max-h-screen' : 'max-h-0'}`}
                  >
                    <div className="py-4 text-gray-600 leading-relaxed whitespace-pre-line">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">{t('certCheck.noResults')}</p>
            )}
          </div>
        </div>
      </div>
      <div id="hana-fab" className="fixed bottom-24 md:bottom-8 right-8 z-40">
        <HanaChat 
          isOpen={isHanaChatOpen} 
          onOpen={() => setIsHanaChatOpen(true)} 
          onClose={() => setIsHanaChatOpen(false)} 
        />
      </div>
    </>
  );
};

export default FAQPage;
