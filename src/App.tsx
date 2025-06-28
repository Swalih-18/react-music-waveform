import React from "react";
import AudioWaveform from "./components/Audiowaveform/Audiowaveform";

const App: React.FC = () => {
  return (
    <div className="centered-container">
      //sample usage of AudioWaveform component
      <AudioWaveform
        src="src\assets\takitaki.mp3"
        style="aurevia"
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
