import React, { useState, useLayoutEffect, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface TourStep {
  target: string | null;
  contentKey: string;
  titleKey: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onFinish: () => void;
  onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, onFinish, onSkip }) => {
  const { t } = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [isCentred, setIsCentred] = useState(false);

  const step = steps[currentStep];

  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else {
      onFinish();
    }
  }, [currentStep, steps.length, onFinish]);

  useLayoutEffect(() => {
    const targetElement = step.target ? document.querySelector(step.target) as HTMLElement : null;
    const isVisible = targetElement && targetElement.offsetParent !== null;

    if (isVisible) {
      const rect = targetElement.getBoundingClientRect();
      setIsCentred(false);
      
      setHighlightStyle({
        position: 'fixed',
        top: `${rect.top - 4}px`,
        left: `${rect.left - 4}px`,
        width: `${rect.width + 8}px`,
        height: `${rect.height + 8}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
        borderRadius: '12px',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'none',
      });
      
      let tooltipTop = rect.bottom + 15;
      // Adjust if tooltip goes off-screen vertically
      if (tooltipTop + 180 > window.innerHeight) { 
        tooltipTop = rect.top - 180; // approx tooltip height
      }
      
      setTooltipStyle({
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
        transition: 'all 0.3s ease-in-out',
      });

    } else if (step.target) {
        // Target specified but not visible, skip this step
        handleNext();
    } else {
      // Centered step (e.g., welcome message)
      setIsCentred(true);
      setHighlightStyle({});
      setTooltipStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s ease-in-out',
      });
    }
    
  }, [currentStep, step.target, handleNext]);

  return (
    <div className="fixed inset-0 z-[1000]" aria-live="polite">
      <div 
        className={`fixed inset-0 transition-opacity duration-300 ${isCentred ? 'bg-black/70' : ''}`}
        onClick={onSkip}
      />
      
      <div style={highlightStyle} />

      <div style={tooltipStyle} className="w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl p-6 z-10">
        <h3 className="text-xl font-bold text-halal-green mb-2">{t(step.titleKey)}</h3>
        <p className="text-gray-600 mb-6">{t(step.contentKey)}</p>
        
        <div className="flex justify-between items-center">
          <button onClick={onSkip} className="text-sm text-gray-500 hover:text-gray-800">
            {t('onboarding.skip')}
          </button>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${currentStep === index ? 'bg-halal-green' : 'bg-gray-300'}`} />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90"
            >
              {currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
