

import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

type ValidationStatus = 'Halal' | 'Haram' | 'Syubhat';

interface ValidationResult {
  ingredient: string;
  status: ValidationStatus;
  reason: string;
}

// Mock validation function to simulate AI analysis
const mockValidateIngredients = (ingredients: string[], t: (key: string) => string): Promise<ValidationResult[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = ingredients
        .filter(ing => ing.trim() !== '')
        .map(ing => {
          const lowerIng = ing.toLowerCase();
          if (lowerIng.includes('pork') || lowerIng.includes('babi') || lowerIng.includes('lard') || lowerIng.includes('alkohol')) {
            return { ingredient: ing, status: 'Haram' as ValidationStatus, reason: t('ingredientValidator.reasons.haramAlcoholPork') };
          }
          if (lowerIng.includes('gelatin') || lowerIng.includes('enzyme') || lowerIng.includes('emulsifier') || lowerIng.includes('gliserin')) {
            return { ingredient: ing, status: 'Syubhat' as ValidationStatus, reason: t('ingredientValidator.reasons.syubhatSource') };
          }
          if (lowerIng.includes('rennet')) {
            return { ingredient: ing, status: 'Syubhat' as ValidationStatus, reason: t('ingredientValidator.reasons.syubhatRennet') };
          }
          return { ingredient: ing, status: 'Halal' as ValidationStatus, reason: t('ingredientValidator.reasons.halalPlantBased') };
        });
      resolve(results);
    }, 1500);
  });
};


const IngredientValidatorPage: React.FC = () => {
  const { t } = useTranslations();
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setResults(null);

    const ingredientList = ingredients.split(/[\n,]+/).map(item => item.trim());
    const validationResults = await mockValidateIngredients(ingredientList, t);
    
    setResults(validationResults);
    setLoading(false);
  };

  const StatusBadge: React.FC<{ status: ValidationStatus }> = ({ status }) => {
    let badgeText = '';
    let badgeClasses = '';

    switch (status) {
      case 'Halal':
        badgeText = t('ingredientValidator.statusHalal');
        badgeClasses = 'bg-green-100 text-green-800';
        break;
      case 'Haram':
        badgeText = t('ingredientValidator.statusHaram');
        badgeClasses = 'bg-red-100 text-red-800';
        break;
      case 'Syubhat':
        badgeText = t('ingredientValidator.statusSyubhat');
        badgeClasses = 'bg-yellow-100 text-yellow-800';
        break;
    }

    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClasses} w-24 text-center`}>
        {badgeText}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('ingredientValidator.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('ingredientValidator.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleValidation}>
          <label htmlFor="ingredient-input" className="sr-only">{t('ingredientValidator.inputLabel')}</label>
          <textarea
            id="ingredient-input"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder={t('ingredientValidator.inputPlaceholder')}
            className="w-full h-48 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-halal-green transition-shadow shadow-sm"
            disabled={loading}
          />
          <button 
            type="submit"
            className="w-full mt-4 px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center"
            disabled={loading || !ingredients.trim()}
          >
            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
            {loading ? t('ingredientValidator.loading') : t('ingredientValidator.validateButton')}
          </button>
        </form>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center p-8">
            <p>{t('ingredientValidator.loading')}</p>
          </div>
        ) : results === null ? (
          <div className="text-center p-8 bg-gray-100/50 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <p className="mt-4 text-gray-600">{t('ingredientValidator.initialPrompt')}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border">
             <h2 className="text-xl font-bold text-gray-800 mb-4">{t('ingredientValidator.resultsTitle')}</h2>
            {results.map((result, index) => (
              <div key={index} className="p-4 rounded-xl border bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{result.ingredient}</p>
                  <p className="text-sm text-gray-500 mt-1">{result.reason}</p>
                </div>
                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <StatusBadge status={result.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center p-8 bg-gray-100/50 rounded-2xl">
             <p className="mt-4 text-gray-600">{t('ingredientValidator.initialPrompt')}</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default IngredientValidatorPage;