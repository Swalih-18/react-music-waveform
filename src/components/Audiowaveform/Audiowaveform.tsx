import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import type { AudioWaveformProps } from "../../types/types";
import { formatTime } from "../../utils/formatTime";
import { useAudioHandlers } from "../Audiowaveform/hooks/useAudioHandler";
import { useWaveformData } from "../Audiowaveform/hooks/useWaveFormData";
import { useSpeedControl } from "../Audiowaveform/hooks/useSpeedControl";
import { getThemeStyles } from "../Audiowaveform/styles/themeStyles";
import { renderWaveform } from "../Audiowaveform/components/WaveformRender";
import { SpeedControl } from "../Audiowaveform/components/SpeedControl";

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  src,
  style = "viridara",
  theme = "dark",
  height = 80,
  width = 600,
  barSpacing = 2,
  primaryColor,
  progressColor,
  backgroundColor,
  showControls = true,
  showTimestamp = true,
  showSpeedControl = true,
  showBackground = true,
  className = "",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<SVGSVGElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Calculate scale factor based on screen size
  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      let scale = 1;
      
      if (screenWidth <= 320) {
        // Very small phones
        scale = 0.5;
      } else if (screenWidth <= 480) {
        // Mobile phones
        scale = 0.65;
      } else if (screenWidth <= 768) {
        // Small tablets
        scale = 0.8;
      } else if (screenWidth <= 1024) {
        // Tablets
        scale = 0.9;
      }
      
      setScaleFactor(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Scaled dimensions
  const scaledWidth = Math.floor(width * scaleFactor);
  const scaledHeight = Math.floor(height * scaleFactor);
  const scaledBarSpacing = Math.max(1, Math.floor(barSpacing * scaleFactor));

  const speedControlData = useSpeedControl(
    audioRef as React.RefObject<HTMLAudioElement>
  );
  const { playbackRate, speedControlRef, ...speedControlProps } =
    speedControlData;
  const waveformData = useWaveformData(src, scaledWidth, scaledBarSpacing);

  useAudioHandlers(
    audioRef as React.RefObject<HTMLAudioElement>,
    src,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setProgress
  );

  const themeStyles = getThemeStyles(
    style,
    theme,
    backgroundColor,
    primaryColor,
    progressColor
  );

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleWaveformClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickRatio = clickX / scaledWidth;
    const newTime = clickRatio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: showBackground ? themeStyles.background : "transparent",
    padding: `${Math.floor(8 * scaleFactor)}px ${Math.floor(12 * scaleFactor)}px`,
    borderRadius: `${Math.floor(12 * scaleFactor)}px`,
    display: "flex",
    alignItems: "center",
    gap: `${Math.floor(6 * scaleFactor)}px`,
    width: "fit-content",
    maxWidth: "100%",
    boxSizing: "border-box",
    minHeight: scaledHeight + Math.floor(16 * scaleFactor),
    maxHeight: scaledHeight + Math.floor(16 * scaleFactor),
    boxShadow: showBackground ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",
    marginBottom: showSpeedControl ? `${Math.floor(120 * scaleFactor)}px` : "0",
  };

  const waveformContainerStyle: React.CSSProperties = {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
  };

  const playButtonStyle: React.CSSProperties = {
    ...themeStyles.playButton,
    width: `${Math.floor(32 * scaleFactor)}px`,
    height: `${Math.floor(32 * scaleFactor)}px`,
  };

  const timestampStyle: React.CSSProperties = {
    ...themeStyles.timestamp,
    width: `${Math.floor(45 * scaleFactor)}px`,
    textAlign: "center",
    flexShrink: 0,
    minWidth: `${Math.floor(45 * scaleFactor)}px`,
    fontSize: `${Math.floor(12 * scaleFactor)}px`,
  };

  const iconSize = Math.floor(16 * scaleFactor);

  return (
    <div className={className} style={containerStyle}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {showControls && (
        <button
          onClick={togglePlay}
          style={playButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={iconSize} fill={themeStyles.playButtonIcon} />
          ) : (
            <Play
              size={iconSize}
              fill={themeStyles.playButtonIcon}
              style={{ marginLeft: "1px" }}
            />
          )}
        </button>
      )}

      {showTimestamp && (
        <div style={timestampStyle}>{formatTime(currentTime)}</div>
      )}

      <div style={waveformContainerStyle}>
        <svg
          ref={waveformRef}
          width={scaledWidth}
          height={scaledHeight}
          style={{ cursor: "pointer", display: "block" }}
          onClick={handleWaveformClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          role="slider"
          aria-label="Audio progress"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {renderWaveform(
            waveformData,
            scaledWidth,
            scaledHeight,
            scaledBarSpacing,
            progress,
            style,
            themeStyles
          )}
        </svg>
      </div>

      {showTimestamp && (
        <div style={timestampStyle}>{formatTime(duration)}</div>
      )}

      {showControls && showSpeedControl && (
        <div style={{ position: "relative", zIndex: 1000 }}>
          <SpeedControl
            playbackRate={playbackRate}
            speedControlRef={speedControlRef as React.RefObject<HTMLDivElement>}
            themeStyles={themeStyles}
            {...speedControlProps}
          />
        </div>
      )}
    </div>
  );
};

export default AudioWaveform;