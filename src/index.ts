export { default as AudioWaveform } from "./components/Audiowaveform/Audiowaveform";
export type {
  AudioWaveformProps,
  AudioPlayerProps,
  WaveformProps,
  WaveformStyle,
  Theme,
  ThemeColors,
} from "./types/types";

export { formatTime, generateWaveformData, debounce } from "./utils/formatTime";
