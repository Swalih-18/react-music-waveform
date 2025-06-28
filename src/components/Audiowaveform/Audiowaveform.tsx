import React, { useState, useRef } from "react";
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const speedControlData = useSpeedControl(
    audioRef as React.RefObject<HTMLAudioElement>
  );
  const { playbackRate, speedControlRef, ...speedControlProps } =
    speedControlData;
  const waveformData = useWaveformData(src, width, barSpacing);

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
    const clickRatio = clickX / width;
    const newTime = clickRatio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: showBackground ? themeStyles.background : "transparent",
    padding: "8px 12px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    width: "fit-content",
    boxSizing: "border-box",
    minHeight: height + 16,
    maxHeight: height + 16,
    boxShadow: showBackground ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",
    marginBottom: showSpeedControl ? "120px" : "0",
  };

  const waveformContainerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
  };

  const timestampStyle: React.CSSProperties = {
    ...themeStyles.timestamp,
    width: "45px",
    textAlign: "center",
    flexShrink: 0,
    minWidth: "45px",
  };

  return (
    <div className={className} style={containerStyle}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {showControls && (
        <button
          onClick={togglePlay}
          style={themeStyles.playButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={16} fill={themeStyles.playButtonIcon} />
          ) : (
            <Play
              size={16}
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
          width={width}
          height={height}
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
            width,
            height,
            barSpacing,
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
