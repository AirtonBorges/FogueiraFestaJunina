import { useEffect, useRef } from 'react';

export function useMicrophoneVolume(isActive: boolean, onVolumeChange: (volume: number) => void) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
    return () => stopAudioCapture();
    // eslint-disable-next-line
  }, [isActive]);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 512;
      analyserNode.smoothingTimeConstant = 0.3;
      mediaStreamAudioSourceNode.connect(analyserNode);
      analyserRef.current = analyserNode;
      const pcmData = new Float32Array(analyserNode.fftSize);

      const onFrame = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) {
          sumSquares += amplitude * amplitude;
        }
        const currentVolume = Math.sqrt(sumSquares / pcmData.length);
        const normalizedVolume = Math.min(currentVolume * 10, 1);
        onVolumeChange(normalizedVolume);
        animationFrameRef.current = window.requestAnimationFrame(onFrame);
      };

      animationFrameRef.current = window.requestAnimationFrame(onFrame);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioCapture = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    onVolumeChange(0);
  };
}
