import { useState, useEffect, useRef, useCallback } from 'react';

// Check for browser support
const isSupported = 'speechSynthesis' in window;

interface UseTextToSpeechProps {
  onStart?: () => void;
  onEnd?: () => void;
  language: string; // 'en', 'id', 'ar'
}

export const useTextToSpeech = ({ onStart, onEnd, language }: UseTextToSpeechProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const mapLanguageToVoice = (lang: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
      const langMap: { [key: string]: string[] } = {
          'en': ['en-US', 'en_US', 'English (United States)'],
          'id': ['id-ID', 'id_ID', 'Indonesian', 'Bahasa Indonesia'],
          'ar': ['ar-SA', 'ar_SA', 'Arabic (Saudi Arabia)']
      };
      const targetLangs = langMap[lang] || langMap['en'];
      
      return voices.find(voice => targetLangs.some(target => voice.lang.startsWith(target) || voice.name.includes(target)));
  };


  useEffect(() => {
    // Cleanup on unmount or if speaking is interrupted
    return () => {
      if (isSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) {
      if (!isSupported) console.warn('Speech Synthesis API is not supported.');
      return;
    }

    // Cancel any ongoing speech before starting a new one
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = mapLanguageToVoice(language, voices);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            console.warn(`No specific voice found for language: ${language}. Using browser default.`);
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            onStart?.();
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
            utteranceRef.current = null;
        };

        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            if (event.error === 'not-allowed') {
                console.info('Speech synthesis playback failed: Autoplay was blocked by the browser. User interaction is required to start audio.');
            } else {
// FIX: Complete the implementation of the useTextToSpeech hook which was truncated.
// This includes completing the speak function, adding the cancel function, and returning the necessary values.
                console.error('SpeechSynthesis Error:', event.error);
            }
            // Ensure state is reset on error
            setIsSpeaking(false);
            onEnd?.();
            utteranceRef.current = null;
        };
        
        window.speechSynthesis.speak(utterance);
    };

    // The 'voiceschanged' event is fired when the list of voices is ready.
    // Some browsers load voices asynchronously.
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
        setVoiceAndSpeak();
    }
  }, [language, onStart, onEnd]);

  const cancel = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      // onend event will handle setting isSpeaking to false
    }
  }, []);

  return { isSpeaking, speak, cancel, isSupported };
};
