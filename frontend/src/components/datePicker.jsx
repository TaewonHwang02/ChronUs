import React, {useState} from 'react';
import { addDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DateSelector = ({ onChange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    }
  ]);

  const handleDateChange = (item) => {
    setState([item.selection]);
    onChange && onChange(item.selection);
  };

  return (
    <div className="w-5/6 bg-white rounded-md p-4 flex items-center justify-center">
      <div className="transform object-scale-down origin-top">
        <DateRange
          editableDateInputs={true}
          onChange={handleDateChange}
          moveRangeOnFirstSelection={false}
          ranges={state}
          months={1}
          minDate={addDays(new Date(), -300)}
          maxDate={addDays(new Date(), 900)}
          direction="vertical"
          scroll={{ enabled: true }}
        />
      </div>
    </div>
  );
};

export default DateSelector;
