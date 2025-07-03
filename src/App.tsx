import React, { useState } from 'react';

import { AnimatedVisual } from './components/AnimatedVisual';
import { useMicrophoneVolume } from './hooks/useMicrophoneVolume';

function App() {
  const [volume, setVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useMicrophoneVolume(isListening, setVolume);

  const handleScreenClick = async () => {
    if (!hasPermission) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        setIsListening(true);
      } catch (error) {
        console.error('Permission denied:', error);
        alert('Microphone permission is required. Please enable it in your browser settings.');
      }
    } else {
      setIsListening(!isListening);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-black cursor-pointer"
      onClick={handleScreenClick}
    >
      {/* Fullscreen Fireplace */}
      <AnimatedVisual volume={volume} />
      
      {/* Overlay instructions */}
      {!hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 text-center text-white bg-black rounded-lg bg-opacity-70">
            <h2 className="mb-4 text-2xl font-bold">Cozy Fireplace</h2>
            <p className="mb-4 text-lg">Click anywhere to enable microphone</p>
            <p className="text-sm text-gray-300">The fireplace will respond to sounds around you</p>
          </div>
        </div>
      )}

      {/* Status indicator */}
      {hasPermission && (
        <div className="absolute top-4 left-4">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        </div>
      )}

      {/* Fullscreen button */}
      <button
        onClick={e => { e.stopPropagation(); handleFullscreen(); }}
        className="absolute top-4 right-4 z-20 p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 focus:outline-none"
        title="Toggle fullscreen"
        aria-label="Toggle fullscreen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 0 1 2-2h2m8 0h2a2 2 0 0 1 2 2v2m0 8v2a2 2 0 0 1-2 2h-2m-8 0H6a2 2 0 0 1-2-2v-2" />
        </svg>
      </button>
    </div>
  );
}

export default App;