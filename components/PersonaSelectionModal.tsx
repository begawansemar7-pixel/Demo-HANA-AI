import React, { useEffect } from 'react';
import { PERSONAS } from '../constants';
import type { Persona, PersonaId } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface PersonaSelectionModalProps {
  onSelect: (personaId: PersonaId) => void;
  onContinueAsGuest: () => void;
}

const PersonaCard: React.FC<{ persona: Persona; onClick: () => void }> = ({ persona, onClick }) => {
  const { t } = useTranslations();
  return (
    <div 
      onClick={onClick}
      className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center group"
    >
      <div className="text-halal-green dark:text-accent-gold mx-auto mb-4 group-hover:text-turquoise-blue transition-colors">
        {persona.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t(persona.name)}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t(persona.description)}</p>
    </div>
  );
};

const SpeakerIcon: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        {isSpeaking && (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" className="opacity-75" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}/>
        )}
    </svg>
);

const SpeakerMutedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);


const PersonaSelectionModal: React.FC<PersonaSelectionModalProps> = ({ onSelect, onContinueAsGuest }) => {
  const { t, language } = useTranslations();
  const { speak, cancel, isSpeaking, isSupported } = useTextToSpeech({
    language: language,
  });

  useEffect(() => {
    if (isSupported) {
      const welcomeText = t('personas.welcomeAudio');
      speak(welcomeText);
    }
    // Cleanup on unmount
    return () => {
      cancel();
    };
  }, [isSupported, speak, cancel, t]);

  const toggleAudio = () => {
    if (isSpeaking) {
      cancel();
    } else {
      const welcomeText = t('personas.welcomeAudio');
      speak(welcomeText);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadein overflow-hidden">
        {/* Background Image and Overlay */}
        <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 scale-110"
            style={{ backgroundImage: "url('https://picsum.photos/seed/beautiful-mosque-halal/1920/1080')" }}
        />
        <div className="absolute inset-0 bg-halal-green/80 dark:bg-halal-green/90 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-white">{t('personas.title')}</h1>
                {isSupported && (
                    <button
                        onClick={toggleAudio}
                        className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-white"
                        aria-label={t('personas.toggleAudio')}
                    >
                        {isSpeaking ? <SpeakerIcon isSpeaking={isSpeaking} /> : <SpeakerMutedIcon />}
                    </button>
                )}
            </div>
            <p className="text-lg text-white/80 mb-12">{t('personas.subtitle')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERSONAS.map(persona => (
                <PersonaCard key={persona.id} persona={persona} onClick={() => onSelect(persona.id as PersonaId)} />
            ))}
            </div>
            
            <button onClick={onContinueAsGuest} className="mt-12 text-white/70 hover:text-white transition-colors">
            {t('personas.continueAsGuest')} &rarr;
            </button>
        </div>
    </div>
  );
};

export default PersonaSelectionModal;