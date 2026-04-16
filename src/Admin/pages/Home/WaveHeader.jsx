import React from "react";

const WaveHeader = ({ height = 200 }) => {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 320"
        style={{ display: "block" }}
        width="100%"
        height={height}
        preserveAspectRatio="none"
      >
        <path
          fill="#0b2a4a"
          d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0L1320,0L1200,0L1080,0L960,0L840,0L720,0L600,0L480,0L360,0L240,0L120,0L60,0L0,0Z"
        />
        <path
          fill="#1e5fa3"
          opacity="0.8"
          d="M0,140L60,145.3C120,149,240,160,360,154.7C480,149,600,128,720,122.7C840,117,960,128,1080,149.3C1200,171,1320,203,1380,218.7L1440,224L1440,0L0,0Z"
        />
        <path
          fill="#4fc3f7"
          opacity="0.6"
          d="M0,120L60,117.3C120,115,240,107,360,101.3C480,96,600,96,720,106.7C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,0L0,0Z"
        />
      </svg>
    </div>
  );
};

export default WaveHeader;
