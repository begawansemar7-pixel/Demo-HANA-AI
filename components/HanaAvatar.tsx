

import React from 'react';

export enum HanaState {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  ANSWERING = 'answering',
}

interface HanaAvatarProps {
  state: HanaState;
  onClick: () => void;
}

const HanaAvatar: React.FC<HanaAvatarProps> = ({ state, onClick }) => {
  const getStateClasses = () => {
    switch (state) {
      case HanaState.IDLE:
        return 'animate-breathing';
      case HanaState.LISTENING:
        return 'animate-pulse';
      case HanaState.THINKING:
        return 'opacity-70';
      case HanaState.ANSWERING:
        return '';
      default:
        return '';
    }
  };

  const ThinkingDots: React.FC = () => (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className={`w-20 h-20 rounded-full bg-gradient-to-br from-halal-green to-turquoise-blue text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 ${getStateClasses()}`}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Face Container: Fades back when thinking/listening */}
          <div className={`transition-opacity duration-300 ${state === HanaState.THINKING || state === HanaState.LISTENING ? 'opacity-30' : 'opacity-100'}`}>
            {/* Eyes */}
            <div className="absolute top-[22px] left-1/2 -translate-x-1/2 flex items-center gap-3.5">
              <div className={`w-2 h-2 bg-white/90 rounded-full ${state === HanaState.IDLE ? 'animate-pulse-eye' : ''}`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-2 h-2 bg-white/90 rounded-full ${state === HanaState.IDLE ? 'animate-pulse-eye' : ''}`}></div>
            </div>

            {/* Mouth */}
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2">
                {state === HanaState.ANSWERING ? (
                    <div className="w-5 h-2 bg-white/90 rounded-full animate-speaking origin-bottom"></div>
                ) : (
                    <div className="w-4 h-0.5 bg-white/60 rounded-full"></div>
                )}
            </div>
          </div>
        </div>
        
        {state === HanaState.LISTENING && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
        )}
        {state === HanaState.THINKING && <ThinkingDots />}
      </button>
    </div>
  );
};

export default HanaAvatar;