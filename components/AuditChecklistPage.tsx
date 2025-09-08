import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

// Define the structure for a checklist item's state
interface ChecklistItemState {
  id: string;
  isChecked: boolean;
  notes: string;
}

// Define the static data for checklist items
const CHECKLIST_ITEMS = [
  { id: 'ingredient', titleKey: 'auditChecklist.items.ingredient' },
  { id: 'process', titleKey: 'auditChecklist.items.process' },
  { id: 'hygiene', titleKey: 'auditChecklist.items.hygiene' },
  { id: 'documentation', titleKey: 'auditChecklist.items.documentation' },
];

const LOCAL_STORAGE_KEY = 'auditChecklistState';

const AuditChecklistPage: React.FC = () => {
  const { t } = useTranslations();
  
  // Initialize state from localStorage or default
  const [checklistState, setChecklistState] = useState<ChecklistItemState[]>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Error loading checklist state from localStorage:", error);
    }
    // Default state if nothing is saved
    return CHECKLIST_ITEMS.map(item => ({ id: item.id, isChecked: false, notes: '' }));
  });

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checklistState));
    } catch (error) {
      console.error("Error saving checklist state to localStorage:", error);
    }
  }, [checklistState]);

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setChecklistState(prevState =>
      prevState.map(item => (item.id === id ? { ...item, isChecked } : item))
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setChecklistState(prevState =>
      prevState.map(item => (item.id === id ? { ...item, notes } : item))
    );
  };
  
  const toggleExpand = (id: string) => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
  };

  const handleSave = () => {
      // The state is already saved on change due to useEffect. 
      // This button just provides user feedback.
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const progress = (checklistState.filter(item => item.isChecked).length / checklistState.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green dark:text-accent-gold">{t('auditChecklist.title')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{t('auditChecklist.subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-halal-green dark:text-accent-gold">Progress</span>
                <span className="text-sm font-medium text-halal-green dark:text-accent-gold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-halal-green dark:bg-accent-gold h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      
        <div className="space-y-4">
          {CHECKLIST_ITEMS.map(itemInfo => {
            const itemState = checklistState.find(s => s.id === itemInfo.id);
            if (!itemState) return null;

            const isExpanded = expandedItemId === itemInfo.id;

            return (
              <div key={itemInfo.id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md border dark:border-gray-700 transition-all duration-300">
                <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => toggleExpand(itemInfo.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`notes-${itemInfo.id}`}
                >
                    <input
                        type="checkbox"
                        id={`checkbox-${itemInfo.id}`}
                        checked={itemState.isChecked}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleCheckboxChange(itemInfo.id, e.target.checked)}
                        className="h-6 w-6 rounded border-gray-300 dark:border-gray-600 text-halal-green focus:ring-halal-green flex-shrink-0 bg-gray-100 dark:bg-gray-900"
                    />
                    <label 
                        htmlFor={`checkbox-${itemInfo.id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-lg font-bold text-gray-800 dark:text-gray-100 flex-1 cursor-pointer"
                    >
                        {t(itemInfo.titleKey)}
                    </label>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
                {isExpanded && (
                    <div 
                        id={`notes-${itemInfo.id}`}
                        className="mt-4 pl-10 animate-fadein"
                    >
                        <textarea
                            value={itemState.notes}
                            onChange={e => handleNotesChange(itemInfo.id, e.target.value)}
                            placeholder={t('auditChecklist.notesPlaceholder')}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-halal-green dark:focus:ring-accent-gold transition-shadow shadow-sm min-h-[100px] bg-white dark:bg-gray-700"
                            onClick={e => e.stopPropagation()} // Prevent closing when clicking textarea
                        />
                    </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center relative">
            <button
                onClick={handleSave}
                className="px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-lg"
            >
                {t('auditChecklist.saveButton')}
            </button>
             <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-all duration-300 ${showSaveSuccess ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-green-100 text-green-800 text-sm font-semibold py-2 px-4 rounded-full">
                    {t('auditChecklist.saveSuccess')}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuditChecklistPage;
