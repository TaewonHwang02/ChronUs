import React, { useCallback, useEffect, useState, useRef } from "react";

const TimeRangePicker = ({
  min = 8,
  max = 22,
  trackColor = "#cecece",
  rangeColor = "#FFBA08",
  defaultMin = 9,
  defaultMax = 17,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);
  const minValRef = useRef(defaultMin);
  const maxValRef = useRef(defaultMax);
  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    if (minVal !== minValRef.current || maxVal !== maxValRef.current) {
      onChange && onChange({ min: minVal, max: maxVal });
      minValRef.current = minVal;
      maxValRef.current = maxVal;
    }
  }, [minVal, maxVal, onChange]);

  return (
    <div className="relative top-3 w-full h-[160px] bg-white rounded-md">
      <div className="absolute top-5 w-5/6 h-full left-1/2 -translate-x-1/2">
        <div className="absolute top-0 w-[240px] left-1/3 font-poppins text-[30px] text-[#0B1354]">
          {`${minVal > 12 ? minVal - 12 : minVal} ${
            minVal < 12 ? "AM" : "PM"
          } to ${maxVal > 12 ? maxVal - 12 : maxVal} ${
            maxVal >= 12 ? "PM" : "AM"
          }`}
        </div>
        <div className="absolute bottom-7 w-full h-[40px] text-[#A3A3A3] text-[16px] font-poppins">
          <span className="absolute left-0">8 AM</span>
          <span className="absolute left-1/2 -translate-x-1/2">3 PM</span>
          <span className="absolute right-0">10 PM</span>
        </div>

        {/* Slider Container */}
        <div className="relative mt-[74px] h-[9px]">
          {/* Gray track */}
          <div
            className="absolute h-full w-full z-[1]"
            style={{ backgroundColor: trackColor, pointerEvents: 'none' }}
          />
          {/* Yellow range */}
          <div
            ref={range}
            className="absolute h-full z-[2]"
            style={{ backgroundColor: rangeColor, pointerEvents: 'none' }}
          />

          {/* Right thumb input first */}
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + 1))}
            className="absolute appearance-none w-full h-7 z-[3] "
          />
          {/* Left thumb input second */}
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - 1))}
            className="relative appearance-none w-full h-2 z-[4] "
          />
        </div>
      </div>

      <style>
        {`
          input[type="range"] {
            pointer-events: none;
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

          /* Thumbs */
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            background: white;
            pointer-events: auto; /* Re-enable clicks only on the thumb */
            cursor: grab;
            border: 2px solid #FFBA08;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            transform: translateY(-50%);
            position: relative;
            z-index: 10;
          }

          input[type="range"]::-moz-range-thumb {
            background: white;
            pointer-events: auto; /* Re-enable clicks only on the thumb */
            cursor: grab;
            border: 2px solid #FFBA08;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            margin-top: -6px;
            position: relative;
            z-index: 10;
          }

        `}
      </style>
    </div>
  );
};

export default TimeRangePicker;
