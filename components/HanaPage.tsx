import React, { useState, useRef, useEffect, useCallback } from 'react';
import HanaAvatar, { HanaState } from './HanaAvatar';
import { createHanaChat, sendMessageToHana } from '../services/geminiService';
import { Chat } from '@google/genai';
import { useTranslations } from '../hooks/useTranslations';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAuth } from '../hooks/useAuth';
import { PERSONAS } from '../constants';
import ListeningModal from './ListeningModal';


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'hana';
}

const CHAT_HISTORY_KEY_PAGE = 'hanaPageChatHistory'; // Separate key for the full page

const SpeakerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerMutedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

const HanaPage: React.FC = () => {
  const { t, language } = useTranslations();
  const { persona } = useAuth();
  const [hanaState, setHanaState] = useState<HanaState>(HanaState.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  const textBeforeListeningRef = useRef('');
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(true);

  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes free trial
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [showPaymentWall, setShowPaymentWall] = useState(false);

  const personaDetails = PERSONAS.find(p => p.id === persona);
  let personaIcon: React.ReactNode = null;
  let personaName: string = '';

  if (persona === 'guest') {
    personaName = t('personas.guest.name');
    personaIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (personaDetails) {
    personaName = t(personaDetails.name);
    // FIX: Use Object.assign to merge props safely, resolving a TypeScript error with cloneElement.
    personaIcon = React.cloneElement(personaDetails.icon, Object.assign({}, personaDetails.icon.props, { className: 'h-4 w-4' }));
  }

  const { speak, cancel, isSupported: isTtsSupported } = useTextToSpeech({
    onStart: () => setHanaState(HanaState.ANSWERING),
    onEnd: () => {
        setHanaState(HanaState.IDLE);
        setCurrentlySpeakingId(null);
    },
    language: language
  });
  
  const handleSend = useCallback(async (messageToSend: string) => {
    if (messageToSend.trim() === '' || !chatRef.current) return;
    
    const userMessage: Message = { id: Date.now(), text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setHanaState(HanaState.THINKING);

    try {
        const response = await sendMessageToHana(chatRef.current, messageToSend, language);
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
  }, [language, isTtsSupported, isVoiceModeEnabled, speak, t]);
  
  const { isListening, startListening, stopListening, isSupported: isMicSupported } = useVoiceRecognition({
      onResult: (transcript) => {
          const prefix = textBeforeListeningRef.current.trim();
          const separator = prefix ? ' ' : '';
          setInput(prefix + separator + transcript);
      },
      onSpeechEnd: (finalTranscript) => {
          const prefix = textBeforeListeningRef.current.trim();
          const separator = prefix ? ' ' : '';
          const fullMessage = prefix + separator + finalTranscript;
          if (fullMessage.trim()) {
              handleSend(fullMessage);
          }
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
  
  const startNewSession = useCallback(() => {
      chatRef.current = createHanaChat(language);
      localStorage.removeItem(CHAT_HISTORY_KEY_PAGE); // Clear previous history
      setMessages([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
      setInput('');
      setTimeRemaining(300);
      setIsFreeTrial(true);
      setShowPaymentWall(false);
  }, [language, t]);
  
  // Timer effect
  useEffect(() => {
    if (showPaymentWall || timeRemaining <= 0) return;
    const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [showPaymentWall, timeRemaining]);
  
  // Session end effect
  useEffect(() => {
    if (timeRemaining <= 0 && isFreeTrial) {
        setShowPaymentWall(true);
    }
  }, [timeRemaining, isFreeTrial]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, hanaState]);

  // Effect for initial load and language changes (loads history)
  useEffect(() => {
    chatRef.current = createHanaChat(language);
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY_PAGE);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
        } else {
          setMessages([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
        }
      } catch (e) {
        console.error("Failed to parse chat history:", e);
        setMessages([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
      }
    } else {
      setMessages([{ id: Date.now(), text: t('hana.welcomeMessage'), sender: 'hana' }]);
    }
  }, [language, t]);

  // Effect for saving messages to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(CHAT_HISTORY_KEY_PAGE, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isListening) {
      setHanaState(HanaState.LISTENING);
    } else if (hanaState === HanaState.LISTENING) {
      setHanaState(HanaState.IDLE);
    }
  }, [isListening, hanaState]);


  const handleStopSpeech = () => {
      cancel();
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };
  
  const suggestionChips = [
    t('hana.suggestion1'),
    t('hana.suggestion2'),
    t('hana.suggestion3'),
  ];

  const handleChipClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend(suggestion);
  };
  
  const handleMicClick = () => {
    textBeforeListeningRef.current = input;
    startListening();
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
    const logMessage = `Saving to AI Halal Advisor Database (Simulation): ${JSON.stringify(chatLogForDb)}`;
    console.log(logMessage);

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
  const isChatDisabled = hanaState === HanaState.THINKING || hanaState === HanaState.ANSWERING || showPaymentWall || isSessionEnded || isListening;
  
  const isMicVisible = input.trim() === '' && isMicSupported && isVoiceModeEnabled;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein">
      <ListeningModal isOpen={isListening} onStop={stopListening} />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Left Column: Avatar & Info */}
        <div className="lg:w-1/3 flex flex-col items-center text-center">
          <div className="transform scale-150 mt-8 mb-12">
            <HanaAvatar state={hanaState} onClick={() => {}} />
          </div>
          <h1 className="text-4xl font-bold text-halal-green">{t('hana.title')}</h1>
          <p className="text-lg text-gray-500 mt-2">{t('hana.subtitle')}</p>
          <div className="mt-8 border-t pt-6 w-full">
            <h3 className="font-semibold text-gray-700 mb-3">{t('hana.suggestionsTitle')}</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {suggestionChips.map((chip, index) => (
                    <button key={index} onClick={() => handleChipClick(chip)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-halal-green hover:text-white transition-colors">
                        {chip}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col h-[75vh] relative">
           {showDownloadSuccess && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-full animate-fadein z-10">
                    {t('hana.downloadSuccess')}
                </div>
            )}
          <header className="p-4 bg-halal-green text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex-1 text-center">
                 <h3 className="font-bold text-lg">{t('hana.chatTitle')}</h3>
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
                {messages.length > 1 && (
                  <button onClick={handleDownloadChat} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" title={t('hana.downloadChat')} aria-label={t('hana.downloadChat')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                  </button>
                )}
                {(isTtsSupported || isMicSupported) && (
                    <button
                        onClick={() => setIsVoiceModeEnabled(prev => !prev)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        title={t('hana.toggleVoice')}
                        aria-label={t('hana.toggleVoice')}
                    >
                        {isVoiceModeEnabled ? <SpeakerIcon/> : <SpeakerMutedIcon/>}
                    </button>
                )}
              </div>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'hana' && <div className="w-8 h-8 rounded-full bg-halal-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">H</div>}
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-halal-green text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
                 {isTtsSupported && currentlySpeakingId === msg.id && (
                    <button onClick={handleStopSpeech} className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 flex-shrink-0 transition-colors" aria-label="Stop speech">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
              </div>
            ))}
             {hanaState === HanaState.THINKING && (
                <div className="flex items-end gap-2 animate-fadein">
                    <div className="w-8 h-8 rounded-full bg-halal-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">H</div>
                    <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 rounded-bl-none">
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

            <div className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-2xl">
                {showPaymentWall ? (
                    <div className="p-4 bg-yellow-50 text-center animate-fadein rounded-lg">
                        <h4 className="font-bold text-yellow-800">{t('hana.paymentTitle')}</h4>
                        <p className="text-sm text-yellow-700 my-2">{t('hana.paymentMessage')}</p>
                        <button 
                            onClick={handlePayment} 
                            className="w-full mt-2 px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                        >
                            {t('hana.paymentButton')}
                        </button>
                    </div>
                ) : isSessionEnded ? (
                    <div className="p-4 bg-gray-100 text-center animate-fadein rounded-lg">
                         <h4 className="font-bold text-gray-800">{t('hana.sessionEndedTitle')}</h4>
                        <p className="text-sm text-gray-700 my-2">{t('hana.sessionEndedMessage')}</p>
                        <button 
                            onClick={startNewSession} 
                            className="w-full mt-2 px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                        >
                            {t('hana.startNewSession')}
                        </button>
                    </div>
                ) : (
                    <div className="relative flex items-center">
                        <label htmlFor="hana-page-input" className="sr-only">{t('hana.inputPlaceholder')}</label>
                        <input
                            id="hana-page-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t('hana.inputPlaceholder')}
                            className="flex-1 w-full py-3 px-4 pr-12 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isChatDisabled}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <button
                                type="button"
                                onClick={isMicVisible ? handleMicClick : () => handleSend(input)}
                                aria-label={isMicVisible ? t('hana.startListeningLabel') : t('hana.sendLabel')}
                                disabled={isMicVisible ? isChatDisabled : (isChatDisabled || input.trim() === '')}
                                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isMicVisible 
                                    ? (isListening ? 'bg-red-500 text-white' : 'bg-halal-green text-white hover:bg-opacity-90') 
                                    : 'bg-halal-green text-white hover:bg-opacity-90'
                                }`}
                            >
                                {isMicVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HanaPage;