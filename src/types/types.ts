export type WaveformStyle = "viridara" | "solmara" | "aurevia" | "minimal";
export type Theme = "light" | "dark";

export interface AudioWaveformProps {
  src: string;
  style?: WaveformStyle;
  theme?: Theme;
  height?: number;
  width?: number;
  barSpacing?: number;
  primaryColor?: string;
  progressColor?: string;
  backgroundColor?: string;
  showBackground?: boolean;
  showControls?: boolean;
  showTimestamp?: boolean;
  showSpeedControl?: boolean;
  className?: string;
}

export interface AudioPlayerProps {
  src: string;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export interface WaveformProps {
  data: number[];
  style?: WaveformStyle;
  color?: string;
  progressColor?: string;
  height?: number;
  width?: number;
  barSpacing?: number;
  progress?: number;
  onClick?: (progress: number) => void;
  className?: string;
}

export interface ThemeColors {
  background: string;
  primary: string;
  progress: string;
  text: string;
  controls: string;
  controlsBorder: string;
}
