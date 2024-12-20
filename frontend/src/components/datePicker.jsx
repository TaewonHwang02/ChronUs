import React, {useState} from 'react';
import { addDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const DateSelector = ({ onChange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: 'selection',
    }
  ]);

  const handleDateChange = (item) => {
    const newSelection = item.selection;
    setState([newSelection]);
    onChange && onChange(newSelection);
  };

  return (
    <div className="relative w-5/6 h-1/2 bg-white rounded-md p-2 font-poppins flex items-center justify-center overflow-hidden">
      <div className="flex justify-center items-center w-full h-full">
      <DateRange
          editableDateInputs={true}
          onChange={handleDateChange}
          moveRangeOnFirstSelection={false}
          ranges={state}
          months={1}
          minDate={addDays(new Date(), -300)}
          maxDate={addDays(new Date(), 900)}
          direction="vertical"
          scroll={{ enabled: false }}
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default DateSelector;
