import React, { useEffect, useState, useRef, useMemo } from "react";
import { addMinutes, startOfWeek, addDays, format } from "date-fns";
import {ChevronLeft, ChevronRight, RotateCcw, Check} from 'lucide-react'

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function parseHourMinute(s) {
  const [hour, minute] = s.split(":").map(Number);
  return { hour, minute };
}


function overlapStyle(count, maxCount) {
  if (!count || maxCount <= 0) {
    return { backgroundColor: "white" };
  }

  const t = count / maxCount; 
  const minL = 90;
  const maxL = 55;
  const lightness = minL - (minL - maxL) * t;

  return {
    backgroundColor: `hsl(45 100% ${lightness}%)`,
  };
}

const TimeSelector = ({
  meeting,
  groupSlots = [],
  groupCounts: groupCountsProp = null,
  initialSelected = [],
  onChange,
  onSubmit,
}) => {
  const {
    id: meetingId,
    title = "Select your availabilities",
    timezone = "America/Montreal",
    slotMinutes = 30,
    dayStart = "09:00",
    dayEnd = "21:00",
    startDate,
    endDate,
  } = meeting || {};

  // --- Week navigation ---
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const earliestDay = startDate ? new Date(startDate) : null;
  const latestDay = endDate ? new Date(endDate) : null;

  // --- Base group counts from backend ---
  const baseGroupCounts = useMemo(() => {
    if (groupCountsProp) return groupCountsProp;

    const counts = {};
    for (const iso of groupSlots) {
      counts[iso] = (counts[iso] || 0) + 1;
    }
    return counts;
  }, [groupCountsProp, groupSlots]);

  // --- Optimistic extra counts (delta from last submitted selection) ---
  const [extraCounts, setExtraCounts] = useState({});

  const groupCounts = useMemo(() => {
    const merged = { ...baseGroupCounts };
    for (const [iso, extra] of Object.entries(extraCounts)) {
      const value = (merged[iso] || 0) + extra;
      if (value > 0) merged[iso] = value;
      else delete merged[iso];
    }
    return merged;
  }, [baseGroupCounts, extraCounts]);

  const maxGroupCount = useMemo(() => {
    const values = Object.values(groupCounts);
    return values.length ? Math.max(...values) : 0;
  }, [groupCounts]);

  // --- Right-grid selection state ---
  const [selected, setSelected] = useState(() => new Set(initialSelected));

  useEffect(() => {
    onChange?.(Array.from(selected));
  }, [selected, onChange]);

  // Track last submitted selection so we can compute deltas
  const lastSubmittedRef = useRef(new Set(initialSelected));

  // --- Drag state ---
  const dragging = useRef(false);
  const dragMode = useRef(null); // "add" | "remove"

  useEffect(() => {
    const endDrag = () => {
      dragging.current = false;
      dragMode.current = null;
    };
    window.addEventListener("mouseup", endDrag);
    return () => window.removeEventListener("mouseup", endDrag);
  }, []);

  // --- Generate days + slots ---
  const { days, slots } = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const { hour: sH, minute: sM } = parseHourMinute(dayStart);
    const { hour: eH, minute: eM } = parseHourMinute(dayEnd);

    const slots = days.map((d) => {
      const start = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        sH,
        sM,
        0,
        0
      );
      const end = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        eH,
        eM,
        0,
        0
      );

      const list = [];
      for (let t = start; t < end; t = addMinutes(t, slotMinutes)) {
        list.push(new Date(t));
      }
      return list;
    });

    return { days, slots };
  }, [weekStart, dayStart, dayEnd, slotMinutes]);

  const timeColumn = slots[0] || [];

  // --- Week navigation guards ---
  const viewPreviousWeek =
    !earliestDay ||
    addDays(weekStart, 7) >= startOfWeek(earliestDay, { weekStartsOn: 0 });

  const viewNextWeek =
    !latestDay ||
    addDays(weekStart, 7) <=
      startOfWeek(addDays(latestDay, 7), { weekStartsOn: 0 });

  // --- Selection handlers ---
  const toggleSlot = (dateObject, force) => {
    const k = dateObject.toISOString();
    setSelected((prev) => {
      const next = new Set(prev);
      const has = next.has(k);
      const shouldAdd = force !== undefined ? force : !has;
      if (shouldAdd) next.add(k);
      else next.delete(k);
      return next;
    });
  };

  const onCellDown = (dateObject) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const iso = dateObject.toISOString();
    const isOn = selected.has(iso);
    dragMode.current = isOn ? "remove" : "add";
    dragging.current = true;
    toggleSlot(dateObject, dragMode.current === "add");
  };

  const onCellEnter = (dateObject) => (e) => {
    if (!dragging.current || !dragMode.current) return;
    e.preventDefault();
    toggleSlot(dateObject, dragMode.current === "add");
  };

  // --- Date range label ---
  const dateRange = `${format(weekStart, "MMMM d")} - ${format(
    addDays(weekStart, 6),
    "MMMM d"
  )}`;

  // --- Submit handler with optimistic delta ---
  const handleSubmitClick = () => {
    const payload = {
      meetingId,
      timezone,
      slots: Array.from(selected),
    };
    onSubmit?.(payload);

    const prevSubmitted = lastSubmittedRef.current;
    const current = new Set(selected);

    const toAdd = [];
    const toRemove = [];

    for (const iso of current) {
      if (!prevSubmitted.has(iso)) toAdd.push(iso);
    }
    for (const iso of prevSubmitted) {
      if (!current.has(iso)) toRemove.push(iso);
    }

    setExtraCounts((prev) => {
      const next = { ...prev };

      for (const iso of toAdd) {
        next[iso] = (next[iso] || 0) + 1;
      }
      for (const iso of toRemove) {
        next[iso] = (next[iso] || 0) - 1;
        if (next[iso] === 0) delete next[iso];
      }

      return next;
    });

    lastSubmittedRef.current = current;
  };


  // Clear current selection
  const handleResetClick = () => {
    setSelected(new Set());
    setExtraCounts({});
    lastSubmittedRef.current = new Set();


  }

  return (
    <div className="w-full flex flex-col items-center select-none -mt-12">
    {/* Title & date */}
    <h1 className="text-2xl font-poppins  text-white mb-4">
      {"Select your availabilities"}
    </h1>
    

    {/* Week navigation */}
    <div className="flex items-center justify-center gap-6 mb-3">
      <button
        onClick={() =>
          viewPreviousWeek && setWeekStart(addDays(weekStart, -7))
        }
        className={`w-10 h-10 border-2 rounded-md flex items-center justify-center ${
          viewPreviousWeek
            ? "!border-none text-white"
            : "border-white/40 text-white/40 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={40} />
      </button>

    <h2 className="text-bold text-2xl font-poppins text-white ">
      {dateRange}
    </h2>


      <button
        onClick={() => viewNextWeek && setWeekStart(addDays(weekStart, 7))}
        className={`w-10 h-10 border-2 rounded-md flex items-center justify-center ${
          viewNextWeek
            ? "!border-none text-white"
            : "border-white/40 text-white/40 cursor-not-allowed"
        }`}
      >
        <ChevronRight size={40} />
      </button>
    </div>

      {/* Two grids */}
      <div className="flex w-[60%] justify-between gap-6 mt-4" >
        {/* LEFT GRID: group overlap */}
        <div className="w-1/2">
          <div className="bg-white border border-black rounded-xl shadow-md overflow-hidden pl-1 pr-4 pb-4">
            {/* Header */}
            <div className="flex w-full text-xs font-poppins bg-white">
          
              <div className="w-10 border border-black" />

              {/* Day headers */}
              {days.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 border border-black py-2 text-center text-[11px]"
                >
                  {daysOfWeek[i]}
                </div>
              ))}
            </div>

            {/* Time rows */}
            {timeColumn.map((time, rowIdx) => (
              <div
                key={rowIdx}
                className="flex bg-white"
              >
                {/* time label */}
                <div
                  className="font-poppins w-10 h-6 text-[10px] text-gray-500 flex items-center justify-center"
                 
                >
                  {format(time, "h:mm")}
                </div>

                {/* 7 day cells */}
                {days.map((_, dayIdx) => {
                  const cellTime = slots[dayIdx][rowIdx];
                  const iso = cellTime.toISOString();
                  const count = groupCounts[iso] || 0;
                  const style = overlapStyle(count, maxGroupCount);

                  return (
                    <div
                      key={dayIdx}
                      className="flex-1 h-6"
                      style={{
                        border: "1px solid #000",  // force visible border
                        ...style,                  // keep your yellow overlap coloring
                      }}
                    />
                  );
                })}
              </div>
            ))}

          </div>
        </div>

       {/* RIGHT GRID: this user's selection */}
        <div className="w-1/2 flex flex-col items-center">
          {/* Grid card */}
          <div className="w-full bg-white border border-black rounded-xl shadow-md overflow-hidden pl-1 pr-4 pb-4">
            {/* Header */}
            <div className="flex w-full text-xs font-poppins bg-white">
          
              <div className="w-10 border border-black" />

              {/* Day headers */}
              {days.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 border border-black py-2 text-center text-[11px]"
                >
                  {daysOfWeek[i]}
                </div>
              ))}
            </div>


         
            {/* Time rows */}
            {timeColumn.map((time, rowIdx) => (
              <div
                key={rowIdx}
                className="flex bg-white"
              >
                {/* time label */}
                <div
                  className="w-10 h-6 text-[10px] font-poppins text-gray-500 flex items-center justify-center"
                 
                >
                  {format(time, "h:mm")}
                </div>

                {/* 7 day cells */}
                {days.map((_, dayIdx) => {
                const cellTime = slots[dayIdx][rowIdx];
                const iso = cellTime.toISOString();
                const isSelected = selected.has(iso);

                return (
                  <div
                    key={dayIdx}
                    className="flex-1 h-6 cursor-pointer"
                    onMouseDown={onCellDown(cellTime)}
                    onMouseEnter={onCellEnter(cellTime)}
                    style={{
                      border: "1px solid #000",
                      backgroundColor: isSelected ? "#FFBA08" : "white",
                    }}
                  />
                );
              })}

              </div>
            ))}
          </div>

          {/* Footer: reset + submit, like your mock */}
          <div className="-mt-4 flex items-center gap-4 w-full justify-center">
            {/* reset circle */}
            <button
              onClick={handleResetClick}
              className="w-12 h-12 rounded-full bg-[#3B7AAF] text-white flex items-center justify-center shadow-md !border-none"
              aria-label="Reset"
            >
              <RotateCcw size={22} />
            </button>

            {/* big yellow submit pill */}
            <button
              onClick={handleSubmitClick}
              className="flex items-center justify-center gap-2 px-8 py-2 rounded-full bg-[#FFBA08] border-0 hover:bg-[#E3A23A] text-white text-lg font-semibold font-poppins shadow-md !border-none"
            >
              Submit
              <Check size={22} />
            </button>
          </div>
        </div>

      </div>

      
    </div>
  );
};

export default TimeSelector;
