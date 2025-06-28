import React from "react";
import AudioWaveform from "./components/Audiowaveform/Audiowaveform";

const App: React.FC = () => {
  return (
     // Example usage of AudioWaveform component
    <div className="centered-container">
      <AudioWaveform
        src="src\assets\taki taki.mp3"
        style="viridara"
        theme="dark"
        height={50}
        width={200}
        showControls={true}
        showTimestamp={true}
        showSpeedControl={true}
        showBackground={true}
      />
    </div>
  );
};

export default App;
