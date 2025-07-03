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
    </div>
  );
}

export default App;