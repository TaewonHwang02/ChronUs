import React, { useCallback, useEffect, useState, useRef } from "react";


const TimeRangePicker = ({
  min = 8,
  max = 22,
  zIndex = 1,
  trackColor = "#cecece",
  rangeColor = "#FFBA08",
  defaultMin = 9, // Default starting hour
  defaultMax = 17, // Default ending hour
  width = "500px",
  onChange,
}) => {
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);
  const minValRef = useRef(defaultMin);
  const maxValRef = useRef(defaultMax);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update range width and position
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

  // Handle value change
  useEffect(() => {
    if (minVal !== minValRef.current || maxVal !== maxValRef.current) {
      onChange && onChange({ min: minVal, max: maxVal });
      minValRef.current = minVal;
      maxValRef.current = maxVal;
    }
  }, [minVal, maxVal, onChange]);

  return (
    <div className="relative top-3 w-full h-[160px] bg-white rounded-md" >
      
      <div className="absolute top-5 w-5/6 h-full left-1/2 -translate-x-1/2">
        {/* Title */}
        <div className="absolute top-0 w-[240px] left-1/3 font-poppins text-[30px] text-[#0B1354]">
          {`${minVal > 12 ? minVal - 12 : minVal} ${
            minVal < 12 ? "AM" : "PM"
          } to ${maxVal > 12 ? maxVal - 12 : maxVal} ${maxVal >= 12 ? "PM" : "AM"}`}
        </div>
        {/* Time Labels */}
        <div className="absolute bottom-7 w-full h-[40px] text-[#A3A3A3] text-[16px] font-poppins">
          <span className="absolute left-0">8 AM</span>
          <span className="absolute left-1/2 -translate-x-1/2">3 PM</span>
          <span className="absolute right-0">10 PM</span>
        </div>

        {/* Slider Container */}
        <div className="relative mt-[74px] h-[9px]">
          {/* Track */}
          <div
            className="absolute h-full w-full"
            style={{ backgroundColor: trackColor }}
          />
          {/* Range */}
          <div
            ref={range}
            className="absolute h-full"
            style={{ backgroundColor: rangeColor }}
          />
          {/* Left Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(event) =>
              setMinVal(Math.min(Number(event.target.value), maxVal - 1))
            }
            className="absolute appearance-none w-full h-[10px] bg-transparent pointer-events-auto"
            style={{
              zIndex: minVal > max - 10 ? 5 : undefined,
            }}
          />
          {/* Right Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(event) =>
              setMaxVal(Math.max(Number(event.target.value), minVal + 1))
            }
            className="absolute appearance-none w-full h-[10px] bg-transparent pointer-events-auto"
            style={{
              zIndex: maxVal < min + 10 ? 5 : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeRangePicker;
