// Component brought from utility library date-fns

import React, { useState } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Default date set to present date and end date to 3 days from today
const DateSelector = ({ onChange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: "selection",
    },
  ]);

  // Notifying parent
  const handleDateChange = (item) => {
    const newSelection = item.selection;
    setState([newSelection]);
    onChange && onChange(newSelection);
  };

  // Structure of component, simple date picker
  return (
    <div className=" date-selector-container font-poppins w-full rounded-md p-2  flex items-center justify-center ">
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
      {/* Resizing of the component */}
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
          transform-origin: center; 
          height: 300px;
          transition: transform 0.3s ease-in-out;
          display: flex;
          justify-content: center;
        }
      }


        .daterange-component .rdrCalendarWrapper {
          height: auto !important;
          max-height: none !important;
        }

        .daterange-component, .rdrDateDisplayWrapper {
          background-color: var(--secondary);
          color: var(--letter-secondary);
          padding-top: 2px;
          border-radius: 18px;
          border: !none;
        }


        /* Calendar cells */
        .daterange-component .rdrDay {
          background-color: transparent;
          color: "var(--letter-primary)";
          border: none !important;
          box-shadow: none !important;
        }

        .daterange-component .rdrInRange,
        .daterange-component .rdrStartEdge,
        .daterange-component .rdrEndEdge{
          background-color: var(--tertiary);
          opacity: 0.7;
        }
    
        .rdrDateDisplayWrapper, 
        .rdrDateDisplay .rdrDateInput{
        background-color: var(--secondary);
        }

        .daterange-component .rdrDateDisplay .rdrDateDisplayItemActive{
          border-color: var(--letter-secondary);
        }

        .daterange-component .rdrDayPassive .rdrDayNumber span {
          color: var(--letter-secondary) !important;
          opacity: 0.3;
        }

        .daterange-component .rdrMonthAndYearWrapper .rdrMonthAndYearPickers select
        {
          color: var(--letter-secondary) !important;
          opacity: 0.5;
          background-color: transparent;
        }

        .daterange-component .rdrMonthAndYearWrapper button,
        .daterange-component .rdrMonthAndYearWrapper
        {
          background-color: transparent;
          border: none !important;
          padding-top: 0px
        }
          
        

      `}
      </style>
    </div>
  );
};

export default DateSelector;
