// Dana Lee 261054107

import React from "react";

const Accordion = ({
  title,
  subtext,
  children,
  imageSrc,
  isActive,
  onToggle,
}) => {
  return (
    <div
      className={`accordion w-full rounded-md transition-all duration-300 ease-in-out ${
        isActive ? "bg-secondary border-l-4 border-yellow-500" : "bg-secondary"
      }`}
    >
      <div
        className="accordion-item cursor-pointer flex items-center space-x-4 ph:px-10 px-4 ph:py-3 py-2 rounded-md"
        onClick={onToggle}
      >
        {/* Set Image to display (default option minimum time slot) */}
        <img
          src={imageSrc}
          alt={`${title} image`}
          className="w-15 h-16 object-cover"
        />
        {/* From the parent, we display the title and the subtext */}
        <div className="flex flex-col flex-grow">
          <h3 className="ph:text-base text-[15px] font-medium font-poppins text-secondary_letter">
            {title}
          </h3>
          <p className="ph:text-xs text-[10px] text-letter_secondary mt-1 font-poppins">
            {subtext}
          </p>
        </div>
      </div>
      {isActive && (
        // Whatever is on the children field of the accordion component
        <div className="accordion-content px-4 py-0 bg-secondary rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
