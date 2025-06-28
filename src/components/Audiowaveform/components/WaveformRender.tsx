import { type JSX } from "react";
import type { ThemeStyles } from "../styles/themeStyles";

export const renderWaveform = (
  waveformData: number[],
  width: number,
  height: number,
  barSpacing: number,
  progress: number,
  style: "viridara" | "solmara" | "aurevia" | "minimal",
  themeStyles: ThemeStyles
): JSX.Element[] | null => {
  if (waveformData.length === 0) {
    return null;
  }

  const barCount = waveformData.length;

  // bars width
  let barWidth: number;
  switch (style) {
    case "aurevia":
      barWidth = Math.max(
        ((width - barSpacing * (barCount - 1)) / barCount) * 2,
        6
      );
      break;
    case "solmara":
      barWidth = Math.max(
        ((width - barSpacing * (barCount - 1)) / barCount) * 1.2,
        3
      );
      break;
    case "viridara":
      barWidth = Math.max((width - barSpacing * (barCount - 1)) / barCount, 2);
      break;
    case "minimal":
      barWidth = Math.max(
        ((width - barSpacing * (barCount - 1)) / barCount) * 1,
        1
      );
      break;
    default:
      barWidth = Math.max((width - barSpacing * (barCount - 1)) / barCount, 2);
  }

  const actualSpacing = style === "aurevia" ? barSpacing * 1.5 : barSpacing;
  const actualBarWidth = style === "aurevia" ? Math.min(barWidth, 8) : barWidth;

  return waveformData.map((value, index) => {
    let barHeight = value * height;
    let barY = 0;

    switch (style) {
      case "viridara":
        barHeight = Math.max(barHeight * 0.8, 2);
        barY = (height - barHeight) / 2;
        break;

      case "solmara":
        barHeight = barHeight * 0.9;
        barY = height - barHeight;
        break;

      case "aurevia":
        barHeight = Math.max(barHeight * 0.95, 4);
        barY = (height - barHeight) / 2;
        break;

      case "minimal":
        barHeight = Math.max(barHeight * 0.6, 1);
        barY = (height - barHeight) / 2;
        break;
    }

    const xPosition = index * (actualBarWidth + actualSpacing);

    const barCenterPosition = xPosition + actualBarWidth / 2;
    const barCenterRatio = barCenterPosition / width;

    const isPlayed = progress >= barCenterRatio;

    const barStartRatio = xPosition / width;
    const barEndRatio = (xPosition + actualBarWidth) / width;
    const isCurrentProgressBar =
      progress >= barStartRatio && progress < barEndRatio;

    let barColor = themeStyles.primary;
    let opacity = style === "minimal" ? 0.4 : 0.6;

    if (isPlayed) {
      barColor = themeStyles.progress;
      opacity = 1;
    } else if (isCurrentProgressBar) {
      barColor = themeStyles.progress;
      const barProgress =
        (progress - barStartRatio) / (barEndRatio - barStartRatio);
      opacity = 0.6 + 0.4 * Math.max(0, Math.min(1, barProgress));
    }

    let borderRadius = 0;
    switch (style) {
      case "viridara":
        borderRadius = actualBarWidth / 2;
        break;
      case "aurevia":
        borderRadius = 2;
        break;
      case "solmara":
        borderRadius = 1;
        break;
      case "minimal":
        borderRadius = 0;
        break;
    }

    return (
      <rect
        key={index}
        x={xPosition}
        y={barY}
        width={actualBarWidth}
        height={barHeight}
        fill={barColor}
        rx={borderRadius}
        opacity={opacity}
        style={{
          transition: "all 0.15s ease",
          transformOrigin: "center",
          willChange: "fill, opacity",
        }}
      />
    );
  });
};
