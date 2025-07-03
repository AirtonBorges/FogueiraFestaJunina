import React, { useRef } from 'react';

interface AnimatedVisualProps {
  volume: number;
}

export const AnimatedVisual: React.FC<AnimatedVisualProps> = ({ volume }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert volume (0-1) to frame progression (0-100)
  const frameProgress = Math.round(volume * 100);
  return (
    <div className="absolute inset-0 w-full h-full" ref={containerRef}>
      {/* Canvas for GIF player */}
      <img
        src='/fireplaceanimation.gif'
        alt='Animated Fireplace'
        className="absolute inset-0 object-cover w-full h-full"
        style={{
          filter: `brightness(${1 + volume * 0.5}) contrast(${
            1 + volume * 0.4
          }) saturate(${1 + volume * 0.3})`,
          imageRendering: 'pixelated',
        }}
      />

      {/* Flame glow overlay that intensifies with vohttps:lume */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center 70%, 
            rgba(255, 140, 0, ${volume * 0.4}) 0%, 
            rgba(255, 69, 0, ${volume * 0.3}) 20%, 
            rgba(255, 0, 0, ${volume * 0.2}) 40%,
            transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Additional flame particles for higher volumes */}
      {volume > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 80%, 
              rgba(255, 200, 0, ${(volume - 0.5) * 0.6}) 0%, 
              transparent 30%),
              radial-gradient(circle at 70% 75%, 
              rgba(255, 150, 0, ${(volume - 0.5) * 0.5}) 0%, 
              transparent 25%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Frame counter display */}
      <div className="absolute px-3 py-1 font-mono text-sm text-white bg-black rounded bottom-4 right-4 bg-opacity-70">
        {frameProgress}/100
      </div>
    </div>
  );
};
