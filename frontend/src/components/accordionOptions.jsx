import React, { useState } from 'react';

const Accordion = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="accordion w-full ">
      <div
        className="accordion-item cursor-pointer flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-white rounded-md"
        onClick={() => setIsActive(!isActive)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-xl font-bold"></span>
      </div>
      {isActive && (
        <div className="accordion-content px-3 py-3 bg-white ">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
