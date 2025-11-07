// Dana Lee 261054107

import React, { useEffect, useState, useRef } from "react";

const TimeSlider = ({
  // Max 6 hours
  max = 360,
  step = 15, // Increments 15 at a time
  trackColor = "#cecece",
  sliderColor = "#FFBA08",
  defaultValue = 180, // I set default as 3 hours
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

  // Notify of the change to parent
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
    <div className="relative w-full h-[100px] bg-secondary rounded-md">
      <div className="absolute top-0 w-5/6 h-full left-1/2 -translate-x-1/2">
        <div className="absolute py-0 top-0 w-full text-center font-poppins text-2xl text-secondary_letter">
          {`${Math.floor(value / 60)} hrs ${value % 60} mins`}
        </div>

        <div className="py-4">
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
            {/* Subtext at beg half and end */}
            <div className="absolute bottom-0 w-full h-0 text-[#A3A3A3] text-xs font-poppins">
              <span className="absolute left-0">0 Mins</span>
              <span className="absolute left-1/2 -translate-x-1/2">3Hrs</span>
              <span className="absolute right-0">6Hrs</span>
            </div>
            {/* Knub to move the slider */}
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
