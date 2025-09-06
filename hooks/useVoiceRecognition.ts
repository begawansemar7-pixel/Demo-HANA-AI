
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
    language: string;
}

export const useVoiceRecognition = ({ onResult, language }: UseVoiceRecognitionProps) => {
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
    
    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Error stopping recognition:", error);
            }
            // The onend event will set isListening to false
        }
    }, [isListening]);

    useEffect(() => {
        if (!isSupported) {
            console.warn('Speech Recognition API is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one phrase is detected
        recognition.interimResults = true;
        recognition.lang = mapLanguage(language);

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            onResult(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            // Ensure listening stops on error
             if (isListening) {
                stopListening();
             }
        };

        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
        
        // Cleanup function to stop recognition if the component unmounts
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };

    }, [language, onResult, isSupported, isListening, stopListening]);
    
    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error("Error starting recognition:", error);
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