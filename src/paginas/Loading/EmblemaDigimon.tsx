import React from "react";

interface Props {
  size?: number;
  rotate?: boolean;
}
// para mas adelante 🔥🔥🔥🔥
const Loading: React.FC<Props> = ({ size = 200, rotate = true }) => {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: "drop-shadow(0 0 12px rgba(0,150,255,0.7))",
        animation: rotate ? "spin 2s linear infinite" : "none",
      }}
    >
      <defs>
        {/* Glow */}
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Contorno exterior */}
      <path
        d="M 100 200 Q 250 60 400 60 Q 550 60 700 200 Q 550 340 400 340 Q 250 340 100 200 Z"
        fill="rgba(0,160,255,0.25)"
        stroke="white"
        strokeWidth="18"
        filter="url(#glow)"
      />

      {/* Llama izquierda */}
      <path
        d="M 350 120 C 290 180 300 240 350 300"
        fill="none"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Llama derecha */}
      <path
        d="M 450 120 C 510 180 500 240 450 300"
        fill="none"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Contorno grande circular */}
      <circle
        cx="400"
        cy="200"
        r="150"
        fill="none"
        stroke="white"
        strokeWidth="18"
        filter="url(#glow)"
      />

      {/* Ala izquierda */}
      <path
        d="M 100 200 Q 200 250 300 200"
        fill="none"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Ala derecha */}
      <path
        d="M 500 200 Q 600 250 700 200"
        fill="none"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
};

export default Loading;
