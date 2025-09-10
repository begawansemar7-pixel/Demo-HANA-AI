import { useState, useEffect, useRef, useCallback } from 'react';

// Define the interface for the SpeechRecognition API to ensure type safety
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
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

    const onResultRef = useRef(onResult);
    const onSpeechEndRef = useRef(onSpeechEnd);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        onSpeechEndRef.current = onSpeechEnd;
    }, [onSpeechEnd]);

    const mapLanguage = (lang: string) => {
        switch (lang) {
            case 'id': return 'id-ID';
            case 'ar': return 'ar-SA';
            case 'en':
            default: return 'en-US';
        }
    };

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            // The `onend` handler will manage state cleanup.
        }
    }, []);

    const startListening = useCallback(() => {
        if (isListening || !isSupported) {
            return;
        }
        
        // Stop any previous instance before starting a new one. This handles cases where onend might not have fired.
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = mapLanguage(language);

        let finalTranscript = '';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            if (event.results[event.results.length - 1].isFinal) {
                finalTranscript = currentTranscript.trim();
            }
            onResultRef.current(currentTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            // The browser will automatically call `onend` after an error.
        };

        recognition.onend = () => {
            setIsListening(false);
            if (onSpeechEndRef.current && finalTranscript) {
                onSpeechEndRef.current(finalTranscript);
            }
            recognitionRef.current = null; // Clear the ref after the session ends.
        };
        
        recognitionRef.current = recognition;
        recognition.start();

    }, [isListening, isSupported, language]);
    
    // Effect to clean up on component unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null; // Prevent onend logic from firing on unmount
                recognitionRef.current.stop();
            }
        };
    }, []);


    return {
        isListening,
        startListening,
        stopListening,
        isSupported
    };
};
