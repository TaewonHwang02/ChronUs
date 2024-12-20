import React, { useMemo } from 'react';

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
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
  if (count === 0) return '#ffffff'; // no overlap
  if (count === 1) return '#b3d9ff'; // light blue
  if (count === 2) return '#66b3ff'; // medium blue
  return '#1a8cff'; // dark blue for 3 or more overlaps
}

function convertToDate(yyyymmdd) {
  const year = parseInt(yyyymmdd.slice(0,4),10);
  const month = parseInt(yyyymmdd.slice(4,6),10) - 1;
  const day = parseInt(yyyymmdd.slice(6,8),10);
  return new Date(year, month, day);
}

function formatDateMMDD(dateStr) {
  const date = convertToDate(dateStr);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}.${dd}`;
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * GridOverlapDisplay
 * Shows increments at every 30 minutes.
 * Hour increments (xx:00) have a label, half-hour increments (xx:30) do not.
 * Both hour and half-hour rows have the same fixed height and line-height for consistency.
 */
const GridOverlapDisplay = ({ timeSlots = [], timeUnit = 30 }) => {
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

  const globalMin = Math.min(...timeSlots.map(s => timeToMinutes(s.minTime)));
  const globalMax = Math.max(...timeSlots.map(s => timeToMinutes(s.maxTime)));

  const increments = generateTimeIncrements(globalMin, globalMax, timeUnit);

  const dayData = slotsByDay.map(([day, slots]) => {
    return {
      day,
      date: slots[0]?.date,
      counts: increments.map((inc) => {
        const incEnd = inc + timeUnit;
        const count = slots.filter(s => {
          const slotStart = timeToMinutes(s.minTime);
          const slotEnd = timeToMinutes(s.maxTime);
          return slotStart < incEnd && slotEnd > inc;
        }).length;
        return count;
      })
    };
  });

  const cellStyle = {
    borderBottom: '1px dotted #ccc',
    borderRight: '1px solid #ccc',
    textAlign: 'center',

    fontSize: '0.75em',
    height: '21px',         // fixed height
    lineHeight: '15px',     // ensure vertical centering
    whiteSpace: 'nowrap'
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `auto repeat(${dayData.length}, 1fr)`,
        border: '1px solid #ccc',
        fontFamily: 'sans-serif',
        maxWidth: '100%',
        overflow: 'auto'
      }}
    >
      {/* Top-left corner cell (empty) */}
      <div style={{ ...cellStyle, borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', lineHeight: 'normal', height: 'auto' }}></div>

      {/* Date headers */}
      {dayData.map(({day, date}, idx) => (
        <div
          key={day}
          style={{
            ...cellStyle,
            borderBottom: '1px solid #ccc',
            borderRight: idx === dayData.length - 1 ? 'none' : '1px solid #ccc',
            fontWeight: 'bold',
            height: 'auto',
            lineHeight: 'normal',
            padding: '5px 0'
          }}
        >
          {date ? formatDateMMDD(date) : ''}
        </div>
      ))}

      {/* Time rows (every 30 minutes) */}
      {increments.map((inc, rowIdx) => {
        const minutes = inc % 60;
        // Label only if it's on the hour
        const label = (minutes === 0) ? formatTime(inc) : '';

        return (
          <React.Fragment key={inc}>
            {/* Time label cell */}
            <div
              style={{
                ...cellStyle,
                borderRight: '1px solid #ccc',
                textAlign: 'right',
                color: '#555',
                fontWeight: 'bold',
                padding: '0 5px',
              }}
            >
              {label}
            </div>

            {/* One cell per day for this increment */}
            {dayData.map(({ day, counts }, colIdx) => {
              const count = counts[rowIdx];
              const background = getColorForCount(count);
              return (
                <div
                  key={`${day}-${inc}`}
                  style={{
                    ...cellStyle,
                    borderRight: colIdx === dayData.length - 1 ? 'none' : '1px solid #ccc',
                    background,
                    color: count > 1 ? '#fff' : '#000'
                  }}
                >
                  {count > 0 ? count : ''}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GridOverlapDisplay;
