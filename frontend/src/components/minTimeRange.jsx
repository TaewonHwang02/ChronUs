import React, { useEffect, useState, useRef } from "react";

const TimeSlider = ({
  max = 360, // Max value in minutes
  step = 15, // Interval step in minutes
  trackColor = "#cecece",
  sliderColor = "#FFBA08",
  defaultValue = 180, // Default time in minutes (e.g., 180 = 3 hours)
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef(null);

  const getPercent = (val) => Math.round((val / max) * 100);

  // Update slider fill width
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.width = `${getPercent(value)}%`;
    }
  }, [value, max]);

  // Notify of the change
  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const handleChange = (e) => {
    const rawValue = Number(e.target.value);
    const snappedValue = Math.round(rawValue / step) * step; 
    setValue(snappedValue);
  };

  return (
    <div className="relative w-full h-[100px] bg-white rounded-md">
      <div className="absolute top-0 w-5/6 h-full left-1/2 -translate-x-1/2">
        {/* Title */}
        <div className="absolute py-0 top-0 w-full text-center font-poppins text-[30px] text-[#0B1354]">
          {`${Math.floor(value / 60)} hrs ${value % 60} mins`}
        </div>

        <div className="py-6">
          <div className="relative mt-9 h-[9px]">
            <div
              className="absolute h-full w-full rounded-md z-[1]"
              style={{ backgroundColor: trackColor }}
            />
            <div
              ref={sliderRef}
              className="absolute h-full rounded-md z-[2]"
              style={{ backgroundColor: sliderColor }}
            />
            <div className="absolute bottom-0 w-full h-0 text-[#A3A3A3] text-[16px] font-poppins">
              <span className="absolute left-0">0 Mins</span>
              <span className="absolute left-1/2 -translate-x-1/2">3Hrs</span>
              <span className="absolute right-0">6Hrs</span>
            </div>
            {/* Thumb */}
            <input
              type="range"
              min={0}
              max={max}
              value={value}
              step={step}
              onChange={handleChange}
              className="absolute appearance-none w-full h-7 z-[3] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <style>
        {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
          }

          input[type="range"]::-webkit-slider-runnable-track {
            background: transparent;
          }
          input[type="range"]::-moz-range-track {
            background: transparent;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            background: white;
            border: 2px solid #FFBA08;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            transform: translateY(-50%);
            cursor: grab;
            position: relative;
            z-index: 10;
          }

          input[type="range"]::-moz-range-thumb {
            background: white;
            border: 2px solid #FFBA08;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            margin-top: -6px;
            cursor: grab;
            position: relative;
            z-index: 10;
          }
        `}
      </style>
    </div>
  );
};

export default TimeSlider;
