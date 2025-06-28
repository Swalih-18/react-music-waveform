import { useState, useRef, useEffect } from 'react';

export const useSpeedControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const speedControlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedControlRef.current && !speedControlRef.current.contains(event.target as Node)) {
        setShowSpeedDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedDropdown(false);
  };

  const toggleSpeedDropdown = () => {
    setShowSpeedDropdown(!showSpeedDropdown);
  };

  return {
    playbackRate,
    showSpeedDropdown,
    speedControlRef,
    changePlaybackRate,
    toggleSpeedDropdown
  };
};