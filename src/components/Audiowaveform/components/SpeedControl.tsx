import React from 'react';
import type { ThemeStyles } from '../styles/themeStyles';

interface SpeedControlProps {
  playbackRate: number;
  showSpeedDropdown: boolean;
  speedControlRef: React.RefObject<HTMLDivElement>;
  themeStyles: ThemeStyles;
  toggleSpeedDropdown: () => void;
  changePlaybackRate: (rate: number) => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  playbackRate,
  showSpeedDropdown,
  speedControlRef,
  themeStyles,
  toggleSpeedDropdown,
  changePlaybackRate
}) => {
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const dropdownStyle: React.CSSProperties = {
    ...themeStyles.speedDropdown,
    opacity: showSpeedDropdown ? 1 : 0,
    visibility: showSpeedDropdown ? 'visible' : 'hidden',
    transform: showSpeedDropdown ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease',
    pointerEvents: showSpeedDropdown ? 'auto' : 'none'
  };

  return (
    <div
      ref={speedControlRef}
      style={{ position: 'relative', flexShrink: 0 }}
      onClick={toggleSpeedDropdown}
    >
      <span style={themeStyles.speedControl}>
        {playbackRate}x
      </span>

      <ul style={dropdownStyle}>
        {speedOptions.map((rate) => (
          <li
            key={rate}
            style={{
              ...themeStyles.speedOption,
              backgroundColor: playbackRate === rate ? 'rgba(255,255,255,0.2)' : 'transparent',
            }}
            onClick={(e) => {
              e.stopPropagation();
              changePlaybackRate(rate);
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = playbackRate === rate ? 'rgba(255,255,255,0.2)' : 'transparent'; 
            }}
          >
            {rate}x
          </li>
        ))}
      </ul>
    </div>
  );
};