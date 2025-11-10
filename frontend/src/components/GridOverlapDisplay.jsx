import React, { useMemo } from "react";

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function generateTimeIncrements(startMinutes, endMinutes, step = 30) {
  const increments = [];
  for (let m = startMinutes; m < endMinutes; m += step) {
    increments.push(m);
  }
  return increments;
}

function getColorForCount(count) {
  if (count === 0) return "#ffffff"; // No overlap, display as white (empty)
  if (count === 1) return "#b3d9ff"; // Light blue
  if (count === 2) return "#66b3ff"; // Medium blue
  if (count === 3) return "#3399ff"; // Darker blue for 3 overlaps
  if (count === 4) return "#0073e6"; // Even darker blue for 4 overlaps
  return "#005bb5"; // Darkest blue for 5 or more overlaps
}

function formatDateMMDD(dateStr) {
  const date = new Date(dateStr);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}`; // Format as MM.DD
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

const GridOverlapDisplay = ({
  startDate,
  endDate,
  startTime,
  endTime,
  timeSlots,
  timeUnit = 30,
}) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Generate time increments (rows)
  const increments = generateTimeIncrements(startMinutes, endMinutes, timeUnit);

  // Create an array of all days between startDate and endDate
  const dateRange = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Initialize the grid with empty counts (0)
  const dayData = dateRange.map((date, dayIndex) => ({
    day: dayIndex,
    date: date,
    counts: Array(increments.length).fill(0), // Initialize with 0 counts
  }));

  // Group time slots by day
  const slotsByDay = useMemo(() => {
    const map = new Map();
    for (const slot of timeSlots) {
      if (!map.has(slot.day)) {
        map.set(slot.day, []);
      }
      map.get(slot.day).push(slot);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [timeSlots]);

  // Update grid with overlapping counts
  slotsByDay.forEach(([day, slots]) => {
    const dayIndex = dayData.findIndex((d) => d.day === day);
    slots.forEach((slot) => {
      const slotStart = timeToMinutes(slot.minTime);
      const slotEnd = timeToMinutes(slot.maxTime);
      increments.forEach((inc, idx) => {
        const incEnd = inc + timeUnit;
        if (slotStart < incEnd && slotEnd > inc) {
          dayData[dayIndex].counts[idx] += 1; // Increment count for overlapping time slot
        }
      });
    });
  });

  const cellStyle = {
    borderBottom: "1px dotted #ccc",
    borderRight: "1px solid #ccc",
    textAlign: "center",
    fontSize: "0.75em",
    height: "21px", // fixed height
    lineHeight: "15px", // ensure vertical centering
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto repeat(${dateRange.length}, 1fr)`,
        border: "1px solid #ccc",
        fontFamily: "sans-serif",
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      {/* Top-left corner cell (empty) */}
      <div
        style={{
          ...cellStyle,
          borderBottom: "1px solid #ccc",
          borderRight: "1px solid #ccc",
          lineHeight: "normal",
          height: "auto",
        }}
      ></div>

      {/* Date headers */}
      {dateRange.map((date, idx) => (
        <div
          key={date}
          style={{
            ...cellStyle,
            borderBottom: "1px solid #ccc",
            borderRight:
              idx === dateRange.length - 1 ? "none" : "1px solid #ccc",
            fontWeight: "bold",
            height: "auto",
            lineHeight: "normal",
            padding: "5px 0",
          }}
        >
          {formatDateMMDD(date.toISOString())}
        </div>
      ))}

      {/* Time rows (every 30 minutes) */}
      {increments.map((inc, rowIdx) => {
        const minutes = inc % 60;
        const label = minutes === 0 ? formatTime(inc) : "";

        return (
          <React.Fragment key={inc}>
            {/* Time label cell */}
            <div
              style={{
                ...cellStyle,
                borderRight: "1px solid #ccc",
                textAlign: "right",
                color: "#ccc",
                fontWeight: "bold",
                padding: "0 5px",
              }}
            >
              {label}
            </div>

            {/* One cell per day for this increment */}
            {dayData.map(({ day, counts }, colIdx) => {
              const count = counts[rowIdx];
              const backgroundClass = "bg-secondary";

              return (
                <div
                  key={`${day}-${inc}`}
                  className={`${backgroundClass} ${
                    count > 1 ? "text-white" : "text-black"
                  }`}
                  style={{
                    ...cellStyle,
                    borderRight:
                      colIdx === dayData.length - 1 ? "none" : "1px solid #ccc",
                  }}
                ></div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GridOverlapDisplay;
