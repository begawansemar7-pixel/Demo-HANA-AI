import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

// Define the structure for a regulation document
interface RegulationDocument {
  id: string;
  titleKey: string;
  descriptionKey: string;
  categoryKey: string;
  date: string;
  pdfUrl: string; // Placeholder for now
}

// Dummy data for regulation documents
const regulationDocuments: RegulationDocument[] = [
  { id: 'uu-33-2014', titleKey: 'regulation.docs.1.title', descriptionKey: 'regulation.docs.1.description', categoryKey: 'regulation.categories.law', date: 'October 17, 2014', pdfUrl: '/path/to/dummy.pdf' },
  { id: 'pp-39-2021', titleKey: 'regulation.docs.2.title', descriptionKey: 'regulation.docs.2.description', categoryKey: 'regulation.categories.gov', date: 'February 2, 2021', pdfUrl: '/path/to/dummy.pdf' },
  { id: 'kma-748-2021', titleKey: 'regulation.docs.3.title', descriptionKey: 'regulation.docs.3.description', categoryKey: 'regulation.categories.ministerial', date: 'July 28, 2021', pdfUrl: '/path/to/dummy.pdf' },
  { id: 'bpjph-1-2021', titleKey: 'regulation.docs.4.title', descriptionKey: 'regulation.docs.4.description', categoryKey: 'regulation.categories.bpjph', date: 'August 5, 2021', pdfUrl: '/path/to/dummy.pdf' },
];

const RegulationDetailPage: React.FC<{ document: RegulationDocument; onBack: () => void }> = ({ document, onBack }) => {
    const { t } = useTranslations();
    return (
        <div className="animate-fadein">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-halal-green font-semibold mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {t('regulation.backToList')}
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <span className="text-sm font-semibold text-turquoise-blue uppercase">{t(document.categoryKey)}</span>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">{t(document.titleKey)}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">{document.date}</p>
                <p className="text-gray-600 leading-relaxed mb-8">{t(document.descriptionKey)}</p>

                <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="mt-2 font-semibold">{t('regulation.pdfPlaceholder')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const RegulationPage: React.FC = () => {
  const { t } = useTranslations();
  const [selectedDoc, setSelectedDoc] = useState<RegulationDocument | null>(null);

  if (selectedDoc) {
      return (
          <div className="container mx-auto px-4 py-8">
              <RegulationDetailPage document={selectedDoc} onBack={() => setSelectedDoc(null)} />
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('regulation.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('regulation.subtitle')}</p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-4">
        {regulationDocuments.map(doc => (
            <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg hover:border-halal-green transition-all duration-300 cursor-pointer"
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <span className="text-xs font-bold text-turquoise-blue uppercase">{t(doc.categoryKey)}</span>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">{t(doc.titleKey)}</h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{t(doc.descriptionKey)}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                         <p className="text-xs text-gray-400">{doc.date}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default RegulationPage;
