import React, { useState, useRef, useEffect } from 'react';
import HanaAvatar, { HanaState } from './HanaAvatar';
import { createHanaChat, sendMessageToHana } from '../services/geminiService';
import { Chat } from '@google/genai';
import { useTranslations } from '../hooks/useTranslations';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAuth } from '../hooks/useAuth';
import { PERSONAS } from '../constants';


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'hana';
}

interface HanaChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SpeakerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerMutedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

const HanaChat: React.FC<HanaChatProps> = ({ isOpen, onClose, onOpen }) => {
  const { t, language } = useTranslations();
  const { persona } = useAuth();
  const [hanaState, setHanaState] = useState<HanaState>(HanaState.IDLE);
  const [messages, setMessages] = useState<Message[]>([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
  const [input, setInput] = useState('');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  const textBeforeListeningRef = useRef('');
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(true);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes free trial
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [showPaymentWall, setShowPaymentWall] = useState(false);
  
  const personaDetails = PERSONAS.find(p => p.id === persona);
  let personaIcon: React.ReactNode = null;
  let personaName: string = '';

  if (persona === 'guest') {
    personaName = t('personas.guest.name');
    personaIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (personaDetails) {
    personaName = t(personaDetails.name);
    // FIX: Use Object.assign to merge props safely, resolving a TypeScript error with cloneElement.
    personaIcon = React.cloneElement(personaDetails.icon, Object.assign({}, personaDetails.icon.props, { className: 'h-4 w-4' }));
  }

  const { isListening, startListening, stopListening, isSupported: isMicSupported } = useVoiceRecognition({
      onResult: (transcript) => {
          const prefix = textBeforeListeningRef.current.trim();
          const separator = prefix ? ' ' : '';
          setInput(prefix + separator + transcript);
      },
      language: language
  });
  
  const { speak, cancel, isSupported: isTtsSupported } = useTextToSpeech({
    onStart: () => setHanaState(HanaState.ANSWERING),
    onEnd: () => {
        setHanaState(HanaState.IDLE);
        setCurrentlySpeakingId(null);
    },
    language: language
  });

  // Effect to handle side-effects of toggling voice mode
  useEffect(() => {
    if (!isVoiceModeEnabled) {
        cancel(); // Stop any ongoing speech
        stopListening(); // Stop any ongoing listening
    }
  }, [isVoiceModeEnabled, cancel, stopListening]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Timer effect
  useEffect(() => {
      if (!isOpen || showPaymentWall || timeRemaining <= 0) return;
      const timer = setInterval(() => {
          setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
  }, [isOpen, showPaymentWall, timeRemaining]);
  
  // Effect to handle session end
  useEffect(() => {
      if (timeRemaining <= 0 && isFreeTrial) {
          setShowPaymentWall(true);
      }
  }, [timeRemaining, isFreeTrial]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    // Reset or initialize chat when the modal opens or language changes
    if (isOpen) {
      chatRef.current = createHanaChat(language);
      setMessages([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
      setInput('');
      setTimeRemaining(300);
      setIsFreeTrial(true);
      setShowPaymentWall(false);
    } else {
        cancel(); // Stop speech when modal is closed
    }
  }, [isOpen, language, t, cancel]);

  useEffect(() => {
    if (isListening) {
        setHanaState(HanaState.LISTENING);
    } else if (hanaState === HanaState.LISTENING) {
        setHanaState(HanaState.IDLE);
    }
  }, [isListening, hanaState]);
  
  // Keyboard listener for open/close shortcut and escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpen, onClose]);

  // Focus management on open/close and focus trap
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const inputField = modalRef.current?.querySelector('input[type="text"]');
        if (inputField) (inputField as HTMLElement).focus();
      }, 100);

      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleFocusTrap);
      return () => document.removeEventListener('keydown', handleFocusTrap);
    } else {
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);


  const handleSend = async (text: string) => {
    if (text.trim() === '' || !chatRef.current) return;
    
    const userMessage: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setHanaState(HanaState.THINKING);

    try {
        const response = await sendMessageToHana(chatRef.current, text, language);
        const hanaMessage: Message = { id: Date.now() + 1, text: response, sender: 'hana' };
        setMessages(prev => [...prev, hanaMessage]);

        if (isTtsSupported && isVoiceModeEnabled) {
            speak(response);
            setCurrentlySpeakingId(hanaMessage.id);
        } else {
            setHanaState(HanaState.IDLE);
        }
    } catch (error) {
        const errorMessage: Message = { id: Date.now() + 1, text: t('hana.errorMessage'), sender: 'hana' };
        setMessages(prev => [...prev, errorMessage]);
        setHanaState(HanaState.IDLE);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      textBeforeListeningRef.current = input;
      startListening();
    }
  };

  const handleDownloadChat = () => {
    const chatLogForDb = {
        sessionId: `chat_${Date.now()}`,
        timestamp: new Date().toISOString(),
        persona: persona || 'guest',
        messages: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.id).toISOString()
        }))
    };
    console.log(`Saving to AI Halal Advisor Database (Simulation): ${JSON.stringify(chatLogForDb)}`);

    const header = `AI Halal Advisor Consultation Log\nGenerated on: ${new Date().toLocaleString()}\n\n---\n\n`;
    const formattedContent = messages.map(msg => {
        const sender = msg.sender === 'hana' ? 'HANA' : 'User';
        return `${sender}:\n${msg.text}\n`;
    }).join('\n---\n');

    const fullContent = header + formattedContent;
    
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `HANA_Chat_Log_${timestamp}.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowDownloadSuccess(true);
    setTimeout(() => setShowDownloadSuccess(false), 3000);
  };
  
  const handlePayment = () => {
      setShowPaymentWall(false);
      setIsFreeTrial(false);
      setTimeRemaining(3600); // 60 minutes
  };
  
  const isSessionEnded = timeRemaining <= 0 && !isFreeTrial && !showPaymentWall;
  const isChatDisabled = hanaState === HanaState.THINKING || showPaymentWall || isSessionEnded;

  return (
    <>
      <HanaAvatar 
        ref={triggerButtonRef} 
        state={hanaState} 
        onClick={isOpen ? onClose : onOpen} 
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t('hana.toggleChatLabel')}
      />
      
      {isOpen && (
        <div 
          ref={modalRef}
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 w-[90vw] max-w-sm h-[60vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col animate-fadein z-50"
          role="dialog"
          aria-labelledby="hana-chat-title"
        >
          {showDownloadSuccess && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-full animate-fadein z-10">
                {t('hana.downloadSuccess')}
            </div>
          )}
          <header className="p-3 bg-halal-green text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
            <div className="flex-1 text-center">
                 <h3 id="hana-chat-title" className="font-bold">{t('hana.chatTitle')}</h3>
                 {personaName && (
                   <div className="flex items-center justify-center gap-1.5 text-xs text-white/80 mt-1">
                       {personaIcon}
                       <span>{personaName}</span>
                   </div>
                 )}
                 <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full inline-block mt-1">
                    {isFreeTrial ? t('hana.freeTrial') : t('hana.sessionTime')} | {t('hana.timeRemaining', { time: formatTime(timeRemaining) })}
                 </div>
            </div>
            <div className="flex items-center gap-1">
                {(isTtsSupported || isMicSupported) && (
                    <button onClick={() => setIsVoiceModeEnabled(prev => !prev)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" title={t('hana.toggleVoice')}>
                        {isVoiceModeEnabled ? <SpeakerIcon/> : <SpeakerMutedIcon/>}
                    </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" title={t('search.close')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </header>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'hana' && <div className="w-8 h-8 rounded-full bg-halal-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">H</div>}
                <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-halal-green text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {hanaState === HanaState.THINKING && (
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-halal-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">H</div>
                    <div className="max-w-xs p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-3 border-t bg-white dark:bg-gray-800 rounded-b-2xl">
            {showPaymentWall ? (
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 text-center animate-fadein rounded-lg">
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">{t('hana.paymentTitle')}</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 my-1">{t('hana.paymentMessage')}</p>
                    <button onClick={handlePayment} className="w-full mt-1 px-4 py-1.5 bg-halal-green text-white text-sm font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                        {t('hana.paymentButton')}
                    </button>
                </div>
            ) : isSessionEnded ? (
                <div className="text-center animate-fadein">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('hana.sessionEndedMessage')}</p>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    {isMicSupported && isVoiceModeEnabled && (
                        <button onClick={toggleListening} className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`} disabled={isChatDisabled}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                    )}
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={isListening ? t('hana.listeningPlaceholder') : t('hana.inputPlaceholder')} className="flex-1 w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green disabled:bg-gray-200 dark:disabled:bg-gray-600" disabled={isChatDisabled} />
                    <button onClick={() => handleSend(input)} disabled={isChatDisabled || input.trim() === ''} className="w-9 h-9 bg-halal-green text-white rounded-full flex-shrink-0 flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HanaChat;
