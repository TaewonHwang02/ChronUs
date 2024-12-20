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
    <div className="date-selector-container font-poppins w-full rounded-md p-2  flex items-center justify-center ">
      <div className="date-range-wrapper flex justify-center rounded-md  items-center w-full h-full ">
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
          className="daterange-component"
        />
      </div>
    <style>
      {`
      .date-selector-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .date-range-wrapper {
        transform: scale(1); 
        transform-origin: top left; 
        transition: transform 0.3s ease-in-out;
      }

      @media (max-width: 768px) {
        .date-range-wrapper {
          transform: scale(1); 
          transition: transform 0.3s ease-in-out;
        }
      }

      @media (max-width: 430px) {
        .date-range-wrapper {
          transform: scale(0.8); 
          transform-origin: top center; 
          transition: transform 0.3s ease-in-out;
        }
      }

      `}
    </style>
    </div>
    
  );
};


export default DateSelector;
