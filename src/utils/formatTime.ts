/**
 * Format seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * DEPRECATED: Generate sample waveform data for visualization
 * This function will no longer be used for actual waveform generation.
 */
export const generateWaveformData = (length: number = 100): number[] => {
  console.warn("generateWaveformData is deprecated. Use analyzeAudioFile for real waveform data.");
  return Array(length).fill(0).map((_, index) => {
    const baseAmplitude = Math.random() * 0.6 + 0.1;
    const peakFactor = Math.sin((index / length) * Math.PI * 4) * 0.3;
    return Math.min(Math.max(baseAmplitude + peakFactor, 0.05), 1);
  });
};

// src/types/global.d.ts




/**
 * Analyze audio file and extract waveform data
 * @param audioUrl - URL of the audio file
 * @param samples - Number of samples to extract for the waveform visualization
 * @returns Promise resolving to an array of normalized amplitude values (0-1)
 */
export const analyzeAudioFile = async (audioUrl: string, samples: number = 80): Promise<number[]> => {
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0); // Get data from the first channel
    const waveformData: number[] = [];

    // Calculate block size to get 'samples' number of data points
    const blockSize = Math.floor(channelData.length / samples);

    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;
      let count = 0; // To handle potential empty blocks at the very end

      for (let j = start; j < start + blockSize && j < channelData.length; j++) {
        sum += Math.abs(channelData[j]); // Use absolute value for amplitude
        count++;
      }

      const average = count > 0 ? sum / count : 0;
      waveformData.push(average);
    }

    // Normalize the data to a 0-1 range
    const max = Math.max(...waveformData);
    return waveformData.map(value => max > 0 ? value / max : 0);

  } catch (error) {
    console.error('Error analyzing audio file:', error);
    // Return a default waveform or throw an error based on your error handling strategy
    return Array(samples).fill(0.1); // Return a flat line if analysis fails
  }
};


/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};