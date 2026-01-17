import React from "react";
import { motion } from "framer-motion";

const PRIZES = ["-5%", "-10%", "-20%", "-50%", "-5%", "-10%", "-20%", "-50%"];
const COLORS = [
  "#111111",
  "#1a1a1a",
  "#111111",
  "#1a1a1a",
  "#111111",
  "#1a1a1a",
  "#111111",
  "#1a1a1a",
];

const Wheel = ({ mustSpin, targetAngle, onFinished }) => {
  const segmentAngle = 360 / PRIZES.length;

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[800px] max-h-[800px]">
      <div
        className="absolute top-[-10px] z-20 w-0 h-0 
        border-l-[25px] border-l-transparent 
        border-r-[25px] border-r-transparent 
        border-t-[50px] border-t-red-600 drop-shadow-lg"
      />

      <motion.div
        className="w-full h-full"
        initial={{ rotate: 0 }}
        animate={mustSpin ? { rotate: 360 * 5 + targetAngle } : {}}
        transition={{
          duration: 5,
          ease: [0.15, 0, 0.15, 1],
        }}
        onAnimationComplete={onFinished}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full rounded-full border-[6px] border-black shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          {PRIZES.map((label, i) => {
            const startAngle = i * segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;

            const x1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
            const y1 = 50 - 50 * Math.cos((startAngle * Math.PI) / 180);
            const x2 =
              50 + 50 * Math.sin(((startAngle + segmentAngle) * Math.PI) / 180);
            const y2 =
              50 - 50 * Math.cos(((startAngle + segmentAngle) * Math.PI) / 180);

            return (
              <g key={i}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={COLORS[i]}
                  stroke="#333"
                  strokeWidth="0.2"
                />

                <text
                  x="50"
                  y="12"
                  fill="white"
                  fontSize="4.5"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle} 50 50)`}
                  style={{ userSelect: "none", letterSpacing: "-0.02em" }}
                >
                  {label}
                </text>
              </g>
            );
          })}

          <circle cx="50" cy="50" r="6" fill="#000" />
          <circle cx="50" cy="50" r="3" fill="#fff" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default Wheel;
