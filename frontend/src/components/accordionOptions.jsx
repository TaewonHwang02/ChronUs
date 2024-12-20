import React from 'react';

const Accordion = ({ title, subtext, children, imageSrc, isActive, onToggle }) => {
  return (
    <div
      className={`accordion w-full rounded-md transition-all duration-300 ease-in-out ${
        isActive ? 'bg-white border-l-4 border-yellow-500' : 'bg-gray-100'
      }`}
    >
      <div
        className="accordion-item cursor-pointer flex items-center space-x-4 ph:px-10 px-4 ph:py-3 py-2 rounded-md"
        onClick={onToggle}
      >
        {/* Image */}
        <img
          src={imageSrc}
          alt={`${title} image`}
          className="w-15 h-16 object-cover"
        />
        {/* Title and Subtext */}
        <div className="flex flex-col flex-grow">
          <h3 className="ph:text-base text-[15px] font-medium font-poppins">{title}</h3>
          <p className="ph:text-xs text-[10px] text-gray-500 mt-1 font-poppins">{subtext}</p>
        </div>
        
      </div>
      {isActive && (
        <div className="accordion-content px-4 py-0 bg-white rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
