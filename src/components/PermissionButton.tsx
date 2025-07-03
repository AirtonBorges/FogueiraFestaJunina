import React from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';

interface PermissionButtonProps {
  isActive: boolean;
  hasPermission: boolean;
  onToggle: () => void;
  onRequestPermission: () => void;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  isActive,
  hasPermission,
  onToggle,
  onRequestPermission,
}) => {
  if (!hasPermission) {
    return (
      <button
        onClick={onRequestPermission}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium transition-colors duration-200"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Enable Microphone</span>
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-4 py-2 rounded font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {isActive ? (
        <>
          <Square className="w-4 h-4" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>Start Listening</span>
        </>
      )}
    </button>
  );
};