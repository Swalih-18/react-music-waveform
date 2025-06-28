export interface ThemeStyles {
  background: string;
  primary: string;
  progress: string;
  text: string;
  playButton: React.CSSProperties;
  playButtonIcon: string;
  timestamp: React.CSSProperties;
  speedControl: React.CSSProperties;
  speedDropdown: React.CSSProperties;
  speedOption: React.CSSProperties;
}

const STYLE_COLORS = {
  viridara: {
    primary: "#1DB954",
    progress: "#1ed760",
  },
  solmara: {
    primary: "#ff5500",
    progress: "#ef6c05",
  },
  aurevia: {
    primary: "#007AFF",
    progress: "#0056D6",
  },
  minimal: {
    light: {
      primary: "#666666",
      progress: "#000000",
    },
    dark: {
      primary: "#999999",
      progress: "#FFFFFF",
    },
  },
};

export const getThemeStyles = (
  style: "viridara" | "solmara" | "aurevia" | "minimal",
  theme: "light" | "dark",
  backgroundColor?: string,
  primaryColor?: string,
  progressColor?: string
): ThemeStyles => {
  let styleColors;
  if (style === "minimal") {
    styleColors = STYLE_COLORS.minimal[theme];
  } else {
    styleColors = STYLE_COLORS[style];
  }

  // them coloring
  const isLight = theme === "light";
  const baseBackground = isLight ? "#FFFFFF" : "#000000";
  const baseText = isLight ? "#000000" : "#FFFFFF";

  const finalColors = {
    background: backgroundColor || baseBackground,
    primary: primaryColor || styleColors.primary,
    progress: progressColor || styleColors.progress,
    text: baseText,
  };

  const buttonColor =
    style === "minimal" ? finalColors.progress : finalColors.progress;

  const buttonIconColor = "#FFFFFF";

  return {
    background: finalColors.background,
    primary: finalColors.primary,
    progress: finalColors.progress,
    text: finalColors.text,

    playButton: {
      backgroundColor: buttonColor,
      color: buttonIconColor,
      width: "32px",
      height: "32px",
      minWidth: "32px",
      minHeight: "32px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },

    playButtonIcon: buttonIconColor,

    timestamp: {
      color: finalColors.text,
      fontSize: "11px",
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "600",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    },

    speedControl: {
      color: finalColors.text,
      fontSize: "13px",
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "700",
      padding: "4px 8px",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "background-color 0.2s ease, color 0.2s ease",
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      height: "20px",
    },

    speedDropdown: {
      position: "absolute",
      top: "calc(100% + 6px)",
      right: 0,
      backgroundColor: "rgba(50, 50, 50, 0.9)",
      borderRadius: "6px",
      padding: "4px 0",
      minWidth: "60px",
      zIndex: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      listStyle: "none",
      margin: 0,
    },

    speedOption: {
      color: "#FFFFFF",
      fontSize: "12px",
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "600",
      padding: "6px 10px",
      cursor: "pointer",
      borderRadius: "3px",
      transition: "background-color 0.15s ease",
      textAlign: "center",
    },
  };
};
