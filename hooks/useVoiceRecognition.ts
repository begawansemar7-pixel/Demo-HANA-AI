import { useState, useEffect, useRef, useCallback } from 'react';

// Define the interface for the SpeechRecognition API to ensure type safety
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: ISpeechRecognition, ev: any) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: any) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  new(): ISpeechRecognition;
}

// Check for vendor-prefixed versions of the SpeechRecognition API
const SpeechRecognition: ISpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface UseVoiceRecognitionProps {
    onResult: (transcript: string) => void;
    onSpeechEnd?: (finalTranscript: string) => void;
    language: string;
}

export const useVoiceRecognition = ({ onResult, onSpeechEnd, language }: UseVoiceRecognitionProps) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const isSupported = !!SpeechRecognition;

    const mapLanguage = (lang: string) => {
        switch (lang) {
            case 'id': return 'id-ID';
            case 'ar': return 'ar-SA';
            case 'en':
            default: return 'en-US';
        }
    };

    // This effect sets up and tears down the recognition object.
    useEffect(() => {
        if (!isSupported) {
            console.warn('Speech Recognition API is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = mapLanguage(language);

        let finalTranscript = '';

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            if (event.results[event.results.length - 1].isFinal) {
                finalTranscript = currentTranscript;
            }
            onResult(currentTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (onSpeechEnd && finalTranscript) {
                onSpeechEnd(finalTranscript);
            }
        };
        
        recognitionRef.current = recognition;
        
        return () => {
            recognition.stop();
        };
    }, [language, onResult, onSpeechEnd, isSupported]);


    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                // Common error: starting recognition that has already started.
                console.error("Error starting recognition:", error);
                setIsListening(false);
            }
        }
    }, [isListening]);
    
    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
                // onend will set isListening to false
            } catch (error) {
                console.error("Error stopping recognition:", error);
                setIsListening(false);
            }
        }
    }, [isListening]);


    return {
        isListening,
        startListening,
        stopListening,
        isSupported
    };
};
