
export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};


export const analyzeAudioFile = async (audioUrl: string, samples: number = 90): Promise<number[]> => {
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
      let count = 0; 

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